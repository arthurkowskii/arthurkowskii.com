---
title:
  fr: Youtube_to_Reaper Script
  en: Youtube_to_Reaper Script
altTitle:
  fr: Youtube to Reaper Script
  en: Youtube to Reaper Script
description:
  fr: Un script lua pour Reaper qui prend le dernier lien Youtube/Soundcloud de votre presse-papiers
  en: A lua script for reaper that takes the last Youtube/Soundcloud link from your clipboard
tech:
  - Lua
  - Reascript
status: completed
link: https://example.com
github: https://github.com/you/repo
date: 2024-08-22
useBentoLayout: true
orbit:
  shellMode: auto
  angleMode: auto
bento:
  layout:
    version: 3
    columns:
      desktop: 12
      tablet: 8
      mobile: 4
    blocks:
      -
        id: hero-1
        type: hero
        enabled: true
        variant: default
        placement:
          desktop:
            x: 4
            y: 0
            w: 8
            h: 2
          tablet:
            x: 3
            y: 0
            w: 5
            h: 2
          mobile:
            x: 0
            y: 0
            w: 4
            h: 2
        content:
          subtitle:
            fr: Lua script for Reaper
            en: Lua script for Reaper
          subtitleColor: "#2666ec"
          backgroundImage: ""
          backgroundPosition: center
          backgroundSize: cover
          backgroundScale: 1
          overlayTopOpacity: 0
          overlayBottomOpacity: 0.5
          logo: ""
          showLogo: false
      -
        id: actions-1
        type: actions
        enabled: true
        variant: default
        placement:
          desktop:
            x: 0
            y: 1
            w: 4
            h: 2
          tablet:
            x: 0
            y: 1
            w: 3
            h: 2
          mobile:
            x: 0
            y: 3
            w: 4
            h: 2
        content:
          title:
            fr: Liens
            en: Links
          primary:
            text:
              fr: "🛒 Bientôt disponible (actuellement en beta)"
              en: "🛒 Bientôt disponible (actuellement en beta)"
            url: https://arthurkowskii.gumroad.com/
          secondary:
            text:
              fr: "🗃️ Voir le projet sur GitHub"
              en: "🗃️ Voir le projet sur GitHub"
            url: "https://github.com/arthurkowskii/Youtube_to_Reaper#"
      -
        id: process-1
        type: process
        enabled: true
        variant: default
        placement:
          desktop:
            x: 4
            y: 2
            w: 4
            h: 2
          tablet:
            x: 4
            y: 2
            w: 4
            h: 2
          mobile:
            x: 0
            y: 11
            w: 4
            h: 2
        content:
          title:
            fr: "Guide d'Utilisation"
            en: User Guide
          subtitle:
            fr: ""
            en: ""
          steps:
            -
              fr: "Lancer l'installateur pour Windows (.exe) ou mac (.dmg)"
              en: "Run the installer for Windows (.exe) or Mac (.dmg)"
            -
              fr: "Ajouter le script à votre liste d'action reaper (un raccourci a été créé sur le bureau pour le trouver rapidement)"
              en: "Add the script to your Reaper action list (a shortcut was created on the desktop to find it quickly)"
            -
              fr: Copier un lien Youtube ou Soundcloud
              en: Copy a Youtube or Soundcloud link
            -
              fr: Lancer le script youtube_to_reaper
              en: Run the youtube_to_reaper script
            -
              fr: "Une nouvelle piste a été créée depuis votre lien !"
              en: "A new track has been created from your link!"
      -
        id: gallery-1
        type: gallery
        enabled: true
        variant: default
        placement:
          desktop:
            x: 8
            y: 2
            w: 4
            h: 2
          tablet:
            x: 0
            y: 11
            w: 4
            h: 2
          mobile:
            x: 0
            y: 13
            w: 4
            h: 2
        content:
          title:
            fr: Galerie
            en: Gallery
          source: assetsFolder
          images: []
      -
        id: stats-1
        type: stats
        enabled: true
        variant: default
        placement:
          desktop:
            x: 0
            y: 3
            w: 4
            h: 2
          tablet:
            x: 0
            y: 3
            w: 3
            h: 2
          mobile:
            x: 0
            y: 5
            w: 4
            h: 2
        content:
          items:
            -
              value: Lua
              label:
                fr: LANGUAGE
                en: LANGUAGE
            -
              value: "0€+"
              label:
                fr: PRICE
                en: PRICE
            -
              value: Reaper
              label:
                fr: PLATFORM
                en: PLATFORM
            -
              value: Kowskii
              label:
                fr: CREATOR
                en: CREATOR
      -
        id: musicLinks-1
        type: musicLinks
        enabled: false
        variant: default
        placement:
          desktop:
            x: 0
            y: 5
            w: 4
            h: 2
          tablet:
            x: 0
            y: 5
            w: 3
            h: 2
          mobile:
            x: 0
            y: 7
            w: 4
            h: 2
        content:
          title: Music Links
          items:
            -
              text: Spotify
              url: https://open.spotify.com/
            -
              text: Apple Music
              url: https://music.apple.com/
            -
              text: Bandcamp
              url: https://bandcamp.com/
            -
              text: YouTube
              url: "https://youtu.be/6aKB7nFtJQo?si=a0XfJuEDsXJyw6F2"
      -
        id: results-1
        type: results
        enabled: true
        variant: default
        placement:
          desktop:
            x: 5
            y: 6
            w: 3
            h: 2
          tablet:
            x: 0
            y: 13
            w: 8
            h: 2
          mobile:
            x: 0
            y: 21
            w: 4
            h: 2
        content:
          title:
            fr: "Fonctionnalités"
            en: Features
          subtitle:
            fr: ""
            en: ""
          items:
            -
              icon: "📋"
              text:
                fr: "Smart URL detection: détecte automatiquement les liens YouTube et SoundCloud depuis le presse-papiers"
                en: "Smart URL detection: automatically detects YouTube and SoundCloud links from clipboard"
            -
              icon: "🎯"
              text:
                fr: "Real-time Progress Bar : la fenêtre affichant en direct l'avancement du téléchargement"
                en: "Real-time Progress Bar: window displaying live download progress"
            -
              icon: "🔄"
              text:
                fr: "Non bloquant : REAPER reste réactif pendant le téléchargement"
                en: "Non-blocking: REAPER remains responsive during download"
            -
              icon: "🧹"
              text:
                fr: "Auto-cleanup : suppression des fichiers temporaires après l'importation"
                en: "Auto-cleanup: automatic temporary file removal after import"
      -
        id: tech-1
        type: tech
        enabled: true
        variant: default
        placement:
          desktop:
            x: 0
            y: 7
            w: 4
            h: 2
          tablet:
            x: 0
            y: 7
            w: 4
            h: 2
          mobile:
            x: 0
            y: 9
            w: 4
            h: 2
        content:
          title:
            fr: Technologie
            en: Technology
      -
        id: challenges-1
        type: challenges
        enabled: true
        variant: default
        placement:
          desktop:
            x: 0
            y: 11
            w: 5
            h: 1
          tablet:
            x: 4
            y: 7
            w: 4
            h: 1
          mobile:
            x: 0
            y: 19
            w: 4
            h: 1
        content:
          title:
            fr: "Défis techniques"
            en: Technical Challenges
          subtitle:
            fr: ""
            en: ""
          items:
            -
              title:
                fr: "Accès multi-plateforme au presse-papiers"
                en: Cross-platform clipboard access
              description:
                fr: "Implémenter une surveillance fiable du presse-papiers sur différents systèmes d'exploitation tout en préservant la réactivité de Reaper a nécessité une gestion minutieuse du threading et de la sélection d'API."
                en: "Implementing reliable clipboard monitoring across different operating systems while preserving Reaper's responsiveness required careful threading management and API selection."
            -
              title:
                fr: "Validation et parsing des formats d'URL"
                en: URL format validation and parsing
              description:
                fr: "Supporter les multiples formats d'URL YouTube et SoundCloud (liens courts, URLs de playlists, paramètres de timestamp) tout en assurant une gestion d'erreurs robuste pour les liens invalides."
                en: "Supporting multiple YouTube and SoundCloud URL formats (short links, playlist URLs, timestamp parameters) while ensuring robust error handling for invalid links."
  accentColor: "#2666ec"
  cards:
    hero: true
    stats: true
    actions: true
    tech: true
    process: true
    gallery: true
    challenges: true
    results: true
    musicLinks: false
    video: false
    spotify: false
    soundcloud: false
    audio: false
    sampler: false
    fmod: false
  hero:
    subtitle:
      fr: Lua script for Reaper
      en: Lua script for Reaper
    subtitleColor: "#2666ec"
    backgroundPosition: center
    backgroundSize: cover
    backgroundScale: 1
    overlayTopOpacity: 0
    overlayBottomOpacity: 0.5
    showLogo: false
  actions:
    title:
      fr: Liens
      en: Links
    primary:
      text:
        fr: "🛒 Bientôt disponible (actuellement en beta)"
        en: "🛒 Bientôt disponible (actuellement en beta)"
      url: https://arthurkowskii.gumroad.com/
    secondary:
      text:
        fr: "🗃️ Voir le projet sur GitHub"
        en: "🗃️ Voir le projet sur GitHub"
      url: "https://github.com/arthurkowskii/Youtube_to_Reaper#"
  process:
    title:
      fr: "Guide d'Utilisation"
      en: User Guide
    subtitle:
      fr: ""
      en: ""
    steps:
      -
        fr: "Lancer l'installateur pour Windows (.exe) ou mac (.dmg)"
        en: "Run the installer for Windows (.exe) or Mac (.dmg)"
      -
        fr: "Ajouter le script à votre liste d'action reaper (un raccourci a été créé sur le bureau pour le trouver rapidement)"
        en: "Add the script to your Reaper action list (a shortcut was created on the desktop to find it quickly)"
      -
        fr: Copier un lien Youtube ou Soundcloud
        en: Copy a Youtube or Soundcloud link
      -
        fr: Lancer le script youtube_to_reaper
        en: Run the youtube_to_reaper script
      -
        fr: "Une nouvelle piste a été créée depuis votre lien !"
        en: "A new track has been created from your link!"
  gallery:
    title:
      fr: Galerie
      en: Gallery
    images: []
  assetsFolder: /src/content/projects/3_tech/Assets_yt
  stats:
    -
      value: Lua
      label:
        fr: LANGUAGE
        en: LANGUAGE
    -
      value: "0€+"
      label:
        fr: PRICE
        en: PRICE
    -
      value: Reaper
      label:
        fr: PLATFORM
        en: PLATFORM
    -
      value: Kowskii
      label:
        fr: CREATOR
        en: CREATOR
  musicLinks:
    title: Music Links
    items:
      -
        text: Spotify
        url: https://open.spotify.com/
      -
        text: Apple Music
        url: https://music.apple.com/
      -
        text: Bandcamp
        url: https://bandcamp.com/
      -
        text: YouTube
        url: "https://youtu.be/6aKB7nFtJQo?si=a0XfJuEDsXJyw6F2"
  results:
    title:
      fr: "Fonctionnalités"
      en: Features
    subtitle:
      fr: ""
      en: ""
    items:
      -
        icon: "📋"
        text:
          fr: "Smart URL detection: détecte automatiquement les liens YouTube et SoundCloud depuis le presse-papiers"
          en: "Smart URL detection: automatically detects YouTube and SoundCloud links from clipboard"
      -
        icon: "🎯"
        text:
          fr: "Real-time Progress Bar : la fenêtre affichant en direct l'avancement du téléchargement"
          en: "Real-time Progress Bar: window displaying live download progress"
      -
        icon: "🔄"
        text:
          fr: "Non bloquant : REAPER reste réactif pendant le téléchargement"
          en: "Non-blocking: REAPER remains responsive during download"
      -
        icon: "🧹"
        text:
          fr: "Auto-cleanup : suppression des fichiers temporaires après l'importation"
          en: "Auto-cleanup: automatic temporary file removal after import"
  tech:
    title:
      fr: Technologie
      en: Technology
  challenges:
    title:
      fr: "Défis techniques"
      en: Technical Challenges
    subtitle:
      fr: ""
      en: ""
    items:
      -
        title:
          fr: "Accès multi-plateforme au presse-papiers"
          en: Cross-platform clipboard access
        description:
          fr: "Implémenter une surveillance fiable du presse-papiers sur différents systèmes d'exploitation tout en préservant la réactivité de Reaper a nécessité une gestion minutieuse du threading et de la sélection d'API."
          en: "Implementing reliable clipboard monitoring across different operating systems while preserving Reaper's responsiveness required careful threading management and API selection."
      -
        title:
          fr: "Validation et parsing des formats d'URL"
          en: URL format validation and parsing
        description:
          fr: "Supporter les multiples formats d'URL YouTube et SoundCloud (liens courts, URLs de playlists, paramètres de timestamp) tout en assurant une gestion d'erreurs robuste pour les liens invalides."
          en: "Supporting multiple YouTube and SoundCloud URL formats (short links, playlist URLs, timestamp parameters) while ensuring robust error handling for invalid links."
---


# Youtube_to_Reaper for Reaper

Un workflow fluide pour importer instantanément du contenu audio depuis YouTube ou SoundCloud directement dans votre session Reaper, gérant le téléchargement et l'importation en un seul clic.

