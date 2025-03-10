'use client';

import { InstitutionType } from "@/lib/types/institution_type";
import { Institution } from "@/lib/types/institution";
import Navbar from "../ui/navbar";
import { useEffect, useState, useTransition } from "react";
import { fetchInstitutions, fetchInstitutionTypes, createInstitution, updateInstitution } from "@/lib/actions";

export default function Home() {
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [types, setTypes] = useState<InstitutionType[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<Partial<Institution>>({});
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        async function fetchData() {
            const institutionsData = await fetchInstitutions();
            const typesData = await fetchInstitutionTypes();
            setInstitutions(institutionsData);
            setTypes(typesData);
        }
        fetchData();
    }, []);

    const getTypeName = (id: number) => types.find((t) => t.id === id)?.name || "Unknown";

    const handleSubmit = async (action: (formData: FormData) => Promise<void>, formData: FormData) => {
        await action(formData);
        refreshData();
    };

    const refreshData = () => {
        startTransition(async () => {
            const institutionsData = await fetchInstitutions();
            setInstitutions(institutionsData);
            setEditingId(null);
            setEditValues({});
        });
    };

    const handleEdit = (institution: Institution) => {
        setEditingId(institution.id);
        setEditValues(institution);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!editingId) return;

        const formData = new FormData();
        Object.entries(editValues).forEach(([key, value]) => {
            if (value !== undefined) formData.append(key, String(value));
        });

        await updateInstitution(formData);
        refreshData();
    };

    return (
        <div className="p-6 bg-gray-900 text-white min-h-screen">
            <Navbar />
            
            <form action={(formData) => handleSubmit(createInstitution, formData)} className="space-y-4 md:flex md:items-center md:space-y-0 md:space-x-4 bg-gray-800 p-4 rounded-lg">
                <input placeholder="Jmeno" name="name" id="name" className="border p-2 rounded bg-gray-700 text-white" />
                <input placeholder="Ulice" name="street" id="street" className="border p-2 rounded bg-gray-700 text-white" />
                <input placeholder="Mesto" name="city" id="city" className="border p-2 rounded bg-gray-700 text-white" />
                <input placeholder="Web" name="website" id="website" className="border p-2 rounded bg-gray-700 text-white" />
                <input placeholder="Facebook" name="facebook" id="facebook" className="border p-2 rounded bg-gray-700 text-white" />
                <input placeholder="Instagram" name="instagram" id="instagram" className="border p-2 rounded bg-gray-700 text-white" />
                <select className="border p-2 rounded bg-gray-700 text-white" name="type" id="type">
                    {types.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={isPending}>
                    {isPending ? "Přidávání..." : "Přidat kontakt"}
                </button>
            </form>

            <table className="w-full mt-6 border border-gray-700">
                <thead>
                    <tr className="bg-gray-800">
                        <th className="border p-2">Jmeno</th>
                        <th className="border p-2">Ulice</th>
                        <th className="border p-2">Mesto</th>
                        <th className="border p-2">Web</th>
                        <th className="border p-2">Facebook</th>
                        <th className="border p-2">Instagram</th>
                        <th className="border p-2">Typ</th>
                        <th className="border p-2">Poznamky</th>
                        <th className="border p-2">Akce</th>
                    </tr>
                </thead>
                <tbody>
                    {institutions.map((i) => (
                        <tr key={i.id} className="bg-gray-800">
                            <td className="border p-2">{editingId === i.id ? <input name="name" value={editValues.name || ""} onChange={handleChange} className="border p-1 bg-gray-800 text-white" /> : i.name}</td>
                            <td className="border p-2">{editingId === i.id ? <input name="street" value={editValues.street || ""} onChange={handleChange} className="border p-1 bg-gray-800 text-white" /> : i.street}</td>
                            <td className="border p-2">{editingId === i.id ? <input name="city" value={editValues.city || ""} onChange={handleChange} className="border p-1 bg-gray-800 text-white" /> : i.city}</td>
                            <td className="border p-2">{editingId === i.id ? <input name="website" value={editValues.website || ""} onChange={handleChange} className="border p-1 bg-gray-800 text-white" /> : i.website}</td>
                            <td className="border p-2">{editingId === i.id ? <input name="facebook" value={editValues.facebook || ""} onChange={handleChange} className="border p-1 bg-gray-800 text-white" /> : i.facebook}</td>
                            <td className="border p-2">{editingId === i.id ? <input name="instagram" value={editValues.instagram || ""} onChange={handleChange} className="border p-1 bg-gray-800 text-white" /> : i.instagram}</td>
                            <td className="border p-2">{editingId === i.id ? <select name="type_id" value={editValues.type_id || ""} onChange={handleChange} className="border p-1 bg-gray-800 text-white">{types.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}</select> : getTypeName(i.type_id)}</td>
                            <td className="border p-2">{editingId === i.id ? <input name="notes" value={editValues.notes || ""} onChange={handleChange} className="border p-1 bg-gray-800 text-white" /> : i.notes}</td>
                            <td className="border p-2"><button className="bg-yellow-500 text-white p-1 rounded" onClick={() => handleEdit(i)}>Upravit</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
