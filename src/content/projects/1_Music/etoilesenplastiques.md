---
title: "Étoiles en Plastiques"
altTitle: "Étoiles en Plastiques"
description: "\"ETOILES EN PLASTIQUES\" est un album de rap alternatif dont l'univers sonore mêle instrumentales électroniques a des textes sombres et introspectifs. L'album explore des souffrances amoureuses, un contexte de travail éprouvant et des tensions familiales, créant une explosion émotionnelle comparable à une supernova."
tech: ["Ableton", "Reaper", "Davinci Resolve"]
status: "completed" # or "in-progress" | "planned"
link: "https://example.com"
github: "https://github.com/you/repo"
date: 2024-08-22
useBentoLayout: true

# Bento Layout Configuration
bento:
  # Theme color
  accentColor: "#113860"

  # REQUIRED for auto hero/logo + gallery
  # Put images here and name hero.* and logo.* for the hero card
  assetsFolder: "/src/content/projects/1_Music/Assets_etoilesenplastiques"

  # Toggle cards
  cards:
    hero: true
    stats: false
    musicLinks: true
    video: true
    spotify: true
    actions: true
    tech: false
    process: false
    gallery: true
    challenges: true
    results: true

  # Hero subtitle only; hero/background/logo auto from assetsFolder
  hero:
    subtitle: "Album et Animation"
    subtitleColor: "#faf525"
    backgroundPosition: "top"
    backgroundSize: "cover"
    backgroundScale: 1.2  # Alternative to backgroundSize - use 1.1, 0.9, etc.
    overlayTopOpacity: 0.05   # Controls dark overlay opacity at top (0.0 = transparent, 1.0 = opaque)
    overlayBottomOpacity: 0.7 # Controls dark overlay opacity at bottom (0.0 = transparent, 1.0 = opaque)
    showLogo: false

  # Optional stats
  stats:
    - value: "2y"
      label: "DURATION"
    - value: "5 👨‍👩‍👦‍👦"
      label: "TEAM SIZE"
    - value : "Youtube"
      label : "PLATFORM"
    - value : Kowskii
      label : COMPANY

  # Optional actions
  actions:
    title: "Experience"
    primary:
      text: "💽 Écouter l'Album"
      url: "https://youtu.be/GtoGUcY1K1Y?si=YQXis7RFPEgLKbPy"
    secondary:
      text: "Soutenir à prix libre sur Bandcamp"
      url: "https://kowskii.bandcamp.com/album/toiles-en-plastique-album"

  # Video configuration
  video:
    title: "JE NE VOIS LE CIEL QUE DANS LES FLAQUES (Animation)"
    url: "https://youtu.be/5ikfSQ6UHFU?si=BhXFkc4EQc57FntH" # Replace with actual album teaser
    description: "Animation entièrement réalisé, dessiné et monté par Arthur Kowskii. Process : Photoshop, Davinci Resolve"

  # Spotify configuration  
  spotify:
    title: "Étoiles en Plastiques - Album"
    url: "https://open.spotify.com/album/4pHpH5Nzl4m9AxuQ3IE43G?si=qogefLmpQIC8hnrB7YAsPQ"
    description: "L'album complet avec tous les morceaux sur Spotify"

  # Music links (exactly 4 items). Enable with cards.musicLinks: true
  musicLinks:
    title: "Music Links"
    items:
      - text: "Spotify"
        url: "https://open.spotify.com/album/4pHpH5Nzl4m9AxuQ3IE43G?si=syf-V0dsTPWzd7m5i9N8DA"
      - text: "Apple Music"
        url: "https://music.apple.com/fr/album/%C3%A9toiles-en-plastiques/1827122321"
      - text: "Bandcamp"
        url: "https://kowskii.bandcamp.com/album/toiles-en-plastique-album"
      - text: "*Soundcloud*"
        url: "https://on.soundcloud.com/G4M0eKE9CAg6g6DeCh"

  # Optional process
  process:
    title: "Tracklist"
    steps:
      - "OUVERTURE (des portes)"
      - "06h59"
      - "ETOILES EN PLASTIQUES"
      - "GO FAST"
      - "KETAMINE"
      - "POEME ELECTRONIQUE"
      - "LE SABLE SOUS MES YEUX"
      - "JE NE VOIS LE CIEL QUE DANS LES FLAQUES"

  # Gallery images auto from assetsFolder; title optional
  gallery:
    title: "Gallery"

  # Optional challenges
  challenges:
    title: "Synopsis"
    items:
      - title: "Synopsis Long"
        description: "ETOILES EN PLASTIQUES, est un album de rap alternatif dont l'univers sonore mêle instrumentals électroniques a des textes sombres et introspectifs. L'album explore des souffrances amoureuses, un contexte de travail éprouvant et des tensions familiales, créant une explosion émotionnelle comparable à une supernova. Il suit trois personnages : le père, la mère et l'enfant, ce dernier regardant les étoiles en plastique de son plafond pour s'évader des disputes. Celui ci s'inclut comme une préquel au SUPER MEGA SHOW, un album/série audio de 16 titres sans coupures en collaboration avec le comédien de doublage Benoit Grimmiaux (BoJack Horseman, Pokémon, Rick & Morty...)"

  # Optional results
  results:
    title: "Results"
    items:
      - icon: "💽"
        text: "Un album de 8 titres"
      - icon: "🖍️"
        text: "Un mini film d'animation disponible sur Youtube; dessiné, animé et monté par Arthur Kowskii"
---

# Your Project Title

A few paragraphs describing the project goals, your role, the tech, and the outcome. This Markdown is shown on the dedicated route `/projects/<slug>`.

## Highlights

- Key feature or achievement
- Another notable detail
- Any recognition, awards, or measurable impact
