# DG Statybos — svetainė

Vieno puslapio (one-page) svetainė statybų įmonei **DG Statybos** (Klaipėda + 50 km): karkasiniai namai, stogai, terasos, stoginės ir vidaus apdaila.

## Stekas
Statinis HTML / CSS / JS (be framework'ų). Motion: GSAP ScrollTrigger + Lenis (per CDN).

## Struktūra
- `index.html` — visas puslapis
- `assets/css/style.css` — dizaino sistema + komponentai
- `assets/js/main.js` — sąveikos, motion, galerija, forma
- `assets/img/` — 70 realių darbų nuotraukų (WebP, vandenženklis pašalintas). Originalai — `assets/img/_src/` (į git neįtraukta)
- `server.js` — lokalus statinis serveris (peržiūrai)

## Paleidimas
```bash
node server.js   # → http://localhost:3031
```

## Turinys
Visas tekstas, kainos (nuo 450/100/25 €/m²), 3 atsiliepimai ir 5,0 įvertinimas paimti iš oficialaus
[paslaugos.lt profilio](https://paslaugos.lt/dg-statybos-gs615). Nuotraukos — iš tos pačios galerijos.

## Kontaktinė forma
El. paštas **dgstatybos@gmail.com** įdėtas į kontaktų kortelę, footer'į ir formą. Šiuo metu forma siunčia per
`mailto:` (atidaro lankytojo el. pašto programą su paruošta žinute). Norint, kad užklausa būtų siunčiama
fone (be el. pašto programos), įrašyti tikrą Formspree (ar pan.) ID: `index.html` → `action="https://formspree.io/f/YOUR_FORM_ID"`
(JS automatiškai persijungs į fono siuntimą).

## ⚠️ Reikia patvirtinti su klientu (prieš publikavimą)
- **Facebook / Instagram** — oficialaus profilio nerasta; jei yra, pridėti į navigaciją/footer'į.
- **Logotipas** — naudojamas tekstinis „DG STATYBOS“ ženklas (aiškus bet kokiame dydyje). Jei klientas turi
  vektorinį/originalų logotipą, galima pakeisti.
- **Įmonės rekvizitai** (kodas, PVM, tikslus adresas) — pridėti į footer'į, jei reikia.
- **Domenas** — `canonical`/OG nuorodose įrašytas `dgstatybos.lt` placeholderis; pakeisti į tikrą domeną.
