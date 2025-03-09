import { InstitutionType } from "@/lib/types/institution_type";
import Navbar from "../ui/navbar";
import { createInstitution, fetchInstitutions, fetchInstitutionTypes } from "@/lib/actions";

export default async function Home() {
    const institutions = await fetchInstitutions();
    const types = await fetchInstitutionTypes();

    const getTypeName = (id: number) => {
        return types.filter((t: InstitutionType) => t.id === id)[0].name;
    }

    return (
        <div className="p-6">
            <Navbar />
        <form action={createInstitution} className="space-y-4">
            <input placeholder="Jmeno" name="name" id="name" className="border p-2" />
            <input placeholder="Ulice" name="street" id="street" className="border p-2" />
            <input placeholder="Mesto" name="city" id="city" className="border p-2" />
            <input placeholder="Web" name="website" id="website" className="border p-2" />
            <input placeholder="Facebook" name="facebook" id="facebook" className="border p-2" />
            <input placeholder="Instagram" name="instagram" id="instagram" className="border p-2" />
            <select className="border p-2"  name="type" id="type">
                {types.map((t: InstitutionType) => {
                    return (
                    <option key={t.id} value={t.id} className="text-black">{t.name}</option>
                    )
                })}
                </select>
            <button type="submit" className="bg-blue-500 text-white p-2">Pridat Instituci</button>
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
                {
                    institutions.map((i) => {
                        return (
                            <tr key={i.id}>
                                <td className="border p-2">{i.name}</td>
                                <td className="border p-2">{i.street}</td>
                                <td className="border p-2">{i.city}</td>
                                <td className="border p-2">{i.website}</td>
                                <td className="border p-2">{i.facebook}</td>
                                <td className="border p-2">{i.instagram}</td>
                                <td className="border p-2">{
                                    getTypeName(i.type_id)
                                    }</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
        </div>
    )
}
