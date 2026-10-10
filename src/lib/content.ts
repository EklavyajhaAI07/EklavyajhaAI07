import {
  SiteSchema,
  IdentitySchema,
  EducationSchema,
  ProgramSchema,
  SkillSchema,
  ProjectSchema,
  HackathonSchema,
  CommunityItemSchema,
  StatSchema,
  JourneyItemSchema,
  ConnectSchema,
  HomePageSchema,
  AudiencePageSchema,
  CopyDeckSchema,
  type SiteData,
  type IdentityData,
  type EducationData,
  type ProgramData,
  type SkillData,
  type ProjectData,
  type HackathonData,
  type CommunityItemData,
  type StatData,
  type JourneyItemData,
  type ConnectData,
  type HomePageData,
  type AudiencePageData,
  type CopyDeckData,
} from './schema';

import siteRaw from '../../content/site.json';
import identityRaw from '../../content/identity.json';
import educationRaw from '../../content/education.json';
import programsRaw from '../../content/programs.json';
import skillsRaw from '../../content/skills.json';
import hackathonsRaw from '../../content/hackathons.json';
import communityRaw from '../../content/community.json';
import statsRaw from '../../content/stats.json';
import journeyRaw from '../../content/journey.json';
import connectRaw from '../../content/connect.json';
import homePageRaw from '../../content/pages/home.json';
import recruiterPageRaw from '../../content/pages/recruiter.json';
import teamsPageRaw from '../../content/pages/teams.json';
import clientsPageRaw from '../../content/pages/clients.json';
import copyDeckRaw from '../../content/copy/copy-deck.json';

// Glob all project JSONs
const projectModules = import.meta.glob('../../content/projects/*.json', { eager: true });
const rawProjects: any[] = Object.values(projectModules).map((mod: any) => mod.default || mod);

// Validate and parse datasets
export const site: SiteData = SiteSchema.parse(siteRaw);
export const identity: IdentityData = IdentitySchema.parse(identityRaw);
export const education: EducationData = EducationSchema.parse(educationRaw);
export const programs: ProgramData[] = programsRaw.map(p => ProgramSchema.parse(p));
export const projects: ProjectData[] = rawProjects.map(p => ProjectSchema.parse(p));
export const skills: SkillData[] = skillsRaw.map(s => SkillSchema.parse(s));
export const hackathons: HackathonData[] = hackathonsRaw.map(h => HackathonSchema.parse(h));
export const community: CommunityItemData[] = communityRaw.map(c => CommunityItemSchema.parse(c));
export const stats: StatData[] = statsRaw.map(s => StatSchema.parse(s));
export const journey: JourneyItemData[] = journeyRaw.map(j => JourneyItemSchema.parse(j));
export const connect: ConnectData = ConnectSchema.parse(connectRaw);
export const copyDeck: CopyDeckData = CopyDeckSchema.parse(copyDeckRaw);

export const homePage: HomePageData = HomePageSchema.parse(homePageRaw);
export const recruiterPage: AudiencePageData = AudiencePageSchema.parse(recruiterPageRaw);
export const teamsPage: AudiencePageData = AudiencePageSchema.parse(teamsPageRaw);
export const clientsPage: AudiencePageData = AudiencePageSchema.parse(clientsPageRaw);

// Referential integrity verification
const projectIds = new Set(projects.map(p => p.id));
for (const skill of skills) {
  if (!projectIds.has(skill.proofProject)) {
    throw new Error(`Referential integrity error: Skill "${skill.name}" references non-existent proofProject "${skill.proofProject}"`);
  }
}

export function getProjectById(id: string): ProjectData | undefined {
  return projects.find(p => p.id === id);
}

export function getProjectsForAudience(audience: 'recruiter' | 'teams' | 'clients'): ProjectData[] {
  return projects.filter(p => p.showOn.includes(audience));
}

export function getStatsForAudience(audience: 'recruiter' | 'teams' | 'clients'): StatData[] {
  return stats.filter(s => s.showOn.includes(audience));
}

export function getSkillsForAudience(audience: 'recruiter' | 'teams' | 'clients'): SkillData[] {
  return skills.filter(s => s.audiences.includes(audience));
}
