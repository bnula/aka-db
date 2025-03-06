'use client'
import { Institution } from "@/lib/types/institution";
import { useEffect, useState } from "react";
import Navbar from "../ui/navbar";

export default function Home() {
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [name, setName] = useState<string>('');
    const [street, setStreet] = useState<string>('');
    const [city, setCity] = useState<string>('');

    useEffect(() => {
        fetch('/api/contacts')
        .then((res) => res.json())
        .then((data) => setInstitutions(data));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        console.log(institutions);
        e.preventDefault();
    };

    return (
        <div className="p-6">
            <Navbar />
        <form onSubmit={handleSubmit} className="space-y-4">
            <input placeholder="Jmeno" value={name} onChange={(e) => setName(e.target.value)} className="border p-2" />
            <input placeholder="Email" value={street} onChange={(e) => setStreet(e.target.value)} className="border p-2" />
            <input placeholder="Telefon" value={city} onChange={(e) => setCity(e.target.value)} className="border p-2" />
            <input placeholder="Typ" value={city} onChange={(e) => setCity(e.target.value)} className="border p-2" />
            <button type="submit" className="bg-blue-500 text-white p-2">Pridat Instituci</button>
        </form>
        <table className="w-full mt-6 border">
            <thead>
            <tr>
                <th className="border p-2">Jmeno</th>
                <th className="border p-2">Ulice</th>
                <th className="border p-2">Mesto</th>
                <th className="border p-2">Typ</th>
            </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="border p-2">Best divadlo evr</td>
                    <td className="border p-2">Vymyslena 189</td>
                    <td className="border p-2">Sudkov</td>
                    <td className="border p-2">Divadlo</td>
                </tr>
                <tr>
                    <td className="border p-2">ZS Nerealna</td>
                    <td className="border p-2">Nekde 18</td>
                    <td className="border p-2">Praha 9</td>
                    <td className="border p-2">Skola</td>
                </tr>
            </tbody>
        </table>
        </div>
    )
}
