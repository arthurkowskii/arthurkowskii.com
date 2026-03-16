---
title:
  fr: Starting_Grid_for_Reaper Script
  en: Starting_Grid_for_Reaper Script
altTitle:
  fr: Starting Grid for Reaper
  en: Starting Grid for Reaper
description:
  fr: "Starting Grid for Reaper est un script qui prend tous vos items sélectionnés (peu importe le type) et qui les place au début de leurs pistes. Le script fonctionne avec tous les types d'items supportés par Reaper et est destiné aux longues sessions de sampling qui résultent souvent en une multitude de samples éparpillés sur une longue durée."
  en: "Starting Grid for Reaper is a script that takes all your selected items (regardless of type) and places them at the beginning of their tracks. The script works with all item types supported by Reaper and is intended for long sampling sessions that often result in a multitude of samples scattered over a long duration."
tech:
  - Lua
  - Reascript
status: completed
link: https://github.com/arthurkowskii/StartingGrid_for_Reaper
github: https://github.com/arthurkowskii/StartingGrid_for_Reaper
date: 2024-08-22
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
            fr: Lua script for Reaper
            en: Lua script for Reaper
          subtitleColor: "#2666ec"
          backgroundImage: ""
          backgroundPosition: center
          backgroundSize: cover
          backgroundScale: 1
          overlayTopOpacity: 0
          overlayBottomOpacity: 0.5
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
            fr: "Expérience"
            en: Experience
          primary:
            text:
              fr: "🛒 Télécharger à prix libre sur Gumroad"
              en: "🛒 Download with pay-what-you-want on Gumroad"
            url: https://arthurkowskii.gumroad.com/
          secondary:
            text:
              fr: "🗃️ Voir le projet sur GitHub"
              en: "🗃️ View project on GitHub"
            url: https://github.com/arthurkowskii/StartingGrid_for_Reaper
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
            fr: "Guide d'Utilisation"
            en: User Guide
          subtitle:
            fr: ""
            en: ""
          steps:
            -
              fr: "Sélectionner les items, (quel que soit le type)"
              en: "Select the items (of any type)"
            -
              fr: "Enclencher le script depuis le menu Actions \"?\" ou par raccourci"
              en: "Run the script from the Actions \"?\" menu or by shortcut"
            -
              fr: "Les items sont maintenant rangés au début de leurs pistes !"
              en: "The items are now arranged at the beginning of their tracks!"
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
              value: Lua
              label:
                fr: LANGUAGE
                en: LANGUAGE
            -
              value: "0€+"
              label:
                fr: PRICE
                en: PRICE
            -
              value: Reaper
              label:
                fr: PLATFORM
                en: PLATFORM
            -
              value: Kowskii
              label:
                fr: CREATOR
                en: CREATOR
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
              url: "https://youtu.be/6aKB7nFtJQo?si=a0XfJuEDsXJyw6F2"
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
            fr: "Fonctionnalités"
            en: Features
          subtitle:
            fr: ""
            en: ""
          items:
            -
              icon: "✅"
              text:
                fr: "Fonctionne avec tous les types d'items supportés par Reaper"
                en: Works with all item types supported by Reaper
            -
              icon: "⚡"
              text:
                fr: "Temps de réponse immédiat"
                en: Immediate response time
            -
              icon: "🐦"
              text:
                fr: "Léger, rapide et efficace"
                en: "Lightweight, fast and efficient"
            -
              icon: "💸"
              text:
                fr: "Gratuit ! (pas cher)"
                en: "Free! (not expensive)"
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
            fr: "Défis techniques"
            en: Technical Challenges
          subtitle:
            fr: ""
            en: ""
          items:
            -
              title:
                fr: Embouteillages
                en: Item collisions
              description:
                fr: "Anticipation en cas d'item déjà existant au début d'une piste; Dans ce cas, l'item sélectionné se mettra collé à la suite de celui-ci"
                en: "Handling cases where an item already exists at the beginning of a track; In this case, the selected item will be placed immediately after it"
            -
              title:
                fr: "Sélection multiple"
                en: Multiple selection
              description:
                fr: "En cas de sélection de plusieurs items appartenant à la même piste, ceux-ci vont se positionner de façon séquentielle en respectant l'ordre d'origine."
                en: "When selecting multiple items from the same track, they will be positioned sequentially while respecting the original order."
  accentColor: "#b50606"
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
      fr: Lua script for Reaper
      en: Lua script for Reaper
    subtitleColor: "#2666ec"
    backgroundPosition: center
    backgroundSize: cover
    backgroundScale: 1
    overlayTopOpacity: 0
    overlayBottomOpacity: 0.5
    showLogo: false
  actions:
    title:
      fr: "Expérience"
      en: Experience
    primary:
      text:
        fr: "🛒 Télécharger à prix libre sur Gumroad"
        en: "🛒 Download with pay-what-you-want on Gumroad"
      url: https://arthurkowskii.gumroad.com/
    secondary:
      text:
        fr: "🗃️ Voir le projet sur GitHub"
        en: "🗃️ View project on GitHub"
      url: https://github.com/arthurkowskii/StartingGrid_for_Reaper
  process:
    title:
      fr: "Guide d'Utilisation"
      en: User Guide
    subtitle:
      fr: ""
      en: ""
    steps:
      -
        fr: "Sélectionner les items, (quel que soit le type)"
        en: "Select the items (of any type)"
      -
        fr: "Enclencher le script depuis le menu Actions \"?\" ou par raccourci"
        en: "Run the script from the Actions \"?\" menu or by shortcut"
      -
        fr: "Les items sont maintenant rangés au début de leurs pistes !"
        en: "The items are now arranged at the beginning of their tracks!"
  gallery:
    title:
      fr: Galerie
      en: Gallery
    images: []
  assetsFolder: /src/content/projects/3_tech/Assets_sg
  stats:
    -
      value: Lua
      label:
        fr: LANGUAGE
        en: LANGUAGE
    -
      value: "0€+"
      label:
        fr: PRICE
        en: PRICE
    -
      value: Reaper
      label:
        fr: PLATFORM
        en: PLATFORM
    -
      value: Kowskii
      label:
        fr: CREATOR
        en: CREATOR
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
        url: "https://youtu.be/6aKB7nFtJQo?si=a0XfJuEDsXJyw6F2"
  results:
    title:
      fr: "Fonctionnalités"
      en: Features
    subtitle:
      fr: ""
      en: ""
    items:
      -
        icon: "✅"
        text:
          fr: "Fonctionne avec tous les types d'items supportés par Reaper"
          en: Works with all item types supported by Reaper
      -
        icon: "⚡"
        text:
          fr: "Temps de réponse immédiat"
          en: Immediate response time
      -
        icon: "🐦"
        text:
          fr: "Léger, rapide et efficace"
          en: "Lightweight, fast and efficient"
      -
        icon: "💸"
        text:
          fr: "Gratuit ! (pas cher)"
          en: "Free! (not expensive)"
  tech:
    title:
      fr: Technologie
      en: Technology
  challenges:
    title:
      fr: "Défis techniques"
      en: Technical Challenges
    subtitle:
      fr: ""
      en: ""
    items:
      -
        title:
          fr: Embouteillages
          en: Item collisions
        description:
          fr: "Anticipation en cas d'item déjà existant au début d'une piste; Dans ce cas, l'item sélectionné se mettra collé à la suite de celui-ci"
          en: "Handling cases where an item already exists at the beginning of a track; In this case, the selected item will be placed immediately after it"
      -
        title:
          fr: "Sélection multiple"
          en: Multiple selection
        description:
          fr: "En cas de sélection de plusieurs items appartenant à la même piste, ceux-ci vont se positionner de façon séquentielle en respectant l'ordre d'origine."
          en: "When selecting multiple items from the same track, they will be positioned sequentially while respecting the original order."
---


# Starting_Grid for Reaper

Un outil indispensable pour les sessions de sampling intensives, permettant de réorganiser instantanément des centaines d'items au début de leurs pistes respectives pour un workflow propre et efficace.

