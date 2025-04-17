// components/Navbar.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") return null;

  const handleLogout = () => {
    localStorage.removeItem("userId");
    router.push("/login");
  };

  const navLinks = [
    { href: "/dashboard", label: "Ana Sayfa" },
    { href: "/analytics", label: "Analizler" },
    { href: "/add-installment", label: "Taksitler" },
    { href: "/add-income", label: "Gelir Ekle" },
    { href: "/add-expense", label: "Gider Ekle" },
  ];

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Sol Menü Butonu */}
          <div className="flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-gray-400 hover:text-white focus:outline-none focus:text-white"
              aria-label="Menüyü Aç/Kapat"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
            <span className="ml-2 text-xl font-bold">FinansApp</span>
          </div>

          {/* Orta Menü Linkleri */}
          <div className="hidden md:flex space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === link.href
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Sağ Çıkış Butonu */}
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="flex items-center text-red-500 hover:text-red-700"
              aria-label="Çıkış Yap"
            >
              <LogOut className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">Çıkış Yap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobil Menü */}
      {menuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-gray-800">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === link.href
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
