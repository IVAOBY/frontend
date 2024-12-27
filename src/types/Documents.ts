export interface DocumentsCategoryType {
    id: string;
    order: number;
    name: {
        [key: string]: string;
    };
    documents: DocumentsType[];
}

export interface DocumentsType {
    id: string;
    category: string;
    name: {
        [key: string]: string;
    };
    content: {
        [key: string]: string;
    };
    published: boolean;
}
