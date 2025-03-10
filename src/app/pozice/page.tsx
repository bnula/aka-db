'use client';

import { useEffect, useState, useTransition } from "react";
import Navbar from "../ui/navbar";
import { createInstitutionType, createPosition, updateInstitutionType, updatePosition, fetchInstitutionTypes, fetchPositions } from "@/lib/actions";
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

    // Handles form submissions and refreshes data
    const handleSubmit = async (action: (formData: FormData) => Promise<void>, formData: FormData) => {
        await action(formData);
        refreshData();
    };

    // Refresh function to update data after actions
    const refreshData = () => {
        startTransition(async () => {
        const positionsData = await fetchPositions();
        const institutionTypesData = await fetchInstitutionTypes();

        setPositions(positionsData);
        setInstitutionTypes(institutionTypesData);
        setEditing({ id: null, type: null });
        });
    };

    // Handles edit button click
    const handleEdit = (id: number, type: "position" | "institution", currentValue: string) => {
        setEditing({ id, type });
        setEditValue(currentValue);
    };

    // Handles save for edits
    const handleSave = async () => {
        if (!editing.id || !editing.type) return;
        
        const formData = new FormData();
        formData.append("id", String(editing.id));
        formData.append("name", editValue);

        if (editing.type === "position") {
        await updatePosition(formData);
        } else {
        await updateInstitutionType(formData);
        }

        refreshData();
    };

    return (
        <div className="p-6">
        <Navbar />

        {/* Position Form */}
        <table className="w-full mt-6 border">
            <thead>
                <tr>
                <th className="border p-2">Pozice</th>
                <th className="border p-2">Akce</th>
                </tr>
            </thead>
            <tbody>
                {positions.map((p) => (
                <tr key={p.id}>
                    <td className="border p-2">
                    {editing.id === p.id && editing.type === "position" ? (
                        <input
                        className="border p-1"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        />
                    ) : (
                        p.name
                    )}
                    </td>
                    <td className="border p-2">
                    {editing.id === p.id && editing.type === "position" ? (
                        <button className="bg-green-500 text-white p-1" onClick={handleSave} disabled={isPending}>
                        Uložit
                        </button>
                    ) : (
                        <button className="bg-yellow-500 text-white p-1" onClick={() => handleEdit(p.id, "position", p.name)}>
                        Upravit
                        </button>
                    )}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        <form action={(formData) => handleSubmit(createPosition, formData)} className="space-y-4">
            <input placeholder="Nazev" name="name" id="name" className="border p-2" />
            <button type="submit" className="bg-blue-500 text-white p-2" disabled={isPending}>
            {isPending ? "Přidávání..." : "Přidat pozici"}
            </button>
        </form>

        <br />

        {/* Institution Type Form */}
        <form action={(formData) => handleSubmit(createInstitutionType, formData)} className="space-y-4">
            <table className="w-full mt-6 border">
            <thead>
                <tr>
                <th className="border p-2">Typ instituce</th>
                <th className="border p-2">Akce</th>
                </tr>
            </thead>
            <tbody>
                {institutionTypes.map((it) => (
                <tr key={it.id}>
                    <td className="border p-2">
                    {editing.id === it.id && editing.type === "institution" ? (
                        <input
                        className="border p-1"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        />
                    ) : (
                        it.name
                    )}
                    </td>
                    <td className="border p-2">
                    {editing.id === it.id && editing.type === "institution" ? (
                        <button className="bg-green-500 text-white p-1" onClick={handleSave} disabled={isPending}>
                        Uložit
                        </button>
                    ) : (
                        <button className="bg-yellow-500 text-white p-1" onClick={() => handleEdit(it.id, "institution", it.name)}>
                        Upravit
                        </button>
                    )}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
            <input placeholder="Nazev" name="name" id="name" className="border p-2" />
            <button type="submit" className="bg-blue-500 text-white p-2" disabled={isPending}>
            {isPending ? "Přidávání..." : "Přidat typ instituce"}
            </button>
        </form>
        </div>
    );
}
