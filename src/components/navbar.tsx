"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Navbar() {
  const [openAccordion, setOpenAccordion] = useState(false);

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo y nombre de la app */}
        <div className="flex items-center">
          <Image
            src="/skale_logo_sk.jpg"
            alt="Skale Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="ml-2 text-xl font-bold">Skale</span>
        </div>

        {/* Menú de navegación */}
        <ul className="flex items-center space-x-6">
          <li>
            <Link href="/" className="hover:text-gray-400">
              Inicio
            </Link>
          </li>
          <li>
            <Link href="/profesor" className="hover:text-gray-400">
              Profesor
            </Link>
          </li>
          <li>
            <Link href="/alumno" className="hover:text-gray-400">
              Alumno
            </Link>
          </li>
          <li className="relative">
            <button
              onClick={() => setOpenAccordion((prev) => !prev)}
              className="flex items-center hover:text-gray-400 focus:outline-none"
            >
                Servicios
              {openAccordion ? (
                <ChevronUp className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-1 h-4 w-4" />
              )}
            </button>
            {openAccordion && (
              <div className="absolute left-0 top-full mt-2 w-40 bg-gray-700 rounded shadow-lg z-10">
                <Link href="/profesor/dashboard" className="block px-4 py-2 hover:bg-gray-600">
                Dashboard Profesor
                </Link>
                <Link href="/alumno/recomendaciones" className="block px-4 py-2 hover:bg-gray-600">
                  Recomendaciones Alumno
                </Link>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
