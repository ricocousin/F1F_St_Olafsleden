# Pilegrimsleden — Selånger → Nidaros

Interactive map for a 10-day pilgrimage run along the St. Olav's Way from **Selånger, Sweden** to **Nidaros Cathedral, Trondheim, Norway** (~600 km, bivvy camping throughout).

🗺 **Live map:** [ricocousin.github.io/F1F_St_Olafsleden](https://ricocousin.github.io/F1F_St_Olafsleden)

---

## Route overview

| Dag | Fra → Til | km | Stigning | Vanskelighet |
|-----|-----------|-----|----------|--------------|
| D1 | Selånger → Fränsta | 70.7 | 1 288 m | Moderat |
| D2 | Fränsta → Bräcke | 58.7 | 1 493 m | Moderat |
| D3 | Bräcke → Brunflo | 67.8 | 1 836 m | Krevende |
| D4 | Brunflo → Alsen | 71.8 | 1 544 m | Moderat |
| D5 | Alsen → Åre | 67.6 | 3 043 m | ⚠️ Svært hardt |
| D6 | Åre → Skalstugan | 55.3 | 994 m | Krevende |
| D7 | Skalstugan → Stiklestad | 60.4 | 3 072 m | ⚠️ Svært hardt |
| D8 | Stiklestad → Borås/Rådal | 67.9 | 2 255 m | Krevende |
| D9 | Borås/Rådal → Mostadmark | 47.8 | 2 187 m | Krevende |
| D10 | Mostadmark → Nidaros | 31.9 | 830 m | Moderat |
| **Totalt** | | **~600 km** | **~18 500 m** | |

---

## Map layers

| Layer | Innhold |
|-------|---------|
| 🏕 Optimale bivvyplasser | Confirmed sleep spots, one per day |
| ⛺ Foreslåtte campingplasser | Backup options and alternative sites |
| 💧 Vann & forsyning | Streams, taps, stores — critical stops starred |
| 🍽 Matstopp | Cafés, restaurants, hot meal opportunities |
| 📖 Pilegrimsstempler | Passport stamp stations, D0 pickup → D10 finish |
| 🏊 St. Olavs badesjøer | Traditional swimming spots along the route |
| ⚠️ Krevende etapper | The three brutal climb segments — plan carefully |

---

## Critical stops

| Stop | Dag | Hvorfor |
|------|-----|---------|
| **Östersund** | D4 | Best resupply city on the route. Gear shop, supermarket, pharmacy. Stock for D5. |
| **Hålland** | D5 | Fill ALL water here. +1 463 m climb ahead with no reliable sources. |
| **Åre** | D5/D6 | Last major Swedish town. Pack for D6 + D7 border crossing. |
| **Sul / Riksgränsen** | D7 | Norway border crossing. No services for 27 km. Carry 2L+ water. |
| **Lånke / Vaernes** | D9 | Last shop before Nidaros. Stock up for 2 days, fill water for Mostadmark climb. |

---

## Stack

- [Leaflet.js](https://leafletjs.com/) — interactive map
- [OpenStreetMap](https://www.openstreetmap.org/) — map tiles
- [GitHub Pages](https://pages.github.com/) — hosting (free)
- Vanilla HTML/JS — no build step, no dependencies to install

---

## Development

All map data lives directly in `index.html` as JavaScript arrays. To add or edit points, find the relevant array near the top of the `<script>` block:

```js
const bivvyPts  = [ ... ];   // optimal bivvy sites
const campPts   = [ ... ];   // suggested campsites
const waterPts  = [ ... ];   // water & resupply
const foodPts   = [ ... ];   // food stops
const passportPts = [ ... ]; // stamp stations
const swimPts   = [ ... ];   // swim spots
const warnPts   = [ ... ];   // hard segment warnings
```

Each point follows this shape:
```js
{ p: [lat, lon], n: 'Name', d: 'Description', ...extras }
```

### Running locally
No server needed — just open `index.html` in a browser.

```bash
open index.html        # Mac
start index.html       # Windows
xdg-open index.html    # Linux
```

### Deploying
Push to `main`. GitHub Pages auto-deploys within ~60 seconds.

---

## Planned features

- [ ] GPX track overlay (actual recorded route)
- [ ] More St. Olav swim lakes (Lodden)
- [ ] Elevation profile chart
- [ ] Offline PWA support (cache tiles for field use)
- [ ] Day-by-day kcal / food weight breakdown panel
- [ ] Filter by difficulty

---

## Coordinate accuracy

All coordinates are currently approximate — hand-placed based on route knowledge. They should be verified against:
- Official Pilegrimsleden GPX files
- [pilegrimsleden.no](https://pilegrimsleden.no) / [pilgrimsleden.se](https://pilgrimsleden.se)

---

*Nidaros Cathedral, 1030 km from the first step. Gå vel.* 🛤
