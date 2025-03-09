export type Institution = {
    id: number;
    name: string;
    street: string;
    city: string;
    website?: string | null;
    facebook?: string| null;
    instagram?: string | null;
    type_id: number;
}