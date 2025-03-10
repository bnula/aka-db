// import { Institution } from "./institution";
// import { Position } from "./position";

export type Contact = {
    id: number;
    name: string;
    email: string;
    title: string | null;
    phone: string;
    cellphone: string | null;
    position_id: number;
    institution_id: number;
}