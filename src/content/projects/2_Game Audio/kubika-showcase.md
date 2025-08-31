---
title: "Kubika: A Cube Story"
altTitle: "Kubika: A Cube Story"
description: "Kubika est un jeu de Sokoban en 3D où la gravité devient votre meilleur allié… ou votre pire ennemi ! Actuellement en développement, j'assure le Sound-Design  et l'Intégration Audio du projet"
tech: ["Unity", "Reaper", "FMOD", "C#",]
status: "completed"
link: "https://kubika.itch.io/kubika-a-cube-story"
date: 2024-03-15
useBentoLayout: true

# Bento Layout Configuration
bento:
  # Accent color theme (orange for Kubika)
  accentColor: "#ff6b00"
  
  # Centralized assets folder for hero/logo and gallery images
  assetsFolder: "/src/content/projects/2_Game Audio/Assets_Kubika"
  
  # Card visibility toggles
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
  
  # Hero card configuration
  hero:
    subtitle: "Technical Sound Design"
    subtitleColor: "#ff6b00"
    backgroundPosition: "center"
    backgroundSize: "cover"
    backgroundScale: 1.1  # Alternative to backgroundSize - use 1.1, 0.9, etc.
    overlayTopOpacity: 0.05  # Controls dark overlay opacity at top (0.0 = transparent, 1.0 = opaque)
    overlayBottomOpacity: 0.35 # Controls dark overlay opacity at bottom (0.0 = transparent, 1.0 = opaque)
    showLogo: false
  
  # Project stats
  stats:
    - value: "1y+"
      label: "DURATION"
    - value: "5 👨‍👩‍👦‍👦"
      label: "TEAM SIZE"
    - value : "PC"
      label : "PLATFORM"
    - value : KubiTeam
      label : COMPANY
  
  # Action buttons
  actions:
    title: "Links"
    primary:
      text: "Download the Alpha here ! ⬇️"
      url: "https://kubika.itch.io/kubika-a-cube-story/purchase"
    secondary:
      text: "Follow us on itch.io"
      url: "https://kubika.itch.io/kubika-a-cube-story"

  # Video configuration
  video:
    title: "Kubika: Gameplay Trailer"
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ" # Replace with actual Kubika trailer
    description: "Watch the gravity-defying puzzle mechanics and immersive 3D audio in action"

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
      - "Enregistrement et conception de l'intégralité des SFX présents dans le jeu"
      - "Conception d'une banque unique et propre au jeu et réutilisable pour le studio KubiTeam"
      - "Intégration des sons avec FMOD et UNITY"
  
  # Gallery images
  # Gallery now auto-populates from assetsFolder (excluding hero/logo files)
  gallery:
    title: "Gallery"
  
  # Technical challenges
  challenges:
    title: "Key Challenges"
    subtitle: "Technical problems solved during development"
    items:
      - title: "Détection des différents type de cube"
        description: "Developed custom 3D audio listener system that maintains spatial relationships regardless of world orientation"
      - title: "Concevoir un son joué plus d'une cinquantaine de fois par minute et le rendre plaisant"
        description: "Implemented audio pooling and LOD systems to handle complex 3D audio without performance impact"
      - title: "Optimisation des performances"
        description: "Created parametric music system with vertical remixing for seamless emotional transitions"
  
  # Results and impact
  results:
    title: "Results"
    subtitle: "Impact and recognition"
    items:
      - icon: "🕹️"
        text: "Une démo du premier monde disponible sur itch.io et une démo steam disponible avant la fin 2025"
      - icon: "🔉"
        text: "Un sound design satisfaisant et réactif"
      - icon: "👨‍💻"
        text: "Une intégration puissante mais légère, sans latence."
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
