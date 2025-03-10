'use client';

import { InstitutionType } from "@/lib/types/institution_type";
import { Institution } from "@/lib/types/institution";
import Navbar from "../ui/navbar";
import { useEffect, useState, useTransition } from "react";
import { fetchInstitutions, fetchInstitutionTypes, createInstitution } from "@/lib/actions";

export default function Home() {
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [types, setTypes] = useState<InstitutionType[]>([]);
    const [isPending, startTransition] = useTransition(); // Helps manage async state updates

    useEffect(() => {
        async function fetchData() {
            const institutionsData = await fetchInstitutions();
            const typesData = await fetchInstitutionTypes();
            setInstitutions(institutionsData);
            setTypes(typesData);
        }
        fetchData();
    }, []);

    const getTypeName = (id: number) => {
        const type = types.find((t) => t.id === id);
        return type ? type.name : "Unknown";
    };

    // Handles form submissions and refreshes data
    const handleSubmit = async (action: (formData: FormData) => Promise<void>, formData: FormData) => {
        await action(formData); // Call the server action
        startTransition(async () => {
        const institutionsData = await fetchInstitutions();
        
        setInstitutions(institutionsData);
        });
    };

    return (
        <div className="p-6">
            <Navbar />
            <form action={(formData) => handleSubmit(createInstitution, formData)} className="space-y-4">
                <input placeholder="Jmeno" name="name" id="name" className="border p-2" />
                <input placeholder="Ulice" name="street" id="street" className="border p-2" />
                <input placeholder="Mesto" name="city" id="city" className="border p-2" />
                <input placeholder="Web" name="website" id="website" className="border p-2" />
                <input placeholder="Facebook" name="facebook" id="facebook" className="border p-2" />
                <input placeholder="Instagram" name="instagram" id="instagram" className="border p-2" />
                <select className="border p-2" name="type" id="type">
                    {types.map((t) => (
                        <option key={t.id} value={t.id} className="text-black">{t.name}</option>
                    ))}
                </select>
                <button type="submit" className="bg-blue-500 text-white p-2" disabled={isPending}>
                    {isPending ? "Přidávání..." : "Přidat kontakt"}
                </button>
            </form>
            <table className="w-full mt-6 border">
                <thead>
                    <tr>
                        <th className="border p-2">Jmeno</th>
                        <th className="border p-2">Ulice</th>
                        <th className="border p-2">Mesto</th>
                        <th className="border p-2">Web</th>
                        <th className="border p-2">Facebook</th>
                        <th className="border p-2">Instagram</th>
                        <th className="border p-2">Typ</th>
                    </tr>
                </thead>
                <tbody>
                    {institutions.map((i) => (
                        <tr key={i.id}>
                            <td className="border p-2">{i.name}</td>
                            <td className="border p-2">{i.street}</td>
                            <td className="border p-2">{i.city}</td>
                            <td className="border p-2">{i.website}</td>
                            <td className="border p-2">{i.facebook}</td>
                            <td className="border p-2">{i.instagram}</td>
                            <td className="border p-2">{getTypeName(i.type_id)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
