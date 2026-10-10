import { z } from 'zod';

export const AudienceEnum = z.enum(['recruiter', 'teams', 'clients', 'home']);
export type Audience = z.infer<typeof AudienceEnum>;

export const ProjectStatusEnum = z.enum(['live', 'in-development', 'coming-soon', 'demo-template']);
export type ProjectStatus = z.infer<typeof ProjectStatusEnum>;

export const ProjectKindEnum = z.enum(['client-work', 'hackathon-build', 'own-product', 'demo-template']);
export type ProjectKind = z.infer<typeof ProjectKindEnum>;

export const HackathonResultEnum = z.enum(['finalist', 'participant']);
export type HackathonResult = z.infer<typeof HackathonResultEnum>;

export const SkillLevelEnum = z.enum(['learning', 'working', 'strong']);
export type SkillLevel = z.infer<typeof SkillLevelEnum>;

export const SiteSchema = z.object({
  siteName: z.string().min(1),
  siteUrl: z.string().url(),
  lang: z.string().default('en'),
});
export type SiteData = z.infer<typeof SiteSchema>;

export const IdentitySchema = z.object({
  name: z.string().min(1),
  roleLine: z.string().min(1),
  supportingLine: z.string().min(1),
  location: z.object({
    city: z.string(),
    region: z.string(),
    country: z.string(),
  }),
  college: z.string().min(1),
  tags: z.array(z.string()),
  photo: z.object({
    src: z.string(),
    alt: z.string().min(1),
  }),
  audienceTags: z.record(z.array(z.string())).optional(),
});
export type IdentityData = z.infer<typeof IdentitySchema>;

export const EducationSchema = z.object({
  university: z.string().min(1),
  degree: z.string().min(1),
  startYear: z.number(),
  currentSemester: z.number(),
  graduationYear: z.number(),
});
export type EducationData = z.infer<typeof EducationSchema>;

export const ProgramSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  status: z.string(),
  start: z.string(),
  end: z.string(),
  proof: z.object({
    url: z.string(),
    publish: z.boolean(),
  }),
  note: z.string().optional(),
});
export type ProgramData = z.infer<typeof ProgramSchema>;

export const SkillSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  level: SkillLevelEnum,
  proofProject: z.string().min(1),
  audiences: z.array(AudienceEnum),
});
export type SkillData = z.infer<typeof SkillSchema>;

export const LinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
  type: z.string().optional(),
});

export const RoadmapItemSchema = z.object({
  label: z.string().min(1),
  status: z.literal('coming-soon'),
});

export const ProjectSchema = z.object({
  id: z.string().min(1),
  title: z.string().max(80),
  oneLine: z.string().max(140),
  status: ProjectStatusEnum,
  kind: ProjectKindEnum,
  clientLabel: z.string().optional(),
  description: z.string().max(400),
  role: z.string().min(1),
  tech: z.array(z.string()),
  links: z.array(LinkSchema),
  screenshots: z.array(z.object({
    src: z.string(),
    alt: z.string().min(1),
  })).default([]),
  roadmap: z.array(RoadmapItemSchema).optional(),
  featured: z.boolean().default(false),
  featuredOrder: z.number().optional(),
  showOn: z.array(AudienceEnum),
  angles: z.record(z.string()).optional(),
}).refine(
  (data) => {
    // Demo template projects never have clientLabel and must have status demo-template
    if (data.kind === 'demo-template') {
      return !data.clientLabel && data.status === 'demo-template';
    }
    return true;
  },
  { message: "Demo template projects must not have clientLabel and must have status 'demo-template'" }
);
export type ProjectData = z.infer<typeof ProjectSchema>;

export const HackathonSchema = z.object({
  id: z.string().min(1),
  event: z.string().min(1),
  round: z.string().optional(),
  project: z.string().optional(),
  result: HackathonResultEnum,
  note: z.string().optional(),
  proof: z.object({
    url: z.string(),
    publish: z.boolean(),
  }).optional(),
}).refine(
  (data) => {
    // Finalist entries require proof
    if (data.result === 'finalist') {
      return !!data.proof;
    }
    return true;
  },
  { message: "Finalist hackathon entries require a proof object" }
);
export type HackathonData = z.infer<typeof HackathonSchema>;

export const CommunityItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: z.enum(['role', 'award', 'participation']),
  date: z.string().optional(),
  result: z.string().optional(),
  proof: z.object({
    url: z.string(),
    publish: z.boolean(),
  }).optional(),
});
export type CommunityItemData = z.infer<typeof CommunityItemSchema>;

export const StatSchema = z.object({
  id: z.string().min(1),
  label: z.string().max(60),
  value: z.number(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  proof: z.string().optional(),
  showOn: z.array(AudienceEnum),
});
export type StatData = z.infer<typeof StatSchema>;

export const JourneyItemSchema = z.object({
  date: z.string().min(1),
  label: z.string().min(1),
});
export type JourneyItemData = z.infer<typeof JourneyItemSchema>;

export const ChannelSchema = z.object({
  id: z.string().min(1),
  url: z.string().url().optional(),
  mode: z.string().optional(),
  username: z.string().optional(),
  audiences: z.array(AudienceEnum),
});

export const ConnectSchema = z.object({
  channels: z.array(ChannelSchema),
  form: z.object({
    enabled: z.boolean(),
    audienceOptions: z.array(z.string()),
  }),
});
export type ConnectData = z.infer<typeof ConnectSchema>;

export const HomeCardSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  url: z.string().min(1),
});

export const HomePageSchema = z.object({
  page: z.literal('home'),
  slug: z.literal(''),
  cards: z.array(HomeCardSchema),
});
export type HomePageData = z.infer<typeof HomePageSchema>;

export const AudiencePageSchema = z.object({
  page: z.enum(['recruiter', 'teams', 'clients']),
  slug: z.string().min(1),
  sections: z.array(z.string()),
  projects: z.array(z.string()),
  animation: z.object({
    projects: z.array(z.string()).max(4, "Max 4 projects in animation sequence"),
    stats: z.array(z.string()).max(3, "Max 3 stats per page"),
  }),
  offer: z.array(z.string()).optional(),
  howIWork: z.array(z.object({
    title: z.string(),
    description: z.string(),
  })).optional(),
  primaryCta: z.object({
    type: z.string(),
    channels: z.array(z.string()).optional(),
  }),
  secondaryCta: z.object({
    type: z.string(),
    channels: z.array(z.string()).optional(),
  }).optional(),
});
export type AudiencePageData = z.infer<typeof AudiencePageSchema>;

export const CopyDeckSchema = z.object({
  master: z.object({
    headline: z.array(z.string()),
    supportingLine: z.array(z.string()),
    primaryCta: z.array(z.string()),
    secondaryCta: z.array(z.string()),
    availability: z.array(z.string()),
  }),
  recruiter: z.object({
    headline: z.array(z.string()),
    endCard: z.array(z.string()),
  }),
  teams: z.object({
    headline: z.array(z.string()),
    endCard: z.array(z.string()),
  }),
  clients: z.object({
    headline: z.array(z.string()),
    endCard: z.array(z.string()),
  }),
  shortLines: z.array(z.string()),
});
export type CopyDeckData = z.infer<typeof CopyDeckSchema>;
