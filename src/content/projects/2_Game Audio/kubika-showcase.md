---
title:
  fr: "Kubika: A Cube Story"
  en: "Kubika: A Cube Story"
altTitle:
  fr: "Kubika: A Cube Story"
  en: "Kubika: A Cube Story"
description:
  fr: "Kubika est un jeu de Sokoban en 3D où la gravité devient votre meilleur allié… ou votre pire ennemi ! Actuellement en développement, j'assure le Sound-Design et l'Intégration Audio du projet."
  en: "Kubika is a 3D Sokoban game where gravity becomes your best ally... or your worst enemy! Currently in development, I handle the Sound Design and Audio Integration for the project"
tech:
  - Unity
  - Reaper
  - FMOD
  - "C#"
status: completed
link: https://kubika.itch.io/kubika-a-cube-story
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
            fr: Sound Design Technique
            en: Technical Sound Design
          subtitleColor: "#ff6b00"
          backgroundImage: ""
          backgroundPosition: center
          backgroundSize: cover
          backgroundScale: 1.1
          overlayTopOpacity: 0.05
          overlayBottomOpacity: 0.35
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
            fr: Links
            en: Links
          primary:
            text:
              fr: "Download the Alpha here ! ⬇️"
              en: "Download the Alpha here ! ⬇️"
            url: https://kubika.itch.io/kubika-a-cube-story/purchase
          secondary:
            text:
              fr: Follow us on itch.io
              en: Follow us on itch.io
            url: https://kubika.itch.io/kubika-a-cube-story
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
            fr: "Du concept à la livraison"
            en: From concept to shipping
          steps:
            -
              fr: "Enregistrement et conception de l'intégralité des SFX présents dans le jeu"
              en: Recording and designing all SFX present in the game
            -
              fr: "Conception d'une banque unique et propre au jeu et réutilisable pour le studio KubiTeam"
              en: Creating a unique game-specific sound bank reusable for KubiTeam studio
            -
              fr: "Intégration des sons avec FMOD et UNITY"
              en: Sound integration with FMOD and Unity
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
              value: "1y+"
              label:
                fr: DURATION
                en: DURATION
            -
              value: "5 👨‍👩‍👦‍👦"
              label:
                fr: TEAM SIZE
                en: TEAM SIZE
            -
              value: PC
              label:
                fr: PLATFORM
                en: PLATFORM
            -
              value: KubiTeam
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
              url: https://youtube.com/
      -
        id: sampler-1
        type: sampler
        enabled: true
        variant: wide
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
          folder: Kubika
          volume: 2.5
          samplePool:
            - Click_03.ogg
            - Click_04.ogg
            - GRASS_00_002.ogg
            - GRASS_00_005.ogg
            - HIghlands_StartLevel_Medium_02.ogg
            - Level_Editor.ogg
            - Loading Down.ogg
            - Loading_Down.ogg
            - New_crumble_00_001.ogg
            - New_crumble_00_004.ogg
            - Ok_Chord_01.ogg
            - Ok_Chord_02.ogg
            - Select.ogg
            - UI back.ogg
            - UIClick_X4 Small Cute Bop 06_SKII_KUBIKA.ogg
            - UI_select.ogg
            - "Water, Movement, Swimming, Full Body Emerge, Surface, Splash SND122413.ogg"
            - Win_Base.ogg
            - Win_Gold.ogg
            - Win_Silver.ogg
            - batch_three_glass-003.ogg
            - break_glass-001.ogg
            - crescendo 02.ogg
            - crescendo_01.ogg
            - elevator_01.ogg
            - elevator_02.ogg
            - elevator_03.ogg
            - fallOnTop_01.ogg
            - fall_delivery.ogg
            - fall_elevator_01.ogg
            - fall_elevator_03.ogg
            - gear_01.ogg
            - gear_02.ogg
            - heavy-005.ogg
            - impact_breach_win.ogg
            - move.ogg
            - move_ceramic_01.ogg
            - new_delivery_01.ogg
            - new_delivery_ceramic_02.ogg
            - new_delivery_chord_RAW.ogg
            - play level the vale cubes.ogg
            - removed_before_win.ogg
            - start level transition the vale.ogg
            - start_level_breach.ogg
            - world move 02.ogg
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
            fr: Impact et reconnaissance
            en: Impact and recognition
          items:
            -
              icon: "🕹️"
              text:
                fr: "Une démo du premier monde disponible sur itch.io et une démo Steam disponible avant la fin 2025"
                en: First world demo available on itch.io and a Steam demo coming before the end of 2025
            -
              icon: "🔉"
              text:
                fr: "Un sound design satisfaisant et réactif"
                en: Satisfying and responsive sound design
            -
              icon: "👨‍💻"
              text:
                fr: "Une intégration puissante mais légère, sans latence"
                en: Powerful yet lightweight integration with no latency
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
        id: video-1
        type: video
        enabled: false
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
          title: "Kubika: Gameplay Trailer"
          url: "https://youtube.com/watch?v=dQw4w9WgXcQ"
          description: Watch the gravity-defying puzzle mechanics and immersive 3D audio in action
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
            fr: "Problèmes techniques résolus pendant le développement"
            en: Technical problems solved during development
          items:
            -
              title:
                fr: "Détection des différents types de cubes"
                en: Detecting different cube types
              description:
                fr: "Développement d'un système d'écoute audio 3D personnalisé qui maintient les relations spatiales indépendamment de l'orientation du monde"
                en: Developed custom 3D audio listener system that maintains spatial relationships regardless of world orientation
            -
              title:
                fr: "Concevoir un son joué plus d'une cinquantaine de fois par minute et le rendre plaisant"
                en: Designing a sound played over fifty times per minute and making it pleasant
              description:
                fr: "Implémentation de systèmes de pooling audio et LOD pour gérer l'audio 3D complexe sans impact sur les performances"
                en: Implemented audio pooling and LOD systems to handle complex 3D audio without performance impact
            -
              title:
                fr: Optimisation des performances
                en: Performance optimization
              description:
                fr: "Création d'un système de musique paramétrique avec remixage vertical pour des transitions émotionnelles fluides"
                en: Created parametric music system with vertical remixing for seamless emotional transitions
  accentColor: "#ff6b00"
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
    sampler: true
    fmod: false
  hero:
    subtitle:
      fr: Sound Design Technique
      en: Technical Sound Design
    subtitleColor: "#ff6b00"
    backgroundPosition: center
    backgroundSize: cover
    backgroundScale: 1.1
    overlayTopOpacity: 0.05
    overlayBottomOpacity: 0.35
    showLogo: false
  actions:
    title:
      fr: Links
      en: Links
    primary:
      text:
        fr: "Download the Alpha here ! ⬇️"
        en: "Download the Alpha here ! ⬇️"
      url: https://kubika.itch.io/kubika-a-cube-story/purchase
    secondary:
      text:
        fr: Follow us on itch.io
        en: Follow us on itch.io
      url: https://kubika.itch.io/kubika-a-cube-story
  process:
    title:
      fr: Processus
      en: Process
    subtitle:
      fr: "Du concept à la livraison"
      en: From concept to shipping
    steps:
      -
        fr: "Enregistrement et conception de l'intégralité des SFX présents dans le jeu"
        en: Recording and designing all SFX present in the game
      -
        fr: "Conception d'une banque unique et propre au jeu et réutilisable pour le studio KubiTeam"
        en: Creating a unique game-specific sound bank reusable for KubiTeam studio
      -
        fr: "Intégration des sons avec FMOD et UNITY"
        en: Sound integration with FMOD and Unity
  gallery:
    title:
      fr: Galerie
      en: Gallery
    images: []
  assetsFolder: /src/content/projects/2_Game Audio/Assets_Kubika
  stats:
    -
      value: "1y+"
      label:
        fr: DURATION
        en: DURATION
    -
      value: "5 👨‍👩‍👦‍👦"
      label:
        fr: TEAM SIZE
        en: TEAM SIZE
    -
      value: PC
      label:
        fr: PLATFORM
        en: PLATFORM
    -
      value: KubiTeam
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
        url: https://youtube.com/
  sampler:
    title:
      fr: "Jouez avec les sons du jeu ⬇️"
      en: "PLay sounds from this game ⬇️"
    folder: Kubika
    volume: 2.5
    samplePool:
      - Click_03.ogg
      - Click_04.ogg
      - GRASS_00_002.ogg
      - GRASS_00_005.ogg
      - HIghlands_StartLevel_Medium_02.ogg
      - Level_Editor.ogg
      - Loading Down.ogg
      - Loading_Down.ogg
      - New_crumble_00_001.ogg
      - New_crumble_00_004.ogg
      - Ok_Chord_01.ogg
      - Ok_Chord_02.ogg
      - Select.ogg
      - UI back.ogg
      - UIClick_X4 Small Cute Bop 06_SKII_KUBIKA.ogg
      - UI_select.ogg
      - "Water, Movement, Swimming, Full Body Emerge, Surface, Splash SND122413.ogg"
      - Win_Base.ogg
      - Win_Gold.ogg
      - Win_Silver.ogg
      - batch_three_glass-003.ogg
      - break_glass-001.ogg
      - crescendo 02.ogg
      - crescendo_01.ogg
      - elevator_01.ogg
      - elevator_02.ogg
      - elevator_03.ogg
      - fallOnTop_01.ogg
      - fall_delivery.ogg
      - fall_elevator_01.ogg
      - fall_elevator_03.ogg
      - gear_01.ogg
      - gear_02.ogg
      - heavy-005.ogg
      - impact_breach_win.ogg
      - move.ogg
      - move_ceramic_01.ogg
      - new_delivery_01.ogg
      - new_delivery_ceramic_02.ogg
      - new_delivery_chord_RAW.ogg
      - play level the vale cubes.ogg
      - removed_before_win.ogg
      - start level transition the vale.ogg
      - start_level_breach.ogg
      - world move 02.ogg
  results:
    title:
      fr: "Résultats"
      en: Results
    subtitle:
      fr: Impact et reconnaissance
      en: Impact and recognition
    items:
      -
        icon: "🕹️"
        text:
          fr: "Une démo du premier monde disponible sur itch.io et une démo Steam disponible avant la fin 2025"
          en: First world demo available on itch.io and a Steam demo coming before the end of 2025
      -
        icon: "🔉"
        text:
          fr: "Un sound design satisfaisant et réactif"
          en: Satisfying and responsive sound design
      -
        icon: "👨‍💻"
        text:
          fr: "Une intégration puissante mais légère, sans latence"
          en: Powerful yet lightweight integration with no latency
  tech:
    title:
      fr: Technologie
      en: Technology
  video:
    title: "Kubika: Gameplay Trailer"
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ"
    description: Watch the gravity-defying puzzle mechanics and immersive 3D audio in action
  challenges:
    title:
      fr: "Défis Clés"
      en: Key Challenges
    subtitle:
      fr: "Problèmes techniques résolus pendant le développement"
      en: Technical problems solved during development
    items:
      -
        title:
          fr: "Détection des différents types de cubes"
          en: Detecting different cube types
        description:
          fr: "Développement d'un système d'écoute audio 3D personnalisé qui maintient les relations spatiales indépendamment de l'orientation du monde"
          en: Developed custom 3D audio listener system that maintains spatial relationships regardless of world orientation
      -
        title:
          fr: "Concevoir un son joué plus d'une cinquantaine de fois par minute et le rendre plaisant"
          en: Designing a sound played over fifty times per minute and making it pleasant
        description:
          fr: "Implémentation de systèmes de pooling audio et LOD pour gérer l'audio 3D complexe sans impact sur les performances"
          en: Implemented audio pooling and LOD systems to handle complex 3D audio without performance impact
      -
        title:
          fr: Optimisation des performances
          en: Performance optimization
        description:
          fr: "Création d'un système de musique paramétrique avec remixage vertical pour des transitions émotionnelles fluides"
          en: Created parametric music system with vertical remixing for seamless emotional transitions
---


# Kubika: A Cube Story

Mind-bending, gravity-shifting 3D Sokoban puzzle game featuring innovative spatial audio that adapts to gravity changes and immersive 3D positional sound systems.

## Project Overview

Created immersive spatial audio for this award-winning puzzle game, developing custom systems that respond dynamically to the game's unique gravity-shifting mechanics. The audio design maintains spatial relationships regardless of world orientation, creating a truly three-dimensional soundscape.

## Technical Achievements

- **Gravity-Responsive Audio**: Custom 3D audio listener system
- **Performance Optimization**: Audio pooling and LOD systems  
- **Adaptive Music System**: Parametric system with vertical remixing
- **45+ Sound Effects**: Complete audio library
- **8 Audio Layers**: Dynamic music composition

## Recognition

- 5.0/5 star rating with specific praise for innovative audio design
- Featured as case study for 3D audio in indie game development
- Audio systems reused in team's subsequent projects
- Enhanced the "headphones recommended" meditative experience

