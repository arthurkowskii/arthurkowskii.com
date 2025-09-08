---
title:
  fr: "FMOD Demo : Interactive JDR"
  en: "FMOD Demo : Interactive RPG"
altTitle:
  fr: "FMOD Demo"
  en: "FMOD Demo"
description:
  fr: "Conception d'un projet FMOD pour un jeu de rôle. Le pitch : un jeu d'horreur situé dans un univers de science-fiction spatial, dans l'esprit de Dead Space.Le jeu comporte quatre phases de gameplay distinctes : exploration, infiltration, combat et survie — toutes contrôlées dynamiquement via le paramètre "INTERACTIVITY"."
  en: "Design of an FMOD project for a role-playing game. The pitch: a horror game set in a space sci-fi universe, in the spirit of Dead Space. The game features four distinct gameplay phases: exploration, infiltration, combat and survival — all dynamically controlled via the "INTERACTIVITY" parameter."
tech: ["Reaper", "FMOD"]
status: "completed"
link: "https://youtu.be/URPsqY7SwxY?si=orus46GsXuOBT0hj"
date: 2024-03-15
useBentoLayout: true

# Bento Layout Configuration
bento:
  # Accent color theme
  accentColor: "#ff0000ff"
  
  # Centralized assets folder for hero/logo and gallery images
  assetsFolder: "/src/content/projects/2_Game Audio/Assets_FMOD"
  
  # Card visibility toggles
  cards:
    hero: true
    stats: true
    musicLinks: false
    video: true
    spotify: false
    actions: true
    tech: true
    process: false
    gallery: true
    challenges: true
    results: true
  
  # Hero card configuration
  hero:
    subtitle:
      fr: "Démonstration Musique Dynamique"
      en: "Dynamic Music Demonstration"
    subtitleColor: "#e50000"
    backgroundPosition: "center"
    backgroundSize: "cover"
    backgroundScale: 1  # Alternative to backgroundSize - use 1.1, 0.9, etc.
    overlayTopOpacity: 0.0   # Controls dark overlay opacity at top (0.0 = transparent, 1.0 = opaque)
    overlayBottomOpacity: 0.0 # Controls dark overlay opacity at bottom (0.0 = transparent, 1.0 = opaque)
    showLogo: true
  
  # Project stats
  stats:
    - value: "2 Weeks"
      label: "DURATION"
    - value: "1 👨‍👩‍👦‍👦"
      label: "TEAM SIZE"
    - value : "FMOD"
      label : "PLATFORM"
    - value : ISART
      label : COMPANY
  
  # Action buttons
  actions:
    title:
      fr: "Liens"
      en: "Links"
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

  # Video configuration
  video:
    title:
      fr: "INTERACTIVE JDR - SPACE ABYSS"
      en: "INTERACTIVE RPG - SPACE ABYSS"
    url: "https://youtu.be/URPsqY7SwxY?si=orus46GsXuOBT0hj"
    description:
      fr: "Conception d'un projet FMOD pour un jeu de rôle. Le pitch : un jeu d'horreur situé dans un univers de science-fiction spatial, dans l'esprit de Dead Space. L'ambiance sonore y joue un rôle central, renforçant la tension et l'immersion du joueur à chaque instant. Le jeu comporte quatre phases de gameplay distinctes : exploration, infiltration, combat et survie — toutes contrôlées dynamiquement via le paramètre "INTERACTIVITY"."
      en: "Design of an FMOD project for a role-playing game. The pitch: a horror game set in a space sci-fi universe, in the spirit of Dead Space. The sound atmosphere plays a central role, reinforcing tension and player immersion at every moment. The game features four distinct gameplay phases: exploration, infiltration, combat and survival — all dynamically controlled via the "INTERACTIVITY" parameter."

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
        url: "https://youtube.com/"
  
  # Development process
  process:
    title: "Process"
    subtitle: "From concept to shipping"
    steps:
      - "Conception des SFX avec PhasePlant et Reaper"
      - "Conception d'une banque de son en relation avec le projet"
      - "Composition de la musique sous les contraintes de DA : instrument fantasiste, cordes... pas de synthé. pas d'instruments modernes."
      - "Assemblage de la musique et des SFX dans Reaper directement"
      - "Mixage et Mastering en respectant les normes de rendus"
  
  # Gallery images
  # Gallery now auto-populates from assetsFolder (excluding hero/logo files)
  gallery:
    title: "Gallery"
  
  # Technical challenges
  challenges:
    title:
      fr: "Pitch"
      en: "Pitch"
    subtitle:
      fr: ""
      en: ""
    items:
      - title:
          fr: ""
          en: ""
        description:
          fr: "Nous allons avoir besoin que tu composes de la musique interactive pour notre jeu avec des phases distinctes. Pour ce faire, dans l'application, nous allons appeler un paramètre que tu devras créer qui contiendra donc plusieurs états. Ce paramètre nous l'avons appelé INTERACTIVITY."
          en: "We will need you to compose interactive music for our game with distinct phases. To do this, in the application, we will call a parameter that you will need to create that will contain multiple states. We have called this parameter INTERACTIVITY."
      - title:
          fr: "[État 0] : Ouverture du jeu : mise en contexte"
          en: "[State 0] : Game opening: context setting"
        description:
          fr: ""
          en: ""
      - title:
          fr: "[État 01 + 01.5] : Musique de réflexion / Idle"
          en: "[State 01 + 01.5] : Reflection/Idle music"
        description:
          fr: ""
          en: ""
      - title:
          fr: "[État 02] : Musique de combat avec transition"
          en: "[State 02] : Combat music with transition"
        description:
          fr: ""
          en: ""
      - title:
          fr: "[Victoire et transition] : 02 -> Win -> 01"
          en: "[Victory and transition] : 02 -> Win -> 01"
        description:
          fr: ""
          en: ""
      - title:
          fr: "[Défaite et transition] : 02 -> Loose -> 01"
          en: "[Defeat and transition] : 02 -> Loose -> 01"
        description:
          fr: ""
          en: ""
  
  # Results and impact
  results:
    title:
      fr: "Résultats"
      en: "Results"
    subtitle:
      fr: "Résultat à l'issu de ce projet"
      en: "Result achieved from this project"
    items:
      - icon: "⬇️"
        text:
          fr: "Un fichier de démonstration FMOD téléchargeable ci-dessus"
          en: "A downloadable FMOD demonstration file above"
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
