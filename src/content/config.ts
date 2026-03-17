import { defineCollection, z } from 'astro:content';

// Utility types for bilingual content support
const BilingualString = z.union([
  z.string(), // Backward compatible - single language string
  z.object({
    fr: z.string(),
    en: z.string().optional(),
  }).refine(data => data.fr || data.en, {
    message: "At least one language (fr or en) must be provided"
  })
]);

const BilingualStringOptional = z.union([
  z.string().optional(),
  z.object({
    fr: z.string().optional(),
    en: z.string().optional(),
  }).optional()
]);

// Define the projects collection schema
const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: BilingualString,
    altTitle: BilingualStringOptional, // Optional - shorter title for electron preview cards
    domain: z.string().optional(), // Optional - will be computed from folder structure if not provided
    description: BilingualString,
    tech: z.array(z.string()),
    status: z.enum(['completed', 'in-progress', 'planned']),
    link: z.string().url().optional(),
    github: z.string().url().optional(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
    date: z.date(),
    useBentoLayout: z.boolean().default(false),

    // Bento layout configuration
    bento: z.object({
      // Card visibility toggles
      cards: z.object({
        hero: z.boolean().default(true),
        stats: z.boolean().default(true),
        musicLinks: z.boolean().default(false),
        video: z.boolean().default(false),
        spotify: z.boolean().default(false),
        sampler: z.boolean().default(false),
        soundcloud: z.boolean().default(false),
        audio: z.boolean().default(false),
        fmod: z.boolean().default(false),
        actions: z.boolean().default(true),
        tech: z.boolean().default(true),
        process: z.boolean().default(true),
        gallery: z.boolean().default(true),
        challenges: z.boolean().default(true),
        results: z.boolean().default(true),
      }).optional(),

      // Accent color theme
      accentColor: z.string().default('#ff6b00'), // Orange default
      accentColorDark: z.string().optional(), // Optional dark theme accent color

      // Hero card configuration
      hero: z.object({
        subtitle: BilingualStringOptional,
        subtitleColor: z.string().optional(),
        backgroundImage: z.string().optional(),
        backgroundPosition: z.string().optional(),
        backgroundSize: z.string().optional(),
        backgroundScale: z.number().optional(),
        overlayOpacity: z.number().min(0).max(1).optional(), // Controls dark overlay opacity (0.0 = transparent, 1.0 = opaque) - DEPRECATED, use overlayTopOpacity/overlayBottomOpacity
        overlayTopOpacity: z.number().min(0).max(1).optional(), // Controls dark overlay opacity at top (0.0 = transparent, 1.0 = opaque)
        overlayBottomOpacity: z.number().min(0).max(1).optional(), // Controls dark overlay opacity at bottom (0.0 = transparent, 1.0 = opaque)
        logo: z.string().optional(),
        showLogo: z.boolean().optional(),
      }).optional(),

      // Stats configuration
      stats: z.array(z.object({
        value: z.string(),
        label: BilingualString,
      })).optional(),

      // Music Links configuration
      musicLinks: z.object({
        title: BilingualString.default('Music Links'),
        items: z.array(z.object({
          text: z.string(),
          url: z.string().url(),
        })).length(4),
      }).optional(),

      // Video configuration
      video: z.object({
        title: BilingualStringOptional,
        url: z.string().url(),
        description: BilingualStringOptional,
      }).optional(),

      // Spotify configuration
      spotify: z.object({
        title: BilingualStringOptional,
        url: z.string().url(),
        description: BilingualStringOptional,
      }).optional(),

      // SoundCloud configuration
      soundcloud: z.object({
        title: BilingualStringOptional,
        url: z.string().url(),
        description: BilingualStringOptional,
        large: z.boolean().default(false), // true = gallery position, false = tech position
      }).optional(),

      // Audio Player configuration
      audio: z.object({
        title: BilingualString.default('Listen'),
        tracks: z.array(z.object({
          title: BilingualString,
          artist: z.string().optional(),
          filename: z.string(), // filename without extension (e.g., "track1" for track1.webm/mp3)
          duration: z.string().optional(), // e.g., "3:45"
        })),
      }).optional(),

      // FMOD Interactive Player configuration
      fmod: z.object({
        title: BilingualString.default('FMOD Interactive Player'),
        description: BilingualStringOptional,
        mode: z.enum(['standard', 'interactive-game']).default('standard'), // Display mode
        introDuration: z.number().default(26.5), // Duration of intro phase in seconds (for game mode)
        folder: z.string(), // Folder inside public/fmod containing the banks
        banks: z.array(z.string()), // e.g., ["Master.bank", "Master.strings.bank"]
        events: z.array(z.object({
          name: BilingualString, // Display name
          path: z.string(), // FMOD event path, e.g., "event:/mus_BOSS"
        })),
        parameters: z.array(z.object({
          name: z.string(), // Parameter name in FMOD
          label: BilingualStringOptional, // UI display name
          min: z.number(),
          max: z.number(),
          step: z.number().default(0.1),
          default: z.number()
        })).optional()
      }).optional(),

      sampler: z.object({
        title: BilingualString.default('Sampler'),
        description: BilingualStringOptional,
        folder: z.string(),
        samplePool: z.array(z.string()).min(1),
        volume: z.number().optional(),
      }).optional(),
      secondary: z.object({
        text: BilingualString,
        url: z.string().optional(),
      }).optional(),

      actions: z.object({
        title: BilingualString.default('Links'),
        primary: z.object({
          text: BilingualString,
          url: z.string(),
        }).optional(),
        secondary: z.object({
          text: BilingualString,
          url: z.string().optional(),
        }).optional(),
      }).optional(),

      // Process steps
      process: z.object({
        title: BilingualString.default('Process'),
        subtitle: BilingualStringOptional,
        steps: z.array(BilingualString),
      }).optional(),

      // Gallery images
      gallery: z.object({
        title: BilingualString.default('Gallery'),
        images: z.array(z.object({
          src: z.string(),
          alt: z.string(),
        })).optional(),
      }).optional(),

      // Folder containing image assets for the project
      // When provided, the template will automatically build the gallery
      // from all images found in this folder, excluding files reserved for
      // the hero section ("hero.*" and "logo.*").
      assetsFolder: z.string().optional(),

      // Challenges
      challenges: z.object({
        title: BilingualString.default('Key Challenges'),
        subtitle: BilingualStringOptional,
        items: z.array(z.object({
          title: BilingualString,
          description: BilingualString,
        })),
      }).optional(),

      // Results
      results: z.object({
        title: BilingualString.default('Results'),
        subtitle: BilingualStringOptional,
        items: z.array(z.object({
          icon: z.string(),
          text: BilingualString,
        })),
      }).optional(),
    }).optional(),
  }).optional(),
});

// Define the bio collection schema
const bioCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: BilingualString, // Display name
    subtitle: BilingualString,
    bio: BilingualString, // Markdown string
    portrait: z.string().optional(),
    email: z.string().email(),
    social: z
      .array(z.object({ platform: z.string(), url: z.string().url() }))
      .optional(),
    skills: z
      .array(
        z.object({
          category: z.string(),
          tools: z.array(z.string()),
        })
      )
      .optional(),
    press: z
      .array(
        z.object({
          title: BilingualString,
          description: BilingualString,
          imageUrl: z.string(),
          articleUrl: z.string().url(),
          publishDate: z.string().optional(),
          publication: z.string().optional(),
        })
      )
      .optional(),
    favoriteGames: z
      .array(
        z.object({
          title: BilingualString,
          description: BilingualStringOptional,
          imageUrl: z.string().optional(),
        })
      )
      .optional(),
  }),
});

export const collections = {
  projects: projectsCollection,
  bio: bioCollection,
};
