---
title:
  fr: "Mouse Knight"
  en: "Mouse Knight"
altTitle:
  fr: "Mouse Knight"
  en: "Mouse Knight"
description:
  fr: "Un chevalier-souris part en quête pour retrouver le roi qui lui a lancé une malédiction afin de se venger. J'ai réalisé pour ce projet la composition de cinq musiques orchestrales, avant d'en assurer l'intégration technique sous FMOD et Unity."
  en: "Explore a miniature world as Mouse Knight, an epic adventure game with an immersive sound dimension."
tech: ["FMOD", "Reaper", "Unity"]
status: "in-progress" # or "completed" | "planned"
link: "https://example.com"
github: "https://github.com/you/repo"
date: 2024-12-18
useBentoLayout: true

# Bento Layout Configuration
bento:
  # Theme color
  accentColor: "#2d5a27"

  # REQUIRED for auto hero/logo + gallery
  # Put images here and name hero.* and logo.* for the hero card
  assetsFolder: "/src/content/projects/2_Game Audio/Assets_MouseKnight"

  # Toggle cards
  cards:
    hero: true  
    stats: true
    musicLinks: false
    video: false
    spotify: false
    audio: true
    sampler: false
    actions: true
    tech: true
    process: true
    gallery: true
    challenges: true
    results: true

  # Tech section configuration
  tech:
    title:
      fr: "Technologie"
      en: "Technology"

  # Hero subtitle only; hero/background/logo auto from assetsFolder
  hero:
    subtitle:
      fr: "Sound-Designer et Intégrateur Audio"
      en: "Sound Designer and Audio Integrator"
    subtitleColor: "#ffffff"
    backgroundPosition: "center"
    backgroundSize: "cover"
    backgroundScale: 1.1
    overlayTopOpacity: 0.1
    overlayBottomOpacity: 0.3
    showLogo: true

  # Optional stats
  stats:
    - value: "Ongoing"
      label: "DURATION"
    - value: "5 🐭"
      label: "TEAM SIZE"
    - value : "PC"
      label : "PLATFORM"
    - value : Personal
      label : PROJECT

  # Optional actions
  actions:
    title:
      fr: "Liens"
      en: "Links"
    primary:
      text:
        fr: "📽️ Voir le projet"
        en: "📽️ View project"
      url: "#"
    secondary:
      text:
        fr: "🕹️ Démo"
        en: "🕹️ Demo"
      url: "#"

  # Optional process
  process:
    title:
      fr: "Processus"
      en: "Process"
    steps:
      - fr: "Conception sonore des personnages et de l'environnement."
        en: "Sound design for characters and environment."
      - fr: "Intégration audio via FMOD."
        en: "Audio integration via FMOD."
      - fr: "Création d'ambiances immersives."
        en: "Creation of immersive ambiances."

  # Gallery images auto from assetsFolder; title optional
  gallery:
    title:
      fr: "Galerie"
      en: "Gallery"

  # Optional challenges
  challenges:
    title:
      fr: "Défis Clés"
      en: "Key Challenges"
    items:
      - title:
          fr: "Immersion sonore"
          en: "Sound Immersion"
        description:
          fr: "Créer une atmosphère sonore riche et détaillée pour un monde à petite échelle."
          en: "Creating a rich and detailed sound atmosphere for a small-scale world."

  # Audio Player Configuration
  audio:
    title:
      fr: "Bande Sonore"
      en: "Soundtrack"
    tracks:
      - title:
          fr: "Once Upon A Time... a Mouse Knight"
          en: "Once Upon A Time... a Mouse Knight"
        artist: "Arthur Kowskii"
        filename: "mus__OnceUponATime"
        duration: "02:21"
      - title:
          fr: "Prison Break"
          en: "Prison Break"
        artist: "Arthur Kowskii"
        filename: "mus_PrisonBreak"
        duration: "03:15"
      - title:
          fr: "The Village"
          en: "The Village"
        artist: "Arthur Kowskii"
        filename: "mus_TheVillage"
        duration: "01:51"
      - title:
          fr: "This Curse Ends With You"
          en: "This Curse Ends With You"
        artist: "Arthur Kowskii"
        filename: "mus_ThisCurse.mp3"
        duration: "02:24"
      - title:
          fr: "The Curse... can't be lifted ?"
          en: "The Curse... can't be lifted ?"
        artist: "Arthur Kowskii"
        filename: "End Credits"
        duration: "03:01"

  sampler:
    title:
      fr: "Jouez avec les sons ⬇️"
      en: "Play with sounds ⬇️"
    description:
      fr: "Échantillons sonores du projet Mouse Knight."
      en: "Sound samples from Mouse Knight project."
    folder: "MouseKnight/SFX"
    volume: 1.0
    samplePool:
      - "Sword_Swing.wav"
      - "Mouse_Squeak.wav"

  # Optional results
  results:
    title:
      fr: "Résultats"
      en: "Results"
    items:
      - icon: "⚔️"
        text:
          fr: "Un prototype jouable"
          en: "A playable prototype"
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
