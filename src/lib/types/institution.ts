export type Institution = {
    id: number;
    name: string;
    street: string;
    city: string;
    county_id: number;
    website?: string | null;
    facebook?: string| null;
    instagram?: string | null;
    type_id: number;
    notes: string;
}