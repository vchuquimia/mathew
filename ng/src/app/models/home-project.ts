import { ProjectStatus } from './project-status';
import { ProjectFeedback } from './project-feedback';
import { HomeProjectLog } from './home-project-log';
import { HomeProjectTask } from './home-project-task';

export interface HomeProject {
    id: number;
    name: string;
    familyId: number;
    status: ProjectStatus;
    description: string;
    feedback?: ProjectFeedback;
    comment?: string;
    creationDate: Date;
    logs: HomeProjectLog[];
    tasks: HomeProjectTask[];
}

