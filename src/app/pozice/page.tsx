'use client';

import { useEffect, useState, useTransition } from "react";
import Navbar from "../ui/navbar";
import { 
  createInstitutionType, 
  createPosition, 
  updateInstitutionType, 
  updatePosition, 
  fetchInstitutionTypes, 
  fetchPositions 
} from "@/lib/actions";
import { InstitutionType } from "@/lib/types/institution_type";
import { Position } from "@/lib/types/position";

export default function Home() {
    const [positions, setPositions] = useState<Position[]>([]);
    const [institutionTypes, setInstitutionTypes] = useState<InstitutionType[]>([]);
    const [editing, setEditing] = useState<{ id: number | null; type: "position" | "institution" | null }>({
        id: null,
        type: null,
    });
    const [editValue, setEditValue] = useState<string>("");
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        async function fetchData() {
            const positionsData = await fetchPositions();
            const institutionTypesData = await fetchInstitutionTypes();

            setPositions(positionsData);
            setInstitutionTypes(institutionTypesData);
        }

        fetchData();
    }, []);

    const handleSubmit = async (action: (formData: FormData) => Promise<void>, formData: FormData) => {
        await action(formData);
        refreshData();
    };

    const refreshData = () => {
        startTransition(async () => {
            setPositions(await fetchPositions());
            setInstitutionTypes(await fetchInstitutionTypes());
            setEditing({ id: null, type: null });
        });
    };

    const handleEdit = (id: number, type: "position" | "institution", currentValue: string) => {
        setEditing({ id, type });
        setEditValue(currentValue);
    };

    const handleSave = async () => {
        if (!editing.id || !editing.type) return;
        
        const formData = new FormData();
        formData.append("id", String(editing.id));
        formData.append("name", editValue);

        editing.type === "position" ? await updatePosition(formData) : await updateInstitutionType(formData);
        refreshData();
    };

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6 bg-gray-900">
            <Navbar />
            
            <section className="bg-gray-900 shadow-md rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4">Pozice</h2>
                <table className="w-full border-collapse border border-gray-700">
                    <thead>
                        <tr className="bg-gray-800">
                            <th className="border p-2 bg-gray-700">Pozice</th>
                            <th className="border p-2 bg-gray-700">Akce</th>
                        </tr>
                    </thead>
                    <tbody>
                        {positions.map((p) => (
                            <tr key={p.id} className="border">
                                <td className="border p-2 bg-gray-700">
                                    {editing.id === p.id && editing.type === "position" ? (
                                        <input className="border p-2 w-full bg-gray-700" value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                                    ) : (
                                        p.name
                                    )}
                                </td>
                                <td className="border p-2 text-center bg-gray-700">
                                    {editing.id === p.id && editing.type === "position" ? (
                                        <button className="bg-green-500 text-white px-4 py-1 rounded" onClick={handleSave} disabled={isPending}>Uložit</button>
                                    ) : (
                                        <button className="bg-yellow-500 text-white px-4 py-1 rounded" onClick={() => handleEdit(p.id, "position", p.name)}>Upravit</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <form action={(formData) => handleSubmit(createPosition, formData)} className="mt-4 flex gap-2">
                    <input placeholder="Nazev" name="name" id="name" className="border p-2 flex-1 bg-gray-700" />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={isPending}>
                        {isPending ? "Přidávání..." : "Přidat pozici"}
                    </button>
                </form>
            </section>

            <section className="bg-gray-800 shadow-md rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4">Typ instituce</h2>
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-700">
                            <th className="border p-2 bg-gray-700">Typ</th>
                            <th className="border p-2 bg-gray-700">Akce</th>
                        </tr>
                    </thead>
                    <tbody>
                        {institutionTypes.map((it) => (
                            <tr key={it.id} className="border">
                                <td className="border p-2 bg-gray-700">
                                    {editing.id === it.id && editing.type === "institution" ? (
                                        <input className="border p-2 w-full bg-gray-700" value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                                    ) : (
                                        it.name
                                    )}
                                </td>
                                <td className="border p-2 text-center bg-gray-700">
                                    {editing.id === it.id && editing.type === "institution" ? (
                                        <button className="bg-green-500 text-white px-4 py-1 rounded" onClick={handleSave} disabled={isPending}>Uložit</button>
                                    ) : (
                                        <button className="bg-yellow-500 text-white px-4 py-1 rounded" onClick={() => handleEdit(it.id, "institution", it.name)}>Upravit</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <form action={(formData) => handleSubmit(createInstitutionType, formData)} className="mt-4 flex gap-2">
                    <input placeholder="Nazev" name="name" id="name" className="border p-2 flex-1 bg-gray-700" />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={isPending}>
                        {isPending ? "Přidávání..." : "Přidat typ instituce"}
                    </button>
                </form>
            </section>
        </div>
    );
}
