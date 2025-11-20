export class Family {
    id: number;
    name: string;
    description?: string;
    createdAt: Date;

    constructor() {
        this.id = 0;
        this.name = '';
        this.description = '';
        this.createdAt = new Date();
    }
}
