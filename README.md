# F1F_St_Olafsleden — Selånger → Nidaros

Interactive web app for planning and running the **St. Olavsleden / Pilegrimsleden** pilgrimage route from **Selånger, Sweden** to **Nidaros Cathedral, Trondheim, Norway** (~620 km, 10 days, bivvy camping throughout).

🗺 **Oversiktskart:** [ricocousin.github.io/F1F_St_Olafsleden](https://ricocousin.github.io/F1F_St_Olafsleden)  
📱 **Dagskort (field app):** [ricocousin.github.io/F1F_St_Olafsleden/app.html](https://ricocousin.github.io/F1F_St_Olafsleden/app.html)

---

## Route overview

Distances decrease by ~3 km per day — shorter each day for motivational momentum.

| Dag | Fra → Til | km | Vanskelighet |
|-----|-----------|-----|--------------|
| D1 | Selånger → Borgsjö | 76 | Moderat |
| D2 | Borgsjö → nær Gällö | 72 | Moderat |
| D3 | Gällö → Östersund | 70 | Moderat · ★ Storby-forsyning |
| D4 | Östersund → Mörsil | 66 | Moderat |
| D5 | Mörsil → Åre | 64 | ⚠️ Svært hardt · +1 463 m ved Hålland |
| D6 | Åre → Skalstugan | 60 | Krevende · siste Sverige-etappe |
| D7 | Skalstugan → Stiklestad | 58 | ⚠️ Hardeste dag · +1 781 m · grensepassering |
| D8 | Stiklestad → Rådal/Borås | 54 | Krevende |
| D9 | Rådal/Borås → Mostadmark | 52 | Krevende · +1 630 m · siste butikk Lånke |
| D10 | Mostadmark → Nidaros | 48 | Moderat · målgang |
| **Totalt** | | **~620 km** | **~18 500 m stigning (est.)** |

> Stigningsdata er estimert — GPX-filer mangler høydedata (ele=0).

---

## Apper / filer

### 📱 app.html — Dagskort (primær feltverktøy)
Mobiloptimalisert kortvisning, én side per dag:
- Swipe venstre/høyre mellom dager
- Minikart zoomer til dagens segment
- Statistikk: km · estimert tid · dag · totalt
- Soloppgang/solnedgang beregnet fra koordinater og dato
- Sanntidsvær fra api.met.no (gratis, ingen API-nøkkel, vises innen 9 dager før avgang)
- Nøkkelstopp med km-markering, ikoner og notater
- Bivvy-panel (grønt) · advarselspanel (rødt) · dagsnote

### 🗺 index.html — Oversiktskart (planlegging)
Interaktivt Leaflet-kart med 7 togglbare lag:

| Lag | Innhold |
|-----|---------|
| 🏕 Optimale bivvyplasser | Én per dag, bekreftet overnattingssted |
| ⛺ Foreslåtte campingplasser | Backup og alternative steder |
| 💧 Vann & forsyning | Bekker, kraner, butikker — kritiske stopp merket |
| 🍽 Matstopp | Kafeer, restauranter, varme måltider |
| 📖 Pilegrimsstempler | 9 stempelstasjoner, D0 oppstart → D10 mål |
| 🏊 St. Olavs badesjøer | Tradisjonelle badesjøer langs ruten |
| ⚠️ Krevende etapper | De tre brutale stigningene |

---

## Kritiske stopp

| Stopp | Dag | Hvorfor |
|-------|-----|---------|
| **Östersund** | D3 | Beste forsyningsby. Supermarked, utstyrsbutikk, apotek. Fyll sekken for D5-fjellene. |
| **Hålland** | D5 | Fyll ALT vann her. +1 463 m stigning foran — ingen pålitelig vann til Åre. |
| **Åre** | D5/D6 | Siste store svenske by. Pack for D6 + D7 grensepassering. Dusj tilgjengelig. |
| **Sul / Riksgränsen** | D7 | Norsk grense. Ingen tjenester de neste 28 km. Bær 2L+ vann. |
| **Lånke / Vaernes** | D9 | Siste butikk før Nidaros. Fyll alt. |

---

## GPX-filer

Offisielle GPX-filer fra Naturkartan / pilgrimsleden.se ligger i `/gpx/`.

| Fil | Dekning | Status |
|-----|---------|--------|
| `selanger-borgsjo.gpx` | Selånger → Borgsjö | Kun ridning/sykling-varianter, ingen dedikert fotrute |
| `borgsjo-ostersund.gpx` | Borgsjö → Östersund | Fotruter identifisert, Pilgrimstad→Brunflo mangler |
| `ostersund-are.gpx` | Östersund → Åre | Delvis fotrute, Östersund→Rödön kun sykling |
| `are-stiklestad.gpx` | Åre → Skalstugan | Mangler Skalstugan→Stiklestad (~65 km) |
| `stiklestad-trondheim.gpx` | Stiklestad → Trondheim | ✅ Komplett, 7 segmenter, 143.9 km |

**Viktig:** Ingen GPX-filer har høydedata (ele=0). Stigningsestimater er beregnet fra ekstern DEM.

---

## Stack

- [Leaflet.js](https://leafletjs.com/) — interaktivt kart
- [OpenStreetMap](https://www.openstreetmap.org/) — kartfliser
- [api.met.no](https://api.met.no/) — gratis værvarsling, ingen API-nøkkel
- [GitHub Pages](https://pages.github.com/) — gratis hosting
- Vanilla HTML/JS — ingen build-steg, ingen avhengigheter

---

## Utvikling

### Kjøre lokalt
```bash
open index.html        # Mac
start index.html       # Windows
xdg-open index.html    # Linux
```

### Deploye
Push til `main` — GitHub Pages er live innen ~60 sekunder.

### Commit-format
```
<type>: <kort sammendrag i imperativ>

- detaljbullet
```
Typer: `feat` · `fix` · `data` · `docs` · `style` · `refactor`

### Datastruktur

**index.html** — kartlag som JS-arrays i `<script>`-blokken:
```js
const bivvyPts    = [ ... ];  // optimale bivvyplasser
const campPts     = [ ... ];  // foreslåtte campingplasser
const waterPts    = [ ... ];  // vann & forsyning
const foodPts     = [ ... ];  // matstopp
const passportPts = [ ... ];  // stempelstasjoner
const swimPts     = [ ... ];  // badesjøer
const warnPts     = [ ... ];  // krevende etapper
```

**app.html** — dagdata som array `D[]`, ett objekt per dag:
```js
{ d, from, to, km, color, mid, route, stops, bivvy, warn, note }
```

---

## Planlagte funksjoner

- [ ] GPX-sporgeometri lastet direkte inn i app.html fra `/gpx/`
- [ ] Høydeprofil per dag (SVG-profilstripe i dagskortet)
- [ ] Offline/PWA — cache kartfliser for feltbruk uten signal
- [ ] Flere St. Olavs badesjøer (Lodden-innsjøer)
- [ ] Kcal og matvarevekt per dag
- [ ] Høydedata via Open-Elevation API

---

## Koordinatnøyaktighet

Rutepunkter er foreløpig omtrentlige — manuelt plassert. Verifiser mot:
- `/gpx/`-mappen i dette repoet
- [pilegrimsleden.no](https://pilegrimsleden.no) / [pilgrimsleden.se](https://pilgrimsleden.se)
- Strava/Komoot for Skalstugan→Stiklestad (mangler offisiell GPX)

---

*Nidaros domkirke, 1030 år etter at St. Olav gikk denne veien. Gå vel.* 🛤
