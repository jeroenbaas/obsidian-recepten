# 🍽️ Receptenbeheer - Instructies

## Hoe werkt het?

Wanneer je een recept link deelt, wordt het **automatisch** opgeslagen in deze vault volgens onderstaande structuur.

---

## 📁 Folder Structuur

```
📁 Recepten/
├── 📄 Template.md              # Sjabloon voor nieuwe recepten
├── 📁 Soepen/                  # Alle soepen
├── 📁 Hoofdgerechten/          # Hoofdmaaltijden
├── 📁 Bijgerechten/            # Sides & bijgerechten  
├── 📁 Desserts/                # Toetjes & desserts
└── 📁 Overig/                  # Sauces, dressings, etc.

📁 Maaltijdlog/
├── 📄 2026-02-08.md            # Per dag: wat we aten
```

---

## 📝 Recept Template

Elk recept krijgt deze YAML frontmatter + structuur:

```markdown
---
title: "[Naam van het gerecht]"
category: "[Soep/Hoofdgerecht/Bijgerecht/Dessert/Overig]"
cuisine: "[Italiaans/Nederlands/Frans/etc]"
difficulty: "[Makkelijk/Gemiddeld/Moeilijk]"
time: "[Bereidingstijd]"
portions: "[Aantal personen]"
source: "[URL of bron]"
author: "[Jamie Oliver/etc]"
dietary:
  - "[vegetarisch/vegan/glutenvrij/etc]"
tags:
  - "[tag1]"
  - "[tag2]"
  - "[tag3]"
last_made: "[YYYY-MM-DD of null]"
rating: "[1-5 of null]"
---

# [Naam]

> Korte beschrijving van het gerecht

## 🥘 Ingrediënten

| Ingrediënt | Hoeveelheid | Opmerking |
|------------|-------------|-----------|
| ... | ... | ... |

## 👨‍🍳 Bereiding

1. Stap 1
2. Stap 2
3. ...

## 💡 Tips & Variaties

- ...

## 🗒️ Maaltijdlog

| Datum | Gelegenheid | Opmerking |
|-------|-------------|-----------|
| ... | ... | ... |

```

---

## 🏷️ Tags (voor later indexeren)

### Type
- `#recept/soep`
- `#recept/hoofdgerecht`
- `#recept/bijgerecht`
- `#recept/dessert`

### Seizoen
- `#seizoen/lente`
- `#seizoen/zomer`
- `#seizoen/herfst`
- `#seizoen/winter`

### Dieet
- `#dieet/vegetarisch`
- `#dieet/vegan`
- `#dieet/glutenvrij`
- `#dieet/koolhydraatarm`
- `#dieet/lactosevrij`

### Bereiding
- `#bereiding/oven`
- `#bereiding/bbq`
- `#bereiding/snel` (< 30 min)
- `#bereiling/mealprep` (vriezer-vriendelijk)

### Keuken
- `#keuken/italiaans`
- `#keuken/frans`
- `#keuken/aziatisch`
- `#keuken/nederlands`
- `#keuken/mexicaans`
- etc.

---

## 🍽️ Maaltijdlog

Elke keer dat we een recept maken, wordt dit gelogd in `Maaltijdlog/YYYY-MM-DD.md`:

```markdown
# 2026-02-08

## Avondeten
- **Gerecht:** [[Tomatensoep van Jamie Oliver]]
- **Aantal:** 3x de hoeveelheid (voor deze week)
- **Opmerking:** Bouillon aangepast (1L ipv 1,5L)
```

---

## ⚡ Automatische Workflow

Wanneer je een recept-URL stuurt:

1. ✅ Check of recept al bestaat (zoek op titel + bron)
2. ✅ Haal recept op van de website
3. ✅ Parse ingrediënten + bereiding
4. ✅ Categoriseer (soep/hoofdgerecht/etc)
5. ✅ Genereer tags gebaseerd op inhoud
6. ✅ Sla op in juiste folder
7. ✅ Update Maaltijdlog indien van toepassing
8. ✅ Bevestig aan jou wat er is gedaan

---

## 🔍 Handige Queries (voor later)

In Obsidian kun je later dit soort overzichten maken:

```dataview
TABLE cuisine, time, rating
FROM #recept/hoofdgerecht
SORT rating DESC
```

```dataview
TABLE last_made
FROM #recept/soep
SORT last_made DESC
```

---

*Laatst bijgewerkt: 2026-02-08*
