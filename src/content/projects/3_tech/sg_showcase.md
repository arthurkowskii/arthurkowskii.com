---
title:
  fr: "Starting_Grid_for_Reaper Script"
  en: "Starting_Grid_for_Reaper Script"
altTitle:
  fr: "Starting Grid for Reaper"
  en: "Starting Grid for Reaper"
description:
  fr: "Starting\_Grid for Reaper est un script qui prend tous vos items sélectionnés (peu importe le type) et qui les place au début de leurs pistes. Le script fonctionne avec tous les types d'items supportés par Reaper et est destiné aux longues sessions de sampling qui résultent souvent en une multitude de samples éparpillés sur une longue durée."
  en: "Starting\_Grid for Reaper is a script that takes all your selected items (regardless of type) and places them at the beginning of their tracks. The script works with all item types supported by Reaper and is intended for long sampling sessions that often result in a multitude of samples scattered over a long duration."
tech: ["Lua", "Reascript"]
status: "completed" 
link: "https://github.com/arthurkowskii/StartingGrid_for_Reaper"
github: "https://github.com/arthurkowskii/StartingGrid_for_Reaper"
date: 2024-08-22
useBentoLayout: true

# Bento Layout Configuration
bento:
  # Theme color
  accentColor: "#b50606"

  # REQUIRED for auto hero/logo + gallery
  # Put images here and name hero.* and logo.* for the hero card
  assetsFolder: "/src/content/projects/3_tech/Assets_sg"

  # Toggle cards
  cards:
    hero: true
    stats: true
    musicLinks: false
    video: false
    spotify: false
    actions: true
    tech: true
    process: true
    gallery: true
    challenges: true
    results: true

  # Hero subtitle only; hero/background/logo auto from assetsFolder
  hero:
    subtitle: "Lua script for Reaper"
    subtitleColor: "#2666ec"
    backgroundPosition: "center"
    backgroundSize: "cover"
    backgroundScale: 1 # Alternative to backgroundSize
    overlayTopOpacity: 0  # Controls dark overlay opacity at top (0->1)
    overlayBottomOpacity: 0.5  # Controls dark overlay opacity at bottom (0->1)
    showLogo: false

  # Optional stats
  stats:
    - value: "Lua"
      label: "LANGUAGE"
    - value: "0€+"
      label: "PRICE"
    - value: "Reaper"
      label: "PLATFORM"
    - value: "Kowskii"
      label: "CREATOR"

  # Optional actions
  actions:
    title: "Experience"
    primary:
      text:
        fr: "🛒 Télécharger à prix libre sur Gumroad"
        en: "🛒 Download with pay-what-you-want on Gumroad"
      url: "https://arthurkowskii.gumroad.com/"
    secondary:
      text:
        fr: "🗃️ Voir le projet sur GitHub"
        en: "🗃️ View project on GitHub"
      url: "https://github.com/arthurkowskii/StartingGrid_for_Reaper"

  # Music links (exactly 4 items). Enable with cards.musicLinks: true
  musicLinks:
    title: "Music Links"
    items:
      - text: "Spotify"
        url: "https://open.spotify.com/"
      - text: "Apple Music"
        url: "https://music.apple.com/"
      - text: "Bandcamp"
        url: "https://bandcamp.com/"
      - text: "YouTube"
        url: "https://youtu.be/6aKB7nFtJQo?si=a0XfJuEDsXJyw6F2"

  # Optional process
  process:
    title:
      fr: "Guide d'Utilisation"
      en: "User Guide"
    steps:
      - fr: "Séléctionner les items, (quel que soit le type)"
        en: "Select the items (of any type)"
      - fr: "Enclencher le script depuis le menu Actions \"?\" ou par raccourci"
        en: "Run the script from the Actions \"?\" menu or by shortcut"
      - fr: "Les items sont maintenant rangés au début de leurs pistes !"
        en: "The items are now arranged at the beginning of their tracks!"

  # Gallery images auto from assetsFolder;
  gallery:
    title: "Gallery"

  # Optional challenges
  challenges:
    title:
      fr: "Défis techniques"
      en: "Technical Challenges"
    items:
      - title:
          fr: "Embouteillages"
          en: "Item collisions"
        description:
          fr: "Anticipation en cas d'item déjà existant au début d'une piste; Dans ce cas, l'item sélectionné se mettra collé à la suite de celui-ci"
          en: "Handling cases where an item already exists at the beginning of a track; In this case, the selected item will be placed immediately after it"
      - title:
          fr: "Séléction mutliple"
          en: "Multiple selection"
        description:
          fr: "En cas de sélection de plusieurs items appartenant à la même piste, ceux-ci vont se positionner de façon séquentielle en respectant l'ordre d'origine."
          en: "When selecting multiple items from the same track, they will be positioned sequentially while respecting the original order."

  # Optional results
  results:
    title:
      fr: "Fonctionnalités"
      en: "Features"
    items:
      - icon: "✅"
        text:
          fr: "Fonctionne avec tous les types d'items supportés par Reaper"
          en: "Works with all item types supported by Reaper"
      - icon: "⚡"
        text:
          fr: "Temps de réponse immédiat"
          en: "Immediate response time"
      - icon: "🐦"
        text:
          fr: "Léger, rapide et efficace"
          en: "Lightweight, fast and efficient"
      - icon: "💸"
        text:
          fr: "Gratuit ! (pas cher)"
          en: "Free! (not expensive)"
---

# Your Project Title

A few paragraphs describing the project goals, your role, the tech, and the outcome. This Markdown is shown on the dedicated route `/projects/<slug>`.

## Highlights

- Key feature or achievement
- Another notable detail
- Any recognition, awards, or measurable impact
