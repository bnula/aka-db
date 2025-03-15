'use client';

import { InstitutionType } from "@/lib/types/institution_type";
import { Institution } from "@/lib/types/institution";
import Navbar from "../ui/navbar";
import { useEffect, useState, useTransition, useMemo, useCallback } from "react";
import { fetchInstitutions, fetchInstitutionTypes, createInstitution, updateInstitution, fetchCounties } from "@/lib/actions";
import { County } from "@/lib/types/county";

export default function Home() {
    const [counties, setCounties] = useState<County[]>([]);
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [types, setTypes] = useState<InstitutionType[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<Partial<Institution>>({});
    const [isPending, startTransition] = useTransition();
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        async function fetchData() {
            const institutionsData = await fetchInstitutions();
            const typesData = await fetchInstitutionTypes();
            const countiesData = await fetchCounties();
            setInstitutions(institutionsData);
            setTypes(typesData);
            setCounties(countiesData);
            console.log(countiesData)
        }
        fetchData();
    }, []);

    // Memoize the lookup functions
    const getTypeName = useCallback(
        (id: number) => types.find((t) => t.id === id)?.name || "Unknown",
        [types]
    );
    
    const getCountyName = useCallback(
        (id: number) => counties.find((c) => c.id === id)?.name || "Unknown",
        [counties]
    );

    // Filtered data based on search term
    const filteredInstitutions = useMemo(() => {
        if (!searchTerm.trim()) return institutions;
        
        const searchTermLower = searchTerm.toLowerCase();
        return institutions.filter(institution => 
            institution.name?.toLowerCase().includes(searchTermLower) ||
            institution.street?.toLowerCase().includes(searchTermLower) ||
            institution.city?.toLowerCase().includes(searchTermLower) ||
            getTypeName(institution.type_id)?.toLowerCase().includes(searchTermLower) ||
            getCountyName(institution.county_id)?.toLowerCase().includes(searchTermLower) ||
            institution.website?.toLowerCase().includes(searchTermLower) ||
            institution.facebook?.toLowerCase().includes(searchTermLower) ||
            institution.instagram?.toLowerCase().includes(searchTermLower) ||
            institution.notes?.toLowerCase().includes(searchTermLower)
        );
    }, [institutions, searchTerm, getCountyName, getTypeName]);

    // const filteredTypes = useMemo(() => {
    //     if (!searchTerm.trim()) return types;
        
    //     const searchTermLower = searchTerm.toLowerCase();
    //     return types.filter(type => 
    //         type.name?.toLowerCase().includes(searchTermLower)
    //     );
    // }, [types, searchTerm]);

    // const filteredCounties = useMemo(() => {
    //     if (!searchTerm.trim()) return counties;
        
    //     const searchTermLower = searchTerm.toLowerCase();
    //     return counties.filter(county => 
    //         county.name?.toLowerCase().includes(searchTermLower)
    //     );
    // }, [counties, searchTerm]);

    // Handles form submissions and refreshes data
    const handleSubmit = async (action: (formData: FormData) => Promise<void>, formData: FormData) => {
        await action(formData);
        refreshData();
    };

    // Refresh function to update data after actions
    const refreshData = () => {
        startTransition(async () => {
            const institutionsData = await fetchInstitutions();
            setInstitutions(institutionsData);
            setEditingId(null);
            setEditValues({});
        });
    };

    // Handle edit button click
    const handleEdit = (institution: Institution) => {
        setEditingId(institution.id);
        setEditValues(institution);
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

        await updateInstitution(formData);
        refreshData();
    };

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="p-6 bg-gray-900 text-center">
            <Navbar />
            <h1 className="text-2xl font-semibold mb-4 text-white">Instituce</h1>
            
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
            
            <form action={(formData) => handleSubmit(createInstitution, formData)} className="space-y-4 md:grid md:grid-cols-4 md:gap-4 bg-gray-800 p-4 rounded-lg">
                <input placeholder="Jmeno" name="name" id="name" className="border p-2 rounded bg-gray-700 text-white" />
                <input placeholder="Ulice" name="street" id="street" className="border p-2 rounded bg-gray-700 text-white" />
                <input placeholder="Mesto" name="city" id="city" className="border p-2 rounded bg-gray-700 text-white" />
                <select className="border p-2 rounded bg-gray-700 text-white" name="type" id="type">
                    {types.map((t) => (
                        <option key={t.id} value={t.id} className="text-white">{t.name}</option>
                    ))}
                </select>
                <input placeholder="Web" name="website" id="website" className="border p-2 rounded bg-gray-700 text-white" />
                <input placeholder="Facebook" name="facebook" id="facebook" className="border p-2 rounded bg-gray-700 text-white" />
                <input placeholder="Instagram" name="instagram" id="instagram" className="border p-2 rounded bg-gray-700 text-white" />
                <select className="border p-2 rounded bg-gray-700 text-white" name="county" id="county">
                    {counties.map((c) => (
                        <option key={c.id} value={c.id} className="text-white">{c.name}</option>
                    ))}
                </select>
                <textarea 
                    placeholder="Poznámky" 
                    name="notes" 
                    id="notes" 
                    rows={3}
                    className="border p-2 rounded bg-gray-700 text-white col-span-3"
                ></textarea>
                <div className="flex items-end">
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full" disabled={isPending}>
                        {isPending ? "Přidávání..." : "Přidat kontakt"}
                    </button>
                </div>
            </form>

            {filteredInstitutions.length === 0 ? (
                <div className="mt-4 p-4 bg-gray-800 rounded text-white">
                    Žádné výsledky nenalezeny pro &quot;{searchTerm}&quot;
                </div>
            ) : (
                <table className="w-full border-collapse border border-gray-700 mt-4">
                    <thead>
                        <tr className="bg-gray-700">
                            <th className="border p-2 text-white">Jmeno</th>
                            <th className="border p-2 text-white">Ulice</th>
                            <th className="border p-2 text-white">Mesto</th>
                            <th className="border p-2 text-white">Kraj</th>
                            <th className="border p-2 text-white">Web</th>
                            <th className="border p-2 text-white">Facebook</th>
                            <th className="border p-2 text-white">Instagram</th>
                            <th className="border p-2 text-white">Typ</th>
                            <th className="border p-2 text-white">Poznamky</th>
                            <th className="border p-2 text-white">Akce</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInstitutions.map((i) => (
                            <tr key={i.id} className="border-gray-700">
                                <td className="border p-2 text-white">
                                    {editingId === i.id ? (
                                        <input name="name" value={editValues.name || ""} onChange={handleChange} className="border p-1 bg-gray-800 text-white" />
                                    ) : (
                                        i.name
                                    )}
                                </td>
                                <td className="border p-2 text-white">
                                    {editingId === i.id ? (
                                        <input name="street" value={editValues.street || ""} onChange={handleChange} className="border p-1 bg-gray-800 text-white" />
                                    ) : (
                                        i.street
                                    )}
                                </td>
                                <td className="border p-2 text-white">
                                    {editingId === i.id ? (
                                        <input name="city" value={editValues.city || ""} onChange={handleChange} className="border p-1 bg-gray-800 text-white" />
                                    ) : (
                                        i.city
                                    )}
                                </td>
                                <td className="border p-2 text-white">
                                    {editingId === i.id ? (
                                        <select name="county_id" value={editValues.county_id || ""} onChange={handleChange} className="border p-1 bg-gray-800 text-white">
                                            {counties.map((c) => (
                                                <option key={c.id} value={c.id} className="text-white">{c.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        getCountyName(i.county_id)
                                    )}
                                </td>
                                <td className="border p-2 text-white">
                                    {editingId === i.id ? (
                                        <input name="website" value={editValues.website || ""} onChange={handleChange} className="border p-1 bg-gray-800 text-white" />
                                    ) : (
                                        i.website
                                    )}
                                </td>
                                <td className="border p-2 text-white">
                                    {editingId === i.id ? (
                                        <input name="facebook" value={editValues.facebook || ""} onChange={handleChange} className="border p-1 bg-gray-800 text-white" />
                                    ) : (
                                        i.facebook
                                    )}
                                </td>
                                <td className="border p-2 text-white">
                                    {editingId === i.id ? (
                                        <input name="instagram" value={editValues.instagram || ""} onChange={handleChange} className="border p-1 bg-gray-800 text-white" />
                                    ) : (
                                        i.instagram
                                    )}
                                </td>
                                <td className="border p-2 text-white">
                                    {editingId === i.id ? (
                                        <select name="type_id" value={editValues.type_id || ""} onChange={handleChange} className="border p-1 bg-gray-800 text-white">
                                            {types.map((t) => (
                                                <option key={t.id} value={t.id} className="text-white">{t.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        getTypeName(i.type_id)
                                    )}
                                </td>
                                <td className="border p-2 text-white">
                                    {editingId === i.id ? (
                                        <textarea 
                                            name="notes" 
                                            value={editValues.notes || ""} 
                                            onChange={handleChange} 
                                            rows={3}
                                            className="border p-1 bg-gray-800 text-white w-full"
                                        />
                                    ) : (
                                        i.notes
                                    )}
                                </td>
                                <td className="border p-2 gap-2 text-center">
                                    {editingId === i.id ? (
                                        <button className="bg-green-500 text-white px-4 py-1 rounded" onClick={handleSave} disabled={isPending}>
                                            Uložit
                                        </button>
                                    ) : (
                                        <button className="bg-yellow-500 text-white px-4 py-1 rounded" onClick={() => handleEdit(i)}>
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
                {filteredInstitutions.length > 0 && searchTerm && (
                    <p>Zobrazeno {filteredInstitutions.length} z {institutions.length} institucí</p>
                )}
            </div>
        </div>
    );
}
