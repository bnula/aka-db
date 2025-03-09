"use server"

import { contactsRepository } from "./data/contactsRepository";

export async function createPosition(formData: FormData){
    const name = String(formData.get("name"))
    
    if (name != null) {
        contactsRepository.createPosition({name: name})
    }
}

export async function fetchPositions() {
    return await contactsRepository.getAllPositions();
}

export async function createInstitutionType(formData: FormData){
    const name = String(formData.get("name"))
    
    if (name != null) {
        contactsRepository.createInstitutionType({name: name})
    }
}

export async function fetchInstitutionTypes() {
    return await contactsRepository.getAllInstitutionTypes();
}

export async function createInstitution(formData: FormData) {
    const data = {
        name: String(formData.get("name")),
        street: String(formData.get("street")),
        city: String(formData.get("city")),
        website: String(formData.get("website")),
        facebook: String(formData.get("facebook")),
        instagram: String(formData.get("instagram")),
        type_id: Number(formData.get("type"))
    };

    contactsRepository.createInstitution(data);
}

export async function fetchInstitutions() {
    return await contactsRepository.getAllInstitutions();
}

export async function createContact(formData: FormData) {
    const data = {
        title: String(formData.get("title")),
        name: String(formData.get("name")),
        email: String(formData.get("email")),
        phone: String(formData.get("phone")),
        cellphone: String(formData.get("cellPhone")),
        position_id: Number(formData.get("position_id")),
        institution_id: Number(formData.get("institution_id"))
    }

    await contactsRepository.createContact(data);
}

export async function fetchContacts() {
    return await contactsRepository.getAllContacts();
}