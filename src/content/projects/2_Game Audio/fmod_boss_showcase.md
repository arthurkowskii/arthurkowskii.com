---
title:
  fr: FMOD Boss Demo
  en: FMOD Boss Demo
altTitle:
  fr: FMOD Boss
  en: FMOD Boss
description:
  fr: "Démonstration interactive de l'implémentation audio dynamique avec FMOD via web API."
  en: Interactive demonstration of dynamic audio implementation with FMOD via web API.
tech:
  - FMOD
  - Web API
  - JavaScript
status: completed
date: 2026-02-21
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
              value: FMOD
              label:
                fr: ENGINE
                en: ENGINE
            -
              value: WEB
              label:
                fr: PLATFORM
                en: PLATFORM
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
            fr: "Intégration Web FMOD"
            en: FMOD Web Integration
          subtitleColor: "#ff6b00"
          backgroundImage: ""
          backgroundPosition: center
          backgroundSize: cover
          backgroundScale: 1
          overlayTopOpacity: 0.2
          overlayBottomOpacity: 0.6
          logo: ""
          showLogo: false
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
              fr: "Exportation des banques FMOD depuis l'éditeur Desktop"
              en: Exporting FMOD banks from the Desktop editor
            -
              fr: "Intégration de l'API HTML5 (fmodstudio.wasm/.js)"
              en: "HTML5 API integration (fmodstudio.wasm/.js)"
            -
              fr: "Chargement asynchrone des banques dans le système de fichiers virtuel (Emscripten)"
              en: "Asynchronous loading of banks into the virtual file system (Emscripten)"
            -
              fr: "Contrôle en temps réel des événements et paramètres"
              en: Real-time control of events and parameters
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
        id: fmod-1
        type: fmod
        enabled: true
        variant: default
        placement:
          desktop:
            x: 0
            y: 12
            w: 12
            h: 1
          tablet:
            x: 0
            y: 15
            w: 8
            h: 1
          mobile:
            x: 0
            y: 24
            w: 4
            h: 1
        content:
          title:
            fr: FMOD Player Interactif
            en: FMOD Interactive Player
          description:
            fr: "Testez l'implémentation audio directement dans votre navigateur. Utilisez les curseurs ci-dessous pour modifier les paramètres FMOD en temps réel."
            en: Test the audio implementation directly in your browser. Use the sliders below to modify FMOD parameters in real-time.
          folder: FMOD-BOSS
          banks:
            - Master.bank
            - Master.strings.bank
          events:
            -
              name:
                fr: "Thème du Boss"
                en: Boss Theme
              path: event:/v1
          parameters:
            -
              name: BOSS_HEALTH
              label:
                fr: "Santé du Boss"
                en: Boss Health
              min: 0
              max: 100
              step: 1
              default: 100
            -
              name: PLAYER_HEALTH
              label:
                fr: "Santé du Joueur"
                en: Player Health
              min: 0
              max: 100
              step: 1
              default: 100
            -
              name: is_MobKilled
              label:
                fr: "Mob Tué"
                en: Mob Killed
              min: 0
              max: 1
              step: 1
              default: 0
            -
              name: isSpecial
              label:
                fr: "Spécial"
                en: Special
              min: 0
              max: 1
              step: 1
              default: 0
  accentColor: "#f3522c"
  cards:
    hero: true
    stats: true
    actions: false
    tech: true
    process: true
    gallery: false
    challenges: false
    results: false
    musicLinks: false
    video: false
    spotify: false
    soundcloud: false
    audio: false
    sampler: false
    fmod: true
  stats:
    -
      value: FMOD
      label:
        fr: ENGINE
        en: ENGINE
    -
      value: WEB
      label:
        fr: PLATFORM
        en: PLATFORM
  hero:
    subtitle:
      fr: "Intégration Web FMOD"
      en: FMOD Web Integration
    subtitleColor: "#ff6b00"
    backgroundPosition: center
    backgroundSize: cover
    backgroundScale: 1
    overlayTopOpacity: 0.2
    overlayBottomOpacity: 0.6
    showLogo: false
  process:
    title:
      fr: Processus
      en: Process
    subtitle:
      fr: ""
      en: ""
    steps:
      -
        fr: "Exportation des banques FMOD depuis l'éditeur Desktop"
        en: Exporting FMOD banks from the Desktop editor
      -
        fr: "Intégration de l'API HTML5 (fmodstudio.wasm/.js)"
        en: "HTML5 API integration (fmodstudio.wasm/.js)"
      -
        fr: "Chargement asynchrone des banques dans le système de fichiers virtuel (Emscripten)"
        en: "Asynchronous loading of banks into the virtual file system (Emscripten)"
      -
        fr: "Contrôle en temps réel des événements et paramètres"
        en: Real-time control of events and parameters
  tech:
    title:
      fr: Technologie
      en: Technology
  fmod:
    title:
      fr: FMOD Player Interactif
      en: FMOD Interactive Player
    description:
      fr: "Testez l'implémentation audio directement dans votre navigateur. Utilisez les curseurs ci-dessous pour modifier les paramètres FMOD en temps réel."
      en: Test the audio implementation directly in your browser. Use the sliders below to modify FMOD parameters in real-time.
    folder: FMOD-BOSS
    banks:
      - Master.bank
      - Master.strings.bank
    events:
      -
        name:
          fr: "Thème du Boss"
          en: Boss Theme
        path: event:/v1
    parameters:
      -
        name: BOSS_HEALTH
        label:
          fr: "Santé du Boss"
          en: Boss Health
        min: 0
        max: 100
        step: 1
        default: 100
      -
        name: PLAYER_HEALTH
        label:
          fr: "Santé du Joueur"
          en: Player Health
        min: 0
        max: 100
        step: 1
        default: 100
      -
        name: is_MobKilled
        label:
          fr: "Mob Tué"
          en: Mob Killed
        min: 0
        max: 1
        step: 1
        default: 0
      -
        name: isSpecial
        label:
          fr: "Spécial"
          en: Special
        min: 0
        max: 1
        step: 1
        default: 0
---


# FMOD Web Integration: Boss Demo

This interactive project demonstrates the capabilities of integrating the FMOD runtime engine directly into a modern web portfolio using the HTML5/WebAssembly API.

## Technical Implementation

By leveraging Emscripten and the FMOD Studio Web API, the exact sound banks created in the FMOD Studio desktop application are loaded asynchronously into a virtual file system in the browser. This allows for real-time testing of complex interactive audio systems—such as dynamic health parameters and event triggers—without requiring any game engine or native application running.

