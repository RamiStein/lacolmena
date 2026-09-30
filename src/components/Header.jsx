import React from 'react';
import { Calendar, MapPin, Heart, Shield, Settings } from 'lucide-react';

export function Header({ onOpenAdmin, onDonateClick }) {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF6E9]/95 backdrop-blur-md border-b border-[#E5B837]/30 shadow-sm transition-all">
      {/* Franja superior de aviso comunitario */}
      <div className="bg-[#B24016] text-[#FAF6E9] text-xs sm:text-sm font-medium py-1.5 px-4 text-center flex items-center justify-center gap-2 tracking-wide">
        <span className="inline-block animate-pulse">✨</span>
        <span>Campaña Comunitaria 2026: <strong>Kermess y Fiesta de Micael</strong> — 22 de Noviembre</span>
        <span className="hidden md:inline">• Los Aromos 3100, Maschwitz</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo Oficial de La Colmena */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative">
            <img 
              src="/logo-colmena.png" 
              alt="Logo Escuela La Colmena" 
              className="h-11 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105 duration-200"
            />
          </div>
        </a>

        {/* Enlaces de Navegación */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-[#3D2E24]">
          <a 
            href="#propositos" 
            className="hover:text-[#B24016] transition-colors py-1 border-b-2 border-transparent hover:border-[#E5B837]"
          >
            Metas del Panal
          </a>
          <a 
            href="#sobre-micael" 
            className="hover:text-[#B24016] transition-colors py-1 border-b-2 border-transparent hover:border-[#E5B837]"
          >
            La Fiesta de Micael
          </a>
          <a 
            href="#muro" 
            className="hover:text-[#B24016] transition-colors py-1 border-b-2 border-transparent hover:border-[#E5B837]"
          >
            Muro de Familias
          </a>
        </nav>

        {/* Botones de Acción */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenAdmin}
            title="Panel de gestión de coordinadores"
            className="p-2 rounded-full text-[#466270] hover:text-[#B24016] hover:bg-[#E5B837]/20 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>

          <button
            onClick={onDonateClick}
            className="flex items-center gap-2 bg-[#B24016] hover:bg-[#9e3410] text-[#FAF6E9] px-4 py-2 sm:py-2.5 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Heart className="w-4 h-4 fill-current text-[#FAF6E9]" />
            <span>Colaborar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
