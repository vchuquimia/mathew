import { User } from './user';

export interface HomeTask {
    id: number;
    description: string;
    done: boolean;
    dueDate: Date;
    rating?: number;
    ratingComment?: string;
    userName: string;
    familyId: number;
}

