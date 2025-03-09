'use client'
import { Contact } from "@/lib/types/contact";
import { useEffect, useState } from "react";
import Navbar from "./ui/navbar";
import { contactsRepository } from "@/lib/data/contactsRepository";

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [cellPhone, setcellPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [positionId, setPositionId] = useState<string>('');
  const [institutionId, setInstitutionId] = useState<string>('');

  useEffect(() => {
    async function fetchContacts() {
      const data = await contactsRepository.getAllContacts();
      console.log(data)
    }
    fetchContacts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(institutionId);
    console.log(positionId);
    console.log(phone);
    const newContact: Contact = {
      id: -1,
      cellPhone: cellPhone,
      email: email,
      institution_id: Number(institutionId),
      position_id: Number(positionId),
      name: name,
      phone: phone,
      title: title
    }
    console.log(newContact);
    setContacts([...contacts, newContact]);
  };

  return (
    <div className="p-6">
        <Navbar />
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Titul" name="title" id="title" className="border p-2" />
        <input placeholder="Jmeno" value={name} onChange={(e) => setName(e.target.value)} className="border p-2" />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2" />
        <input placeholder="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} className="border p-2" />
        <input placeholder="Mobil" value={cellPhone} onChange={(e) => setcellPhone(e.target.value)} className="border p-2" />
        <select value={positionId} onChange={(e) => setPositionId(e.target.value)} className="border p-2">
            <option value="" className="text-black">Pozice</option>
            <option value="Manager" className="text-black">Nejaka</option>
            <option value="Developer" className="text-black">Nejaka jina</option>
            <option value="Designer" className="text-black">Treti</option>
          </select>
        <select value={institutionId} onChange={(e) => setInstitutionId(e.target.value)} className="border p-2">
            <option value="" className="text-black">Instituce</option>
            <option value="Manager" className="text-black">Best divadlo evr</option>
            <option value="Developer" className="text-black">Jine divadlo</option>
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
          <tr>
            <td className="border p-2">Judr.</td>
            <td className="border p-2">Franta Uzivatel</td>
            <td className="border p-2">franta@uzivatel.cz</td>
            <td className="border p-2">123456789</td>
            <td className="border p-2">123456789</td>
            <td className="border p-2">Nejaka</td>
            <td className="border p-2">Best divadlo evr</td>
          </tr>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td className="border p-2">{contact.title}</td>
              <td className="border p-2">{contact.name}</td>
              <td className="border p-2">{contact.email}</td>
              <td className="border p-2">{contact.phone}</td>
              <td className="border p-2">{contact.cellPhone}</td>
              <td className="border p-2">{contact.position_id}</td>
              <td className="border p-2">{contact.institution_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
