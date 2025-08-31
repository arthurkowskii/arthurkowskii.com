import { defineCollection, z } from 'astro:content';

// Define the projects collection schema
const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    altTitle: z.string().optional(), // Optional - shorter title for electron preview cards
    domain: z.string().optional(), // Optional - will be computed from folder structure if not provided
    description: z.string(),
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
        soundcloud: z.boolean().default(false),
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
        subtitle: z.string().optional(),
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
        label: z.string(),
      })).optional(),

      // Music Links configuration
      musicLinks: z.object({
        title: z.string().default('Music Links'),
        items: z.array(z.object({
          text: z.string(),
          url: z.string().url(),
        })).length(4),
      }).optional(),

      // Video configuration
      video: z.object({
        title: z.string().optional(),
        url: z.string().url(),
        description: z.string().optional(),
      }).optional(),

      // Spotify configuration
      spotify: z.object({
        title: z.string().optional(),
        url: z.string().url(),
        description: z.string().optional(),
      }).optional(),

      // SoundCloud configuration
      soundcloud: z.object({
        title: z.string().optional(),
        url: z.string().url(),
        description: z.string().optional(),
        large: z.boolean().default(false), // true = gallery position, false = tech position
      }).optional(),
      
      // Actions configuration
      actions: z.object({
        title: z.string().default('Experience'),
        primary: z.object({
          text: z.string(),
          url: z.string(),
        }).optional(),
        secondary: z.object({
          text: z.string(),
          url: z.string().optional(),
        }).optional(),
      }).optional(),
      
      // Process steps
      process: z.object({
        title: z.string().default('Process'),
        subtitle: z.string().optional(),
        steps: z.array(z.string()),
      }).optional(),
      
      // Gallery images
      gallery: z.object({
        title: z.string().default('Gallery'),
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
        title: z.string().default('Key Challenges'),
        subtitle: z.string().optional(),
        items: z.array(z.object({
          title: z.string(),
          description: z.string(),
        })),
      }).optional(),
      
      // Results
      results: z.object({
        title: z.string().default('Results'),
        subtitle: z.string().optional(),
        items: z.array(z.object({
          icon: z.string(),
          text: z.string(),
        })),
      }).optional(),
    }).optional(),
  }),
});

// Define the bio collection schema
const bioCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(), // Display name
    subtitle: z.string(),
    bio: z.string(), // Markdown string
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
  }),
});

export const collections = {
  projects: projectsCollection,
  bio: bioCollection,
};
