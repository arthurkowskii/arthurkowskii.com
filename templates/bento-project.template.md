---
title: "Your Project Title"
description: "One sentence that sells it."
tech: ["Tech1", "Tech2"]
status: "completed" # or "in-progress" | "planned"
link: "https://example.com"
github: "https://github.com/you/repo"
date: 2024-08-22
useBentoLayout: true

# Bento Layout Configuration
bento:
  # Theme color
  accentColor: "#ff6b00"

  # REQUIRED for auto hero/logo + gallery
  # Put images here and name hero.* and logo.* for the hero card
  assetsFolder: "/src/content/projects/3_Tech/Assets_NewProject"

  # Toggle cards
  cards:
    hero: true
    stats: true
    musicLinks: false
    actions: true
    tech: true
    process: true
    gallery: true
    challenges: true
    results: true

  # Hero subtitle only; hero/background/logo auto from assetsFolder
  hero:
    subtitle: "Category or Role"
    # Optional: per-project color for hero subtitle (falls back to accentColor)
    # Examples: "#ff6b00", "#ff6b00cc", "rgb(255,107,0)"
    subtitleColor: "#ff6b00"
    # Optional: dark overlay opacity control (separate top/bottom for gradient effect)
    # overlayTopOpacity: 0.05    # Top of gradient (lighter)
    # overlayBottomOpacity: 0.3  # Bottom of gradient (darker)

  # Optional stats
  stats:
    - value: "4"
      label: "Months"
    - value: "12"
      label: "Features"

  # Optional Music Links (enable with cards.musicLinks: true)
  # musicLinks:
  #   title: "Music Links"
  #   items:
  #     - text: "Spotify"
  #       url: "https://open.spotify.com/track/..."
  #     - text: "Apple Music"
  #       url: "https://music.apple.com/..."
  #     - text: "Bandcamp"
  #       url: "https://yourname.bandcamp.com/track/..."
  #     - text: "YouTube"
  #       url: "https://youtube.com/watch?v=..."

  # Optional actions
  actions:
    title: "Experience"
    primary:
      text: "View Live"
      url: "https://example.com"
    secondary:
      text: "Source Code"
      url: "https://github.com/you/repo"

  # Optional process
  process:
    title: "Process"
    steps:
      - "Research"
      - "Build"
      - "Test"
      - "Ship"

  # Gallery images auto from assetsFolder; title optional
  gallery:
    title: "Gallery"

  # Optional challenges
  challenges:
    title: "Key Challenges"
    items:
      - title: "Integration"
        description: "Brief description of what was hard and how you solved it."

  # Optional results
  results:
    title: "Results"
    items:
      - icon: "🚀"
        text: "Decreased load time by 45%"
---

# Your Project Title

A few paragraphs describing the project goals, your role, the tech, and the outcome. This Markdown is shown on the dedicated route `/projects/<slug>`.

## Highlights

- Key feature or achievement
- Another notable detail
- Any recognition, awards, or measurable impact
