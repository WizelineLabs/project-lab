export interface Stage {
  createdAt: string;
  criteria: string;
  id: string;
  mission: string;
  name: string;
  position: number;
  projectId: string;
  projectTasks: any;
  updatedAt: string;
}

export interface ContributorPath {
  projectTaskId: string;
}

export interface ProjectMember {
  active: boolean;
  contributorPath: [ContributorPath];
  createdAt: string;
  hoursPerWeek: number;
  id: string;
  practicedSkills: [{ id: string; name: string }];
  profile: {
    preferredName: string;
    lastName: string;
    email: string;
  };
  profileId: string;
  projectId: string;
  role: [
    {
      createdAt: string;
      id: string;
      name: string;
      updatedAt: string;
    }
  ];
  updatedAt: string;
}

export interface ProjectTask {
  createdAt: string;
  description: string;
  id: string;
  position: number;
  projectStageId: string;
  updatedAt: string;
}
