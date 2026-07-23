/* ═══════════════════════════════════════════════════════════════════════
   St. Olavsleden Day Cards — shared derivation & calculation utilities
   ------------------------------------------------------------------------
   Pure, DOM-free functions used by app.html (as the global `OL`) and by
   test.js (via CommonJS require). No fabrication of trail data: every value
   here is either read from an explicit optional field on the data, DERIVED
   from figures already in the data (distance / elevation / pace / daylight),
   or inferred from signals already written into the stop prose (e.g. the
   literal word "CONFIRMED"). When nothing is known the neutral value
   "Not specified" is returned. Explicit fields always win over inference.
   ═══════════════════════════════════════════════════════════════════════ */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api; // Node / tests
  if (root) root.OL = api;                                                   // browser global
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this), function () {
  'use strict';

  // ── Pace ────────────────────────────────────────────────────────────────
  // Naismith's rule: 1 h per 4 km + 1 h per 600 m of ascent. MOVING time only
  // (no breaks). Preserved verbatim from the original app so pace assumptions
  // do not silently change.
  const PACE_KMH = 4;          // km per hour on the flat
  const PACE_ASCENT = 600;     // metres of ascent per extra hour
  const STOP_BUFFER_MIN = 15;  // rough dwell added per intermediate stop for ETA
  const CONTINGENCY = 0.15;    // 15% slack on moving time (navigation, fatigue, terrain)

  function movingHours(km, eg) {
    return (km || 0) / PACE_KMH + (eg || 0) / PACE_ASCENT;
  }

  // ── Elevation interpolation ───────────────────────────────────────────────
  // profile = [[km, cumulativeGain], ...] (monotonic). Linear-interpolate the
  // cumulative climb reached at a given km so we can attribute ascent to each
  // segment / stop rather than only knowing the day total.
  function gainAtKm(profile, km) {
    if (!profile || !profile.length) return 0;
    if (km <= profile[0][0]) return profile[0][1];
    const last = profile[profile.length - 1];
    if (km >= last[0]) return last[1];
    for (let i = 1; i < profile.length; i++) {
      const [k0, g0] = profile[i - 1], [k1, g1] = profile[i];
      if (km <= k1) {
        const t = (km - k0) / (k1 - k0 || 1);
        return g0 + (g1 - g0) * t;
      }
    }
    return last[1];
  }

  // Major climbs: profile intervals whose ascent rate is meaningfully above the
  // day average. Returns [{fromKm,toKm,gain,rate}] sorted by gain desc.
  function majorClimbs(profile, opts) {
    const o = opts || {};
    const minGain = o.minGain != null ? o.minGain : 200; // ignore trivial bumps
    if (!profile || profile.length < 2) return [];
    const total = profile[profile.length - 1][1] || 0;
    const totalKm = profile[profile.length - 1][0] || 1;
    const avgRate = total / totalKm;
    const out = [];
    for (let i = 1; i < profile.length; i++) {
      const [k0, g0] = profile[i - 1], [k1, g1] = profile[i];
      const gain = g1 - g0, dist = k1 - k0;
      const rate = dist > 0 ? gain / dist : 0;
      if (gain >= minGain && rate >= avgRate) {
        out.push({ fromKm: k0, toKm: k1, gain: Math.round(gain), rate: Math.round(rate) });
      }
    }
    return out.sort((a, b) => b.gain - a.gain);
  }

  // ── Stop keys & completion ────────────────────────────────────────────────
  function stopKey(dayNum, stopName) { return `d${dayNum}_${stopName}`; }

  function isChecked(checks, dayNum, stop) {
    return !!(checks && checks[stopKey(dayNum, stop.n)]);
  }

  // ── Confidence / service model ─────────────────────────────────────────────
  // Vocabulary (fixed set, per spec): Confirmed | Likely | Unverified |
  // Seasonal | Time-sensitive | Not specified.
  const CONFIDENCE = {
    Confirmed:       { label: 'Confirmed',      icon: '✓', rank: 4 },
    Likely:          { label: 'Likely',         icon: '≈', rank: 3 },
    Seasonal:        { label: 'Seasonal',       icon: '❄', rank: 2 },
    'Time-sensitive':{ label: 'Time-sensitive', icon: '⏱', rank: 2 },
    Unverified:      { label: 'Unverified',     icon: '?', rank: 1 },
    'Not specified': { label: 'Not specified',  icon: '–', rank: 0 }
  };

  function hasTimeWindow(hours) {
    if (!hours) return false;
    return /\bclosed\b/i.test(hours) || /\d{1,2}[:.]\d{2}\s*[–-]\s*\d{1,2}[:.]\d{2}/.test(hours) || /\bonly\b/i.test(hours);
  }

  // Derive the confidence for a stop. Explicit `stop.confidence` wins.
  function stopConfidence(stop) {
    if (stop.confidence && CONFIDENCE[stop.confidence]) return stop.confidence;
    const note = stop.note || '';
    const hours = stop.hours || '';
    if (/\bCONFIRMED\b/.test(note)) {
      if (hasTimeWindow(hours) || /closed/i.test(note)) return 'Time-sensitive';
      if (/season|18 june|15 aug|20 oct/i.test(hours + note)) return 'Seasonal';
      return 'Confirmed';
    }
    if (/not (individually )?(verified|confirmed)|not yet verified|approximation|estimate/i.test(hours + ' ' + note)) return 'Unverified';
    if (/\blikely\b|typically|assume|standard/i.test(hours + ' ' + note)) return 'Likely';
    return 'Not specified';
  }

  // Water availability for a stop. Explicit `stop.water` wins; else inferred
  // from stop type and prose. Returns one of: Reliable | Likely | Unverified |
  // None | Not specified.
  function waterStatus(stop) {
    if (stop.water) return stop.water;
    const t = stop.t, note = (stop.note || '').toLowerCase();
    const hasWaterWord = /(lake|river|stream|swim|water|fjord|shore|å|sjön|vatten|elva)/i.test(stop.note || '');
    // A "critical" stop exists precisely because it is the reliable fill point.
    if (t === 'critical') return 'Reliable';
    if (t === 'water' || t === 'swim') return /confirmed|lake|river/i.test(stop.note || '') ? 'Reliable' : 'Likely';
    if (t === 'bivvy' || t === 'city') return hasWaterWord ? 'Reliable' : 'Likely';
    if (hasWaterWord) return /confirmed/i.test(stop.note || '') ? 'Reliable' : 'Likely';
    return 'Not specified';
  }
  function waterReliable(stop) {
    const w = waterStatus(stop);
    return w === 'Reliable' || w === 'Likely';
  }

  // Food availability for a stop. Explicit `stop.food` wins; else inferred.
  // Returns: Confirmed | Likely | Unverified | None | Not specified.
  function foodStatus(stop) {
    if (stop.food) return stop.food;
    const t = stop.t, note = stop.note || '';
    if (t === 'city') return /confirmed|supermarket|shop|restaurant/i.test(note) ? 'Confirmed' : 'Likely';
    if (t === 'food') {
      if (/\bCONFIRMED\b/.test(note)) return hasTimeWindow(stop.hours) ? 'Time-sensitive' : 'Confirmed';
      return /not (individually )?(verified|confirmed)/i.test((stop.hours || '') + note) ? 'Unverified' : 'Likely';
    }
    if (/shop|supermarket|cafe|café|restaurant|buffet|kiosk|grill|gatekjøkken/i.test(note)) return 'Likely';
    return 'None';
  }

  // ── Normalized view of a stop (all optional fields resolved) ────────────────
  function normalizeStop(stop) {
    return {
      km: stop.km,
      name: stop.n,
      icon: stop.i,
      type: stop.t,
      note: stop.note || '',
      hours: stop.hours || null,
      dwell: stop.dwell || null,
      why: stop.why || null,
      backup: stop.backup || stop.fallback || null,
      confidence: stopConfidence(stop),
      water: waterStatus(stop),
      food: foodStatus(stop),
      lastChecked: stop.lastChecked || null,
      // explicit decision-gate fields (all optional, backward compatible)
      targetArrivalTime: stop.targetArrivalTime || null,
      latestDepartureTime: stop.latestDepartureTime || null,
      decisionText: stop.decisionText || null,
      consequence: stop.consequence || null,
      timeSensitive: hasTimeWindow(stop.hours),
      raw: stop
    };
  }

  // ── Segments (between consecutive waypoints, start included) ─────────────────
  function computeSegments(day) {
    const pts = [{ km: 0, n: day.f, t: 'start', note: '' }].concat(day.stops || []);
    const segs = [];
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      const dist = +(b.km - a.km).toFixed(1);
      const gain = Math.round(gainAtKm(day.profile, b.km) - gainAtKm(day.profile, a.km));
      const nb = normalizeStop(b);
      segs.push({
        from: a.n, to: b.n,
        fromKm: a.km, toKm: b.km,
        dist, gain,
        movingH: movingHours(dist, gain),
        toType: b.t,
        water: nb.water,
        food: nb.food,
        confidence: nb.confidence,
        // one-line purpose or the most relevant warning for the segment
        purpose: b.t === 'critical'
          ? 'Fill water — long dry stretch ahead'
          : (nb.why ? firstSentence(nb.why) : firstSentence(nb.note)) || '—'
      });
    }
    return segs;
  }

  function firstSentence(text) {
    if (!text) return '';
    const m = text.replace(/\s+/g, ' ').trim().match(/^(.*?[.!?])(\s|$)/);
    return (m ? m[1] : text).slice(0, 120);
  }

  // ── Next stop / next decision ────────────────────────────────────────────────
  // The next incomplete, non-finish stop derived from the checked state.
  function deriveNextStop(day, checks) {
    const stops = day.stops || [];
    for (let i = 0; i < stops.length; i++) {
      const s = stops[i];
      if (s.t === 'finish') continue;
      if (!isChecked(checks, day.d, s)) {
        return { stop: s, index: i, normalized: normalizeStop(s) };
      }
    }
    // everything checked → point at the finish / camp
    const fin = stops.find(s => s.t === 'finish') || stops[stops.length - 1] || null;
    return fin ? { stop: fin, index: stops.indexOf(fin), normalized: normalizeStop(fin), allDone: true } : null;
  }

  // ── ETA composition ────────────────────────────────────────────────────────
  // Breaks the day estimate into labelled parts. `startDate` is a Date at the
  // planned start moment; may be null (then no clock times, only durations).
  function composeETA(day, opts) {
    const o = opts || {};
    const stops = day.stops || [];
    const nStops = o.stopCount != null ? o.stopCount : stops.filter(s => s.t !== 'finish' && s.t !== 'bivvy').length;
    const movingH = movingHours(day.km, day.eg);
    const stopH = (nStops * (o.stopBufferMin != null ? o.stopBufferMin : STOP_BUFFER_MIN)) / 60;
    const contingencyH = movingH * (o.contingency != null ? o.contingency : CONTINGENCY);
    const totalH = movingH + stopH + contingencyH;
    const fastH = movingH + stopH * 0.5; // "earliest realistic" — half the dwell, no contingency
    let finishDate = null, earliestFinish = null;
    if (o.startDate) {
      finishDate = new Date(o.startDate.getTime() + totalH * 3600e3);
      earliestFinish = new Date(o.startDate.getTime() + fastH * 3600e3);
    }
    return {
      movingH, stopH, contingencyH, totalH, fastH,
      finishDate, earliestFinish,
      parts: [
        { label: 'Moving time', hours: movingH, kind: 'calculated', note: `Naismith · ${day.km} km + ${day.eg} m` },
        { label: 'Planned stops', hours: stopH, kind: 'configured', note: `${nStops} stops × ${o.stopBufferMin != null ? o.stopBufferMin : STOP_BUFFER_MIN} min` },
        { label: 'Contingency', hours: contingencyH, kind: 'configured', note: `${Math.round((o.contingency != null ? o.contingency : CONTINGENCY) * 100)}% of moving` }
      ]
    };
  }

  // Cumulative moving time (+ intermediate stop buffers) from day start to a km.
  function timeToKm(day, km, stopBufferMin) {
    const buf = (stopBufferMin != null ? stopBufferMin : STOP_BUFFER_MIN) / 60;
    const gain = gainAtKm(day.profile, km);
    const move = movingHours(km, gain);
    const priorStops = (day.stops || []).filter(s => s.t !== 'finish' && s.t !== 'bivvy' && s.km < km).length;
    return move + priorStops * buf;
  }

  // ── Decision gate derivation ────────────────────────────────────────────────
  // Explicit fields win. Otherwise derive a "leave no later than" for a stop so
  // the rest of the day can still finish before dark. Returns null when there is
  // nothing meaningful to show (no explicit gate AND no daylight data).
  function deriveGate(day, stop, opts) {
    const o = opts || {};
    const n = normalizeStop(stop);
    if (n.targetArrivalTime || n.latestDepartureTime || n.decisionText) {
      return {
        source: 'configured',
        targetArrival: n.targetArrivalTime,
        latestDeparture: n.latestDepartureTime,
        text: n.decisionText,
        consequence: n.consequence,
        fallback: n.backup
      };
    }
    if (!o.startDate || !o.sunset) return o.startDate ? {
      source: 'derived', targetArrival: fmtClock(addH(o.startDate, timeToKm(day, stop.km))),
      latestDeparture: null, text: null, consequence: null, fallback: n.backup
    } : null;
    // derived: latest departure from this stop to still reach camp by sunset
    const remainKm = day.km - stop.km;
    const remainGain = Math.max(0, gainAtKm(day.profile, day.km) - gainAtKm(day.profile, stop.km));
    const remainMove = movingHours(remainKm, remainGain);
    const remainStops = (day.stops || []).filter(s => s.t !== 'finish' && s.km > stop.km).length;
    const remainH = remainMove + remainStops * (STOP_BUFFER_MIN / 60);
    const latestDep = new Date(o.sunset.getTime() - remainH * 3600e3);
    const targetArr = addH(o.startDate, timeToKm(day, stop.km));
    return {
      source: 'derived',
      targetArrival: fmtClock(targetArr),
      latestDeparture: fmtClock(latestDep),
      text: `Leave by ${fmtClock(latestDep)} to reach ${day.t} before dark`,
      consequence: null,
      fallback: n.backup
    };
  }

  // ── Water gap / food carry (day-level prep derivations) ─────────────────────
  function longestWaterGap(day) {
    // consecutive reliable-water points (start assumed watered, camp usually water)
    const pts = [{ km: 0, reliable: true }]
      .concat((day.stops || []).map(s => ({ km: s.km, reliable: waterReliable(s) })));
    let maxGap = 0, gapFrom = 0, prev = 0;
    for (let i = 1; i < pts.length; i++) {
      if (pts[i].reliable) {
        const gap = pts[i].km - prev;
        if (gap > maxGap) { maxGap = gap; gapFrom = prev; }
        prev = pts[i].km;
      }
    }
    const tail = day.km - prev; // last reliable water → camp
    if (tail > maxGap) { maxGap = tail; gapFrom = prev; }
    return { km: +maxGap.toFixed(1), fromKm: gapFrom, toKm: +(gapFrom + maxGap).toFixed(1) };
  }

  // Recommended starting water (litres) from the longest dry gap. Rough field
  // heuristic (~0.5 L per 5 km + 1 L base), clearly an estimate.
  function recommendedWater(day) {
    const gap = longestWaterGap(day).km;
    const litres = Math.min(4, Math.max(1, Math.round((1 + gap / 10) * 2) / 2));
    return { litres, gapKm: gap };
  }

  // Does the day require carrying food (no confirmed/likely food before a long stretch)?
  function foodCarry(day) {
    const foods = (day.stops || []).filter(s => { const f = foodStatus(s); return f === 'Confirmed' || f === 'Likely' || f === 'Time-sensitive'; });
    if (!foods.length) return { carry: true, reason: 'No confirmed food on route — carry all meals' };
    // largest gap between confirmed/likely food points (start & camp not counted as food)
    let prev = 0, maxGap = 0;
    foods.forEach(s => { maxGap = Math.max(maxGap, s.km - prev); prev = s.km; });
    maxGap = Math.max(maxGap, day.km - prev);
    return { carry: maxGap > 30, reason: `Longest gap without confirmed food ≈ ${Math.round(maxGap)} km` };
  }

  // ── Progress from checked stops (+ optional manual current km) ───────────────
  function dayProgress(day, checks, manualKm) {
    const stops = day.stops || [];
    let completedKm = 0;
    stops.forEach(s => { if (isChecked(checks, day.d, s) && s.t !== 'finish') completedKm = Math.max(completedKm, s.km); });
    if (typeof manualKm === 'number' && !isNaN(manualKm)) completedKm = Math.max(completedKm, Math.min(manualKm, day.km));
    const remainingKm = Math.max(0, +(day.km - completedKm).toFixed(1));
    const doneGain = gainAtKm(day.profile, completedKm);
    const remainingGain = Math.max(0, Math.round((gainAtKm(day.profile, day.km) - doneGain)));
    return {
      completedKm: +completedKm.toFixed(1),
      remainingKm,
      remainingGain,
      started: completedKm > 0,
      fraction: day.km ? Math.min(1, completedKm / day.km) : 0
    };
  }

  // Overall trip progress across days. CUM[i] = km at start of day i.
  function tripProgress(D, CUM, dayIndex, dayProg) {
    const completed = (CUM[dayIndex] || 0) + (dayProg ? dayProg.completedKm : 0);
    const total = CUM[CUM.length - 1] || 0;
    return { completedKm: +completed.toFixed(1), remainingKm: +(total - completed).toFixed(1), totalKm: +total.toFixed(1) };
  }

  // Schedule variance: only meaningful when the day is "today" and started.
  // Returns null otherwise (honest — we can't know ahead/behind without a clock).
  function scheduleVariance(day, opts) {
    const o = opts || {};
    if (!o.startDate || !o.now || o.completedKm == null || o.completedKm <= 0) return null;
    const plannedH = timeToKm(day, o.completedKm, o.stopBufferMin);
    const plannedAt = new Date(o.startDate.getTime() + plannedH * 3600e3);
    const deltaMin = Math.round((plannedAt.getTime() - o.now.getTime()) / 60000); // + = ahead of plan
    return { deltaMin, ahead: deltaMin >= 0, plannedAt };
  }

  // ── small time helpers (pure) ───────────────────────────────────────────────
  function addH(date, hours) { return new Date(date.getTime() + hours * 3600e3); }
  function fmtClock(date) {
    if (!date || isNaN(date.getTime())) return null;
    return String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
  }
  function fmtDur(hours) {
    if (hours == null || isNaN(hours)) return '—';
    const h = Math.floor(hours), m = Math.round((hours - h) * 60);
    if (h <= 0) return `${m} min`;
    return m ? `${h} h ${m} min` : `${h} h`;
  }

  return {
    PACE_KMH, PACE_ASCENT, STOP_BUFFER_MIN, CONTINGENCY, CONFIDENCE,
    movingHours, gainAtKm, majorClimbs,
    stopKey, isChecked,
    stopConfidence, waterStatus, waterReliable, foodStatus, normalizeStop,
    computeSegments, firstSentence,
    deriveNextStop, composeETA, timeToKm, deriveGate,
    longestWaterGap, recommendedWater, foodCarry,
    dayProgress, tripProgress, scheduleVariance,
    addH, fmtClock, fmtDur
  };
});
