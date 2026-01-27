---
title:
  fr: "LE SUPER MEGA SHOW !"
  en: "THE SUPER MEGA SHOW!"
altTitle:
  fr: "LE SUPER MEGA SHOW!"
  en: "THE SUPER MEGA SHOW!"
description:
  fr: "LE SUPER MEGA SHOW ! est une série audio et un court-métrage conçus, écrits et réalisés par Arthur Kowskii. Talk-show fictif inspiré des émissions emblématiques des 70s et fruit de la collaboration entre Arthur Kowskii et le comédien belge Benoit Grimmiaux (Bojack Horseman...) qui incarne le présentateur."
  en: "THE SUPER MEGA SHOW! is an audio series and short film conceived, written and directed by Arthur Kowskii. A fictional talk show inspired by iconic 70s shows and the result of collaboration between Arthur Kowskii and Belgian comedian Benoit Grimmiaux (Bojack Horseman...) who plays the host."
tech: ["Ableton", "Reaper", "Davinci Resolve"]
status: "completed" # or "in-progress" | "planned"
link: "https://example.com"
github: "https://github.com/you/repo"
date: 2024-08-22
useBentoLayout: true

# Bento Layout Configuration
bento:
  # Theme color
  accentColor: "#feee5a"

  # REQUIRED for auto hero/logo + gallery
  # Put images here and name hero.* and logo.* for the hero card
  assetsFolder: "/src/content/projects/1_Music/Assets_lesupermegashow"

  # Toggle cards
  cards:
    hero: true
    stats: false
    musicLinks: true
    video: true
    spotify: true
    audio: false
    sampler: false
    actions: true
    tech: false
    process: false
    gallery: true
    challenges: true
    results: true

  # Hero subtitle only; hero/background/logo auto from assetsFolder
  hero:
    subtitle:
      fr: "Court-Métrage et Série-Audio"
      en: "Short Film and Audio Series"
    subtitleColor: "#faf525"
    backgroundPosition: "top"
    backgroundSize: "cover"
    backgroundScale: 1.1  # Alternative to backgroundSize - use 1.1, 0.9, etc.
    overlayTopOpacity: 0.2   # Controls dark overlay opacity at top (0.0 = transparent, 1.0 = opaque)
    overlayBottomOpacity: 0.6 # Controls dark overlay opacity at bottom (0.0 = transparent, 1.0 = opaque)
    showLogo: false

  # Optional stats
  stats:
    - value: "2y"
      label: "DURATION"
    - value: "5 👨‍👩‍👦‍👦"
      label: "TEAM SIZE"
    - value : "Youtube"
      label : "PLATFORM"
    - value : Kowskii
      label : COMPANY

  # Optional actions
  actions:
    title:
      fr: "Liens"
      en: "Links"
    primary:
      text:
        fr: "📽️ Regarder le Court-Métrage"
        en: "📽️ Watch the Short Film"
      url: "https://youtu.be/GtoGUcY1K1Y?si=YQXis7RFPEgLKbPy"
    secondary:
      text:
        fr: "💽 Écouter l'Album"
        en: "💽 Listen to the Album"
      url: "https://open.spotify.com/album/1y7wp1DtYeQpGxxhoC2i3t?si=gVXYTvsqRoC6D18xovDuYg"

  # Video configuration
  video:
    title:
      fr: "LE SUPER MEGA SHOW (COURT-METRAGE DE L'ALBUM)"
      en: "THE SUPER MEGA SHOW (SHORT FILM FROM THE ALBUM)"
    url: "https://youtu.be/GtoGUcY1K1Y?si=XI7niHdCjUYA1L8s"
    description:
      fr: "À SUIVRE dans l'album LE SUPER MEGA SHOW !, disponible sur toutes les plateformes. Vous pouvez soutenir et acheter l'album à PRIX LIBRE sur Bandcamp pour soutenir les prochains projets."
      en: "TO BE CONTINUED in THE SUPER MEGA SHOW! album, available on all platforms. You can support and buy the album at FREE PRICE on Bandcamp to support upcoming projects."

  # Spotify configuration
  spotify:
    title:
      fr: "LE SUPER MEGA SHOW - Album"
      en: "THE SUPER MEGA SHOW - Album"
    url: "https://open.spotify.com/album/1y7wp1DtYeQpGxxhoC2i3t?si=UTvZ7TS4QWqUKtuilpaMpQ"
    description:
      fr: "L'album complet disponible sur Spotify avec tous les morceaux et interludes"
      en: "Complete album available on Spotify with all tracks and interludes"

  # Music links (exactly 4 items). Enable with cards.musicLinks: true
  musicLinks:
    title:
      fr: "Liens Musicaux"
      en: "Music Links"
    items:
      - text: "Spotify"
        url: "https://open.spotify.com/album/1y7wp1DtYeQpGxxhoC2i3t?si=gVXYTvsqRoC6D18xovDuYg"
      - text: "Apple Music"
        url: "https://music.apple.com/fr/album/le-super-mega-show/1768698755"
      - text: "Bandcamp"
        url: "https://kowskii.bandcamp.com/album/le-super-mega-show-album"
      - text: "YouTube"
        url: "https://youtu.be/GtoGUcY1K1Y?si=YQXis7RFPEgLKbPy"

  # Optional process
  process:
    title:
      fr: "Tracklist"
      en: "Tracklist"
    steps:
      - "LE SUPER MEGA SHOW !"
      - "PINK CAR RIDE TO YOU (feat. ABAD)"
      - "Bienvenue"
      - "THE LAST SHADOW PUPPETS (feat. Theo Goude, ABAD)"
      - "KINTSUGI (feat. Damon, ABAD)"
      - "L'interview"
      - "SHARE A SILENCE"
      - "Le Public... ?"
      - "ENFER ET LAPIN BLANC"
      - "T'es nouveau c'est ça ?"
      - "XR 300 (feat. MAI)"
      - "ENFANT"
      - "C'est toi ?"
      - "PARIS Z80"
      - "The End"
      - "Rolling Credits (feat. Theo Goude, Damon)"

  # Gallery images auto from assetsFolder; title optional
  gallery:
    title:
      fr: "Galerie"
      en: "Gallery"

  # Optional challenges
  challenges:
    title:
      fr: "Défis Principaux"
      en: "Key Challenges"
    subtitle:
      fr: "Défis principaux rencontrés lors de ce projet"
      en: "Main challenges encountered during this project"
    items:
      - title:
          fr: "Un album... et une série audio"
          en: "An album... and an audio series"
        description:
          fr: "LE SUPER MEGA SHOW ! est un projet hybride mêlant album et série audio. Plusieurs titres y sont entrecoupés de courts épisodes narratifs qui ancrent l'histoire dans la musique. L'enjeu était de trouver le bon équilibre entre narration et morceaux pour offrir une expérience fluide. Une tracklist fixe a été essentielle pour garantir la continuité entre chaque épisode et chaque chanson."
          en: "THE SUPER MEGA SHOW! is a hybrid project blending album and audio series. Several tracks are interspersed with short narrative episodes that anchor the story in the music. The challenge was finding the right balance between narration and songs to offer a smooth experience. A fixed tracklist was essential to guarantee continuity between each episode and each song."
      - title:
          fr: "Casting"
          en: "Casting"
        description:
          fr: "Le présentateur du « Super Mega Show » a été pensé comme un personnage à la fois charismatique et étrange, nécessitant un comédien de doublage idéal. Ce rôle a été brillamment interprété par Benoit Grimmiaux (Bojack Horseman, Pokémon, Rick et Morty…). Collaborer avec Benoit, d’abord une idole puis un compagnon créatif, a été un immense honneur et une grande fierté pour moi."
          en: "The host of the 'Super Mega Show' was conceived as a both charismatic and strange character, requiring an ideal voice actor. This role was brilliantly performed by Benoit Grimmiaux (Bojack Horseman, Pokémon, Rick & Morty…). Collaborating with Benoit, first an idol then a creative companion, was an immense honor and a great pride for me."
      - title:
          fr: "Un album, une série audio... et puis un film !"
          en: "An album, an audio series... and then a film!"
        description:
          fr: "Plus nous travaillions avec Benoit, plus nous mettions de cœur dans ce projet. L’envie de passer à l’image est née lors de l’enregistrement audio, même si cela paraissait impossible : je n’avais jamais écrit de script, storyboardé, monté une équipe, conçu de mise en scène ou assuré une réalisation. Pourtant, c'est exactement ce que j’ai fini par faire !"
          en: "The more we worked with Benoit, the more heart we put into this project. The desire to move to film was born during the audio recording, even if it seemed impossible: I had never written a script, storyboarded, assembled a team, designed a scene or handled directing. Yet, that's exactly what I ended up doing!"

  # Optional results
  results:
    title:
      fr: "Résultats"
      en: "Results"
    items:
      - icon: "🎬"
        text:
          fr: "Un court-métrage de 12 minutes, écrit et réalisé par Arthur Kowskii"
          en: "A 12-minute short film, written and directed by Arthur Kowskii"
      - icon: "🎙️"
        text:
          fr: "2 Clips musicaux : XR 300 (feat. Mai) et ENFANT"
          en: "2 Music videos: XR 300 (feat. Mai) and ENFANT"
      - icon: "💽"
        text:
          fr: "Un album de 16 titres (18 en physique) comprenant 7 épisodes audio et 9 morceaux"
          en: "A 16-track album (18 physical) including 7 audio episodes and 9 songs"
      - icon: "📼"
        text:
          fr: "Une sortie physique en cassette, pour suivre la direction artistique de l'album à 50 exemplaires."
          en: "A physical cassette release, following the album's artistic direction in 50 copies."

  # Audio Player Configuration
  audio:
    title:
      fr: "Écouter l'Album"
      en: "Listen to the Album"
    tracks:
      - title:
          fr: "XR 300 (feat. Mai)"
          en: "XR 300 (feat. Mai)"
        artist: "Arthur Kowskii"
        filename: "xr300"
        duration: "3:42"
      - title:
          fr: "ENFANT"
          en: "ENFANT"
        artist: "Arthur Kowskii"
        filename: "enfant"
        duration: "4:15"
      - title:
          fr: "Épisode 1 - Introduction"
          en: "Episode 1 - Introduction"
        artist: "Benoit Grimmiaux"
        filename: "episode1"
        duration: "2:30"

---

# LE SUPER MEGA SHOW !

Un projet tentaculaire mêlant musique, narration et cinéma, né d'une collaboration fusionnelle avec Benoit Grimmiaux. Une immersion dans un talk-show rétro-futuriste où la réalité se fragmente au rythme des interludes.
