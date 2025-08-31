---
title: "Helena Rubinstein - Commission"
altTitle: "Helena Rubinstein"
description: "À l’occasion du salon annuel L’Oréal Paris, j’ai eu l’opportunité de collaborer avec Helena Rubinstein pour la présentation exclusive de ses nouveaux produits. J’ai composé quinze minutes de musique, diffusées tout au long de l’événement afin d’accompagner les différentes sessions."
tech: ["Ableton", "FMOD"]
status: "completed"
link: "https://kowskii.com"
date: 2024-03-15
useBentoLayout: true

# Bento Layout Configuration
bento:
  # Accent color theme
  accentColor: "#2b2b2bff"
  accentColorDark: "#ffffff"  # White accent for dark mode
  
  # Centralized assets folder for hero/logo and gallery images
  assetsFolder: "/src/content/projects/1_Music/Assets_hr"
  
  # Card visibility toggles
  cards:
    hero: true
    stats: true
    musicLinks: false
    video: false
    spotify: false
    soundcloud: true
    actions: true
    tech: true
    process: true
    gallery: false
    challenges: true
    results: false
  
  # Hero card configuration
  hero:
    subtitle: "Commision Musicale Freelance"
    subtitleColor: "#e50000"
    backgroundPosition: "center"
    backgroundSize: "cover"
    backgroundScale: 1.7  # Alternative to backgroundSize - use 1.1, 0.9, etc.
    overlayTopOpacity: 0.1    # Controls dark overlay opacity at top (0.0 = transparent, 1.0 = opaque)
    overlayBottomOpacity: 0.4 # Controls dark overlay opacity at bottom (0.0 = transparent, 1.0 = opaque)
    showLogo: false
  
  # Project stats
  stats:
    - value: "2 Weeks"
      label: "DURATION"
    - value: "10 👨‍👩‍👦‍👦"
      label: "TEAM SIZE"
    - value : "LIVE"
      label : "PLATFORM"
    - value : "L'Oréal"
      label : "EMPLOYEUR"
  
  # Action buttons
  actions:
    title: "Links"
    primary:
      text: "🎧 Listen to Kowskii and HR 2024 collaboration"
      url: "https://on.soundcloud.com/7WWxaXFKQd7jxrLKm9"
    secondary:
      text: "See ealier collaboration with HR (2021, 2022)"
      url: "https://vimeo.com/1112967801?share=copy"

  # Video configuration
  video:
    title: "Helena Rubinstein"
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ" # Replace with actual Kubika trailer
    description: "Arthur Kowskii pour Helena Rubinstein 2024"

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

  # SoundCloud configuration
  soundcloud:
    title: "Helena Rubinstein Commission"
    url: "https://soundcloud.com/kforkowskii/sets/kowskii-for-helena-rubinstein-px50-event?si=257dbf8a42f749d4baf427d537d957da&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
    description: "15 minutes de musique pour L'Oréal Paris"
    large: true  # large size = gallery position / small = tech position
  
  # Development process
  process:
    title: "Process"
    subtitle: "From concept to shipping"
    steps:
      - "Helena Rubinstein (L’Oréal) me contacte pour composer 15 minutes de musique pour leur événement annuel de 2024. Le pitch : accompagner leur présentation d’un événement musical évoquant l’innovation, le luxe et l’histoire de la marque"
      - "Conception d'une première musique témoin (3m) pour valider la direction artistique"
      - "Composition des 12 minutes supplémentaires, en 3 parties et sur les thèmes de la marque : AVANT-GARDE, SCIENCE OF BEAUTY, BIOTECH"
      - "Intégration de la musique sur FMOD pour une diffusion sur l'ensemble des deux journées de présentation"
  
  # Gallery images
  # Gallery now auto-populates from assetsFolder (excluding hero/logo files)
  gallery:
    title: "Gallery"
  
  # Technical challenges
  challenges:
    title: "Key Challenges"
    subtitle: "Défis principaux rencontrés lors de ce projet"
    items:
      - title: "Temps imparti"
        description: "Le délai imparti pour ce projet était particulièrement court au regard du travail demandé, ce qui reste habituel pour ce type de productions, souvent communiquées aux équipes à la toute dernière étape avant la sortie. Quinze minutes de musique ont ainsi été commandées, à livrer et présenter en direct seulement deux semaines plus tard. Malgré cette contrainte, un brief clair, des ressources de qualité et une direction artistique solide ont permis de travailler dans une ambiance à la fois agréable et créativement stimulante"
  
  # Results and impact
  results:
    title: "Results"
    subtitle: "Impact and recognition"
    items:
      - icon: "⭐"
        text: "5.0/5 star rating with specific praise for innovative audio design"
      - icon: "🎯"
        text: "Featured as case study for 3D audio in indie game development"
      - icon: "🔄"
        text: "Audio systems reused in team's subsequent projects"
      - icon: "🎧"
        text: "Enhanced the \"headphones recommended\" meditative experience"
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
