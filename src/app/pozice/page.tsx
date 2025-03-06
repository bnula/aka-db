'use client'
import { Institution } from "@/lib/types/institution";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../ui/navbar";

export default function Home() {
    const [positions, setPositions] = useState<Institution[]>([]);
    const [name, setName] = useState<string>('');

    useEffect(() => {
        fetch('/api/contacts')
        .then((res) => res.json())
        .then((data) => setPositions(data));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <div className="p-6">
        <Navbar />
        <form onSubmit={handleSubmit} className="space-y-4">
            <input placeholder="Nazev" value={name} onChange={(e) => setName(e.target.value)} className="border p-2" />
            <button type="submit" className="bg-blue-500 text-white p-2">Pridat pozici</button>
        </form>
        <table className="w-full mt-6 border">
            <thead>
            <tr>
                <th className="border p-2">Pozice</th>
            </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="border p-2">Nejaka</td>
                </tr>
                <tr>
                    <td className="border p-2">Nejaka jina</td>
                </tr>
                <tr>
                    <td className="border p-2">Treti</td>
                </tr>
            </tbody>
        </table>
        </div>
    )
}
