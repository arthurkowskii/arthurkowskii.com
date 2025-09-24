---
title:
  fr: "Sound ReDesign : Heroes of Might and Magic VI"
  en: "Sound ReDesign : Heroes of Might and Magic VI"
altTitle:
  fr: "Heroes VI Redesign"
  en: "Heroes VI Redesign"
description:
  fr: "Recréation de la musique et du sound design du trailer de Heroes of Might and Magic VI dans le cadre d'un projet d'étude. Contraintes : une orchestration traditionnelle, sans synthés, guitares ni aucun instrument moderne."
  en: "Recreation of the music and sound design for the Heroes of Might and Magic VI trailer as a study project. Constraints: traditional orchestration only, no synths, guitars or modern instruments."
tech: ["Reaper", "Phase Plant"]
status: "completed"
link: "https://kubika.itch.io/kubika-a-cube-story"
date: 2024-03-15
useBentoLayout: true

# Bento Layout Configuration
bento:
  # Accent color theme
  accentColor: "#e50000"
  
  # Centralized assets folder for hero/logo and gallery images
  assetsFolder: "/src/content/projects/2_Game Audio/Assets_Heroes"
  
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

  # Tech section configuration
  tech:
    title:
      fr: "Technologie"
      en: "Technology"
  
  # Hero card configuration
  hero:
    subtitle:
      fr: "Musique et Sound Design"
      en: "Music and Sound Design"
    subtitleColor: "#e50000"
    backgroundPosition: "center"
    backgroundSize: "cover"
    backgroundScale: 1  # Alternative to backgroundSize - use 1.1, 0.9, etc.
    overlayTopOpacity: 0.1   # Controls dark overlay opacity at top (0.0 = transparent, 1.0 = opaque)
    overlayBottomOpacity: 0.55 # Controls dark overlay opacity at bottom (0.0 = transparent, 1.0 = opaque)
    showLogo: false
  
  # Project stats
  stats:
    - value: "2 Weeks"
      label: "DURATION"
    - value: "1 👨‍👩‍👦‍👦"
      label: "TEAM SIZE"
    - value : "VIDEO"
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
        fr: "📽️ Voir le trailer complet refait"
        en: "📽️ Watch the Full Trailer Remake"
      url: "https://youtu.be/OK9EgEImmZc?si=dzKnXIHsKYrMNpUF"
    secondary:
      text:
        fr: "Trailer original d'Ubisoft"
        en: "Original Trailer from Ubisoft"
      url: "https://youtu.be/IHwRdqbSQdM?si=GAwNMfhBCVJjL63F"

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
      en: "From concept to delivery"
    steps:
      - fr: "Conception des SFX avec PhasePlant et Reaper"
        en: "SFX design with PhasePlant and Reaper"
      - fr: "Conception d'une banque de son en relation avec le projet"
        en: "Creating a project-specific sound library"
      - fr: "Composition de la musique sous les contraintes de DA : instrument fantasiste, cordes... pas de synthé. pas d'instruments modernes."
        en: "Music composition under art direction constraints: fantasy instruments, strings... no synths or modern instruments."
      - fr: "Assemblage de la musique et des SFX dans Reaper directement"
        en: "Music and SFX assembly directly in Reaper"
      - fr: "Mixage et Mastering en respectant les normes de rendus"
        en: "Mixing and mastering following delivery standards"
  
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
          fr: "Composition dans un style \"traditionnel\""
          en: "Composing in a \"traditional\" style"
        description:
          fr: "Le principal défi de ce projet était de composer en respectant une orchestration strictement traditionnelle, excluant tout instrument moderne (guitare, synthé…). Bien que ce cadre soit éloigné de mes habitudes de création, davantage tournées vers l'électronique, ce challenge s'est révélé particulièrement stimulant et enrichissant."
          en: "The main challenge of this project was composing while respecting strictly traditional orchestration, excluding all modern instruments (guitar, synth...). Although this framework is far from my usual creative habits, which lean more toward electronic music, this challenge proved particularly stimulating and enriching."
      - title:
          fr: "De la synthèse... partout."
          en: "Synthesis... everywhere."
        description:
          fr: "J'ai voulu profiter de ce projet pour explorer la synthèse utilisant Phase Plant pour créer la plupart des sons comme le golem, l'épée, pierre magique, ailes en feu, etc... Ce choix m'a demandé pas mal d'expérimentations, mais il s'est avéré très formateur et a surtout intégré phase plant dans mes habitudes presques quotidiennes. Des démos des sons avec leurs patchs Phase Plant sont disponibles dans la galerie"
          en: "I wanted to take advantage of this project to explore synthesis using Phase Plant to create most of the sounds like the golem, sword, magic stone, fire wings, etc... This choice required quite a bit of experimentation, but it proved very educational and above all integrated Phase Plant into my almost daily habits. Sound demos with their Phase Plant patches are available in the gallery"

  # Results and impact
  results:
    title:
      fr: "Résultats"
      en: "Results"
    subtitle:
      fr: "Résultats obtenus à l'issu de ce projet"
      en: "Results achieved from this project"
    items:
      - icon: "🎬"
        text:
          fr: "1m20 de musique dans un style fantastique avec orchestre et voix soprano"
          en: "1m20 of fantasy-style music with orchestra and soprano voice"
      - icon: "🔉"
        text:
          fr: "Des SFX créés entièrement pour ce projet avec Phase Plant et Reaper"
          en: "SFX created entirely for this project with Phase Plant and Reaper"
---

# Sound ReDesign: Heroes of Might and Magic VI

Complete music and sound design recreation of the Heroes of Might and Magic VI trailer as an academic project, following strict traditional orchestration constraints without modern instruments.

## Project Overview

This project challenged me to step outside my electronic music comfort zone and create a fantasy soundtrack using only traditional orchestral instruments. The goal was to recreate the epic feel of Ubisoft's original trailer while respecting academic constraints that excluded synthesizers, guitars, and any modern instrumentation.

## Technical Achievements

- **Traditional Orchestration**: Complete score using only fantasy instruments and classical orchestration
- **Phase Plant Integration**: Extensive use of synthesis for SFX creation (golem, sword, magic stones, fire wings)
- **Project-Specific Sound Library**: Custom sound bank designed specifically for the fantasy setting
- **1m20 Original Score**: Full orchestral composition with soprano vocals
- **Professional Delivery Standards**: Mixing and mastering following industry specifications

## Recognition

- Successfully demonstrated versatility across musical genres and production techniques
- Integrated new synthesis workflow that became part of daily creative practice
- Phase Plant patch library available as educational resource
