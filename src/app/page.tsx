'use client';

import Navbar from "./ui/navbar";
import { useEffect, useState, useTransition } from "react";
import { createContact, fetchContacts, fetchInstitutions, fetchPositions } from "@/lib/actions";
import { Contact } from "@/lib/types/contact";
import { Position } from "@/lib/types/position";
import { Institution } from "@/lib/types/institution";

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isPending, startTransition] = useTransition(); // Helps manage async state updates

  useEffect(() => {
    async function fetchData() {
      const contactsData = await fetchContacts();
      const positionsData = await fetchPositions();
      const institutionsData = await fetchInstitutions();

      setContacts(contactsData);
      setPositions(positionsData);
      setInstitutions(institutionsData);
    }

    fetchData();
  }, []);

  // Handles form submissions and refreshes data
  const handleSubmit = async (action: (formData: FormData) => Promise<void>, formData: FormData) => {
      await action(formData); // Call the server action
      startTransition(async () => {
      const contactsData = await fetchContacts();
      
      setContacts(contactsData);
      });
  };

  const getPositionName = (id: number) => {
    const position = positions.find((p) => p.id === id);
    return position ? position.name : "Unknown";
  };

  const getInstitutionName = (id: number) => {
    const institution = institutions.find((i) => i.id === id);
    return institution ? institution.name : "Unknown";
  };

  return (
    <div className="p-6">
      <Navbar />
      <form action={(formData) => handleSubmit(createContact, formData)} className="space-y-4">
        <input placeholder="Titul" name="title" id="title" className="border p-2" />
        <input placeholder="Jmeno" name="name" id="name" className="border p-2" />
        <input placeholder="Email" name="email" id="email" className="border p-2" />
        <input placeholder="Telefon" name="phone" id="phone" className="border p-2" />
        <input placeholder="Mobil" name="cellPhone" id="cellPhone" className="border p-2" />
        <select name="position_id" id="position_id" className="border p-2">
          {positions.map((p) => (
            <option key={p.id} value={p.id} className="text-black">{p.name}</option>
          ))}
        </select>
        <select name="institution_id" id="institution_id" className="border p-2">
          {institutions.map((i) => (
            <option key={i.id} value={i.id} className="text-black">{i.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2" disabled={isPending}>
            {isPending ? "Přidávání..." : "Přidat kontakt"}
            </button>
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
  );
}
