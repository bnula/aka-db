'use client';

import { useEffect, useState, useTransition } from "react";
import Navbar from "./ui/navbar";
import { createContact, updateContact, fetchContacts, fetchInstitutions, fetchPositions } from "@/lib/actions";
import { Contact } from "@/lib/types/contact";
import { Position } from "@/lib/types/position";
import { Institution } from "@/lib/types/institution";

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<Contact>>({});
  const [isPending, startTransition] = useTransition();

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
    await action(formData);
    refreshData();
  };

  // Refresh function to update data after actions
  const refreshData = () => {
    startTransition(async () => {
      const contactsData = await fetchContacts();
      setContacts(contactsData);
      setEditingId(null);
      setEditValues({});
    });
  };

  // Get position or institution name
  const getPositionName = (id: number) => positions.find((p) => p.id === id)?.name || "Unknown";
  const getInstitutionName = (id: number) => institutions.find((i) => i.id === id)?.name || "Unknown";

  // Handle edit button click
  const handleEdit = (contact: Contact) => {
    setEditingId(contact.id);
    setEditValues(contact);
  };

  // Handle input change for editing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    await updateContact(formData);
    refreshData();
  };

  return (
    <div className="p-6">
      <Navbar />
      <form action={(formData) => handleSubmit(createContact, formData)} className="space-y-4">
        <input placeholder="Titul" name="title" id="title" className="border p-2" />
        <input placeholder="Jmeno" name="name" id="name" className="border p-2" />
        <input placeholder="Email" name="email" id="email" className="border p-2" />
        <input placeholder="Telefon" name="phone" id="phone" className="border p-2" />
        <input placeholder="Mobil" name="cellphone" id="cellphone" className="border p-2" />
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
            <th className="border p-2">Poznamky</th>
            <th className="border p-2">Akce</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td className="border p-2">
                {editingId === contact.id ? (
                  <input name="title" value={editValues.title || ""} onChange={handleChange} className="border p-1" />
                ) : (
                  contact.title
                )}
              </td>
              <td className="border p-2">
                {editingId === contact.id ? (
                  <input name="name" value={editValues.name || ""} onChange={handleChange} className="border p-1" />
                ) : (
                  contact.name
                )}
              </td>
              <td className="border p-2">
                {editingId === contact.id ? (
                  <input name="email" value={editValues.email || ""} onChange={handleChange} className="border p-1" />
                ) : (
                  contact.email
                )}
              </td>
              <td className="border p-2">
                {editingId === contact.id ? (
                  <input name="phone" value={editValues.phone || ""} onChange={handleChange} className="border p-1" />
                ) : (
                  contact.phone
                )}
              </td>
              <td className="border p-2">
                {editingId === contact.id ? (
                  <input name="cellphone" value={editValues.cellphone || ""} onChange={handleChange} className="border p-1" />
                ) : (
                  contact.cellphone
                )}
              </td>
              <td className="border p-2">
                {editingId === contact.id ? (
                  <select name="position_id" value={editValues.position_id || ""} onChange={handleChange} className="border p-1">
                    {positions.map((p) => (
                      <option key={p.id} value={p.id} className="text-black">{p.name}</option>
                    ))}
                  </select>
                ) : (
                  getPositionName(contact.position_id)
                )}
              </td>
              <td className="border p-2">
                {editingId === contact.id ? (
                  <select name="institution_id" value={editValues.institution_id || ""} onChange={handleChange} className="border p-1">
                    {institutions.map((i) => (
                      <option key={i.id} value={i.id} className="text-black">{i.name}</option>
                    ))}
                  </select>
                ) : (
                  getInstitutionName(contact.institution_id)
                )}
              </td>
              <td className="border p-2">
                {editingId === contact.id ? (
                  <input name="notes" value={editValues.notes || ""} onChange={handleChange} className="border p-1" />
                ) : (
                  contact.notes
                )}
              </td>
              <td className="border p-2">
                {editingId === contact.id ? (
                  <button className="bg-green-500 text-white p-1" onClick={handleSave} disabled={isPending}>
                    Uložit
                  </button>
                ) : (
                  <button className="bg-yellow-500 text-white p-1" onClick={() => handleEdit(contact)}>
                    Upravit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
