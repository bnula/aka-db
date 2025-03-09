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

export async function createInstitution(formData: FormData) {
    const data = {
        name: String(formData.get("name")),
        street: String(formData.get("street")),
        city: String(formData.get("city")),
        website: String(formData.get("website")),
        facebook: String(formData.get("facebook")),
        instagram: String(formData.get("instagram")),
    }

    contactsRepository.createInstitution(data);
}

export async function fetchInstitutions() {
    return await contactsRepository.getAllInstitutions();
}

export async function createContact(formData: FormData) {
    const data = {
        title: formData.get("title"),
    }
}