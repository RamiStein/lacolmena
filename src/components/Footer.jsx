import React from 'react';
import { Heart, MapPin, Calendar, Clock, Sparkles } from 'lucide-react';

export function Footer({ onNavigate }) {
  return (
    <footer className="bg-[#FAF6E9] border-t-2 border-[#E5B837]/40 pt-12 pb-20 lg:pb-10 px-4 sm:px-6 mt-16 text-[#3D2E24]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        
        {/* Columna Identidad */}
        <div className="space-y-3 md:col-span-1">
          <img 
            src="./logo-colmena.png" 
            alt="Comunidad La Colmena" 
            className="h-12 w-auto object-contain"
          />
          <p className="text-xs sm:text-sm text-[#3D2E24]/80 leading-relaxed font-medium">
            Espacio educativo de pedagogía antroposófica y comunitaria. 
            Acompañando el desarrollo libre y amoroso de las infancias en Loma Verde.
          </p>
          <p className="text-xs font-hand text-lg text-[#B24016] font-bold">
            "Sostenido por las manos y corazones de sus familias"
          </p>
        </div>

        {/* Columna Horarios del Festival de Primavera */}
        <div className="space-y-2 text-xs sm:text-sm md:col-span-1">
          <h4 className="font-black text-sm uppercase tracking-wider text-[#B24016] mb-3">
            Cronograma del Encuentro
          </h4>
          <div className="space-y-2">
            <div className="bg-white/80 p-2.5 rounded-xl border border-[#B24016]/30">
              <span className="font-bold text-[#B24016] block">🛠️ Viernes 20 de Noviembre</span>
              <span className="text-xs text-[#3D2E24]">Jornada y preparativos: 14 a 18 hs</span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-[#4A6B53]/30">
              <span className="font-bold text-[#4A6B53] block">🎪 Sábado 21 de Noviembre</span>
              <span className="text-xs text-[#3D2E24]">Día del Festival de Primavera: 13 a 18 hs</span>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2 text-xs">
            <MapPin className="w-4 h-4 text-[#B24016] shrink-0" />
            <span>Los Aromos 3100, Loma Verde, Escobar</span>
          </div>
        </div>

        {/* Columna Navegación Rápida */}
        <div className="space-y-2 text-xs sm:text-sm">
          <h4 className="font-black text-sm uppercase tracking-wider text-[#E5B837] mb-3">
            Secciones
          </h4>
          <ul className="space-y-1.5 font-bold">
            <li>
              <button 
                onClick={() => onNavigate && onNavigate('inicio')} 
                className="hover:text-[#B24016] transition-colors"
              >
                🎪 Inicio y Horarios
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate && onNavigate('comisiones')} 
                className="hover:text-[#B24016] transition-colors"
              >
                🎟️ Comisiones y Voluntariado
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate && onNavigate('panal')} 
                className="hover:text-[#B24016] transition-colors"
              >
                🍯 El Panal y Donaciones
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate && onNavigate('sobre-rafael')} 
                className="hover:text-[#B24016] transition-colors"
              >
                🌿 Sobre la Mirada de Rafael
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate && onNavigate('muro')} 
                className="hover:text-[#B24016] transition-colors"
              >
                💌 Muro de Familias
              </button>
            </li>
          </ul>
        </div>

        {/* Columna Valores y Agradecimiento */}
        <div className="space-y-2 text-xs sm:text-sm">
          <h4 className="font-black text-sm uppercase tracking-wider text-[#4A6B53] mb-3">
            Transparencia Comunitaria
          </h4>
          <p className="text-[#3D2E24]/80 leading-relaxed text-xs">
            El 100% de lo recaudado en el Sistema de Panal se destina a la adquisición de insumos nobles, 
            artistas, sonido y sostenimiento del predio para la fiesta comunitaria.
          </p>
          <div className="pt-2 text-xs font-bold text-[#466270]">
            🐝 ¡Gracias por hacer posible esta fiesta!
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-6 border-t border-[#E5B837]/30 flex flex-col sm:flex-row items-center justify-between text-xs text-[#3D2E24]/60 gap-3 text-center sm:text-left">
        <div>
          © {new Date().getFullYear()} Comunidad La Colmena • Loma Verde, Escobar, Buenos Aires.
        </div>
        <div className="flex items-center gap-2 font-medium">
          <span>Tejido con amor para el Festival de Primavera en La Colmena</span>
          <Heart className="w-3.5 h-3.5 text-[#B24016] fill-current" />
          <span className="text-[#3D2E24]/30">•</span>
          <a href="./ia/" className="underline hover:text-[#B24016] text-[#B24016] font-semibold flex items-center gap-1">
            ⚡ Asistente de IA
          </a>
        </div>
      </div>
    </footer>
  );
}
