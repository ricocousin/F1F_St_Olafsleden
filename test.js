/* Focused tests for the derived logic in lib.js.
   Run: node --test  (or: node test.js)  — no dependencies. */
const test = require('node:test');
const assert = require('node:assert');
const OL = require('./lib.js');

// A small, self-contained day fixture in the same shape as app.html's data.
function fixture() {
  return {
    d: 1, f: 'Start', t: 'Camp', c: '#4CAF50', est: false, km: 40, eg: 1200, country: 'SE',
    profile: [[0, 0], [10, 200], [25, 900], [40, 1200]],
    stops: [
      { km: 10, n: 'Village', i: '🍽', note: 'CONFIRMED: shop and cafe. Lunch buffet 11:00-16:00.', t: 'food', hours: 'Lunch buffet 11:00-16:00, CLOSED MONDAYS', dwell: '20 min', why: 'First resupply. Natural break.', backup: 'Push to Camp.' },
      { km: 25, n: 'Stream', i: '💧', note: 'Stream at the county border.', t: 'water', dwell: '5 min', why: 'Reliable refill.', backup: 'Lake 5 km on.' },
      { km: 32, n: 'DryRidge', i: '💧', note: 'FILL ALL WATER HERE. No water toward Camp.', t: 'critical', dwell: '10 min', why: 'Last water before the climb.', backup: 'None.' },
      { km: 40, n: 'Camp', i: '🏕', note: 'CONFIRMED lakeside camp on Storsjön.', t: 'bivvy', why: 'Day end, water confirmed.', backup: 'Walk shoreline.' }
    ]
  };
}

test('movingHours matches Naismith and is unchanged', () => {
  assert.strictEqual(OL.movingHours(40, 1200), 40 / 4 + 1200 / 600); // 10 + 2 = 12
  assert.strictEqual(OL.movingHours(0, 0), 0);
});

test('gainAtKm interpolates cumulative climb', () => {
  const p = fixture().profile;
  assert.strictEqual(OL.gainAtKm(p, 0), 0);
  assert.strictEqual(OL.gainAtKm(p, 10), 200);
  assert.strictEqual(OL.gainAtKm(p, 40), 1200);
  assert.strictEqual(OL.gainAtKm(p, 5), 100);       // halfway up first segment
  assert.strictEqual(OL.gainAtKm(p, 50), 1200);     // clamp beyond end
  assert.strictEqual(OL.gainAtKm(p, -5), 0);        // clamp before start
});

test('confidence reads CONFIRMED, flags time windows, defaults neutral', () => {
  const s = fixture().stops;
  assert.strictEqual(OL.stopConfidence(s[0]), 'Time-sensitive'); // CONFIRMED + closed-days window
  assert.strictEqual(OL.stopConfidence(s[3]), 'Confirmed');      // CONFIRMED, no window
  assert.strictEqual(OL.stopConfidence({ n: 'x', t: 'stamp', note: 'Historic viewpoint.' }), 'Not specified');
  assert.strictEqual(OL.stopConfidence({ n: 'x', t: 'food', note: 'Cafe, hours not verified.' }), 'Unverified');
  // explicit field always wins
  assert.strictEqual(OL.stopConfidence({ n: 'x', t: 'food', note: 'CONFIRMED', confidence: 'Likely' }), 'Likely');
});

test('water and food status inference', () => {
  const s = fixture().stops;
  assert.strictEqual(OL.waterStatus(s[1]), 'Likely');    // stream, water type, not "confirmed"
  assert.strictEqual(OL.waterStatus(s[2]), 'Reliable');  // critical + "water"
  assert.strictEqual(OL.waterStatus(s[3]), 'Reliable');  // bivvy + lake
  assert.strictEqual(OL.foodStatus(s[0]), 'Time-sensitive');
  assert.strictEqual(OL.foodStatus(s[1]), 'None');       // pure water stop
  assert.strictEqual(OL.foodStatus({ n: 'x', t: 'food', note: 'CONFIRMED restaurant.' }), 'Confirmed');
});

test('normalizeStop resolves optional fields with neutral fallbacks', () => {
  const n = OL.normalizeStop({ km: 5, n: 'Bare', i: '📖', t: 'stamp', note: 'A stamp.' });
  assert.strictEqual(n.confidence, 'Not specified');
  assert.strictEqual(n.water, 'Not specified');
  assert.strictEqual(n.food, 'None');
  assert.strictEqual(n.targetArrivalTime, null);
  assert.strictEqual(n.backup, null);
  // fallback alias
  assert.strictEqual(OL.normalizeStop({ n: 'x', t: 'food', fallback: 'Go on.' }).backup, 'Go on.');
});

test('computeSegments spans start + each stop with derived distance/gain', () => {
  const segs = OL.computeSegments(fixture());
  assert.strictEqual(segs.length, 4);
  assert.strictEqual(segs[0].from, 'Start');
  assert.strictEqual(segs[0].to, 'Village');
  assert.strictEqual(segs[0].dist, 10);
  assert.strictEqual(segs[0].gain, 200);
  assert.strictEqual(segs[2].toType, 'critical');
  assert.match(segs[2].purpose, /Fill water/);
});

test('deriveNextStop returns first unchecked non-finish stop', () => {
  const day = fixture();
  let next = OL.deriveNextStop(day, {});
  assert.strictEqual(next.stop.n, 'Village');
  // check off Village → advances to Stream
  const checks = { [OL.stopKey(1, 'Village')]: true };
  next = OL.deriveNextStop(day, checks);
  assert.strictEqual(next.stop.n, 'Stream');
});

test('deriveNextStop points at camp when all done', () => {
  const day = fixture();
  const checks = {};
  day.stops.forEach(s => { if (s.t !== 'bivvy') checks[OL.stopKey(1, s.n)] = true; });
  const next = OL.deriveNextStop(day, checks);
  // Camp is a bivvy (not finish) and still unchecked → it's the next stop
  assert.strictEqual(next.stop.n, 'Camp');
});

test('composeETA splits moving/stop/contingency and labels source', () => {
  const eta = OL.composeETA(fixture(), { startDate: new Date(2026, 7, 8, 6, 0, 0) });
  assert.strictEqual(eta.movingH, 12);
  assert.ok(eta.stopH > 0 && eta.contingencyH > 0);
  assert.ok(Math.abs(eta.totalH - (eta.movingH + eta.stopH + eta.contingencyH)) < 1e-9);
  assert.ok(eta.finishDate instanceof Date);
  assert.strictEqual(eta.parts[0].kind, 'calculated');
  assert.strictEqual(eta.parts[1].kind, 'configured');
  // no start date → durations only
  const eta2 = OL.composeETA(fixture(), {});
  assert.strictEqual(eta2.finishDate, null);
});

test('deriveGate: derived latest-departure respects sunset, explicit wins', () => {
  const day = fixture();
  const start = new Date(2026, 7, 8, 6, 0, 0);
  const sunset = new Date(2026, 7, 8, 20, 0, 0);
  const g = OL.deriveGate(day, day.stops[0], { startDate: start, sunset });
  assert.strictEqual(g.source, 'derived');
  assert.match(g.text, /Leave by \d\d:\d\d/);
  assert.ok(g.targetArrival);
  // explicit fields win and mark configured
  const g2 = OL.deriveGate(day, { n: 'x', km: 5, t: 'food', decisionText: 'Leave by 09:15', targetArrivalTime: '08:40' }, { startDate: start, sunset });
  assert.strictEqual(g2.source, 'configured');
  assert.strictEqual(g2.text, 'Leave by 09:15');
  // no data at all → null (no empty gate block)
  assert.strictEqual(OL.deriveGate(day, day.stops[0], {}), null);
});

test('longestWaterGap and recommendedWater', () => {
  const g = OL.longestWaterGap(fixture());
  // reliable water at 32 (critical) and 40 (camp); 25 stream is only "Likely" but counts as reliable-ish
  assert.ok(g.km > 0);
  const w = OL.recommendedWater(fixture());
  assert.ok(w.litres >= 1 && w.litres <= 4);
});

test('foodCarry flags long gaps without confirmed food', () => {
  const fc = OL.foodCarry(fixture());
  assert.strictEqual(typeof fc.carry, 'boolean');
  assert.match(fc.reason, /gap/i);
  assert.strictEqual(OL.foodCarry({ d: 9, f: 'A', t: 'B', km: 50, eg: 100, profile: [[0, 0], [50, 100]], stops: [{ km: 25, n: 'x', t: 'stamp', note: 'nothing' }] }).carry, true);
});

test('dayProgress derives completed/remaining from checks and manual km', () => {
  const day = fixture();
  let p = OL.dayProgress(day, {});
  assert.strictEqual(p.completedKm, 0);
  assert.strictEqual(p.remainingKm, 40);
  assert.strictEqual(p.started, false);
  p = OL.dayProgress(day, { [OL.stopKey(1, 'Stream')]: true });
  assert.strictEqual(p.completedKm, 25);
  assert.strictEqual(p.remainingKm, 15);
  assert.ok(p.remainingGain > 0);
  // manual km overrides upward
  p = OL.dayProgress(day, {}, 30);
  assert.strictEqual(p.completedKm, 30);
  // manual km clamped to day length
  assert.strictEqual(OL.dayProgress(day, {}, 999).completedKm, 40);
});

test('tripProgress accumulates across days', () => {
  const CUM = [0, 40, 80];
  const tp = OL.tripProgress([], CUM, 1, { completedKm: 10 });
  assert.strictEqual(tp.completedKm, 50);
  assert.strictEqual(tp.remainingKm, 30);
  assert.strictEqual(tp.totalKm, 80);
});

test('scheduleVariance null unless started with a clock', () => {
  const day = fixture();
  assert.strictEqual(OL.scheduleVariance(day, {}), null);
  const start = new Date(2026, 7, 8, 6, 0, 0);
  const now = new Date(2026, 7, 8, 9, 0, 0);
  const v = OL.scheduleVariance(day, { startDate: start, now, completedKm: 10 });
  assert.ok(v && typeof v.deltaMin === 'number' && typeof v.ahead === 'boolean');
});

test('majorClimbs surfaces the steepest intervals', () => {
  const climbs = OL.majorClimbs(fixture().profile);
  assert.ok(climbs.length >= 1);
  assert.strictEqual(climbs[0].fromKm, 10); // 10→25 gains 700m, the big one
  assert.strictEqual(climbs[0].gain, 700);
});
