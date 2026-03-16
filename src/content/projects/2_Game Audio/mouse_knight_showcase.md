---
title:
  fr: Mouse Knight
  en: Mouse Knight
altTitle:
  fr: Mouse Knight
  en: Mouse Knight
description:
  fr: "Un chevalier-souris part en quête pour retrouver le roi qui lui a lancé une malédiction afin de se venger. J'ai réalisé pour ce projet la composition de cinq musiques orchestrales, avant d'en assurer l'intégration technique sous FMOD et Unity."
  en: "A mouse knight embarks on a quest for vengeance against the king who cursed him. For this project, I composed five orchestral tracks and handled their technical integration using FMOD and Unity."
tech:
  - FMOD
  - Reaper
  - Unity
status: in-progress
link: https://kusalherbe.itch.io/mouse-knight
github: https://github.com/you/repo
date: 2024-12-18
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
        id: stats-1
        type: stats
        enabled: true
        variant: default
        placement:
          desktop:
            x: 0
            y: 0
            w: 4
            h: 2
          tablet:
            x: 0
            y: 0
            w: 3
            h: 2
          mobile:
            x: 0
            y: 2
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
              value: "7 🐭"
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
            fr: "Compositeur et Intégrateur Audio"
            en: Composer and Audio Integrator
          subtitleColor: "#ffffff"
          backgroundImage: ""
          backgroundPosition: center
          backgroundSize: cover
          backgroundScale: 1.1
          overlayTopOpacity: 0.1
          overlayBottomOpacity: 0.3
          logo: ""
          showLogo: true
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
            y: 10
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
              fr: "Composition du thème principal"
              en: Composition of the main theme
            -
              fr: "Composition des musiques pour chaque arène."
              en: Composing the music for each arena
            -
              fr: "Intégration des musiques dans FMOD."
              en: Music integration in FMOD
            -
              fr: "Intégration des musiques dans Unity."
              en: Music implementation in Unity
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
            y: 10
            w: 4
            h: 2
          mobile:
            x: 0
            y: 12
            w: 4
            h: 2
        content:
          title:
            fr: Galerie
            en: Gallery
          source: assetsFolder
          images: []
      -
        id: actions-1
        type: actions
        enabled: true
        variant: default
        placement:
          desktop:
            x: 0
            y: 4
            w: 4
            h: 2
          tablet:
            x: 0
            y: 4
            w: 3
            h: 2
          mobile:
            x: 0
            y: 6
            w: 4
            h: 2
        content:
          title:
            fr: Liens
            en: Links
          primary:
            text:
              fr: "🎬 Bande-annonce"
              en: "🎬 Trailer"
            url: "https://www.youtube.com/watch?v=pXoGr9FD1V4"
          secondary:
            text:
              fr: "🕹️ Itch.io"
              en: "🕹️ Itch.io"
            url: https://kusalherbe.itch.io/mouse-knight
      -
        id: sampler-1
        type: sampler
        enabled: false
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
            y: 23
            w: 4
            h: 1
        content:
          title:
            fr: "Jouez avec les sons ⬇️"
            en: "Play with sounds ⬇️"
          description:
            fr: "Échantillons sonores du projet Mouse Knight."
            en: Sound samples from Mouse Knight project.
          folder: MouseKnight/SFX
          volume: 1
          samplePool:
            - Sword_Swing.wav
            - Mouse_Squeak.wav
      -
        id: tech-1
        type: tech
        enabled: true
        variant: default
        placement:
          desktop:
            x: 0
            y: 6
            w: 4
            h: 2
          tablet:
            x: 0
            y: 6
            w: 4
            h: 2
          mobile:
            x: 0
            y: 8
            w: 4
            h: 2
        content:
          title:
            fr: Technologie
            en: Technology
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
            y: 12
            w: 8
            h: 2
          mobile:
            x: 0
            y: 20
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
              icon: "⚔️"
              text:
                fr: Une build jouable sur PC
                en: A playable build on PC
            -
              icon: "🎵"
              text:
                fr: Une OST de 5 tracks originales
                en: An Original Soundtrack of 5 tracks
            -
              icon: "🎬"
              text:
                fr: Un teaser original disponible sur YouTube
                en: An original teaser available on YouTube
      -
        id: challenges-1
        type: challenges
        enabled: true
        variant: default
        placement:
          desktop:
            x: 0
            y: 10
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
                fr: Temps imparti
                en: Tight deadline
              description:
                fr: "Un mois m'a été donné pour composer et intégrer les 5 musiques correspondant au final à une dizaine de minutes de musiques orchestrales."
                en: "I was given one month to compose and integrate 5 tracks, totaling around ten minutes of orchestral music."
            -
              title:
                fr: "Intégration en Visual Scripting"
                en: Visual Scripting Integration
              description:
                fr: "Au lieu d'une intégration code classique nous étions limités au visual scripting sur ce projet. Ce fut une première pour moi qui avait l'habitude d'utiliser mes scripts en C# et m'a donc permis de m'initier à ce langage."
                en: "Instead of traditional code-based integration, we were restricted to visual scripting. This was a first for me, as I'm used to C# scripting, and it allowed me to learn this workflow."
      -
        id: audio-1
        type: audio
        enabled: true
        variant: wide
        placement:
          desktop:
            x: 0
            y: 11
            w: 8
            h: 1
          tablet:
            x: 0
            y: 14
            w: 5
            h: 1
          mobile:
            x: 0
            y: 22
            w: 4
            h: 1
        content:
          title:
            fr: Bande Sonore
            en: Soundtrack
          tracks:
            -
              title:
                fr: Once Upon A Time... a Mouse Knight
                en: Once Upon A Time... a Mouse Knight
              artist: Arthur Kowskii
              filename: mus__OnceUponATime
              duration: "02:21"
            -
              title:
                fr: Prison Break
                en: Prison Break
              artist: Arthur Kowskii
              filename: mus_PrisonBreak
              duration: "03:15"
            -
              title:
                fr: The Village
                en: The Village
              artist: Arthur Kowskii
              filename: mus_TheVillage
              duration: "01:51"
            -
              title:
                fr: This Curse Ends With You
                en: This Curse Ends With You
              artist: Arthur Kowskii
              filename: mus_ThisCurse.mp3
              duration: "02:24"
            -
              title:
                fr: "The Curse... can't be lifted ?"
                en: "The Curse... can't be lifted ?"
              artist: Arthur Kowskii
              filename: End Credits
              duration: "03:01"
  accentColor: "#2d5a27"
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
    sampler: false
    fmod: false
  accentColorDark: "#66bb6a"
  stats:
    -
      value: 1 Month
      label:
        fr: DURATION
        en: DURATION
    -
      value: "7 🐭"
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
  hero:
    subtitle:
      fr: "Compositeur et Intégrateur Audio"
      en: Composer and Audio Integrator
    subtitleColor: "#ffffff"
    backgroundPosition: center
    backgroundSize: cover
    backgroundScale: 1.1
    overlayTopOpacity: 0.1
    overlayBottomOpacity: 0.3
    showLogo: true
  process:
    title:
      fr: Processus
      en: Process
    subtitle:
      fr: ""
      en: ""
    steps:
      -
        fr: "Composition du thème principal"
        en: Composition of the main theme
      -
        fr: "Composition des musiques pour chaque arène."
        en: Composing the music for each arena
      -
        fr: "Intégration des musiques dans FMOD."
        en: Music integration in FMOD
      -
        fr: "Intégration des musiques dans Unity."
        en: Music implementation in Unity
  gallery:
    title:
      fr: Galerie
      en: Gallery
    images: []
  assetsFolder: /src/content/projects/2_Game Audio/Assets_MouseKnight
  actions:
    title:
      fr: Liens
      en: Links
    primary:
      text:
        fr: "🎬 Bande-annonce"
        en: "🎬 Trailer"
      url: "https://www.youtube.com/watch?v=pXoGr9FD1V4"
    secondary:
      text:
        fr: "🕹️ Itch.io"
        en: "🕹️ Itch.io"
      url: https://kusalherbe.itch.io/mouse-knight
  sampler:
    title:
      fr: "Jouez avec les sons ⬇️"
      en: "Play with sounds ⬇️"
    description:
      fr: "Échantillons sonores du projet Mouse Knight."
      en: Sound samples from Mouse Knight project.
    folder: MouseKnight/SFX
    volume: 1
    samplePool:
      - Sword_Swing.wav
      - Mouse_Squeak.wav
  tech:
    title:
      fr: Technologie
      en: Technology
  results:
    title:
      fr: "Résultats"
      en: Results
    subtitle:
      fr: ""
      en: ""
    items:
      -
        icon: "⚔️"
        text:
          fr: Une build jouable sur PC
          en: A playable build on PC
      -
        icon: "🎵"
        text:
          fr: Une OST de 5 tracks originales
          en: An Original Soundtrack of 5 tracks
      -
        icon: "🎬"
        text:
          fr: Un teaser original disponible sur YouTube
          en: An original teaser available on YouTube
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
          fr: Temps imparti
          en: Tight deadline
        description:
          fr: "Un mois m'a été donné pour composer et intégrer les 5 musiques correspondant au final à une dizaine de minutes de musiques orchestrales."
          en: "I was given one month to compose and integrate 5 tracks, totaling around ten minutes of orchestral music."
      -
        title:
          fr: "Intégration en Visual Scripting"
          en: Visual Scripting Integration
        description:
          fr: "Au lieu d'une intégration code classique nous étions limités au visual scripting sur ce projet. Ce fut une première pour moi qui avait l'habitude d'utiliser mes scripts en C# et m'a donc permis de m'initier à ce langage."
          en: "Instead of traditional code-based integration, we were restricted to visual scripting. This was a first for me, as I'm used to C# scripting, and it allowed me to learn this workflow."
  audio:
    title:
      fr: Bande Sonore
      en: Soundtrack
    tracks:
      -
        title:
          fr: Once Upon A Time... a Mouse Knight
          en: Once Upon A Time... a Mouse Knight
        artist: Arthur Kowskii
        filename: mus__OnceUponATime
        duration: "02:21"
      -
        title:
          fr: Prison Break
          en: Prison Break
        artist: Arthur Kowskii
        filename: mus_PrisonBreak
        duration: "03:15"
      -
        title:
          fr: The Village
          en: The Village
        artist: Arthur Kowskii
        filename: mus_TheVillage
        duration: "01:51"
      -
        title:
          fr: This Curse Ends With You
          en: This Curse Ends With You
        artist: Arthur Kowskii
        filename: mus_ThisCurse.mp3
        duration: "02:24"
      -
        title:
          fr: "The Curse... can't be lifted ?"
          en: "The Curse... can't be lifted ?"
        artist: Arthur Kowskii
        filename: End Credits
        duration: "03:01"
---


# Mouse Knight

Mouse Knight is an ambitious project where sound plays a central role in conveying the scale and atmosphere of a tiny knight in a big world.

## Project Overview

In this project, I am focusing on creating a unique sonic identity for the Mouse Knight universe. This includes designing procedural sound effects for footsteps on various surfaces, reactive environmental audio, and a dynamic orchestration that evolves with the player's actions.

## Technical Achievements

- **Dynamic Ambient System**: Environment sounds that change based on time of day and location.
- **FMOD Integration**: Utilizing FMOD for complex transitions and parameter-driven sounds.
- **Scale-Specific Sound Design**: Using high-frequency details to emphasize the small scale of the protagonist.

## Current Status

The project is currently in the prototyping phase, with core audio systems being implemented and tested in Unity.

