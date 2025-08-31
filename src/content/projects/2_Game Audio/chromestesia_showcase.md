---
title: "Chromestesia"
altTitle: "Chromestesia"
description: "Plongez dans Chromestesia, platformer-combat à l'énergie punk forgé en moins d'un mois. Incarnez Michèle et basculez les couleurs pour métamorphoser les plateformes… et la musique !"
tech: ["FMOD", "Reaper", "Unity"]
status: "completed" # or "in-progress" | "planned"
link: "https://example.com"
github: "https://github.com/you/repo"
date: 2024-08-22
useBentoLayout: true

# Bento Layout Configuration
bento:
  # Theme color
  accentColor: "#dfdb00ff"

  # REQUIRED for auto hero/logo + gallery
  # Put images here and name hero.* and logo.* for the hero card
  assetsFolder: "/src/content/projects/2_Game Audio/Assets_Chromestesia"

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
    subtitle: "Musicien, Sound-Designer et Intégrateur Audio"
    subtitleColor: "#faf525"
    backgroundPosition: "center"
    backgroundSize: "cover"
    backgroundScale: 1.1  # Alternative to backgroundSize - use 1.1, 0.9, etc.
    overlayTopOpacity: 0.1  # Controls dark overlay opacity at top (0.0 = transparent, 1.0 = opaque)
    overlayBottomOpacity: 0.7  # Controls dark overlay opacity at bottom (0.0 = transparent, 1.0 = opaque)
    showLogo: false

  # Optional stats
  stats:
    - value: "1 Month"
      label: "DURATION"
    - value: "10 👨‍👩‍👦‍👦"
      label: "TEAM SIZE"
    - value : "PC"
      label : "PLATFORM"
    - value : ISART
      label : COMPANY

  # Optional actions
  actions:
    title: "Experience"
    primary:
      text: "📽️ Watch the trailer"
      url: "https://youtu.be/6aKB7nFtJQo?si=a0XfJuEDsXJyw6F2"
    secondary:
      text: "🕹️ Gameplay Demo"
      url: "https://youtu.be/COJwYCqv5dw?si=PmIhmJSQem6hF6Ha"

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
    title: "Process"
    steps:
      - "Création et conception de l'intégralité des SFX pour constituer une banque de son propre au projet."
      - "Création des musiques ainsi que de leurs variantes (chaque musique à deux versions dans ce jeu)"
      - "Intégration des musiques, SFX et mixage dans FMOD"
      - "Spatialisation et intégration dans UNITY"
      - "Extra : Création de graphitis, Conception de la cinématique d'introduction, animation du personnage jouable"

  # Gallery images auto from assetsFolder; title optional
  gallery:
    title: "Gallery"

  # Optional challenges
  challenges:
    title: "Key Challenges"
    items:
      - title: "Réactivité du système de music-switch"
        description: "Dans ce jeu le joueur peut changer les pistes musicales à volonté grâce au système de switch. Pour une expérience fluide, un système de synchornisation musicale associé a un système de cooldown a permi de rendre cette expérience très satisfaisant pour le joueur."

  # Optional results
  results:
    title: "Results"
    items:
      - icon: "🕹️"
        text: "Une gold jouable développé en 3 semaines"
      - icon: "🎵"
        text: "Une OST de 6 titres disponible sur SoundCloud"
---

# Your Project Title

A few paragraphs describing the project goals, your role, the tech, and the outcome. This Markdown is shown on the dedicated route `/projects/<slug>`.

## Highlights

- Key feature or achievement
- Another notable detail
- Any recognition, awards, or measurable impact
