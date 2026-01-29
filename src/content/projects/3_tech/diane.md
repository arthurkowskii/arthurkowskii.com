---
title:
  fr: "D.IA.NE - Tuteur IA Personnel"
  en: "D.IA.NE - Personal AI Tutor"
altTitle:
  fr: "D.IA.NE"
  en: "D.IA.NE"
description:
  fr: "Un écosystème éducatif propulsé par D.IA.NE. Basé sur l'étude Harvard 'PS2 PAL', il vise à décupler l'apprentissage sans nuire aux capacités cognitives, à l'opposé des solutions passives comme ChatGPT. D.IA.NE structure le travail, gère l'agenda et adapte sa pédagogie du collège au doctorat. J'assure le développement full stack du projet."
  en: "An educational ecosystem powered by D.IA.NE. Based on Harvard's 'PS2 PAL' study, it aims to boost learning without bypassing cognitive abilities—unlike passive tools like ChatGPT. D.IA.NE structures workflows, manages schedules, and adapts its pedagogy from middle school to PhD levels. I am responsible for the full-stack development of the project."
tech: ["Next.js", "TypeScript", "React"]
status: "in-progress"
link: "https://moncartable.app"
date: 2025-12-20
useBentoLayout: true

# Bento Layout Configuration
bento:
  # Accent color theme (AI Violet)
  accentColor: "#8b5cf6"
  accentColorDark: "#8b5cf6"

  # Centralized assets folder
  assetsFolder: "/src/content/projects/3_tech/Diane_Assets"

  # Card visibility toggles
  cards:
    hero: true
    stats: true
    musicLinks: false
    video: false
    spotify: false
    soundcloud: false
    audio: false
    actions: true
    tech: true
    process: true
    gallery: true
    challenges: true
    results: true

  # Tech section configuration
  tech:
    title:
      fr: "Stack Technique"
      en: "Tech Stack"

  # Hero card configuration
  hero:
    subtitle:
      fr: "L'Intelligence Artificielle Pédagogique - 2026"
      en: "The Pedagogical Artificial Intelligence - 2026"
    subtitleColor: "#8b5cf6"
    backgroundPosition: "center"
    backgroundSize: "cover"
    overlayTopOpacity: 0.3
    overlayBottomOpacity: 0.6
    showLogo: false

  # Project stats
  stats:
    - value: "1 Mois"
      label:
        fr: "DÉVELOPPEMENT"
        en: "DEVELOPMENT"
    - value: "20 Users"
      label:
        fr: "BETA PRIVÉE"
        en: "PRIVATE BETA"
    - value: "6e -> PhD"
      label:
        fr: "NIVEAUX"
        en: "LEVELS"
    - value: "Desktop"
      label:
        fr: "PLATEFORME"
        en: "PLATFORM"

  # Action buttons
  actions:
    title:
      fr: "Accès"
      en: "Access"
    primary:
      text:
        fr: "🚀 Voir le Site Live"
        en: "🚀 View Live Site"
      url: "https://moncartable.app"
    # Secondary removed as repo is private
    secondary:
      text:
        fr: "🔐 Repo Privé"
        en: "🔐 Private Repo"
      url: "#"

  # Development process
  process:
    title:
      fr: "Histoire du Projet"
      en: "Project History"
    subtitle:
      fr: "D'un besoin personnel à une solution universelle"
      en: "From personal need to universal solution"
    steps:
      - fr: "Origine : Développement initial pour aider mon frère TDAH à s'organiser au lycée. L'objectif était de réduire la charge mentale et structurer la prise de notes."
        en: "Origin: Initially developed to help my ADHD brother organize himself in high school. The goal was to reduce cognitive load and structure note-taking."
      - fr: "Phase Core : Construction de l'architecture React/TypeScript robuste pour gérer l'agenda intelligent, les tâches et les sessions de travail focus."
        en: "Core Phase: Building a robust React/TypeScript architecture to manage the intelligent agenda, tasks, and focus work sessions."
      - fr: "Orchestration IA : Implémentation du système 'Dual AI' combinant l'intelligence contextuelle de Gemini avec la puissance de recherche de Sonar."
        en: "AI Orchestration: Implementing the 'Dual AI' system combining Gemini's contextual intelligence with Sonar's research power."
      - fr: "État Actuel : Beta test active avec 20 utilisateurs pour affiner les modèles pédagogiques et l'expérience utilisateur."
        en: "Current State: Active beta testing with 20 users to refine pedagogical models and user experience."

  # Technical challenges
  challenges:
    title:
      fr: "Défis Techniques"
      en: "Technical Challenges"
    subtitle:
      fr: "Au-delà d'un simple wrapper GPT"
      en: "Beyond a simple GPT wrapper"
    items:
      - title:
          fr: "Orchestration 'Dual AI' & Sync"
          en: "'Dual AI' Orchestration & Sync"
        description:
          fr: "Synchronisation complexe entre deux cerveaux IA : Gemini pour le contexte émotionnel/pédagogique et Sonar pour la recherche factuelle. Gestion de latence et fusion des réponses pour une expérience fluide."
          en: "Complex synchronization between two AI brains: Gemini for emotional/pedagogical context and Sonar for factual research. Latency management and response merging for a fluid experience."
      - title:
          fr: "Injection de Contexte & Persona"
          en: "Context Injection & Persona System"
        description:
          fr: "Développement d'un système qui nourrit l'IA avec le contexte de l'élève (Agenda, Notes, Tâches) en temps réel. Création de personas adaptatifs qui changent de ton selon le niveau scolaire (6ème vs Doctorat)."
          en: "Developing a system that feeds the AI with student context (Agenda, Notes, Tasks) in real time. Creating adaptive personas that shift tone based on academic level (6th grade vs PhD)."
      - title:
          fr: "Système de Sources par Tiers"
          en: "Tiered Source System"
        description:
          fr: "Algorithme de filtrage pour minimiser les hallucinations. Priorisation des sources académiques (Tiers 1) sur les sources éducatives (Tiers 2) et générales (Tiers 3)."
          en: "Filtering algorithm to minimize hallucinations. Prioritizing academic sources (Tier 1) over educational (Tier 2) and general sources (Tier 3)."

  # Results and impact
  results:
    title:
      fr: "Impact Pédagogique"
      en: "Pedagogical Impact"
    subtitle:
      fr: "La technologie au service de l'apprentissage"
      en: "Technology serving learning"
    items:
      - icon: "🎓"
        text:
          fr: "Méthode soutenue par l'étude Harvard 'PS2 PAL' pour l'effet tuteur"
          en: "Method backed by Harvard 'PS2 PAL' study for the tutor effect"
      - icon: "🧠"
        text:
          fr: "Réduction de la charge cognitive idéale pour les profils TDAH"
          en: "Cognitive load reduction ideal for ADHD profiles"
      - icon: "🛡️"
        text:
          fr: "Taux d'hallucination minimisé grâce au système de sources vérifiées"
          en: "Minimized hallucination rate thanks to verified source system"
      - icon: "📈"
        text:
          fr: "Adaptabilité totale du niveau collège jusqu'au doctorat"
          en: "Full adaptability from middle school to PhD levels"
      - icon: "💰"
        text:
          fr: "Modèle 'Pay-per-use' éthique sans abonnement passif"
          en: "Ethical 'Pay-per-use' model without passive subscription"
      - icon: "⚡"
        text:
          fr: "Application Desktop optimisée pour le deep work"
          en: "Desktop application optimized for deep work"
---

# D.IA.NE

D.IA.NE (Digital Intelligent Artificial Neural Educator) est bien plus qu'un chatbot. C'est un compagnon d'apprentissage qui connaît votre emploi du temps, comprend vos notes et adapte son enseignement à votre niveau spécifique.