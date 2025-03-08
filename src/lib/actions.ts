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