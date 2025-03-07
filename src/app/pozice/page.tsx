import Navbar from "../ui/navbar";

import { createPosition, fetchPositions } from "@/lib/actions";

export default async function Home() {
    const positions = await fetchPositions()

    return (
        <div className="p-6">
        <Navbar />
        <form action={createPosition} className="space-y-4">
            <input placeholder="Nazev" name="name" id="name" className="border p-2" />
            <button type="submit" className="bg-blue-500 text-white p-2">Pridat pozici</button>
        </form>
        <table className="w-full mt-6 border">
            <thead>
            <tr>
                <th className="border p-2">Pozice</th>
            </tr>
            </thead>
            <tbody>
                {
                    positions.map((p) => {
                        return (
                            <tr key={p.id}>
                                <td className="border p-2">{p.name}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
        </div>
    )
}
