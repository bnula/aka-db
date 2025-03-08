import { Institution } from "../types/institution";
import { Contact } from "../types/contact";
import { Position } from "../types/position";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const contactsRepository = {
    async getAllContacts() {
        return await prisma.contacts.findMany();
    },

    async getContactById(id: number) {
        return await prisma.contacts.findUnique({ where: { id } });
    },

    async createContact(data: { contact: Contact }) {
        return await prisma.contacts.create({ data: data.contact });
    },

    async updateContact(data: { contact: Contact }) {
        const id = data.contact.id;
        return await prisma.contacts.update({ where: { id }, data: data.contact });
    },

    async deleteContact(id: number) {
        return await prisma.contacts.delete({ where: { id } });
    },

    async getAllInstitutions() {
        return await prisma.institutions.findMany();
    },

    async getInstitutionById(id: number){
        return await prisma.institutions.findUnique({ where: { id } });
    },

    async createInstitution(data: { institution: Institution} ) {
        return await prisma.institutions.create({ data: data.institution });
    },

    async updateInstitution(data: { institution: Institution }) {
        const id = data.institution.id;
        return await prisma.institutions.update({ where: { id }, data });
        },

    async deleteInstitution(id: number) {
        return await prisma.institutions.delete({ where: { id } })
    },

    async getAllPositions() {
        return await prisma.positions.findMany();
    },

    async getPositionById(id: number){
        return await prisma.positions.findUnique({ where: { id } });
    },

    async createPosition(data: { name: string} ) {
        return await prisma.positions.create({ data: {
            name: data.name
        } });
    },

    async updatePosition(data: { position: Position }) {
        const id = data.position.id;
        return await prisma.positions.update({ where: { id }, data });
        },

    async deletePosition(id: number) {
        return await prisma.positions.delete({ where: { id } })
    },
}