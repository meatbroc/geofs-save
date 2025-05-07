// ==UserScript==
// @name         GeoFS Save
// @version      1.0.0
// @description  Saves important parameters, such as autopilot, flight path, and flight plan
// @author       meatbroc
// @match        https://www.geo-fs.com/geofs.php*
// @grant        none
// ==/UserScript==
(() => {
	const Xe = {f: window.fireBasicEvent, a: window.executeOnEventDone, l: (a, b, c = "log") => console[c](`%c[${b?b.trim():"SAVE"}]`, "color:#45B9AC;font-weight:bold;", a)};
	function i() {
		function s() {
			try {
				const a = {}, b = geofs.autopilot, c = geofs.flightPlan;
                a.fp = {a: JSON.parse(geofs.flightPlan.export()), t: c.trackedWaypoint?.id};
                a.p = flight.recorder.mapPath.map(d => d._latlngs.map(e => [e.lat, e.lng, e.alt]));
                localStorage.setItem("s", JSON.stringify(a));
			} catch (e) {
                e = ''+e, Xe.l("LOC STOR", "ERR: " + e, "warn"), localStorage.setItem("s", JSON.stringify({e}));
			}
		};
		Xe.a("unload", s);
		Xe.f("saveStarted");
		const d = JSON.parse(localStorage.getItem("s"));
		if (!d) return;
        if (d.e) return Xe.l("Last save err: " + (d?.e || "none"));
		const f = geofs.flightPlan, g = geofs.api.map._map;
        d.fp?.a?.[0] && f.import(d.fp.a);
		g.whenReady(() => {
			const o = {weight: 4};
			for (const p of d.p) o.color = geofs.api.color.mixArray(flight.recorder.pathColors, clamp(p[1][2] / 15e3, 0, 1)).toCssHexString(), L.polyline(p, o).addTo(g)
		});
		Xe.f("saveInitialized");
	}
	Xe.a("geofsInitialized", i);
})();
