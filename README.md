# F1F_St_Olafsleden — Selånger → Nidaros

Interactive web app for planning and running the **St. Olavsleden / Pilegrimsleden** pilgrimage route from **Selånger, Sweden** to **Nidaros Cathedral, Trondheim, Norway** (~600 km, 10 days, bivvy camping throughout).

🗺 **Overview map:** [ricocousin.github.io/F1F_St_Olafsleden](https://ricocousin.github.io/F1F_St_Olafsleden)
📱 **Day cards (field app):** [ricocousin.github.io/F1F_St_Olafsleden/app.html](https://ricocousin.github.io/F1F_St_Olafsleden/app.html)

---

## ⚠️ On distance: three different numbers, and which one we use

stolavsleden.com and pilegrimsleden.no consistently list **580 km** as the total length (marketing/rounded figure). Summing the official GPX tracks (hiking-only variants) gave us **646.6 km**. Neither of those turned out to be the number to plan around.

stolavsleden.com also publishes an **itemized stage table** — every sub-segment of the route with exact distance *and* elevation gain. Summed, it comes to:

**600.1 km total, 18,542 m elevation gain.**

We cross-checked this against our GPX data segment by segment: **23 of 29 segments matched within half a kilometer** — strong mutual validation. The other 6 (concentrated around Gällö–Pilgrimstad–Brunflo and Munkeby–Markabygda–Rådal) were off by 2–19 km, most likely because the GPX "hiking" track there follows a longer scenic/alternate variant rather than today's direct official trail. The itemized table's total elevation gain (18,542 m) also matches this project's original estimate ("~18,500 m") almost exactly, from before any of this GPX work — a good independent confirmation that the table is trustworthy.

**This app now plans against the official itemized table: 600.1 km, 18,542 m elevation gain** — the first time this project has had real elevation data rather than an estimate. The map lines still come from GPX geometry where it's accurate; the 6 mismatched stretches may show a slightly longer path on the map than the official straight-line distance used for planning.

---

## Route overview

Days are balanced to decrease steadily around two fixed anchors: **Östersund** (the only major resupply city, D3) and the **Skalstugan→Stiklestad border crossing** (D7, its own day since there's nowhere safe to camp mid-crossing).

| Day        | From → To                            | Official km | Elevation gain | Notes                                                       |
| ---------- | --------------------------------------- | ------------ | ---------------- | ------------------------------------------------------------- |
| D1         | Selånger → near Fränsta                 | 76.8         | 1,288 m           | Follows the Ljungan river valley                               |
| D2         | near Fränsta → Gällö                    | 70.8         | 2,054 m           | Most climbing of the first three days                          |
| D3         | Gällö → **Östersund ★**                 | 64.8         | 1,500 m           | ★ Only major resupply city on the whole route                   |
| D4         | Östersund → near Alsen                  | 63.9         | 1,319 m           | Mountains start coming into view                                 |
| D5         | near Alsen → Åre                        | 59.9         | 3,043 m           | Biggest single climbing day before the border                    |
| D6         | Åre → Skalstugan                        | 55.9         | 1,464 m           | Last stage in Sweden, Tännforsen waterfall                       |
| D7         | Skalstugan → Stiklestad                 | **60.4** ⚠️  | **3,072 m**       | Hardest AND longest day · border crossing · no GPX                |
| D8         | Stiklestad → near Markabygda            | 51.2         | 1,662 m           | Body feels the border day, but distance shrinks now               |
| D9         | near Markabygda → Lånke/Vaernes         | 49.2         | 1,150 m           | Last shop before Nidaros                                          |
| D10        | Lånke/Vaernes → **Nidaros**             | 47.2         | 2,460 m           | Shortest day, but a demanding final push                         |
| **Total**  |                                          | **600.1 km** | **18,542 m**      | |

> All distances and elevation gain are from stolavsleden.com's official itemized stage table — real data, not estimates. One sub-segment (Tännforsen–Medstugan) is missing an official elevation figure and is estimated at ~470m within D6's total.

---

## Apps / files

### 📱 app.html — Day cards (primary field tool)

Mobile-optimized card view, one page per day:

- Swipe left/right between days
- Mini map shows **real trail geometry** pulled directly from the official GPX files (not hand-placed points)
- Km and total distance are **computed live** from the route line itself — can never fall out of sync with the map like it did before
- D7 (Skalstugan→Stiklestad) is clearly flagged as an estimated route (dashed line, red warning) since no official GPX exists for this section
- Stats: km · estimated time · day · total
- Sunrise/sunset calculated from coordinates and date
- Live weather from api.met.no (free, no API key, shown within 9 days of departure)
- Key stops with km markers, icons, and notes
- Bivvy panel (green) · warning panel (red) · day notes

### 🗺 index.html — Overview map (planning)

Interactive Leaflet map with 7 toggleable layers:

| Layer                        | Content                                              |
| ------------------------------ | -------------------------------------------------------- |
| 🏕 Optimal bivvy spots        | One per day, confirmed camping location                   |
| ⛺ Suggested campsites        | Backup and alternative spots                               |
| 💧 Water & supplies           | Streams, taps, shops — critical stops marked               |
| 🍽 Food stops                 | Cafes, restaurants, hot meals                               |
| 📖 Pilgrim stamps             | 9 stamp stations, D0 start → D10 finish                     |
| 🏊 St. Olav's swimming lakes  | Traditional swimming spots along the route                  |
| ⚠️ Demanding stages           | The three brutal climbs                                     |

---

## Critical stops

| Stop                    | Day   | Why                                                                             |
| -------------------------- | ----- | ----------------------------------------------------------------------------------- |
| **Östersund**              | D3    | Best resupply city. Supermarket, outdoor gear shop, pharmacy.                       |
| **Hålland**                | D5    | Fill ALL water here. Climb ahead — no reliable water until Åre.                     |
| **Åre**                    | D6    | Last major Swedish town. Pack for D6 + D7 border crossing. Showers available.       |
| **Sul**                    | D7    | Last known point before 27 km with no services (Sul→Vuku). Carry 2L+ water.         |
| **Lånke / Vaernes**        | D9    | Last shop before Nidaros. Fill up on everything.                                    |

---

## GPX files

Official GPX files from Naturkartan / stolavsleden.se live in `/gpx/`. All five files contain both hiking-trail variants (`type_key=hiking`) and alternate riding/cycling tracks — the app uses only the hiking segments.

| File                                          | Coverage                | Status                                                              |
| ------------------------------------------------ | -------------------------- | ------------------------------------------------------------------------ |
| `selanger-borgsjo-s-t-olavsleden.gpx`             | Selånger → Borgsjö        | ✅ Complete hiking trail (4 segments, ~98 km)                              |
| `borgsjo-ostersund.gpx`                           | Borgsjö → Östersund       | ✅ Complete hiking trail (6 segments, ~150 km)                             |
| `ostersund-are.gpx`                               | Östersund → Åre           | ✅ Complete hiking trail (8 segments, ~132 km)                             |
| `are-stiklestad.gpx`                              | Åre → Skalstugan          | ✅ Complete to Skalstugan · **entirely missing Skalstugan→Stiklestad**     |
| `stiklestad-trondheim-s-t-olavsleden.gpx`         | Stiklestad → Trondheim    | ✅ Complete hiking trail (7 segments, ~152 km)                             |

**Skalstugan→Stiklestad (D7):** no official GPX exists anywhere we've found. The map line in the app is an approximation between known points (Skalstugan, Sul, Vuku, Stiklestad), scaled to match stolavsleden.com's official stage distance (60.5 km). **Verify against physical waymarking in the field** — don't blindly trust the map line through the border crossing.

**Important:** none of the GPX files contain elevation data (ele=0). Elevation gain per day now comes from stolavsleden.com's official itemized stage table (see distance section above), not from the GPX files.

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

Push to `main` — GitHub Pages goes live within ~60 seconds.

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

**app.html** — day data as array `D[]`, one object per day. `route` is real GPX geometry (except D7, flagged `est:true`). `km` and `eg` (elevation gain) are the official stolavsleden.com stage figures, stored directly rather than derived from GPX. `mid` and cumulative distance are computed in JS at load time from the `route` array:

```
{ d, f, t, c, est, km, eg, route, stops, bivvy, warn, note }
```

---

## Planned features

- [ ] Elevation profile per day (SVG profile strip in the day card)
- [ ] Offline/PWA — cache map tiles for field use without signal
- [ ] More St. Olav's swimming lakes (Lodden lakes)
- [ ] Calories and food weight per day
- [ ] Elevation data via Open-Elevation API
- [ ] Better source for Skalstugan→Stiklestad geometry (contact pilegrimsleden.no/stolavsleden.com directly, or Strava/Komoot heatmaps)

---

*Nidaros Cathedral, ~600 km after St. Olav walked this way. Go well.* 🛤
