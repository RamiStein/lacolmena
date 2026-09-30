import React from 'react';
import { Sun, Sparkles, Flame, Shield, MapPin, Users, Heart } from 'lucide-react';

export function MicaelInfoSection() {
  return (
    <section id="sobre-micael" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-[#FAF6E9] border-2 border-[#E5B837]/50 rounded-3xl p-6 sm:p-10 shadow-warm relative overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E5B837]/10 rounded-full blur-2xl pointer-events-none -z-0"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Columna de Texto Explicativo */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 bg-[#E5B837]/25 text-[#B24016] border border-[#E5B837] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sun className="w-4 h-4 text-[#B24016]" />
              <span>Pedagogía Waldorf & Encuentro Comunitario</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-[#3D2E24] leading-tight">
              ¿Por qué celebramos la Fiesta de Micael en La Colmena?
            </h2>

            <p className="text-sm sm:text-base text-[#3D2E24]/85 leading-relaxed font-medium">
              En la cosmovisión antroposófica, la festividad de <strong>Micael</strong> representa el despertar del valor, 
              la voluntad activa y la luz interior que nos ayuda a transformar las dificultades en fuerza comunitaria.
            </p>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#B24016]/15 text-[#B24016] shrink-0 mt-0.5">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-[#3D2E24]">El Fuego y el Pan de Micael</h4>
                  <p className="text-xs sm:text-sm text-[#3D2E24]/75">
                    Amasar juntos con harinas puras y hornear a la leña panes con forma de sol para partir y compartir en ronda.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#E5B837]/30 text-[#85591d] shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-[#3D2E24]">El Arte como Nutriente del Alma</h4>
                  <p className="text-xs sm:text-sm text-[#3D2E24]/75">
                    Talleres libres de acuarela sobre papel mojado, modelado en cera y arcilla, telares y carpintería para todas las edades.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#4A6B53]/20 text-[#4A6B53] shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-[#3D2E24]">Pruebas de Coraje y Juego Libre</h4>
                  <p className="text-xs sm:text-sm text-[#3D2E24]/75">
                    Circuitos de equilibrio y destreza donde cada niño y niña experimenta la confianza en sus propios pasos y el abrazo de la comunidad.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs sm:text-sm font-bold text-[#466270]">
              <MapPin className="w-4 h-4 text-[#B24016]" />
              <span>Predio al aire libre: Los Aromos 3100, Ingeniero Maschwitz, Escobar.</span>
            </div>
          </div>

          {/* Columna de Imágenes reales del predio y afiche */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative group">
              <div className="overflow-hidden rounded-3xl border-4 border-white shadow-warm-lg transform -rotate-1 group-hover:rotate-0 transition-transform duration-300">
                <img 
                  src="./foto-comunidad.jpg" 
                  alt="Encuentro de la comunidad La Colmena en Maschwitz" 
                  className="w-full h-56 sm:h-64 object-cover"
                />
              </div>
              <span className="block text-center text-[11px] font-bold text-[#3D2E24]/60 mt-1 italic">
                Encuentro comunitario en nuestro predio de Maschwitz
              </span>
            </div>

            <div className="bg-white/80 border border-[#E5B837] rounded-2xl p-4 text-xs text-[#3D2E24]/80 flex items-center gap-3 shadow-sm">
              <span className="text-3xl shrink-0">🌻</span>
              <p>
                <strong>Una escuela viva:</strong> La Colmena es un proyecto autogestivo sostenido por el amor y la voluntad de sus familias y maestros.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
