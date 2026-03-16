---
title:
  fr: "FMOD Demo : Interactive JDR"
  en: "FMOD Demo : Interactive RPG"
altTitle:
  fr: FMOD Demo
  en: FMOD Demo
description:
  fr: "Conception d'un projet FMOD pour un jeu de rôle. Le pitch : un jeu d'horreur situé dans un univers de science-fiction spatial, dans l'esprit de Dead Space. Le jeu comporte quatre phases de gameplay distinctes : exploration, infiltration, combat et survie — toutes contrôlées dynamiquement via le paramètre INTERACTIVITY."
  en: "Design of an FMOD project for a role-playing game. The pitch: a horror game set in a space sci-fi universe, in the spirit of Dead Space. The game features four distinct gameplay phases: exploration, infiltration, combat and survival — all dynamically controlled via the INTERACTIVITY parameter."
tech:
  - Reaper
  - FMOD
status: completed
link: "https://youtu.be/URPsqY7SwxY?si=orus46GsXuOBT0hj"
date: 2024-03-15
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
            fr: "Démonstration Musique Dynamique"
            en: Dynamic Music Demonstration
          subtitleColor: "#e50000"
          backgroundImage: ""
          backgroundPosition: center
          backgroundSize: cover
          backgroundScale: 1
          overlayTopOpacity: 0
          overlayBottomOpacity: 0
          logo: ""
          showLogo: true
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
              fr: "📽️ Regarder la DEMO"
              en: "📽️ Watch the DEMO"
            url: "https://youtu.be/URPsqY7SwxY?si=orus46GsXuOBT0hj"
          secondary:
            text:
              fr: "⬇️ Télécharger le projet source FMOD"
              en: "⬇️ Download the FMOD source project"
            url: "https://drive.google.com/file/d/1LKFTjYzZCmCJaRHmEHhbRJbXW8nLqsvQ/view?usp=sharing"
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
              value: 2 Weeks
              label:
                fr: DURATION
                en: DURATION
            -
              value: "1 👨‍👩‍👦‍👦"
              label:
                fr: TEAM SIZE
                en: TEAM SIZE
            -
              value: FMOD
              label:
                fr: PLATFORM
                en: PLATFORM
            -
              value: ISART
              label:
                fr: COMPANY
                en: COMPANY
      -
        id: results-1
        type: results
        enabled: true
        variant: default
        placement:
          desktop:
            x: 5
            y: 3
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
            fr: "Résultat à l'issue de ce projet"
            en: Result achieved from this project
          items:
            -
              icon: "⬇️"
              text:
                fr: "Un fichier de démonstration FMOD téléchargeable ci-dessus"
                en: A downloadable FMOD demonstration file above
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
              url: https://youtube.com/
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
        id: process-1
        type: process
        enabled: false
        variant: default
        placement:
          desktop:
            x: 4
            y: 7
            w: 4
            h: 2
          tablet:
            x: 4
            y: 6
            w: 4
            h: 2
          mobile:
            x: 0
            y: 11
            w: 4
            h: 2
        content:
          title:
            fr: Process
            en: Process
          subtitle:
            fr: From concept to shipping
            en: From concept to shipping
          steps:
            -
              fr: Conception des SFX avec PhasePlant et Reaper
              en: Conception des SFX avec PhasePlant et Reaper
            -
              fr: "Conception d'une banque de son en relation avec le projet"
              en: "Conception d'une banque de son en relation avec le projet"
            -
              fr: "Composition de la musique sous les contraintes de DA : instrument fantasiste, cordes... pas de synthé. pas d'instruments modernes."
              en: "Composition de la musique sous les contraintes de DA : instrument fantasiste, cordes... pas de synthé. pas d'instruments modernes."
            -
              fr: Assemblage de la musique et des SFX dans Reaper directement
              en: Assemblage de la musique et des SFX dans Reaper directement
            -
              fr: Mixage et Mastering en respectant les normes de rendus
              en: Mixage et Mastering en respectant les normes de rendus
      -
        id: video-1
        type: video
        enabled: true
        variant: default
        placement:
          desktop:
            x: 0
            y: 9
            w: 4
            h: 2
          tablet:
            x: 0
            y: 9
            w: 4
            h: 2
          mobile:
            x: 0
            y: 17
            w: 4
            h: 2
        content:
          title:
            fr: INTERACTIVE JDR - SPACE ABYSS
            en: INTERACTIVE RPG - SPACE ABYSS
          url: "https://youtu.be/URPsqY7SwxY?si=orus46GsXuOBT0hj"
          description:
            fr: "Conception d'un projet FMOD pour un jeu de rôle. Le pitch : un jeu d'horreur situé dans un univers de science-fiction spatial, dans l'esprit de Dead Space. L'ambiance sonore y joue un rôle central, renforçant la tension et l'immersion du joueur à chaque instant. Le jeu comporte quatre phases de gameplay distinctes : exploration, infiltration, combat et survie — toutes contrôlées dynamiquement via le paramètre INTERACTIVITY."
            en: "Design of an FMOD project for a role-playing game. The pitch: a horror game set in a space sci-fi universe, in the spirit of Dead Space. The sound atmosphere plays a central role, reinforcing tension and player immersion at every moment. The game features four distinct gameplay phases: exploration, infiltration, combat and survival — all dynamically controlled via the INTERACTIVITY parameter."
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
            y: 3
            w: 4
            h: 1
          mobile:
            x: 0
            y: 19
            w: 4
            h: 1
        content:
          title:
            fr: Pitch
            en: Pitch
          subtitle:
            fr: ""
            en: ""
          items:
            -
              title:
                fr: Briefing du projet
                en: Project briefing
              description:
                fr: "Nous allons avoir besoin que tu composes de la musique interactive pour notre jeu avec des phases distinctes. Pour ce faire, dans l'application, nous allons appeler un paramètre que tu devras créer qui contiendra donc plusieurs états. Ce paramètre nous l'avons appelé INTERACTIVITY."
                en: "We will need you to compose interactive music for our game with distinct phases. To do this, in the application, we will call a parameter that you will need to create that will contain multiple states. We have called this parameter INTERACTIVITY."
            -
              title:
                fr: "[État 0] : Ouverture du jeu : mise en contexte"
                en: "[State 0] : Game opening: context setting"
              description:
                fr: "Musique d'introduction pour établir l'atmosphère du jeu spatial"
                en: Introductory music to establish the spatial game atmosphere
            -
              title:
                fr: "[État 01 + 01.5] : Musique de réflexion / Idle"
                en: "[State 01 + 01.5] : Reflection/Idle music"
              description:
                fr: "Ambiance calme pour les phases d'exploration et de réflexion"
                en: Calm ambiance for exploration and reflection phases
            -
              title:
                fr: "[État 02] : Musique de combat avec transition"
                en: "[State 02] : Combat music with transition"
              description:
                fr: "Musique intense et rythmée pour les séquences de combat"
                en: Intense and rhythmic music for combat sequences
            -
              title:
                fr: "[Victoire et transition] : 02 -> Win -> 01"
                en: "[Victory and transition] : 02 -> Win -> 01"
              description:
                fr: "Transition musicale positive après une victoire au combat"
                en: Positive musical transition after a combat victory
            -
              title:
                fr: "[Défaite et transition] : 02 -> Loose -> 01"
                en: "[Defeat and transition] : 02 -> Loose -> 01"
              description:
                fr: "Transition musicale sombre après une défaite au combat"
                en: Dark musical transition after a combat defeat
  accentColor: "#ff0000ff"
  cards:
    hero: true
    stats: true
    actions: true
    tech: true
    process: false
    gallery: true
    challenges: true
    results: true
    musicLinks: false
    video: true
    spotify: false
    soundcloud: false
    audio: false
    sampler: false
    fmod: false
  hero:
    subtitle:
      fr: "Démonstration Musique Dynamique"
      en: Dynamic Music Demonstration
    subtitleColor: "#e50000"
    backgroundPosition: center
    backgroundSize: cover
    backgroundScale: 1
    overlayTopOpacity: 0
    overlayBottomOpacity: 0
    showLogo: true
  actions:
    title:
      fr: Liens
      en: Links
    primary:
      text:
        fr: "📽️ Regarder la DEMO"
        en: "📽️ Watch the DEMO"
      url: "https://youtu.be/URPsqY7SwxY?si=orus46GsXuOBT0hj"
    secondary:
      text:
        fr: "⬇️ Télécharger le projet source FMOD"
        en: "⬇️ Download the FMOD source project"
      url: "https://drive.google.com/file/d/1LKFTjYzZCmCJaRHmEHhbRJbXW8nLqsvQ/view?usp=sharing"
  gallery:
    title:
      fr: Galerie
      en: Gallery
    images: []
  assetsFolder: /src/content/projects/2_Game Audio/Assets_FMOD
  stats:
    -
      value: 2 Weeks
      label:
        fr: DURATION
        en: DURATION
    -
      value: "1 👨‍👩‍👦‍👦"
      label:
        fr: TEAM SIZE
        en: TEAM SIZE
    -
      value: FMOD
      label:
        fr: PLATFORM
        en: PLATFORM
    -
      value: ISART
      label:
        fr: COMPANY
        en: COMPANY
  results:
    title:
      fr: "Résultats"
      en: Results
    subtitle:
      fr: "Résultat à l'issue de ce projet"
      en: Result achieved from this project
    items:
      -
        icon: "⬇️"
        text:
          fr: "Un fichier de démonstration FMOD téléchargeable ci-dessus"
          en: A downloadable FMOD demonstration file above
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
        url: https://youtube.com/
  tech:
    title:
      fr: Technologie
      en: Technology
  process:
    title:
      fr: Process
      en: Process
    subtitle:
      fr: From concept to shipping
      en: From concept to shipping
    steps:
      -
        fr: Conception des SFX avec PhasePlant et Reaper
        en: Conception des SFX avec PhasePlant et Reaper
      -
        fr: "Conception d'une banque de son en relation avec le projet"
        en: "Conception d'une banque de son en relation avec le projet"
      -
        fr: "Composition de la musique sous les contraintes de DA : instrument fantasiste, cordes... pas de synthé. pas d'instruments modernes."
        en: "Composition de la musique sous les contraintes de DA : instrument fantasiste, cordes... pas de synthé. pas d'instruments modernes."
      -
        fr: Assemblage de la musique et des SFX dans Reaper directement
        en: Assemblage de la musique et des SFX dans Reaper directement
      -
        fr: Mixage et Mastering en respectant les normes de rendus
        en: Mixage et Mastering en respectant les normes de rendus
  video:
    title:
      fr: INTERACTIVE JDR - SPACE ABYSS
      en: INTERACTIVE RPG - SPACE ABYSS
    url: "https://youtu.be/URPsqY7SwxY?si=orus46GsXuOBT0hj"
    description:
      fr: "Conception d'un projet FMOD pour un jeu de rôle. Le pitch : un jeu d'horreur situé dans un univers de science-fiction spatial, dans l'esprit de Dead Space. L'ambiance sonore y joue un rôle central, renforçant la tension et l'immersion du joueur à chaque instant. Le jeu comporte quatre phases de gameplay distinctes : exploration, infiltration, combat et survie — toutes contrôlées dynamiquement via le paramètre INTERACTIVITY."
      en: "Design of an FMOD project for a role-playing game. The pitch: a horror game set in a space sci-fi universe, in the spirit of Dead Space. The sound atmosphere plays a central role, reinforcing tension and player immersion at every moment. The game features four distinct gameplay phases: exploration, infiltration, combat and survival — all dynamically controlled via the INTERACTIVITY parameter."
  challenges:
    title:
      fr: Pitch
      en: Pitch
    subtitle:
      fr: ""
      en: ""
    items:
      -
        title:
          fr: Briefing du projet
          en: Project briefing
        description:
          fr: "Nous allons avoir besoin que tu composes de la musique interactive pour notre jeu avec des phases distinctes. Pour ce faire, dans l'application, nous allons appeler un paramètre que tu devras créer qui contiendra donc plusieurs états. Ce paramètre nous l'avons appelé INTERACTIVITY."
          en: "We will need you to compose interactive music for our game with distinct phases. To do this, in the application, we will call a parameter that you will need to create that will contain multiple states. We have called this parameter INTERACTIVITY."
      -
        title:
          fr: "[État 0] : Ouverture du jeu : mise en contexte"
          en: "[State 0] : Game opening: context setting"
        description:
          fr: "Musique d'introduction pour établir l'atmosphère du jeu spatial"
          en: Introductory music to establish the spatial game atmosphere
      -
        title:
          fr: "[État 01 + 01.5] : Musique de réflexion / Idle"
          en: "[State 01 + 01.5] : Reflection/Idle music"
        description:
          fr: "Ambiance calme pour les phases d'exploration et de réflexion"
          en: Calm ambiance for exploration and reflection phases
      -
        title:
          fr: "[État 02] : Musique de combat avec transition"
          en: "[State 02] : Combat music with transition"
        description:
          fr: "Musique intense et rythmée pour les séquences de combat"
          en: Intense and rhythmic music for combat sequences
      -
        title:
          fr: "[Victoire et transition] : 02 -> Win -> 01"
          en: "[Victory and transition] : 02 -> Win -> 01"
        description:
          fr: "Transition musicale positive après une victoire au combat"
          en: Positive musical transition after a combat victory
      -
        title:
          fr: "[Défaite et transition] : 02 -> Loose -> 01"
          en: "[Defeat and transition] : 02 -> Loose -> 01"
        description:
          fr: "Transition musicale sombre après une défaite au combat"
          en: Dark musical transition after a combat defeat
---


# FMOD Demo: Interactive RPG

Interactive music system demonstration for a space horror RPG featuring dynamic audio states controlled by the INTERACTIVITY parameter, inspired by Dead Space's atmospheric approach.

## Project Overview

This academic project challenged me to design a comprehensive interactive music system using FMOD for a fictional space horror RPG. The system needed to seamlessly transition between four distinct gameplay phases - exploration, infiltration, combat, and survival - while maintaining atmospheric tension throughout.

## Technical Achievements

- **Dynamic Music States**: Complete INTERACTIVITY parameter system with 6+ states
- **Seamless Transitions**: Smooth audio transitions between exploration, combat, victory, and defeat
- **Atmospheric Design**: Space horror soundscape inspired by Dead Space
- **FMOD Implementation**: Full project file with detailed parameter setup
- **Interactive Demo**: Downloadable demonstration showcasing all system states

## Educational Impact

- Comprehensive FMOD project file available for educational use
- Demonstrated mastery of adaptive music principles
- Successfully integrated complex state management in dynamic audio systems

