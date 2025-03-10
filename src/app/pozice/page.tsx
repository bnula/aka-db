'use client';

import { useEffect, useState, useTransition } from "react";
import Navbar from "../ui/navbar";
import { createInstitutionType, createPosition, fetchInstitutionTypes, fetchPositions } from "@/lib/actions";
import { InstitutionType } from "@/lib/types/institution_type";
import { Position } from "@/lib/types/position";

export default function Home() {
    const [positions, setPositions] = useState<Position[]>([]);
    const [institutionTypes, setInstitutionTypes] = useState<InstitutionType[]>([]);
    const [isPending, startTransition] = useTransition(); // Helps manage async state updates

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
        await action(formData); // Call the server action
        startTransition(async () => {
        const positionsData = await fetchPositions();
        const institutionTypesData = await fetchInstitutionTypes();

        setPositions(positionsData);
        setInstitutionTypes(institutionTypesData);
        });
    };

    return (
        <div className="p-6">
        <Navbar />

        {/* Position Form */}
        <form action={(formData) => handleSubmit(createPosition, formData)} className="space-y-4">
            <table className="w-full mt-6 border">
            <thead>
                <tr>
                <th className="border p-2">Pozice</th>
                </tr>
            </thead>
            <tbody>
                {positions.map((p) => (
                <tr key={p.id}>
                    <td className="border p-2">{p.name}</td>
                </tr>
                ))}
            </tbody>
            </table>
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
                </tr>
            </thead>
            <tbody>
                {institutionTypes.map((it) => (
                <tr key={it.id}>
                    <td className="border p-2">{it.name}</td>
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
