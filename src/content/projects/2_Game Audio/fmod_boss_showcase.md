---
title:
  fr: "FMOD Boss Demo"
  en: "FMOD Boss Demo"
altTitle:
  fr: "FMOD Boss"
  en: "FMOD Boss"
description:
  fr: "Démonstration interactive de l'implémentation audio dynamique avec FMOD via web API."
  en: "Interactive demonstration of dynamic audio implementation with FMOD via web API."
tech: ["FMOD", "Web API", "JavaScript"]
status: "completed"
date: 2026-02-21
useBentoLayout: true

# Bento Layout Configuration
bento:
  # Accent color theme
  accentColor: "#f3522c"

  # Card visibility toggles
  cards:
    hero: true
    stats: true
    fmod: true
    actions: false
    tech: true
    process: true
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
      label: "ENGINE"
    - value: "WEB"
      label: "PLATFORM"

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
