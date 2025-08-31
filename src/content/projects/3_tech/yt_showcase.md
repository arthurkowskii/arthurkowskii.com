---
title: "Youtube_to_Reaper Script"
altTitle: "Youtube to Reaper Script"
description: "A lua script for reaper that takes the last Youtube/Soundcloud link from your clipboard"
tech: ["Lua", "Reascript"]
status: "completed" # or "in-progress" | "planned"
link: "https://example.com"
github: "https://github.com/you/repo"
date: 2024-08-22
useBentoLayout: true

# Bento Layout Configuration
bento:
  # Theme color
  accentColor: "#2666ec"

  # REQUIRED for auto hero/logo + gallery
  # Put images here and name hero.* and logo.* for the hero card
  assetsFolder: "/src/content/projects/3_tech/Assets_yt"

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
    backgroundScale: 1 # Alternative to backgroundSize - use 1.1, 0.9, etc.
    overlayTopOpacity: 0  # Controls dark overlay opacity at top (0.0 = transparent, 1.0 = opaque)
    overlayBottomOpacity: 0.5  # Controls dark overlay opacity at bottom (0.0 = transparent, 1.0 = opaque)
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
      text: "🛒 Bientôt disponible (actuellement en beta)"
      url: "https://arthurkowskii.gumroad.com/"
    secondary:
      text: "🗃️ Voir le projet sur GitHub"
      url: "https://github.com/arthurkowskii/Youtube_to_Reaper#"

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
    title: "Guide d'Utilisation"
    steps:
      - "Lancer l'installateur pour Windows (.exe) ou mac (.dmg)"
      - "Ajouter le script à votre liste d'action reaper (un raccourci a été crée sur le bureau pour le trouver rapidement)"
      - "Copier un lien Youtube ou Soundcloud"
      - "Lancer le script youtube_to_reaper"
      - "Une nouvelle piste a été créé depuis votre lien !"

  # Gallery images auto from assetsFolder; title optional
  gallery:
    title: "Gallery"

  # Optional challenges
  challenges:
    title: "Défis techniques"
    items:
      - title: "Accès multi-plateforme au presse-papiers"
        description: "Implémenter une surveillance fiable du presse-papiers sur différents systèmes d'exploitation tout en préservant la réactivité de Reaper a nécessité une gestion minutieuse du threading et de la sélection d'API."
      - title: "Validation et parsing des formats d'URL"
        description: "Supporter les multiples formats d'URL YouTube et SoundCloud (liens courts, URLs de playlists, paramètres de timestamp) tout en assurant une gestion d'erreurs robuste pour les liens invalides."

  # Optional results
  results:
    title: "Features"
    items:
      - icon: "📋"
        text: "Smart URL detection: détecte automatiquement les liens YouTube et SoundCloud depuis le presse-papiers"
      - icon: "🎯"
        text: "Real-time Progress Bar : la fenêtre affichant en direct l’avancement du téléchargement"
      - icon: "🔄"
        text: "Non bloquant : REAPER reste réactif pendant le téléchargement"
      - icon: "🧹"
        text: "Auto-cleanup : suppression des fichiers temporaires après l’importation"
---

# Your Project Title

A few paragraphs describing the project goals, your role, the tech, and the outcome. This Markdown is shown on the dedicated route `/projects/<slug>`.

## Highlights

- Key feature or achievement
- Another notable detail
- Any recognition, awards, or measurable impact
