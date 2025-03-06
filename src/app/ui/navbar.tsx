import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="bg-gray-800 text-white p-4 flex space-x-4">
            <Link href="/" className="hover:underline">Kontakty</Link>
            <Link href="/instituce" className="hover:underline">Instituce</Link>
            <Link href="/pozice" className="hover:underline">Pozice</Link>
        </nav>
    )
}