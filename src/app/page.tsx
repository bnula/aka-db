'use client'
import { Contact } from "@/lib/types/contact";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "./ui/navbar";

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const [institution, setInstitution] = useState<string>('');

  useEffect(() => {
    fetch('/api/contacts')
      .then((res) => res.json())
      .then((data) => setContacts(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });
    const newContact = await res.json();
    setContacts([...contacts, newContact]);
  };

  return (
    <div className="p-6">
        <Navbar />
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Jmeno" value={name} onChange={(e) => setName(e.target.value)} className="border p-2" />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2" />
        <input placeholder="Telefon" value={phone} onChange={(e) => setEmail(e.target.value)} className="border p-2" />
        <select value={position} onChange={(e) => setPosition(e.target.value)} className="border p-2">
            <option value="" className="text-black">Pozice</option>
            <option value="Manager" className="text-black">Nejaka</option>
            <option value="Developer" className="text-black">Nejaka jina</option>
            <option value="Designer" className="text-black">Treti</option>
          </select>
        <select value={institution} onChange={(e) => setPosition(e.target.value)} className="border p-2">
            <option value="" className="text-black">Instituce</option>
            <option value="Manager" className="text-black">Best divadlo evr</option>
            <option value="Developer" className="text-black">Jine divadlo</option>
          </select>
        <button type="submit" className="bg-blue-500 text-white p-2">Pridat Kontakt</button>
      </form>
      <table className="w-full mt-6 border">
        <thead>
          <tr>
            <th className="border p-2">Jmeno</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Telefon</th>
            <th className="border p-2">Pozice</th>
            <th className="border p-2">Instituce</th>
          </tr>
        </thead>
        <tbody>
          <td className="border p-2">Franta Uzivatel</td>
          <td className="border p-2">franta@uzivatel.cz</td>
          <td className="border p-2">123456789</td>
          <td className="border p-2">Nejaka</td>
          <td className="border p-2">Best divadlo evr</td>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td className="border p-2">{contact.name}</td>
              <td className="border p-2">{contact.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
