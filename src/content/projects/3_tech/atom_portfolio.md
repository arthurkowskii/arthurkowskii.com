---
title:
  fr: "Atom Portfolio - Portfolio Interactif"
  en: "Atom Portfolio - Interactive Portfolio"
altTitle:
  fr: "Atom Portfolio"
  en: "Atom Portfolio"
description:
  fr: "Portfolio personnel d'Arthur Kowskii, développé avec Astro, GSAP et une architecture atomique innovante durant l'été 2025. Une expérience web immersive où les projets gravitent autour d'un noyau central, créant une navigation unique et mémorable."
  en: "Arthur Kowskii's personal portfolio, developed with Astro, GSAP and an innovative atomic architecture during summer 2025. An immersive web experience where projects orbit around a central nucleus, creating a unique and memorable navigation."
tech: ["Astro", "GSAP", "JavaScript", "Tone.js"]
status: "completed"
link: "https://arthurkowskii.com"
github: "https://github.com/arthurkowskii/arthurkowskii.com"
date: 2024-09-19
useBentoLayout: true

# Bento Layout Configuration
bento:
  # Accent color theme
  accentColor: "#00ff88"
  accentColorDark: "#00ff88"

  # Centralized assets folder
  assetsFolder: "/src/content/projects/3_tech/Atom_Assets"

  # Card visibility toggles
  cards:
    hero: true
    stats: true
    musicLinks: false
    video: false
    spotify: false
    soundcloud: false
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
      fr: "Portfolio Personnel Interactif - 2024"
      en: "Interactive Personal Portfolio - 2024"
    subtitleColor: "#00ff88"
    backgroundPosition: "center"
    backgroundSize: "cover"
    overlayTopOpacity: 0.2
    overlayBottomOpacity: 0.5
    showLogo: false

  # Project stats
  stats:
    - value: "4 Mois"
      label:
        fr: "DÉVELOPPEMENT"
        en: "DEVELOPMENT"
    - value: "9 Projets"
      label:
        fr: "PRÉSENTÉS"
        en: "SHOWCASED"
    - value: "91%"
      label:
        fr: "OPTIMISATION"
        en: "OPTIMIZATION"
    - value: "2 Langues"
      label:
        fr: "FR/EN"
        en: "FR/EN"

  # Action buttons
  actions:
    title:
      fr: "Liens"
      en: "Links"
    primary:
      text:
        fr: "📦 Voir sur GitHub"
        en: "📦 View on GitHub"
      url: "https://github.com/arthurkowskii/arthurkowskii.com"
    secondary:
      text:
        fr: "🌍 Voir le Site Live"
        en: "🌍 View Live Site"
      url: "https://arthurkowskii.com"

  # Development process
  process:
    title:
      fr: "Processus de Création"
      en: "Development Process"
    subtitle:
      fr: "De la conception à la mise en ligne"
      en: "From concept to deployment"
    steps:
      - fr: "Conceptualisation de la métaphore atomique : le noyau me représente, et les différentes couches énergétiques les domaines qui m'animent. Sur ces domaines des électrons cliquables (et bougeables !) représentent différents projets de leurs domaines respectifs."
        en: "Conceptualizing the atomic metaphor: the nucleus represents me, and the different energy layers represent the domains that drive me. On these domains, clickable (and draggable!) electrons represent different projects from their respective domains"
      - fr: "Développement du système orbital avec GSAP, calcul des positions avec évitement de collision, et animations de hover interactives"
        en: "Developing the orbital system with GSAP, calculating positions with collision avoidance, and interactive hover animations"
      - fr: "Implémentation du système d'overlay circulaire pour la présentation détaillée des projets avec transitions fluides"
        en: "Implementing the circular overlay system for detailed project presentation with smooth transitions"
      - fr: "Design visuel : inspiration bento pour les pages projet/bio, approche minimaliste pour les électrons, et fonctionnalités d'accessibilité (mode sombre/clair, filtrage par domaine avec mise en évidence)"
        en: "Visual design: bento inspiration for project/bio pages, minimalist approach for electrons, and accessibility features (dark/light mode, domain filtering with highlighting)"
      - fr: "Ajout du système bilingue complet et résolution des problèmes de compatibilité Firefox"
        en: "Adding complete bilingual system and resolving Firefox compatibility issues"

  # Technical challenges
  challenges:
    title:
      fr: "Défis Techniques Majeurs"
      en: "Major Technical Challenges"
    subtitle:
      fr: "Les innovations clés du développement initial"
      en: "Key innovations from early development"
    items:
      - title:
          fr: "Système de Drag & Drop avec Physique"
          en: "Drag & Drop Physics System"
        description:
          fr: "Implémentation d'un système de glisser-déposer réaliste pour les électrons tout en maintenant leur mouvement orbital. Création d'animations de retour élastique, gestion des collisions pendant le déplacement, et synchronisation avec le système d'orbite GSAP pour une expérience fluide et intuitive."
          en: "Implementing a realistic drag-and-drop system for electrons while maintaining their orbital motion. Creating elastic snap-back animations, handling collisions during movement, and synchronizing with the GSAP orbit system for a smooth and intuitive experience."
      - title:
          fr: "Génération Dynamique des Shells depuis la Structure de Fichiers"
          en: "Dynamic Shell Generation from File Structure"
        description:
          fr: "Création d'un système qui génère automatiquement les shells à partir de la structure des dossiers. Détection des domaines via les préfixes numériques, attribution dynamique des noms, et adaptation visuelle en temps réel. Maximum de 5 shells avec gestion élégante du surplus."
          en: "Creating a system that automatically generates shells from folder structure. Domain detection via numeric prefixes, dynamic naming assignment, and real-time visual adaptation. Maximum of 5 shells with elegant overflow handling."
      - title:
          fr: "Système d'Overlay avec Transition Circulaire"
          en: "Circular Overlay Transition System"
        description:
          fr: "Développement d'une expérience one-page innovante avec expansion circulaire depuis la position de l'électron cliqué. Utilisation de clip-path CSS pour l'effet de masque, calcul précis du point d'origine, et gestion fluide des transitions sans changement de route."
          en: "Developing an innovative one-page experience with circular expansion from the clicked electron's position. Using CSS clip-path for the mask effect, precise origin point calculation, and smooth transition management without route changes."

  # Results and impact
  results:
    title:
      fr: "Résultats & Impact"
      en: "Results & Impact"
    subtitle:
      fr: "Ce qui rend ce portfolio unique"
      en: "What makes this portfolio unique"
    items:
      - icon: "🎯"
        text:
          fr: "Un portfolio véritablement unique qui marque les esprits par son approche interactive"
          en: "A truly unique portfolio that leaves a lasting impression through its interactive approach"
      - icon: "⚡"
        text:
          fr: "Expérience fluide en one-page avec navigation instantanée entre les projets"
          en: "Smooth one-page experience with instant navigation between projects"
      - icon: "🌐"
        text:
          fr: "Hub centralisé pour contact professionnel et téléchargement direct du CV"
          en: "Centralized hub for professional contact and direct CV download"
      - icon: "🚀"
        text:
          fr: "Performance optimale avec 91% de réduction des assets et animations à 60fps constant"
          en: "Optimal performance with 91% asset reduction and constant 60fps animations"
      - icon: "📱"
        text:
          fr: "Expérience responsive avec message personnalisé pour visiteurs mobiles"
          en: "Responsive experience with personalized message for mobile visitors"
      - icon: "🎨"
        text:
          fr: "Interface mémorable qui reflète créativité et compétences techniques"
          en: "Memorable interface that reflects both creativity and technical skills"
---

# Atom Portfolio

An innovative interactive portfolio showcasing creative work through an atomic interface metaphor, where projects orbit as electrons around a central nucleus.