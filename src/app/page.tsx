import Navbar from "./ui/navbar";
import { createContact, fetchContacts, fetchInstitutions, fetchPositions } from "@/lib/actions";

export default async function Home() {
  const contacts = await fetchContacts();
  const positions = await fetchPositions();
  const institutions = await fetchInstitutions();

  const getPositionName = (id: number) => {
    return positions.filter((p) => p.id === id)[0].name;
  }

  const getInstitutionName = (id: number) => {
    return institutions.filter((i) => i.id === id)[0].name;
  }

  return (
    <div className="p-6">
        <Navbar />
      <form action={createContact} className="space-y-4">
        <input placeholder="Titul" name="title" id="title" className="border p-2" />
        <input placeholder="Jmeno" name="name" id="name" className="border p-2" />
        <input placeholder="Email" name="email" id="email" className="border p-2" />
        <input placeholder="Telefon" name="phone" id="phone" className="border p-2" />
        <input placeholder="Mobil" name="cellPhone" id="cellPhone" className="border p-2" />
        <select name="position_id" id="position_id" className="border p-2">
          {positions.map((p) => {
            return (
              <option key={p.id} value={p.id} className="text-black">{p.name}</option>
            )
          })}
        </select>
        <select name="institution_id" id="institution_id" className="border p-2">
            {institutions.map((i) => {
              return (
                <option key={i.id} value={i.id} className="text-black">{i.name}</option>
              )
            })}
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2">Pridat Kontakt</button>
      </form>
      <table className="w-full mt-6 border">
        <thead>
          <tr>
            <th className="border p-2">Titul</th>
            <th className="border p-2">Jmeno</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Pevna linka</th>
            <th className="border p-2">Mobil</th>
            <th className="border p-2">Pozice</th>
            <th className="border p-2">Instituce</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td className="border p-2">{contact.title}</td>
              <td className="border p-2">{contact.name}</td>
              <td className="border p-2">{contact.email}</td>
              <td className="border p-2">{contact.phone}</td>
              <td className="border p-2">{contact.cellphone}</td>
              <td className="border p-2">{getPositionName(contact.position_id)}</td>
              <td className="border p-2">{getInstitutionName(contact.institution_id)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
