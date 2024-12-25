export interface NewsEntity {
    id: number;
    user: {
        id: number;
        name: {
            first: string;
            last: string;
        };
        staffPositions: {
            prefix: string;
            id: string;
        }[];
    };
    image_url: string;
    name: {
        [key: string]: string;
    };
    description: {
        [key: string]: string;
    };
    publishedAt: Date;
}

export interface Agenda {
    id: number;
    type: number; // 0 - Event, 1 - Training, 2 - Exam, 3 - Technical
    startDate: Date;
    endDate: Date;
    title: string;
    annotation: string;
    airport: string;
    link: string;
}