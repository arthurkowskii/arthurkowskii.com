---
title:
  fr: "Mouse-Reloaded"
  en: "Mouse-Reloaded"
altTitle:
  fr: "Mouse-Reloaded"
  en: "Mouse-Reloaded"
description:
  fr: "Mod en cours pour Mouse Pi For Hire. Je contribue sur trois fronts : reverse engineering et réactivation d'armes coupées via BepInEx/Harmony en C#, sound design des nouveaux contenus, et extraction/colorisation de textures."
  en: "Work-in-progress mod for Mouse Pi For Hire. I contribute across three areas: reverse engineering and re-enabling cut weapons via BepInEx/Harmony in C#, sound design for new content, and texture extraction/colorization."
tech: ["Unity", "C#", "BepInEx", "Harmony", "dnSpy", "Reaper", "Affinity", "Git"]
status: "in-progress"
link: "https://www.moddb.com/mods/mouse-reloaded"
date: 2025-03-01
useBentoLayout: true

# Bento Layout Configuration
bento:
  # Accent color theme
  accentColor: "#4a4a6a"
  accentColorDark: "#8a8aaa"

  # Centralized assets folder for hero/logo and gallery images
  assetsFolder: "/src/content/projects/2_Game Audio/Assets_MouseReloaded"

  # Card visibility toggles
  cards:
    hero: true
    stats: true
    musicLinks: false
    video: false
    spotify: false
    audio: false
    sampler: false
    actions: true
    tech: true
    process: true
    gallery: false
    challenges: true
    results: false

  # Tech section configuration
  tech:
    title:
      fr: "Technologie"
      en: "Technology"

  # Hero card configuration
  hero:
    subtitle:
      fr: "Mod pour Mouse Pi For Hire"
      en: "Mod for Mouse Pi For Hire"
    subtitleColor: "#ffffff"
    backgroundPosition: "center"
    backgroundSize: "cover"
    backgroundScale: 1
    overlayTopOpacity: 0.1
    overlayBottomOpacity: 0.4
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
    - value: "Code / Audio / Art"
      label:
        fr: "RÔLE"
        en: "ROLE"

  # Action buttons
  actions:
    title:
      fr: "Liens"
      en: "Links"
    primary:
      text:
        fr: "🎮 Page ModDB"
        en: "🎮 ModDB Page"
      url: "https://www.moddb.com/mods/mouse-reloaded"
    secondary:
      text:
        fr: "🐦 X / Twitter"
        en: "🐦 X / Twitter"
      url: "https://x.com/mousereloaded"

  # Development process
  process:
    title:
      fr: "Processus"
      en: "Process"
    subtitle:
      fr: "Du reverse engineering à l'intégration"
      en: "From reverse engineering to integration"
    steps:
      - fr: "Analyse du code et des prefabs existants avec dnSpy pour identifier les armes et contenus coupés"
        en: "Analysis of existing code and prefabs with dnSpy to identify cut weapons and content"
      - fr: "Réactivation des prefabs oubliés et implémentation des nouvelles fonctionnalités via BepInEx et Harmony en C#"
        en: "Reactivation of forgotten prefabs and implementation of new features via BepInEx and Harmony in C#"
      - fr: "Sound design des nouvelles armes et contenus ajoutés par le mod dans Reaper"
        en: "Sound design for new weapons and content added by the mod in Reaper"
      - fr: "Extraction et colorisation des textures dans Affinity pour les nouveaux contenus visuels"
        en: "Extraction and colorization of textures in Affinity for new visual content"
      - fr: "Versioning et collaboration avec une équipe de 5 personnes sur Git"
        en: "Version control and collaboration with a team of 5 people on Git"

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
      fr: "Modder un jeu existant sans accès aux sources"
      en: "Modding an existing game without source access"
    items:
      - title:
          fr: "Reverse engineering du code"
          en: "Reverse engineering the code"
        description:
          fr: "Utilisation de dnSpy pour naviguer dans l'assembleur C# du jeu, comprendre l'architecture des armes et identifier les prefabs désactivés ou inutilisés."
          en: "Using dnSpy to navigate the game's C# assembly, understand weapon architecture, and identify disabled or unused prefabs."
      - title:
          fr: "Patching propre avec Harmony"
          en: "Clean patching with Harmony"
        description:
          fr: "Écriture de patches non-destructifs via BepInEx et Harmony pour réactiver du contenu et ajouter de nouvelles fonctionnalités sans casser la base du jeu."
          en: "Writing non-destructive patches via BepInEx and Harmony to reactivate content and add new features without breaking the game base."
      - title:
          fr: "Pipeline audio et visuelle cohérente"
          en: "Consistent audio and visual pipeline"
        description:
          fr: "Assurer la cohérence entre les nouvelles textures colorisées, les armes réactivées et le sound design pour que les ajouts se fondent dans l'expérience originale."
          en: "Ensuring consistency between colorized textures, reactivated weapons, and sound design so additions blend into the original experience."
---

# Mouse-Reloaded

Work-in-progress mod for Mouse Pi For Hire. The project combines reverse engineering, C# tooling, sound design, and texture work to restore cut content and add new features.

## Project Overview

Mouse-Reloaded is a team effort to expand Mouse Pi For Hire. My contributions span three areas: reactivating forgotten weapon prefabs through C# modding with BepInEx and Harmony, designing sound for the added content, and extracting/colorizing textures to support the new visual assets.

## Technical Approach

- **Reverse Engineering**: dnSpy to inspect the game's C# assembly and locate cut content
- **Modding Framework**: BepInEx + Harmony for runtime patching
- **Audio**: Reaper for sound design and asset preparation
- **Visuals**: Affinity for texture extraction and colorization
- **Collaboration**: Git-based workflow with a 5-person team
