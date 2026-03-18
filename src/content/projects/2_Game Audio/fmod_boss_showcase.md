---
title:
  fr: "FMOD Boss Demo"
  en: "FMOD Boss Demo"
altTitle:
  fr: "FMOD Boss"
  en: "FMOD Boss"
description:
  fr: "Voici un système audio de combat de boss réalisé avec FMOD lors d'un projet scolaire, vous pouvez directement essayer l'implémentation sans quitter ce portfolio. Contexte : combat de boss dark fantasy, entièrement composé avec de la musique adaptative pilotée par des paramètres de gameplay."
  en: "This is boss fight audio system made with FMOD during a school project, here you can directly try the implementation without leaving this portfolio. Context : dark fantasy boss fight, scored entirely with adaptive music driven by gameplay parameters."
tech: ["FMOD", "Web API", "JavaScript"]
status: "completed"
date: 2026-02-21
useBentoLayout: true

# Bento Layout Configuration
bento:
  # Accent color theme
  accentColor: "#e42a00"

  # Centralized assets folder for hero/logo images
  assetsFolder: "/src/content/projects/2_Game Audio/Assets_Boss"

  # Card visibility toggles
  cards:
    hero: true
    stats: true
    fmod: true
    tech: false
    actions: true
    process: false
    gallery: false
    challenges: false
    results: false

  # Tech section configuration
  tech:
    title:
      fr: "Technologie"
      en: "Technology"
  
  # Hero card configuration
  hero:
    subtitle:
      fr: "Intégration Web FMOD"
      en: "FMOD Web Integration"

  # Project stats
  stats:
    - value: "FMOD"
      label: "IMPLEMENTATION"
    - value: "REAPER"
      label: "COMPOSITION"

  # Process steps
  process:
    title:
      fr: "Processus"
      en: "Process"
    steps:
      - fr: "Exportation des banques FMOD depuis l'éditeur Desktop"
        en: "Exporting FMOD banks from the Desktop editor"
      - fr: "Intégration de l'API HTML5 (fmodstudio.wasm/.js)"
        en: "HTML5 API integration (fmodstudio.wasm/.js)"
      - fr: "Chargement asynchrone des banques dans le système de fichiers virtuel (Emscripten)"
        en: "Asynchronous loading of banks into the virtual file system (Emscripten)"
      - fr: "Contrôle en temps réel des événements et paramètres"
        en: "Real-time control of events and parameters"

  # Action buttons
  actions:
    title:
      fr: "Liens"
      en: "Links"
    primary:
      text:
        fr: "📽️ Regarder la DEMO"
        en: "📽️ Watch the DEMO"
      url: "https://youtu.be/dXkrb0iK0wM?si=ZK8lNY4IzBlz_ZuP"
    secondary:
      text:
        fr: "⬇️ Télécharger le projet source FMOD"
        en: "⬇️ Download the FMOD source project"
      url: "https://drive.google.com/file/d/1kgkZ3VlRkiE_1NIYSUuTSrf43hViifxg/view?usp=sharing"
    

  # FMOD Interactive Player configuration
  fmod:
    title:
      fr: "FMOD Player Interactif"
      en: "FMOD Interactive Player"
    description:
      fr: "Testez l'implémentation audio directement dans votre navigateur. Utilisez les curseurs ci-dessous pour modifier les paramètres FMOD en temps réel."
      en: "Test the audio implementation directly in your browser. Use the sliders below to modify FMOD parameters in real-time."
    mode: "interactive-game"
    introDuration: 26.5
    images:
      boss: "/fmod/FMOD-BOSS/images/boss.webp"
      player: "/fmod/FMOD-BOSS/images/player.webp"
      mob: "/fmod/FMOD-BOSS/images/mob.webp"
    folder: "FMOD-BOSS"
    banks:
      - "Master.bank"
      - "Master.strings.bank"
    events:
      - name:
          fr: "Thème du Boss"
          en: "Boss Theme"
        path: "event:/mus_BOSS"
    parameters:
      - name: "BOSS_HEALTH"
        label:
          fr: "Santé du Boss"
          en: "Boss Health"
        min: 0
        max: 100
        step: 1
        default: 100
      - name: "is_mobKilled"
        label:
          fr: "Mob Tué"
          en: "Mob Killed"
        min: 0
        max: 1
        step: 1
        default: 0
      - name: "isSpecial"
        label:
          fr: "Spécial"
          en: "Special"
        min: 0
        max: 1
        step: 1
        default: 0
---

# FMOD Web Integration: Boss Demo

This interactive project demonstrates the capabilities of integrating the FMOD runtime engine directly into a modern web portfolio using the HTML5/WebAssembly API.

## Technical Implementation

By leveraging Emscripten and the FMOD Studio Web API, the exact sound banks created in the FMOD Studio desktop application are loaded asynchronously into a virtual file system in the browser. This allows for real-time testing of complex interactive audio systems—such as dynamic health parameters and event triggers—without requiring any game engine or native application running.
