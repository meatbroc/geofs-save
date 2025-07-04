// ==UserScript==
// @name         GeoFS Save
// @version      1.1.0
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
				const a = {}, b = geofs.autopilot, c = geofs.flightPlan, d = geofs.preferences.save;
                a.fp = {a: JSON.parse(geofs.flightPlan.export()), t: c.trackedWaypoint?.id};
                a.p = flight.recorder.mapPath.map(d => d._latlngs.map(e => [e.lat, e.lng, e.alt]));
				a.pr = {as: d.as, al: d.al};
                localStorage.setItem("s", JSON.stringify(a));
			} catch (e) { e = ''+e, Xe.l("ERR: " + e, "LOC STOR", "warn"), localStorage.setItem("s", JSON.stringify({e})) }
		};
		Xe.a("unload", s);
		Xe.f("saveStarted");
		const d = JSON.parse(localStorage.getItem("s")) || {};
        if (d.e) return Xe.l("Last save err: " + (d?.e || "none"), "LOC STOR");
		const f = geofs.flightPlan, g = geofs.api.map._map, o = {weight: 4};
		if (!Object.keys(d).length) d.pr = {}, d.pr.al = d.pr.as = !0, d.p = [];
		Xe.m = (geofs.preferences.save = {
			as: d.pr.as,
			al: d.pr.al,
			lp: () => d.p.forEach(p => (o.color = geofs.api.color.mixArray(flight.recorder.pathColors, clamp(p[1][2] / 15e3, 0, 1)).toCssHexString(), flight.recorder.mapPath.unshift(L.polyline(p, o).addTo(g)))),
			lf: () => d.fp?.a?.[0] && f.import(d.fp.a),
		});
		d.pr.al ? (Xe.m.lf(), g.whenReady(Xe.m.lp)) : $("<style>.save-btn{display: block !important}</style>").appendTo("head");
		$("<li/>", {class: "geofs-list-collapsible-item"}).html(`Save<div class="geofs-collapsible"> <fieldset>
			<label class="mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-js-ripple-effect--ignore-events" for="enableAutoload" tabindex="0"> <input type="checkbox" id="enableAutoload" class="mdl-switch__input" data-gespref="geofs.preferences.save.al"> <span class="mdl-switch__label">Enable autoloading after GeoFS reloads</span> <div class="mdl-switch__track"></div> <div class="mdl-switch__thumb"><span class="mdl-switch__focus-helper"></span></div> <span class="mdl-switch__ripple-container mdl-js-ripple-effect mdl-ripple--center"><span class="mdl-ripple"></span></span> </label>
			<button class="save-btn mdl-button mdl-js-button mdl-button--raised" onclick="geofs.preferences.save.lp();" style="display:none;" tabindex="0">Load previous flight path</button>
			<button class="save-btn mdl-button mdl-js-button mdl-button--raised" onclick="geofs.preferences.save.lf();" style="display:none;" tabindex="0">Load previous flight plan</button>
			<span class="geofs-hideForApp geofs-hideForSchool" style="display: inline-block; margin: 10px 0px 25px 0px;"> <a href="https://github.com/meatbroc/geofs-save" target="_blank" rel="nofollow"><img src="https://raw.githubusercontent.com/meatbroc/geofs-save/refs/heads/main/images/github.png" style="margin: 10px 10px 10px 0px;height:28px;width:114px;"></a>For more information about autosave, visit the <a href="https://github.com/meatbroc/geofs-save" target="_blank" rel="nofollow">Github page here</a> </span>
		</fieldset> </div>`).insertBefore(".geofs-preferenceForm");
		Xe.f("saveInitialized");
	}
	Xe.a("geofsInitialized", i);
})();
