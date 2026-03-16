---
title:
  fr: Chromestesia
  en: Chromestesia
altTitle:
  fr: Chromestesia
  en: Chromestesia
description:
  fr: "Plongez dans Chromestesia, platformer-combat à l'énergie punk forgé en moins d'un mois. Incarnez Michèle et basculez les couleurs pour métamorphoser les plateformes… et la musique !"
  en: "Dive into Chromestesia, a punk-energy platformer-combat game forged in less than a month. Play as Michele and switch colors to transform platforms... and the music!"
tech:
  - FMOD
  - Reaper
  - Unity
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
            fr: "Musicien, Sound-Designer et Intégrateur Audio"
            en: "Musician, Sound Designer and Audio Integrator"
          subtitleColor: "#faf525"
          backgroundImage: ""
          backgroundPosition: center
          backgroundSize: cover
          backgroundScale: 1.1
          overlayTopOpacity: 0.1
          overlayBottomOpacity: 0.7
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
              fr: "📽️ Regarder le trailer"
              en: "📽️ Watch the trailer"
            url: "https://youtu.be/6aKB7nFtJQo?si=a0XfJuEDsXJyw6F2"
          secondary:
            text:
              fr: "🕹️ Démo Gameplay"
              en: "🕹️ Gameplay Demo"
            url: "https://youtu.be/COJwYCqv5dw?si=PmIhmJSQem6hF6Ha"
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
            fr: Processus
            en: Process
          subtitle:
            fr: ""
            en: ""
          steps:
            -
              fr: "Création et conception de l'intégralité des SFX pour constituer une banque de son propre au projet."
              en: Creation and design of all SFX to build a project-specific sound bank.
            -
              fr: "Création des musiques ainsi que de leurs variantes (chaque musique a deux versions dans ce jeu)"
              en: "Creation of music and their variants (each track has two versions in this game)"
            -
              fr: "Intégration des musiques, SFX et mixage dans FMOD"
              en: "Integration of music, SFX and mixing in FMOD"
            -
              fr: "Spatialisation et intégration dans UNITY"
              en: Spatialization and integration in Unity
            -
              fr: "Extra : Création de graffitis, Conception de la cinématique d'introduction, animation du personnage jouable"
              en: "Extra: Graffiti creation, intro cinematic design, playable character animation"
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
              value: 1 Month
              label:
                fr: DURATION
                en: DURATION
            -
              value: "10 👨‍👩‍👦‍👦"
              label:
                fr: TEAM SIZE
                en: TEAM SIZE
            -
              value: PC
              label:
                fr: PLATFORM
                en: PLATFORM
            -
              value: ISART
              label:
                fr: COMPANY
                en: COMPANY
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
        id: sampler-1
        type: sampler
        enabled: true
        variant: default
        placement:
          desktop:
            x: 8
            y: 5
            w: 4
            h: 1
          tablet:
            x: 5
            y: 8
            w: 3
            h: 1
          mobile:
            x: 0
            y: 25
            w: 4
            h: 1
        content:
          title:
            fr: "Jouez avec les sons du jeu ⬇️"
            en: "PLay sounds from this game ⬇️"
          description:
            fr: "Déclenchez quatre SFX emblématiques du jeu et régénérez une nouvelle configuration aléatoire."
            en: Trigger four iconic SFX from the game and regenerate a fresh random layout.
          folder: Chromestesia/SFX
          volume: 1.5
          samplePool:
            - Core_Die.wav
            - Core_Idle.wav
            - Core_LoseLife_01.wav
            - Events_SFX_Ennemies_Mage_MagicWand.wav
            - GUITAR_PowerSlide_02.wav
            - GUITAR_Select_01.wav
            - Hit_Core_Vulnerable-006.wav
            - PLUGGED_WIN_JINGLE.wav
            - Shield_Down.wav
            - Slash_01.wav
            - Slash_02.wav
            - THEME_02_JINGLE_WIN.wav
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
            fr: "Résultats"
            en: Results
          subtitle:
            fr: ""
            en: ""
          items:
            -
              icon: "🕹️"
              text:
                fr: "Une gold jouable développée en 3 semaines"
                en: A playable gold build developed in 3 weeks
            -
              icon: "🎵"
              text:
                fr: Une OST de 6 titres disponible sur SoundCloud
                en: A 6-track OST available on SoundCloud
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
            fr: "Défis Clés"
            en: Key Challenges
          subtitle:
            fr: ""
            en: ""
          items:
            -
              title:
                fr: "Réactivité du système de music-switch"
                en: Music-switch system responsiveness
              description:
                fr: "Dans ce jeu le joueur peut changer les pistes musicales à volonté grâce au système de switch. Pour une expérience fluide, un système de synchronisation musicale associé à un système de cooldown a permis de rendre cette expérience très satisfaisante pour le joueur."
                en: "In this game, players can switch musical tracks at will thanks to the switch system. For a smooth experience, a musical synchronization system combined with a cooldown system made this experience very satisfying for the player."
      -
        id: audio-1
        type: audio
        enabled: true
        variant: default
        placement:
          desktop:
            x: 0
            y: 12
            w: 8
            h: 1
          tablet:
            x: 0
            y: 15
            w: 5
            h: 1
          mobile:
            x: 0
            y: 23
            w: 4
            h: 1
        content:
          title:
            fr: Bande Sonore
            en: Soundtrack
          tracks:
            -
              title:
                fr: OPENING
                en: OPENING
              artist: Arthur Kowskii
              filename: OPENING
              duration: "2:34"
            -
              title:
                fr: "PLUG THE COLOR IN (Plugged Version)"
                en: "PLUG THE COLOR IN (Plugged Version)"
              artist: Arthur Kowskii
              filename: "PLUG THE COLOR IN (Plugged Version)"
              duration: "3:45"
            -
              title:
                fr: "PLUG THE COLOR IN (Unplugged Version)"
                en: "PLUG THE COLOR IN (Unplugged Version)"
              artist: Arthur Kowskii
              filename: "PLUG THE COLOR IN (Unplugged Version)"
              duration: "3:45"
            -
              title:
                fr: "BRING UP THE COLOR (Plugged Version)"
                en: "BRING UP THE COLOR (Plugged Version)"
              artist: Arthur Kowskii
              filename: "BRING UP THE COLOR (Plugged Version)"
              duration: "3:18"
            -
              title:
                fr: "BRING UP THE COLOR (Unplugged Version)"
                en: "BRING UP THE COLOR (Unplugged Version)"
              artist: Arthur Kowskii
              filename: "BRING UP THE COLOR (Unplugged Version)"
              duration: "3:18"
  accentColor: "#dfdb00ff"
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
    audio: true
    sampler: true
    fmod: false
  hero:
    subtitle:
      fr: "Musicien, Sound-Designer et Intégrateur Audio"
      en: "Musician, Sound Designer and Audio Integrator"
    subtitleColor: "#faf525"
    backgroundPosition: center
    backgroundSize: cover
    backgroundScale: 1.1
    overlayTopOpacity: 0.1
    overlayBottomOpacity: 0.7
    showLogo: false
  actions:
    title:
      fr: Liens
      en: Links
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
  process:
    title:
      fr: Processus
      en: Process
    subtitle:
      fr: ""
      en: ""
    steps:
      -
        fr: "Création et conception de l'intégralité des SFX pour constituer une banque de son propre au projet."
        en: Creation and design of all SFX to build a project-specific sound bank.
      -
        fr: "Création des musiques ainsi que de leurs variantes (chaque musique a deux versions dans ce jeu)"
        en: "Creation of music and their variants (each track has two versions in this game)"
      -
        fr: "Intégration des musiques, SFX et mixage dans FMOD"
        en: "Integration of music, SFX and mixing in FMOD"
      -
        fr: "Spatialisation et intégration dans UNITY"
        en: Spatialization and integration in Unity
      -
        fr: "Extra : Création de graffitis, Conception de la cinématique d'introduction, animation du personnage jouable"
        en: "Extra: Graffiti creation, intro cinematic design, playable character animation"
  gallery:
    title:
      fr: Galerie
      en: Gallery
    images: []
  assetsFolder: /src/content/projects/2_Game Audio/Assets_Chromestesia
  stats:
    -
      value: 1 Month
      label:
        fr: DURATION
        en: DURATION
    -
      value: "10 👨‍👩‍👦‍👦"
      label:
        fr: TEAM SIZE
        en: TEAM SIZE
    -
      value: PC
      label:
        fr: PLATFORM
        en: PLATFORM
    -
      value: ISART
      label:
        fr: COMPANY
        en: COMPANY
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
  sampler:
    title:
      fr: "Jouez avec les sons du jeu ⬇️"
      en: "PLay sounds from this game ⬇️"
    description:
      fr: "Déclenchez quatre SFX emblématiques du jeu et régénérez une nouvelle configuration aléatoire."
      en: Trigger four iconic SFX from the game and regenerate a fresh random layout.
    folder: Chromestesia/SFX
    volume: 1.5
    samplePool:
      - Core_Die.wav
      - Core_Idle.wav
      - Core_LoseLife_01.wav
      - Events_SFX_Ennemies_Mage_MagicWand.wav
      - GUITAR_PowerSlide_02.wav
      - GUITAR_Select_01.wav
      - Hit_Core_Vulnerable-006.wav
      - PLUGGED_WIN_JINGLE.wav
      - Shield_Down.wav
      - Slash_01.wav
      - Slash_02.wav
      - THEME_02_JINGLE_WIN.wav
  results:
    title:
      fr: "Résultats"
      en: Results
    subtitle:
      fr: ""
      en: ""
    items:
      -
        icon: "🕹️"
        text:
          fr: "Une gold jouable développée en 3 semaines"
          en: A playable gold build developed in 3 weeks
      -
        icon: "🎵"
        text:
          fr: Une OST de 6 titres disponible sur SoundCloud
          en: A 6-track OST available on SoundCloud
  tech:
    title:
      fr: Technologie
      en: Technology
  challenges:
    title:
      fr: "Défis Clés"
      en: Key Challenges
    subtitle:
      fr: ""
      en: ""
    items:
      -
        title:
          fr: "Réactivité du système de music-switch"
          en: Music-switch system responsiveness
        description:
          fr: "Dans ce jeu le joueur peut changer les pistes musicales à volonté grâce au système de switch. Pour une expérience fluide, un système de synchronisation musicale associé à un système de cooldown a permis de rendre cette expérience très satisfaisante pour le joueur."
          en: "In this game, players can switch musical tracks at will thanks to the switch system. For a smooth experience, a musical synchronization system combined with a cooldown system made this experience very satisfying for the player."
  audio:
    title:
      fr: Bande Sonore
      en: Soundtrack
    tracks:
      -
        title:
          fr: OPENING
          en: OPENING
        artist: Arthur Kowskii
        filename: OPENING
        duration: "2:34"
      -
        title:
          fr: "PLUG THE COLOR IN (Plugged Version)"
          en: "PLUG THE COLOR IN (Plugged Version)"
        artist: Arthur Kowskii
        filename: "PLUG THE COLOR IN (Plugged Version)"
        duration: "3:45"
      -
        title:
          fr: "PLUG THE COLOR IN (Unplugged Version)"
          en: "PLUG THE COLOR IN (Unplugged Version)"
        artist: Arthur Kowskii
        filename: "PLUG THE COLOR IN (Unplugged Version)"
        duration: "3:45"
      -
        title:
          fr: "BRING UP THE COLOR (Plugged Version)"
          en: "BRING UP THE COLOR (Plugged Version)"
        artist: Arthur Kowskii
        filename: "BRING UP THE COLOR (Plugged Version)"
        duration: "3:18"
      -
        title:
          fr: "BRING UP THE COLOR (Unplugged Version)"
          en: "BRING UP THE COLOR (Unplugged Version)"
        artist: Arthur Kowskii
        filename: "BRING UP THE COLOR (Unplugged Version)"
        duration: "3:18"
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

