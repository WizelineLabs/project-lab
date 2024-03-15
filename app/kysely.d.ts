import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface _DisciplinesToProjectMembers {
  A: string;
  B: string;
}

export interface _DisciplinesToProjects {
  A: string;
  B: string;
}

export interface _LabelsToProjects {
  A: string;
  B: string;
}

export interface _PrismaMigrations {
  applied_steps_count: Generated<number>;
  checksum: string;
  finished_at: Timestamp | null;
  id: string;
  logs: string | null;
  migration_name: string;
  rolled_back_at: Timestamp | null;
  started_at: Generated<Timestamp>;
}

export interface _ProjectMembersToSkills {
  A: string;
  B: string;
}

export interface _ProjectsToSkills {
  A: string;
  B: string;
}

export interface Applicant {
  appliedProjects: string | null;
  appliedProjectsId: string | null;
  avatarApplicant: string | null;
  comments: string | null;
  country: string;
  createdAt: Generated<Timestamp>;
  cvLink: string;
  dayOfBirth: Timestamp;
  email: string;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyRelationship: string | null;
  endDate: Timestamp;
  englishLevel: string;
  experience: string;
  fullName: string;
  gender: string;
  graduationDate: Timestamp;
  homeAddress: string;
  hoursPerWeek: number;
  howDidYouHearAboutUs: string;
  id: Generated<number>;
  interest: string;
  interestedRoles: string | null;
  major: string;
  mentorId: string | null;
  nationality: string;
  participatedAtWizeline: boolean;
  personalEmail: string;
  phone: string;
  preferredTools: string | null;
  projectId: string | null;
  semester: string;
  startDate: Timestamp;
  status: Generated<string>;
  universityEmail: string | null;
  universityId: string | null;
  universityPointOfContactId: string | null;
  updatedAt: Timestamp;
  updatedBy: string | null;
  wizelinePrograms: string | null;
}

export interface Comments {
  authorId: string;
  body: string;
  createdAt: Generated<Timestamp>;
  id: string;
  parentId: string | null;
  projectId: string;
  updatedAt: Generated<Timestamp>;
}

export interface ContributorPath {
  createdAt: Generated<Timestamp>;
  id: string;
  projectMemberId: string;
  projectStageId: string;
  projectTaskId: string;
  updatedAt: Generated<Timestamp>;
}

export interface Disciplines {
  createdAt: Generated<Timestamp>;
  id: string;
  name: string;
  updatedAt: Generated<Timestamp>;
}

export interface Experience {
  comentario: string;
  id: Generated<number>;
  profileId: string | null;
}

export interface GitHubActivity {
  author: string;
  avatar_url: string;
  created_at: Timestamp;
  id: string;
  projectId: string;
  typeEvent: string;
}

export interface GitHubProfile {
  avatarUrl: string;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  reposUrl: string;
  username: string;
}

export interface GitHubProjects {
  description: string;
  id: string;
  name: string;
  owner_email: string;
  updated_at: string;
}

export interface GitHubReleases {
  author: string;
  body: string;
  created_at: Timestamp;
  id: string;
  link: string;
  name: string;
  prerealease: boolean;
  projectId: string;
  tagName: string;
}

export interface InnovationTiers {
  benefits: string;
  createdAt: Generated<Timestamp>;
  defaultRow: Generated<boolean>;
  goals: string;
  name: string;
  requisites: string;
  updatedAt: Generated<Timestamp>;
}

export interface InternsComments {
  applicantId: number;
  authorId: string;
  body: string;
  createdAt: Generated<Timestamp>;
  id: string;
  parentId: string | null;
  updatedAt: Generated<Timestamp>;
}

export interface JobTitles {
  createdAt: Generated<Timestamp>;
  id: string;
  name: string | null;
  nameAbbreviation: string | null;
  updatedAt: Generated<Timestamp>;
}

export interface Labels {
  createdAt: Generated<Timestamp>;
  id: string;
  name: string;
  updatedAt: Generated<Timestamp>;
}

export interface Locations {
  createdAt: Generated<Timestamp>;
  id: string;
  name: string;
  updatedAt: Generated<Timestamp>;
}

export interface Note {
  body: string;
  createdAt: Generated<Timestamp>;
  id: string;
  title: string;
  updatedAt: Timestamp;
  userId: string;
}

export interface Profiles {
  avatarUrl: string | null;
  benchStatus: string | null;
  businessUnit: string | null;
  country: string | null;
  createdAt: Generated<Timestamp>;
  department: string | null;
  email: string;
  employeeStatus: string | null;
  firstName: string;
  githubUser: string | null;
  id: string;
  jobLevelTier: string | null;
  jobLevelTitle: string | null;
  jobTitleId: string | null;
  lastName: string;
  location: string | null;
  locationId: string | null;
  preferredName: string;
  searchCol: Generated<string | null>;
  updatedAt: Generated<Timestamp>;
}

export interface ProjectMembers {
  active: Generated<boolean>;
  createdAt: Generated<Timestamp>;
  hoursPerWeek: number | null;
  id: string;
  profileId: string;
  projectId: string;
  updatedAt: Generated<Timestamp>;
}

export interface ProjectMembersVersions {
  active: Generated<boolean>;
  createdAt: Generated<Timestamp>;
  hoursPerWeek: number | null;
  id: Generated<number>;
  practicedSkills: string | null;
  profileId: string;
  projectId: string;
  role: string | null;
  updatedAt: Generated<Timestamp>;
}

export interface Projects {
  createdAt: Generated<Timestamp>;
  demo: string | null;
  description: string | null;
  helpWanted: Generated<boolean>;
  id: string;
  isApproved: Generated<boolean>;
  isArchived: Generated<boolean>;
  logo: string | null;
  name: string;
  ownerId: string | null;
  projectBoard: string | null;
  searchSkills: Generated<string>;
  slackChannel: string | null;
  status: Generated<string | null>;
  target: string | null;
  tierName: Generated<string | null>;
  tsColumn: Generated<string | null>;
  updatedAt: Generated<Timestamp>;
  valueStatement: string | null;
}

export interface ProjectStages {
  createdAt: Generated<Timestamp>;
  criteria: string;
  id: string;
  mission: string;
  name: string;
  position: number;
  projectId: string;
  updatedAt: Generated<Timestamp>;
}

export interface ProjectStatus {
  color: Generated<string>;
  name: string;
  stage: Generated<string | null>;
}

export interface ProjectsVersions {
  createdAt: Generated<Timestamp>;
  demo: string | null;
  description: string | null;
  id: Generated<number>;
  isApproved: Generated<boolean>;
  isArchived: Generated<boolean>;
  logo: string | null;
  membersCount: Generated<number>;
  name: string;
  ownerId: string | null;
  projectId: string;
  searchSkills: Generated<string>;
  slackChannel: string | null;
  status: Generated<string | null>;
  target: string | null;
  tierName: Generated<string | null>;
  valueStatement: string | null;
  votesCount: Generated<number>;
}

export interface ProjectTasks {
  createdAt: Generated<Timestamp>;
  description: string;
  id: string;
  position: number;
  projectStageId: string;
  updatedAt: Generated<Timestamp>;
}

export interface RelatedProjects {
  id: Generated<number>;
  projectAId: string;
  projectBId: string;
}

export interface Repos {
  createdAt: Generated<Timestamp>;
  id: Generated<number>;
  projectId: string;
  updatedAt: Generated<Timestamp>;
  url: string;
}

export interface Resource {
  id: Generated<number>;
  name: string;
  projectId: string;
  provider: string;
  type: string;
}

export interface Skills {
  createdAt: Generated<Timestamp>;
  id: string;
  name: string;
  updatedAt: Generated<Timestamp>;
}

export interface Universities {
  active: Generated<boolean>;
  createdAt: Generated<Timestamp>;
  id: string;
  name: string;
  updatedAt: Timestamp;
}

export interface UniversityPointsOfContact {
  active: Generated<boolean>;
  createdAt: Generated<Timestamp>;
  fullName: string;
  id: string;
  universityId: string | null;
  updatedAt: Timestamp;
}

export interface User {
  createdAt: Generated<Timestamp>;
  email: string;
  id: string;
  name: string | null;
  role: Generated<string>;
  updatedAt: Timestamp;
}

export interface Vote {
  createdAt: Generated<Timestamp>;
  profileId: string;
  projectId: string;
}

export interface DB {
  _DisciplinesToProjectMembers: _DisciplinesToProjectMembers;
  _DisciplinesToProjects: _DisciplinesToProjects;
  _LabelsToProjects: _LabelsToProjects;
  _prisma_migrations: _PrismaMigrations;
  _ProjectMembersToSkills: _ProjectMembersToSkills;
  _ProjectsToSkills: _ProjectsToSkills;
  Applicant: Applicant;
  Comments: Comments;
  ContributorPath: ContributorPath;
  Disciplines: Disciplines;
  Experience: Experience;
  GitHubActivity: GitHubActivity;
  GitHubProfile: GitHubProfile;
  GitHubProjects: GitHubProjects;
  GitHubReleases: GitHubReleases;
  InnovationTiers: InnovationTiers;
  internsComments: InternsComments;
  JobTitles: JobTitles;
  Labels: Labels;
  Locations: Locations;
  Note: Note;
  Profiles: Profiles;
  ProjectMembers: ProjectMembers;
  ProjectMembersVersions: ProjectMembersVersions;
  Projects: Projects;
  ProjectStages: ProjectStages;
  ProjectStatus: ProjectStatus;
  ProjectsVersions: ProjectsVersions;
  ProjectTasks: ProjectTasks;
  RelatedProjects: RelatedProjects;
  Repos: Repos;
  Resource: Resource;
  Skills: Skills;
  Universities: Universities;
  UniversityPointsOfContact: UniversityPointsOfContact;
  User: User;
  Vote: Vote;
}
