import React from 'react';
import { Heart, MapPin, Calendar, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#FAF6E9] border-t-2 border-[#E5B837]/40 pt-12 pb-8 px-4 sm:px-6 mt-16 text-[#3D2E24]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        
        {/* Columna Identidad */}
        <div className="space-y-3">
          <img 
            src="./logo-colmena.png" 
            alt="Escuela La Colmena" 
            className="h-12 w-auto object-contain"
          />
          <p className="text-xs sm:text-sm text-[#3D2E24]/80 leading-relaxed font-medium">
            Espacio educativo de pedagogía antroposófica y comunitaria. 
            Acompañando el desarrollo libre y amoroso de las infancias en Maschwitz.
          </p>
          <p className="text-xs font-hand text-lg text-[#B24016] font-bold">
            "Sostenido por las manos y corazones de sus familias"
          </p>
        </div>

        {/* Columna Fecha y Ubicación */}
        <div className="space-y-2 text-xs sm:text-sm">
          <h4 className="font-black text-sm uppercase tracking-wider text-[#B24016] mb-3">
            Encuentro de la Kermess
          </h4>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#E5B837] shrink-0" />
            <span><strong>Fecha:</strong> Sábado 22 de Noviembre de 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#B24016] shrink-0" />
            <span><strong>Lugar:</strong> Los Aromos 3100, Ingeniero Maschwitz</span>
          </div>
          <p className="text-xs text-[#3D2E24]/60 pt-2">
            Se suspende por lluvia intensa y se reprograma notificando por los canales oficiales.
          </p>
        </div>

        {/* Columna Valores y Agradecimiento */}
        <div className="space-y-2 text-xs sm:text-sm">
          <h4 className="font-black text-sm uppercase tracking-wider text-[#4A6B53] mb-3">
            Transparencia Comunitaria
          </h4>
          <p className="text-[#3D2E24]/80 leading-relaxed">
            El 100% de lo recaudado en este Sistema de Panal se destina a la adquisición de insumos nobles, 
            el pago de artistas y el sostenimiento del predio para la celebración comunitaria.
          </p>
          <div className="pt-2 text-xs font-bold text-[#466270]">
            🐝 ¡Gracias por hacer posible esta fiesta!
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-6 border-t border-[#E5B837]/30 flex flex-col sm:flex-row items-center justify-between text-xs text-[#3D2E24]/60 gap-3 text-center sm:text-left">
        <div>
          © {new Date().getFullYear()} Escuela y Comunidad La Colmena • Maschwitz, Buenos Aires.
        </div>
        <div className="flex items-center gap-1 font-medium">
          <span>Tejido con amor para la Kermess de Micael</span>
          <Heart className="w-3.5 h-3.5 text-[#B24016] fill-current" />
        </div>
      </div>
    </footer>
  );
}
