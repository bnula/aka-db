'use client';

import { useEffect, useState, useTransition, useMemo, useCallback } from "react";
import Navbar from "./ui/navbar";
import { createContact, updateContact, fetchContacts, fetchInstitutions, fetchPositions } from "@/lib/actions";
import { Contact } from "@/lib/types/contact";
import { Position } from "@/lib/types/position";
import { Institution } from "@/lib/types/institution";

export default function Home() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [positions, setPositions] = useState<Position[]>([]);
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<Partial<Contact>>({});
    const [isPending, startTransition] = useTransition();
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        async function fetchData() {
            const contactsData = await fetchContacts();
            const positionsData = await fetchPositions();
            const institutionsData = await fetchInstitutions();

            setContacts(contactsData);
            setPositions(positionsData);
            setInstitutions(institutionsData);
        }

        fetchData();
    }, []);

    // Memoize the lookup functions
    const getPositionName = useCallback(
        (id: number) => positions.find((p) => p.id === id)?.name || "Unknown",
        [positions]
    );
    
    const getInstitutionName = useCallback(
        (id: number) => institutions.find((i) => i.id === id)?.name || "Unknown",
        [institutions]
    );

    // Filter contacts based on search term
    const filteredContacts = useMemo(() => {
        if (!searchTerm.trim()) return contacts;
        
        const searchTermLower = searchTerm.toLowerCase();
        return contacts.filter(contact => 
            (contact.title?.toLowerCase().includes(searchTermLower) || false) ||
            (contact.name?.toLowerCase().includes(searchTermLower) || false) ||
            (contact.email?.toLowerCase().includes(searchTermLower) || false) ||
            (contact.phone?.toLowerCase().includes(searchTermLower) || false) ||
            (contact.cellphone?.toLowerCase().includes(searchTermLower) || false) ||
            getPositionName(contact.position_id).toLowerCase().includes(searchTermLower) ||
            getInstitutionName(contact.institution_id).toLowerCase().includes(searchTermLower) ||
            (contact.notes?.toLowerCase().includes(searchTermLower) || false)
        );
    }, [contacts, searchTerm, getPositionName, getInstitutionName]);

    // // Filter positions based on search term
    // const filteredPositions = useMemo(() => {
    //     if (!searchTerm.trim()) return positions;
        
    //     const searchTermLower = searchTerm.toLowerCase();
    //     return positions.filter(position => 
    //         position.name.toLowerCase().includes(searchTermLower)
    //     );
    // }, [positions, searchTerm]);

    // // Filter institutions based on search term
    // const filteredInstitutions = useMemo(() => {
    //     if (!searchTerm.trim()) return institutions;
        
    //     const searchTermLower = searchTerm.toLowerCase();
    //     return institutions.filter(institution => 
    //         institution.name.toLowerCase().includes(searchTermLower)
    //     );
    // }, [institutions, searchTerm]);

    // Handles form submissions and refreshes data
    const handleSubmit = async (action: (formData: FormData) => Promise<void>, formData: FormData) => {
        await action(formData);
        refreshData();
    };

    // Refresh function to update data after actions
    const refreshData = () => {
        startTransition(async () => {
            const contactsData = await fetchContacts();
            setContacts(contactsData);
            setEditingId(null);
            setEditValues({});
        });
    };

    // Handle edit button click
    const handleEdit = (contact: Contact) => {
        setEditingId(contact.id);
        setEditValues(contact);
    };

    // Handle input change for editing
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditValues((prev) => ({ ...prev, [name]: value }));
    };

    // Handle save for edits
    const handleSave = async () => {
        if (!editingId) return;

        const formData = new FormData();
        Object.entries(editValues).forEach(([key, value]) => {
            if (value !== undefined) formData.append(key, String(value));
        });

        await updateContact(formData);
        refreshData();
    };

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="p-6 bg-gray-900 text-center">
            <Navbar />
            <h1 className="text-2xl font-semibold mb-4 text-white">Kontakty</h1>
            
            {/* Search field */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Vyhledat..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                />
            </div>
            
            <form action={(formData) => handleSubmit(createContact, formData)} className="space-y-4 md:grid md:grid-cols-4 md:gap-4 bg-gray-800 p-4 rounded-lg">
                <input placeholder="Titul" name="title" id="title" className="border p-2 rounded bg-gray-700 text-white" />
                <input placeholder="Jmeno" name="name" id="name" className="border p-2 rounded bg-gray-700 text-white" />
                <input placeholder="Email" name="email" id="email" className="border p-2 rounded bg-gray-700 text-white" />
                <input placeholder="Telefon" name="phone" id="phone" className="border p-2 rounded bg-gray-700 text-white" />
                <input placeholder="Mobil" name="cellphone" id="cellphone" className="border p-2 rounded bg-gray-700 text-white" />
                <select name="position_id" id="position_id" className="border p-2 rounded bg-gray-700 text-white">
                    {positions.map((p) => (
                        <option key={p.id} value={p.id} className="text-white">{p.name}</option>
                    ))}
                </select>
                <select name="institution_id" id="institution_id" className="border p-2 rounded bg-gray-700 text-white">
                    {institutions.map((i) => (
                        <option key={i.id} value={i.id} className="text-white">{i.name}</option>
                    ))}
                </select>
                <div className="flex items-end">
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full" disabled={isPending}>
                        {isPending ? "Přidávání..." : "Přidat kontakt"}
                    </button>
                </div>
                <textarea 
                    placeholder="Poznámky" 
                    name="notes" 
                    id="notes" 
                    rows={3}
                    className="border p-2 rounded bg-gray-700 text-white col-span-4"
                ></textarea>
            </form>

            {filteredContacts.length === 0 ? (
                <div className="mt-4 p-4 bg-gray-800 rounded text-white">
                    Žádné výsledky nenalezeny pro &quot;{searchTerm}&quot;
                </div>
            ) : (
                <table className="w-full border-collapse border border-gray-700 mt-4">
                    <thead>
                        <tr className="bg-gray-700">
                            <th className="border p-2 text-white">Titul</th>
                            <th className="border p-2 text-white">Jmeno</th>
                            <th className="border p-2 text-white">Email</th>
                            <th className="border p-2 text-white">Pevna linka</th>
                            <th className="border p-2 text-white">Mobil</th>
                            <th className="border p-2 text-white">Pozice</th>
                            <th className="border p-2 text-white">Instituce</th>
                            <th className="border p-2 text-white">Poznamky</th>
                            <th className="border p-2 text-white">Akce</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredContacts.map((contact) => (
                            <tr key={contact.id} className="border-gray-700">
                                <td className="border p-2 text-white">
                                    {editingId === contact.id ? (
                                        <input name="title" value={editValues.title || ""} onChange={handleChange} className="border p-1 bg-gray-800 text-white" />
                                    ) : (
                                        contact.title
                                    )}
                                </td>
                                <td className="border p-2 text-white">
                                    {editingId === contact.id ? (
                                        <input name="name" value={editValues.name || ""} onChange={handleChange} className="border p-1 bg-gray-800 text-white" />
                                    ) : (
                                        contact.name
                                    )}
                                </td>
                                <td className="border p-2 text-white">
                                    {editingId === contact.id ? (
                                        <input name="email" value={editValues.email || ""} onChange={handleChange} className="border p-1 bg-gray-800 text-white" />
                                    ) : (
                                        contact.email
                                    )}
                                </td>
                                <td className="border p-2 text-white">
                                    {editingId === contact.id ? (
                                        <input name="phone" value={editValues.phone || ""} onChange={handleChange} className="border p-1 bg-gray-800 text-white" />
                                    ) : (
                                        contact.phone
                                    )}
                                </td>
                                <td className="border p-2 text-white">
                                    {editingId === contact.id ? (
                                        <input name="cellphone" value={editValues.cellphone || ""} onChange={handleChange} className="border p-1 bg-gray-800 text-white" />
                                    ) : (
                                        contact.cellphone
                                    )}
                                </td>
                                <td className="border p-2 text-white">
                                    {editingId === contact.id ? (
                                        <select name="position_id" value={editValues.position_id || ""} onChange={handleChange} className="border p-1 bg-gray-800 text-white">
                                            {positions.map((p) => (
                                                <option key={p.id} value={p.id} className="text-white">{p.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        getPositionName(contact.position_id)
                                    )}
                                </td>
                                <td className="border p-2 text-white">
                                    {editingId === contact.id ? (
                                        <select name="institution_id" value={editValues.institution_id || ""} onChange={handleChange} className="border p-1 bg-gray-800 text-white">
                                            {institutions.map((i) => (
                                                <option key={i.id} value={i.id} className="text-white">{i.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        getInstitutionName(contact.institution_id)
                                    )}
                                </td>
                                <td className="border p-2 text-white">
                                    {editingId === contact.id ? (
                                        <textarea 
                                            name="notes" 
                                            value={editValues.notes || ""} 
                                            onChange={handleChange} 
                                            rows={3}
                                            className="border p-1 bg-gray-800 text-white w-full"
                                        />
                                    ) : (
                                        contact.notes
                                    )}
                                </td>
                                <td className="border p-2 gap-2 text-center">
                                    {editingId === contact.id ? (
                                        <button className="bg-green-500 text-white px-4 py-1 rounded" onClick={handleSave} disabled={isPending}>
                                            Uložit
                                        </button>
                                    ) : (
                                        <button className="bg-yellow-500 text-white px-4 py-1 rounded" onClick={() => handleEdit(contact)}>
                                            Upravit
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            
            <div className="mt-4 text-gray-400 text-sm">
                {filteredContacts.length > 0 && searchTerm && (
                    <p>Zobrazeno {filteredContacts.length} z {contacts.length} kontaktů</p>
                )}
            </div>
        </div>
    );
}
