import Navbar from "../ui/navbar";
import { createInstitution, fetchInstitutions } from "@/lib/actions";

export default async function Home() {
    const institutions = await fetchInstitutions();

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
            </tr>
            </thead>
            <tbody>
                {
                    institutions.map((i) => {
                        return (
                            <tr>
                                <td className="border p-2">{i.name}</td>
                                <td className="border p-2">{i.street}</td>
                                <td className="border p-2">{i.city}</td>
                                <td className="border p-2">{i.website}</td>
                                <td className="border p-2">{i.facebook}</td>
                                <td className="border p-2">{i.instagram}</td>
                            </tr>
                        )
                    })
                }
                <tr>
                    <td className="border p-2">Best divadlo evr</td>
                    <td className="border p-2">Vymyslena 189</td>
                    <td className="border p-2">Sudkov</td>
                    <th className="border p-2">www.bde.cz</th>
                    <th className="border p-2"></th>
                    <th className="border p-2"></th>
                </tr>
                <tr>
                    <td className="border p-2">ZS Nerealna</td>
                    <td className="border p-2">Nekde 18</td>
                    <td className="border p-2">Praha 9</td>
                    <th className="border p-2">www.zsnr.cz</th>
                    <th className="border p-2"></th>
                    <th className="border p-2"></th>
                </tr>
            </tbody>
        </table>
        </div>
    )
}
