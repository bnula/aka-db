import { Institution } from "../types/institution";
import { Contact } from "../types/contact";
import { Position } from "../types/position";
import { prisma } from "../prisma";

export const contactsRepository = {
    async getAllContacts() {
        return await prisma.contacts.findMany();
    },

    async getContactById(id: number) {
        return await prisma.contacts.findUnique({ where: { id } });
    },

    async createContact(data: { title: string, name: string, email: string, phone: string, cellphone: string, position_id: number, institution_id: number }) {
        return await prisma.contacts.create({ data: data });
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

    async createInstitution(data: { name: string, street: string, city: string, website: string, facebook: string, instagram: string, type_id: number }) {
        return await prisma.institutions.create({ data: data });
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

    async getAllInstitutionTypes() {
        return await prisma.institution_types.findMany();
    },

    async getInstitutionTypeById(id: number){
        return await prisma.institution_types.findUnique({ where: { id } });
    },

    async createInstitutionType(data: { name: string} ) {
        return await prisma.institution_types.create({ data: {
            name: data.name
        } });
    },

    async updateInsitutionType(data: { position: Position }) {
        const id = data.position.id;
        return await prisma.institution_types.update({ where: { id }, data });
        },

    async deleteInstitutionType(id: number) {
        return await prisma.institution_types.delete({ where: { id } })
    },
}