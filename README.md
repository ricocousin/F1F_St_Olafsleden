# F1F_St_Olafsleden — Selånger → Nidaros

Interactive web app for planning and running the **St. Olavsleden / Pilegrimsleden** pilgrimage route from **Selånger, Sweden** to **Nidaros Cathedral, Trondheim, Norway** (~590 km, 10 days, bivvy camping throughout — Nortent Skjul, camp anywhere, but the plan targets a real lunch, dinner, and body of water each day).

🗺 **Overview map:** [ricocousin.github.io/F1F_St_Olafsleden](https://ricocousin.github.io/F1F_St_Olafsleden)
📱 **Day cards (field app):** [ricocousin.github.io/F1F_St_Olafsleden/app.html](https://ricocousin.github.io/F1F_St_Olafsleden/app.html)

---

## ⚠️ On distance: three different numbers, and which one we use

stolavsleden.com and pilegrimsleden.no consistently list **580 km** as the total length (marketing/rounded figure). Summing the official GPX tracks naively gave **646.6 km** — inflated by data bugs (see GPX section below).

stolavsleden.com also publishes an **itemized stage table** — every sub-segment of the route with exact distance *and* elevation gain. Summed correctly (after finding and fixing an error where two Stiklestad–Trondheim segments had picked up outer-trail-alternative distances instead of inner-trail figures):

**589.9 km total, 18,673 m elevation gain.**

This is the number the app plans against. It's been cross-checked three ways: segment-by-segment against the GPX tracks (23/29 matched within 0.5km), against this project's original elevation estimate ("~18,500 m," made before any GPX work — matches almost exactly), and against independent stage data from the **St Olavsloppet trail race**, which covers two of our ten days on different but overlapping ground and measured the Stiklestad→Skalstugan border corridor at 57.4 km against our 60.4 km estimate (a 5% gap, consistent with road-race vs. hiking-trail routing).

---

## Route overview

Built through iterative refinement: an exhaustive constraint search targeting a **strictly-decreasing, ≤70km/day pyramid**, using every real waypoint found — official stage points plus ~15 additional real villages, lakes, and rest stops dug up through research (Torpshammar, Hemsjön, Gimårasten, Stavre, Ope, Frösön, Undersåker, Bodsjön, Medstugusjön, and more). A perfect pyramid isn't achievable with real-world village spacing — the current plan is the best mathematically-verified result, with a handful of small (0.1–3.6km) non-strict transitions and a cap relaxed to 72km on two edge days.

| Day        | From → To                  | km        | Elevation gain | Notes                                                            |
| ---------- | --------------------------- | --------- | --------------- | -------------------------------------------------------------------- |
| D1         | Selånger → Fränsta          | 70.7      | 1,288 m          | Ljungan river valley; Torpshammar, Stöde Camping en route             |
| D2         | Fränsta → Stavre            | 70.8      | 1,743 m          | Best-provisioned day: 5 confirmed food/water stops                    |
| D3         | Stavre → Ope                | 63.5      | 1,701 m          | Camp Viking/Gällö early in the day; Ope sits on Lake Storsjön          |
| D4         | Ope → Alsen                 | 64.0      | 1,429 m          | Östersund resupply, Frösön, Nälden lunch, Camp Östbacken swim          |
| D5         | Alsen → Åre                 | 67.6      | 3,043 m          | Biggest single climbing day; ⚠️ fill water at Hålland                 |
| D6         | Åre → Skalstugan             | 55.5      | 1,464 m          | Tännforsen waterfall swim; last night in Sweden                        |
| D7         | Skalstugan → Stiklestad      | **60.4** ⚠️ | **3,072 m**      | Border crossing, hardest/longest day, no official GPX                  |
| D8         | Stiklestad → Borås          | 61.1      | 2,013 m          | Munkeby Herberge lunch, Lake Movatnet swim                             |
| D9         | Borås → Mostadmark           | 47.8      | 2,187 m          | Confirmed swim at Hell bathing area (Lånke); last shop before Nidaros  |
| D10        | Mostadmark → Nidaros         | 28.5      | 733 m            | Confirmed swim at Lake Foldsjøen; shortest day, finish at the cathedral |
| **Total**  |                              | **589.9 km** | **18,673 m**   | |

> All distances/elevation are from stolavsleden.com's official itemized stage table, prorated for the handful of day-boundaries that fall mid-segment. One sub-segment (Tännforsen–Medstugan) is missing an official elevation figure and is estimated at ~470m within D6's total.

---

## Confirmed food, water, and swimming per day

Every camp night in the current plan has confirmed water at or very near the endpoint, and most days have at least one confirmed lunch and dinner option — this took a dedicated research pass (see commit history for sources).

| Day end     | Water at camp                          | Notable food stops                                                        |
| ----------- | ---------------------------------------- | ------------------------------------------------------------------------------ |
| Fränsta     | Ljungan river                            | Matfors, Stöde Camping (lake+river+restaurant), Torpshammar (village, river)   |
| Stavre      | Historic lake village (steamboat era)    | Borgsjö Strand (lunch buffet Tue–Sun 11–16), Hemsjön (lake), Bräcke (2 lunch options), Gimårasten (rest stop) |
| Ope         | **Lake Storsjön shoreline** (confirmed)  | Camp Viking/Gällö (dinner Thu–Sun, lake), Pilgrimstad, Brunflo                 |
| Alsen       | Camp Östbacken (confirmed swim)          | Östersund (full resupply — best on the route), Frösön, Nälden (Matverkstan lunch) |
| Åre         | Lake Åresjön                             | Mörsil (lunch, hours unverified), ⚠️ Hålland (critical water — none until Åre), Undersåker |
| Skalstugan  | Nearby lakes (Bodsjön, Medstugusjön) + Medstugeån river | Duved, Tännforsen (waterfall swim + cafe), Medstugan (river swim, self-catering only, closed 15 Aug–20 Oct) |
| Stiklestad  | **Verdalselva river** (confirmed — Stiklestad Camping sits on it) | Sul (critical water), Vuku (Gatekjøkken + Coop, **closed Sundays**) |
| Borås       | River-adjacent (self-catering pilgrim hostel, pre-book) | Munkeby Herberge (lunch + cheese shop), Troset Gård/Lake Movatnet             |
| Mostadmark  | **Lake Foldsjøen** (confirmed — Langnesset swimming spot) | Lånke (last shop + confirmed swim at Hell bathing area on Stjørdalselva)      |
| Nidaros     | — (finish)                               | Ranheim (cafe), Saksvikskorsen (viewpoint)                                    |

**Known remaining gaps:** Mörsil's lunch venue/hours unverified. Stavre and Borås are real settlements but individual amenities aren't deeply verified — treated as "likely fine, self-catering as backup."

---

## Apps / files

### 📱 app.html — Day cards (primary field tool)

Mobile-optimized card view, one page per day:

- Swipe left/right between days, with a slide-in transition
- Mini map shows **real trail geometry** pulled directly from the official GPX files (loop-fixed, see below)
- Km and elevation are stored as official stage-table values; the map and stats can't drift out of sync
- D7 (Skalstugan→Stiklestad) is clearly flagged as an estimated route (dashed line, red warning) since no official GPX exists for this section — now cross-validated against independent trail-race data
- **Elevation profile** — SVG chart per day built from real per-segment official data, not just a peak number
- **Live GPS tracking** — "Track me" toggle shows your actual position against the route
- **Water/food checklist** per stop, persisted in `localStorage`
- **Per-day GPX export** — download button for backup navigation in Gaia GPS/OsmAnd
- **Pace calculator** using Naismith's rule (1h/4km + 1h/600m climb), with a start-time input and live ETA
- **Emergency info panel** — SE/NO numbers shown based on which country the current day is in
- Sunrise/sunset calculated from coordinates and date
- Live weather from api.met.no (free, no API key, shown within 9 days of departure)
- Progress bar with day-boundary tick marks; critical stops (water warnings etc.) render as distinct red markers on the map

### 🗺 index.html — Overview map (planning)

Interactive Leaflet map with 7 toggleable layers (Norwegian UI — not yet translated to match app.html):

| Layer                        | Content                                              |
| ------------------------------ | -------------------------------------------------------- |
| 🏕 Optimal bivvy spots        | One per day, confirmed camping location                   |
| ⛺ Suggested campsites        | Backup and alternative spots                               |
| 💧 Water & supplies           | Streams, taps, shops — critical stops marked               |
| 🍽 Food stops                 | Cafes, restaurants, hot meals                               |
| 📖 Pilgrim stamps             | 9 stamp stations, D0 start → D10 finish                     |
| 🏊 St. Olav's swimming lakes  | Traditional swimming spots along the route                  |
| ⚠️ Demanding stages           | The three brutal climbs                                     |

### Offline support (PWA)

`manifest.json` + `sw.js` make the app installable and partially usable offline:
- App shell (HTML/JS/CSS/Leaflet) and map tiles cache for offline use
- **HTML is network-first** — critical fix: an earlier version cached HTML cache-first, which silently hid every future push from anyone who'd already loaded the app once. Always test that pushed changes actually appear before relying on this.
- Map tiles are cached as-you-browse — view each day once with signal (e.g. the night before departure) to make that day's map available offline afterward
- Weather is network-first with offline fallback to the last cached forecast

---

## GPX files and known data bugs

Official GPX files from Naturkartan / stolavsleden.se live in `/gpx/`. All five files contain both hiking-trail variants (`type_key=hiking`) and alternate riding/cycling tracks — the app uses only the hiking segments.

| File                                          | Coverage                | Status                                                              |
| ------------------------------------------------ | -------------------------- | ------------------------------------------------------------------------ |
| `selanger-borgsjo-s-t-olavsleden.gpx`             | Selånger → Borgsjö        | ✅ Complete hiking trail                                                   |
| `borgsjo-ostersund.gpx`                           | Borgsjö → Östersund       | ✅ Complete hiking trail                                                   |
| `ostersund-are.gpx`                               | Östersund → Åre           | ✅ Complete hiking trail                                                   |
| `are-stiklestad.gpx`                              | Åre → Skalstugan          | ✅ Complete to Skalstugan · **entirely missing Skalstugan→Stiklestad**     |
| `stiklestad-trondheim-s-t-olavsleden.gpx`         | Stiklestad → Trondheim    | ✅ Complete hiking trail                                                   |

**Skalstugan→Stiklestad (D7):** no official GPX exists anywhere found. The map line is an approximation between known points (Skalstugan, Sul, Vuku, Stiklestad), scaled to match the official stage distance (60.4 km), and independently cross-checked against St Olavsloppet trail-race data (57.4 km for the same corridor, close enough to be a good sanity check). **Verify against physical waymarking in the field.**

**GPX bugs found and fixed — important context if this geometry is ever touched again:**
1. Some `<trk>` elements contain **exact-duplicate `<trkseg>` children** (e.g. Lånke–Mostadmark had the same 784-point path recorded twice), producing visible loop/backtrack artifacts on the map. Fix: deduplicate identical trkseg before concatenating.
2. **One segment (Ranheim–Nidaros) is recorded backwards** — the single trkseg starts near Nidaros and ends near Ranheim. The chain reached the real cathedral location partway through, then reversed direction back out to Ranheim before "finishing." Fix: detect and reverse.
3. Most segments have several small legitimate `<trkseg>` pieces (GPS paused/resumed) that must stay concatenated in file order — don't assume multiple trkseg always means duplicates or bad ordering; check each case.
4. After fixing 1–3, a final loop-stripping pass (detect a large forward jump immediately followed by a near-return to an earlier point, splice out the loop) cleaned up a few remaining artifacts. Current geometry is verified loop-free — checked via max single-point-jump distance and revisit-proximity scans across all 10 day routes.

**Important:** none of the GPX files contain elevation data (ele=0). Elevation gain per day comes entirely from stolavsleden.com's official itemized stage table.

---

## Critical stops

| Stop                    | Day   | Why                                                                             |
| -------------------------- | ----- | ----------------------------------------------------------------------------------- |
| **Östersund**              | D4    | Best resupply city. Supermarket, outdoor gear shop, pharmacy.                       |
| **Hålland**                | D5    | Fill ALL water here. Climb ahead — no reliable water until Åre.                     |
| **Åre**                    | D6    | Last major Swedish town. Pack for D6 + D7 border crossing. Showers available.       |
| **Sul**                    | D7    | Last known point before ~27 km with no services (Sul→Vuku). Carry 2L+ water.        |
| **Vuku**                   | D7    | First Norwegian shop — **closed Sundays**, plan accordingly.                        |
| **Lånke**                  | D9    | Last shop before Nidaros, plus confirmed swim at Hell bathing area.                 |

---

## Stack

- [Leaflet.js](https://leafletjs.com/) — interactive map
- [OpenStreetMap](https://www.openstreetmap.org/) — map tiles
- [api.met.no](https://api.met.no/) — free weather forecasts, no API key
- [GitHub Pages](https://pages.github.com/) — free hosting
- Vanilla HTML/JS — no build step, no dependencies

---

## Development

### Run locally

```
open index.html        # Mac
start index.html       # Windows
xdg-open index.html    # Linux
```

### Deploy

Push to `main` — GitHub Pages goes live within ~60 seconds. **If you've loaded the app before on a given device, you may need one clean online visit for the service worker to pick up changes** (see PWA note above).

### Commit format

```
<type>: <short summary in imperative mood>

- detail bullet
```

Types: `feat` · `fix` · `data` · `docs` · `style` · `refactor`

### Data structure

**index.html** — map layers as JS arrays in the `<script>` block:

```
const bivvyPts    = [ ... ];  // optimal bivvy spots
const campPts     = [ ... ];  // suggested campsites
const waterPts    = [ ... ];  // water & supplies
const foodPts     = [ ... ];  // food stops
const passportPts = [ ... ];  // stamp stations
const swimPts     = [ ... ];  // swimming lakes
const warnPts     = [ ... ];  // demanding stages
```

**app.html** — day data as array `D[]`, one object per day. `route` is real GPX geometry (except D7, flagged `est:true`). `km` and `eg` (elevation gain) are the official stolavsleden.com stage figures, prorated for mid-segment boundaries. `profile` is a coarse cumulative-elevation array used for the SVG chart. `country` (`SE`/`NO`) drives the emergency-info panel. `mid` is computed in JS at load time for weather/sun calculations:

```
{ d, f, t, c, est, km, eg, country, route, profile, stops, bivvy, warn, note }
```

---

## Planned features

- [ ] Translate index.html to English to match app.html
- [ ] Verify Mörsil's lunch venue and spot-check Stavre/Borås amenities
- [ ] Test GPX export against a real device/app (Gaia GPS, OsmAnd)
- [ ] Better source for Skalstugan→Stiklestad geometry, if one ever surfaces (contact pilegrimsleden.no/stolavsleden.com directly, or Strava/Komoot heatmaps)
- [ ] Consider full offline tile pre-caching instead of cache-as-you-browse

---

*Nidaros Cathedral, ~590 km after St. Olav walked this way. Go well.* 🛤
