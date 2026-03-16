---
title:
  fr: "Sound ReDesign : Heroes of Might and Magic VI"
  en: "Sound ReDesign : Heroes of Might and Magic VI"
altTitle:
  fr: Heroes VI Redesign
  en: Heroes VI Redesign
description:
  fr: "Recréation de la musique et du sound design du trailer de Heroes of Might and Magic VI dans le cadre d'un projet d'étude. Contraintes : une orchestration traditionnelle, sans synthés, guitares ni aucun instrument moderne."
  en: "Recreation of the music and sound design for the Heroes of Might and Magic VI trailer as a study project. Constraints: traditional orchestration only, no synths, guitars or modern instruments."
tech:
  - Reaper
  - Phase Plant
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
            fr: Musique et Sound Design
            en: Music and Sound Design
          subtitleColor: "#e50000"
          backgroundImage: ""
          backgroundPosition: center
          backgroundSize: cover
          backgroundScale: 1
          overlayTopOpacity: 0.1
          overlayBottomOpacity: 0.55
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
            fr: Liens
            en: Links
          primary:
            text:
              fr: "📽️ Voir le trailer complet refait"
              en: "📽️ Watch the Full Trailer Remake"
            url: "https://youtu.be/OK9EgEImmZc?si=dzKnXIHsKYrMNpUF"
          secondary:
            text:
              fr: "Trailer original d'Ubisoft"
              en: Original Trailer from Ubisoft
            url: "https://youtu.be/IHwRdqbSQdM?si=GAwNMfhBCVJjL63F"
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
            en: From concept to delivery
          steps:
            -
              fr: Conception des SFX avec PhasePlant et Reaper
              en: SFX design with PhasePlant and Reaper
            -
              fr: "Conception d'une banque de sons en relation avec le projet"
              en: Creating a project-specific sound library
            -
              fr: "Composition de la musique sous les contraintes de DA : instrument fantaisiste, cordes... Pas de synthé. Pas d'instruments modernes."
              en: "Music composition under art direction constraints: fantasy instruments, strings... no synths or modern instruments."
            -
              fr: Assemblage de la musique et des SFX dans Reaper directement
              en: Music and SFX assembly directly in Reaper
            -
              fr: Mixage et Mastering en respectant les normes de rendus
              en: Mixing and mastering following delivery standards
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
              value: 2 Weeks
              label:
                fr: DURATION
                en: DURATION
            -
              value: "1 👨‍👩‍👦‍👦"
              label:
                fr: TEAM SIZE
                en: TEAM SIZE
            -
              value: VIDEO
              label:
                fr: PLATFORM
                en: PLATFORM
            -
              value: ISART
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
            fr: "Résultats obtenus à l'issue de ce projet"
            en: Results achieved from this project
          items:
            -
              icon: "🎬"
              text:
                fr: 1m20 de musique dans un style fantastique avec orchestre et voix soprano
                en: 1m20 of fantasy-style music with orchestra and soprano voice
            -
              icon: "🔉"
              text:
                fr: "Des SFX créés entièrement pour ce projet avec Phase Plant et Reaper"
                en: SFX created entirely for this project with Phase Plant and Reaper
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
                fr: "Composition dans un style \"traditionnel\""
                en: "Composing in a \"traditional\" style"
              description:
                fr: "Le principal défi de ce projet était de composer en respectant une orchestration strictement traditionnelle, excluant tout instrument moderne (guitare, synthé…). Bien que ce cadre soit éloigné de mes habitudes de création, davantage tournées vers l'électronique, ce challenge s'est révélé particulièrement stimulant et enrichissant."
                en: "The main challenge of this project was composing while respecting strictly traditional orchestration, excluding all modern instruments (guitar, synth...). Although this framework is far from my usual creative habits, which lean more toward electronic music, this challenge proved particularly stimulating and enriching."
            -
              title:
                fr: "De la synthèse... partout."
                en: Synthesis... everywhere.
              description:
                fr: "J'ai voulu profiter de ce projet pour explorer la synthèse utilisant Phase Plant pour créer la plupart des sons comme le golem, l'épée, pierre magique, ailes en feu, etc... Ce choix m'a demandé pas mal d'expérimentations, mais il s'est avéré très formateur et a surtout intégré phase plant dans mes habitudes presque quotidiennes. Des démos des sons avec leurs patchs Phase Plant sont disponibles dans la galerie"
                en: "I wanted to take advantage of this project to explore synthesis using Phase Plant to create most of the sounds like the golem, sword, magic stone, fire wings, etc... This choice required quite a bit of experimentation, but it proved very educational and above all integrated Phase Plant into my almost daily habits. Sound demos with their Phase Plant patches are available in the gallery"
  accentColor: "#e50000"
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
    sampler: false
    fmod: false
  hero:
    subtitle:
      fr: Musique et Sound Design
      en: Music and Sound Design
    subtitleColor: "#e50000"
    backgroundPosition: center
    backgroundSize: cover
    backgroundScale: 1
    overlayTopOpacity: 0.1
    overlayBottomOpacity: 0.55
    showLogo: false
  actions:
    title:
      fr: Liens
      en: Links
    primary:
      text:
        fr: "📽️ Voir le trailer complet refait"
        en: "📽️ Watch the Full Trailer Remake"
      url: "https://youtu.be/OK9EgEImmZc?si=dzKnXIHsKYrMNpUF"
    secondary:
      text:
        fr: "Trailer original d'Ubisoft"
        en: Original Trailer from Ubisoft
      url: "https://youtu.be/IHwRdqbSQdM?si=GAwNMfhBCVJjL63F"
  process:
    title:
      fr: Processus
      en: Process
    subtitle:
      fr: "Du concept à la livraison"
      en: From concept to delivery
    steps:
      -
        fr: Conception des SFX avec PhasePlant et Reaper
        en: SFX design with PhasePlant and Reaper
      -
        fr: "Conception d'une banque de sons en relation avec le projet"
        en: Creating a project-specific sound library
      -
        fr: "Composition de la musique sous les contraintes de DA : instrument fantaisiste, cordes... Pas de synthé. Pas d'instruments modernes."
        en: "Music composition under art direction constraints: fantasy instruments, strings... no synths or modern instruments."
      -
        fr: Assemblage de la musique et des SFX dans Reaper directement
        en: Music and SFX assembly directly in Reaper
      -
        fr: Mixage et Mastering en respectant les normes de rendus
        en: Mixing and mastering following delivery standards
  gallery:
    title:
      fr: Galerie
      en: Gallery
    images: []
  assetsFolder: /src/content/projects/2_Game Audio/Assets_Heroes
  stats:
    -
      value: 2 Weeks
      label:
        fr: DURATION
        en: DURATION
    -
      value: "1 👨‍👩‍👦‍👦"
      label:
        fr: TEAM SIZE
        en: TEAM SIZE
    -
      value: VIDEO
      label:
        fr: PLATFORM
        en: PLATFORM
    -
      value: ISART
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
  results:
    title:
      fr: "Résultats"
      en: Results
    subtitle:
      fr: "Résultats obtenus à l'issue de ce projet"
      en: Results achieved from this project
    items:
      -
        icon: "🎬"
        text:
          fr: 1m20 de musique dans un style fantastique avec orchestre et voix soprano
          en: 1m20 of fantasy-style music with orchestra and soprano voice
      -
        icon: "🔉"
        text:
          fr: "Des SFX créés entièrement pour ce projet avec Phase Plant et Reaper"
          en: SFX created entirely for this project with Phase Plant and Reaper
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
          fr: "Composition dans un style \"traditionnel\""
          en: "Composing in a \"traditional\" style"
        description:
          fr: "Le principal défi de ce projet était de composer en respectant une orchestration strictement traditionnelle, excluant tout instrument moderne (guitare, synthé…). Bien que ce cadre soit éloigné de mes habitudes de création, davantage tournées vers l'électronique, ce challenge s'est révélé particulièrement stimulant et enrichissant."
          en: "The main challenge of this project was composing while respecting strictly traditional orchestration, excluding all modern instruments (guitar, synth...). Although this framework is far from my usual creative habits, which lean more toward electronic music, this challenge proved particularly stimulating and enriching."
      -
        title:
          fr: "De la synthèse... partout."
          en: Synthesis... everywhere.
        description:
          fr: "J'ai voulu profiter de ce projet pour explorer la synthèse utilisant Phase Plant pour créer la plupart des sons comme le golem, l'épée, pierre magique, ailes en feu, etc... Ce choix m'a demandé pas mal d'expérimentations, mais il s'est avéré très formateur et a surtout intégré phase plant dans mes habitudes presque quotidiennes. Des démos des sons avec leurs patchs Phase Plant sont disponibles dans la galerie"
          en: "I wanted to take advantage of this project to explore synthesis using Phase Plant to create most of the sounds like the golem, sword, magic stone, fire wings, etc... This choice required quite a bit of experimentation, but it proved very educational and above all integrated Phase Plant into my almost daily habits. Sound demos with their Phase Plant patches are available in the gallery"
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

