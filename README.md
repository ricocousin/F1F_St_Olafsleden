# F1F_St_Olafsleden — Selånger → Nidaros

Interactive web app for planning and running the **St. Olavsleden / Pilegrimsleden** pilgrimage route from **Selånger, Sweden** to **Nidaros Cathedral, Trondheim, Norway** (~647 km, 10 days, bivvy camping throughout).

🗺 **Overview map:** [ricocousin.github.io/F1F_St_Olafsleden](https://ricocousin.github.io/F1F_St_Olafsleden)
📱 **Day cards (field app):** [ricocousin.github.io/F1F_St_Olafsleden/app.html](https://ricocousin.github.io/F1F_St_Olafsleden/app.html)

---

## ⚠️ On distance: 580 km (official) vs. 647 km (this plan)

stolavsleden.com and pilegrimsleden.no consistently list **580 km** as the total length. After loading the official GPX tracks (hiking-only variants, filtered out from riding/cycling) and chaining them together, we get **646.6 km** — nearly 70 km more.

We dug into this before trusting the number:

- Raw GPS point noise contributes almost nothing (<0.4 km total across ~20,000 points) — not the explanation.
- The sum of all hiking-tagged GPX segments is 570.2 km, plus ~16 km of real but small connector gaps between individual tracks (separate recordings that don't quite share an endpoint).
- The Skalstugan→Stiklestad section (the border crossing) has no official GPX at all. We used stolavsleden.com's own stage breakdown for this section instead: Skalstugan–Riksgränsen–Sul 21.2 km + Sul–Vuku 27.3 km + Vuku–Stiklestad 11.9 km = **60.5 km**.
- **570.2 + 16 + 60.5 ≈ 647 km.**
- An independent third-party GPS tracker (the HiiKER app) reports the trail at approximately **623 km**, entirely independent of our calculation — same order of magnitude, same direction of deviation from 580.

**Conclusion:** "580 km" is most likely a rounded, long-standing marketing figure rather than a precisely GPS-measured distance. Real hiking distance is probably **620–650 km**. This app plans around the real 647 km, not the official 580 — better to over-provision food/water than under-provision.

---

## Route overview

Days are balanced to decrease steadily around two fixed anchors: **Östersund** (the only major resupply city, D3) and the **Skalstugan→Stiklestad border crossing** (D7, its own day since there's nowhere safe to camp mid-crossing).

| Day        | From → To                       | Real km      | Difficulty                                                |
| ---------- | -------------------------------- | ------------ | ------------------------------------------------------------ |
| D1         | Selånger → near Fränsta          | 89           | Longest day of the trip — consider splitting in two            |
| D2         | near Fränsta → near Gällö        | 83           | Forest terrain, steady climb                                   |
| D3         | near Gällö → **Östersund ★**     | 77           | ★ Only major resupply city on the whole route                  |
| D4         | Östersund → near Alsen           | 66           | Mountains start coming into view                                |
| D5         | near Alsen → near Åre            | 62           | ⚠️ Hålland → Åre: climb with no water                          |
| D6         | near Åre → Skalstugan            | 58           | Last stage in Sweden, Tännforsen                                |
| D7         | Skalstugan → Stiklestad          | **60.5** ⚠️  | Hardest AND longest day · border crossing · no GPX             |
| D8         | Stiklestad → near Rådal/Borås    | 53           | Body feels it, but distance is shrinking now                    |
| D9         | near Rådal/Borås → near Mostadmark | 51         | Last shop at Lånke/Vaernes                                       |
| D10        | near Mostadmark → **Nidaros**    | 49           | Shortest day — finish line                                      |
| **Total**  |                                   | **~646.6 km** | |

> Elevation data is still estimated — the GPX files have no elevation data (ele=0).

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

**Important:** none of the GPX files contain elevation data (ele=0). Elevation gain estimates are computed from an external DEM.

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

**app.html** — day data as array `D[]`, one object per day. `route` is real GPX geometry (except D7, flagged `est:true`). `km`, `mid`, and cumulative distance are computed in JS at load time from the `route` array — they're not stored as static numbers, specifically to prevent the map and stats from drifting out of sync again:

```
{ d, f, t, c, est, route, stops, bivvy, warn, note }
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

*Nidaros Cathedral, ~647 km after St. Olav walked this way. Go well.* 🛤
