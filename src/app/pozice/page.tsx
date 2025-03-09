import { InstitutionType } from "@/lib/types/institution_type";
import Navbar from "../ui/navbar";

import { createInstitutionType, createPosition, fetchInstitutionTypes, fetchPositions } from "@/lib/actions";
import { Position } from "@/lib/types/position";

export default async function Home() {
    const positions = await fetchPositions();
    const institutionTypes = await fetchInstitutionTypes();

    return (
        <div className="p-6">
        <Navbar />
        <form action={createPosition} className="space-y-4">
            <table className="w-full mt-6 border">
                <thead>
                    <tr>
                        <th className="border p-2">Pozice</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        positions.map((p: Position) => {
                            return (
                                <tr key={p.id}>
                                    <td className="border p-2">{p.name}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <input placeholder="Nazev" name="name" id="name" className="border p-2" />
            <button type="submit" className="bg-blue-500 text-white p-2">Pridat pozici</button>
        </form>
        <br/>
        <form action={createInstitutionType} className="space-y-4">
            <table className="w-full mt-6 border">
                <thead>
                    <tr>
                        <th className="border p-2">Typ instituce</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        institutionTypes.map((it: InstitutionType) => {
                            return (
                                <tr key={it.id}>
                                    <td className="border p-2">{it.name}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <input placeholder="Nazev" name="name" id="name" className="border p-2" />
            <button type="submit" className="bg-blue-500 text-white p-2">Pridat typ instituce</button>
        </form>
        </div>
    )
}
