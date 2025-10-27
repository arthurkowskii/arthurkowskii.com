---
title:
  fr: "Chromestesia"
  en: "Chromestesia"
altTitle:
  fr: "Chromestesia"
  en: "Chromestesia"
description:
  fr: "Plongez dans Chromestesia, platformer-combat à l'énergie punk forgé en moins d'un mois. Incarnez Michèle et basculez les couleurs pour métamorphoser les plateformes… et la musique !"
  en: "Dive into Chromestesia, a punk-energy platformer-combat game forged in less than a month. Play as Michele and switch colors to transform platforms... and the music!"
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

  # Tech section configuration
  tech:
    title:
      fr: "Technologie"
      en: "Technology"

  # Hero subtitle only; hero/background/logo auto from assetsFolder
  hero:
    subtitle:
      fr: "Musicien, Sound-Designer et Intégrateur Audio"
      en: "Musician, Sound Designer and Audio Integrator"
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
    title:
      fr: "Liens"
      en: "Links"
    primary:
      text:
        fr: "📽️ Regarder le trailer"
        en: "📽️ Watch the trailer"
      url: "https://youtu.be/6aKB7nFtJQo?si=a0XfJuEDsXJyw6F2"
    secondary:
      text:
        fr: "🕹️ Démo Gameplay"
        en: "🕹️ Gameplay Demo"
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
    title:
      fr: "Processus"
      en: "Process"
    steps:
      - fr: "Création et conception de l'intégralité des SFX pour constituer une banque de son propre au projet."
        en: "Creation and design of all SFX to build a project-specific sound bank."
      - fr: "Création des musiques ainsi que de leurs variantes (chaque musique à deux versions dans ce jeu)"
        en: "Creation of music and their variants (each track has two versions in this game)"
      - fr: "Intégration des musiques, SFX et mixage dans FMOD"
        en: "Integration of music, SFX and mixing in FMOD"
      - fr: "Spatialisation et intégration dans UNITY"
        en: "Spatialization and integration in Unity"
      - fr: "Extra : Création de graffitis, Conception de la cinématique d'introduction, animation du personnage jouable"
        en: "Extra: Graffiti creation, intro cinematic design, playable character animation"

  # Gallery images auto from assetsFolder; title optional
  gallery:
    title:
      fr: "Galerie"
      en: "Gallery"

  # Optional challenges
  challenges:
    title:
      fr: "Défis Clés"
      en: "Key Challenges"
    items:
      - title:
          fr: "Réactivité du système de music-switch"
          en: "Music-switch system responsiveness"
        description:
          fr: "Dans ce jeu le joueur peut changer les pistes musicales à volonté grâce au système de switch. Pour une expérience fluide, un système de synchornisation musicale associé a un système de cooldown a permi de rendre cette expérience très satisfaisant pour le joueur."
          en: "In this game, players can switch musical tracks at will thanks to the switch system. For a smooth experience, a musical synchronization system combined with a cooldown system made this experience very satisfying for the player."

  # Optional results
  results:
    title:
      fr: "Résultats"
      en: "Results"
    items:
      - icon: "🕹️"
        text:
          fr: "Une gold jouable développé en 3 semaines"
          en: "A playable gold build developed in 3 weeks"
      - icon: "🎵"
        text:
          fr: "Une OST de 6 titres disponible sur SoundCloud"
          en: "A 6-track OST available on SoundCloud"
---

# Chromestesia

Fast-paced punk platformer-combat game featuring innovative color-switching mechanics that transform both platforms and music, developed in under a month as part of a 10-person team at ISART Digital.

## Project Overview

Chromestesia challenged me to create a fully adaptive audio system where music dynamically responds to gameplay mechanics. As the player switches colors to transform platforms, the music seamlessly transitions between complementary track variations, creating a synesthetic experience that bridges visual and audio feedback.

## Technical Achievements

- **Dynamic Music System**: Dual-version soundtrack with real-time color-based switching
- **FMOD Integration**: Advanced audio middleware implementation with Unity
- **Complete Sound Library**: Project-specific SFX bank for punk aesthetic
- **3D Audio Spatialization**: Immersive positional audio in Unity
- **Synchronization System**: Musical timing with cooldown mechanics for smooth transitions

## Additional Contributions

- **Visual Design**: Created in-game graffiti assets
- **Cinematics**: Designed and produced intro sequence
- **Character Animation**: Animated playable character Michele

## Recognition

- Successfully delivered playable gold build in 3-week development sprint
- 6-track original soundtrack released on SoundCloud
- Demonstrated seamless integration of audio-visual synesthetic gameplay
