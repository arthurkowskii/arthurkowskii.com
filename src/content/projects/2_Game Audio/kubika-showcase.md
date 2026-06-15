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
    audio: false
    sampler: true

  # Sampler Configuration
  sampler:
    title:
      fr: "Jouez avec les sons du jeu ⬇️"
      en: "PLay sounds from this game ⬇️"
    folder: "Kubika"
    volume: 2.5
    samplePool: 
      - "Click_03.ogg"
      - "Click_04.ogg"
      - "GRASS_00_002.ogg"
      - "GRASS_00_005.ogg"
      - "HIghlands_StartLevel_Medium_02.ogg"
      - "Level_Editor.ogg"
      - "Loading Down.ogg"
      - "Loading_Down.ogg"
      - "New_crumble_00_001.ogg"
      - "New_crumble_00_004.ogg"
      - "Ok_Chord_01.ogg"
      - "Ok_Chord_02.ogg"
      - "Select.ogg"
      - "UI back.ogg"
      - "UIClick_X4 Small Cute Bop 06_SKII_KUBIKA.ogg"
      - "UI_select.ogg"
      - "Water, Movement, Swimming, Full Body Emerge, Surface, Splash SND122413.ogg"
      - "Win_Base.ogg"
      - "Win_Gold.ogg"
      - "Win_Silver.ogg"
      - "batch_three_glass-003.ogg"
      - "break_glass-001.ogg"
      - "crescendo 02.ogg"
      - "crescendo_01.ogg"
      - "elevator_01.ogg"
      - "elevator_02.ogg"
      - "elevator_03.ogg"
      - "fallOnTop_01.ogg"
      - "fall_delivery.ogg"
      - "fall_elevator_01.ogg"
      - "fall_elevator_03.ogg"
      - "gear_01.ogg"
      - "gear_02.ogg"
      - "heavy-005.ogg"
      - "impact_breach_win.ogg"
      - "move.ogg"
      - "move_ceramic_01.ogg"
      - "new_delivery_01.ogg"
      - "new_delivery_ceramic_02.ogg"
      - "new_delivery_chord_RAW.ogg"
      - "play level the vale cubes.ogg"
      - "removed_before_win.ogg"
      - "start level transition the vale.ogg"
      - "start_level_breach.ogg"
      - "world move 02.ogg"

  # Tech section configuration
  tech:
    title:
      fr: "Technologie"
      en: "Technology"
  
  # Hero card configuration
  hero:
    subtitle:
      fr: "Sound Design Technique"
      en: "Technical Sound Design"
    subtitleColor: "#ff6b00"
    backgroundPosition: "center"
    backgroundSize: "cover"
    backgroundScale: 1.1  # Alternative to backgroundSize - use 1.1, 0.9, etc.
    overlayTopOpacity: 0.05  # Controls dark overlay opacity at top (0.0 = transparent, 1.0 = opaque)
    overlayBottomOpacity: 0.35 # Controls dark overlay opacity at bottom (0.0 = transparent, 1.0 = opaque)
    showLogo: false
  
  # Project stats
  stats:
    - value: "Unity"
      label:
        fr: "MOTEUR"
        en: "ENGINE"
    - value: "C#"
      label:
        fr: "LANGAGE"
        en: "LANGUAGE"
    - value: "Git"
      label:
        fr: "VERSIONNING"
        en: "VERSION CONTROL"
    - value: "Sound Designer"
      label:
        fr: "RÔLE"
        en: "ROLE"
  
  # Action buttons
  actions:
    title: "Links"
    primary:
      text:
        fr: "Jouer à la démo Steam 🎮"
        en: "Play the Steam Demo 🎮"
      url: "https://store.steampowered.com/app/4738710/KUBIKA_Demo/"
    secondary:
      text: "All of our links 🔗"
      url: "https://kubicorpstudio.com/links"

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
    title:
      fr: "Processus"
      en: "Process"
    subtitle:
      fr: "Du concept à la livraison"
      en: "From concept to shipping"
    steps:
      - fr: "Enregistrement et conception de l'intégralité des SFX présents dans le jeu"
        en: "Recording and designing all SFX present in the game"
      - fr: "Conception d'une banque unique et propre au jeu et réutilisable pour le studio KubiTeam"
        en: "Creating a unique game-specific sound bank reusable for KubiTeam studio"
      - fr: "Intégration des sons avec FMOD et UNITY"
        en: "Sound integration with FMOD and Unity"
  
  # Gallery images
  # Gallery now auto-populates from assetsFolder (excluding hero/logo files)
  gallery:
    title:
      fr: "Galerie"
      en: "Gallery"
  
  # Technical challenges
  challenges:
    title:
      fr: "Défis Clés"
      en: "Key Challenges"
    subtitle:
      fr: "Problèmes techniques résolus pendant le développement"
      en: "Technical problems solved during development"
    items:
      - title:
          fr: "Détection des différents types de cubes"
          en: "Detecting different cube types"
        description:
          fr: "Développement d'un système d'écoute audio 3D personnalisé qui maintient les relations spatiales indépendamment de l'orientation du monde"
          en: "Developed custom 3D audio listener system that maintains spatial relationships regardless of world orientation"
      - title:
          fr: "Bruiter des écosystèmes avec une faune cohérente et intelligente, respectant les relations entre les différentes espèces et les biomes"
          en: "Creating cohesive and intelligent ecosystems, respecting relationships between different species and biomes"
        description:
          fr: "Un travail important a été fait par dessus le travail des artistes pour déterminer les types d'animaux présents dans les différentes mondes en fonction de visuels. La répartition de ces animaux est intelligente et dynamique."
          en: "Significant work was done on top of the artists' work to determine the types of animals present in the different worlds based on visuals. The distribution of these animals is intelligent and dynamic."
      - title:
          fr: "Optimisation des performances"
          en: "Performance optimization"
        description:
          fr: "Création d'un système de musique paramétrique avec remixage vertical pour des transitions émotionnelles fluides"
          en: "Created parametric music system with vertical remixing for seamless emotional transitions"
  
  # Results and impact
  results:
    title:
      fr: "Résultats"
      en: "Results"
    subtitle:
      fr: "Impact et reconnaissance"
      en: "Impact and recognition"
    items:
      - icon: "⭐"
        text:
          fr: "Co fondatation du studio indépendant KubiCorp en 2025 avec le reste de l'équipe."
          en: "Co-founded independent studio KubiCorp in 2025 with the rest of the team."
      - icon: "🕹️"
        text:
          fr: "Sortie PC troisième trimestre 2026, démo disponible en avril."
          en: "PC release in Q3 2026, demo available in April."
      - icon: "🔉"
        text:
          fr: "La musique du jeu s'adapte à la gravité et aux différentes phases de jeu, renforçant l'immersion et l'impact émotionnel."
          en: "The game's music seamlessly adapts to gravity changes and different game phases, enhancing immersion and emotional impact."
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
