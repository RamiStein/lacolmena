import React from 'react';
import { Sprout, Sparkles, HeartHandshake, ShieldCheck, MapPin, Heart, Flower2 } from 'lucide-react';

export function RafaelInfoSection() {
  return (
    <section id="sobre-rafael" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-[#FAF6E9] border-2 border-[#4A6B53]/40 rounded-3xl p-6 sm:p-10 shadow-warm relative overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#4A6B53]/10 rounded-full blur-2xl pointer-events-none -z-0"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Columna de Texto Explicativo */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 bg-[#4A6B53]/15 text-[#344738] border border-[#4A6B53]/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sprout className="w-4 h-4 text-[#4A6B53]" />
              <span>Pedagogía Waldorf & Medicina Natural</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-[#3D2E24] leading-tight">
              ¿Por qué nos convoca la mirada de Rafael en noviembre?
            </h2>

            <p className="text-sm sm:text-base text-[#3D2E24]/85 leading-relaxed font-medium">
              En la cosmovisión antroposófica, cada estación del año late bajo el amparo de una fuerza cósmica. 
              En noviembre, el <strong>Arcángel Rafael</strong> rige la medicina de la tierra, la respiración rítmica, 
              el corazón y la capacidad curativa intrínseca que florece en la naturaleza y en los vínculos humanos.
            </p>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#4A6B53]/20 text-[#4A6B53] shrink-0 mt-0.5">
                  <Flower2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-[#3D2E24]">El Reino Vegetal y el Herbolario Vivo</h4>
                  <p className="text-xs sm:text-sm text-[#3D2E24]/75">
                    Caléndula, manzanilla, lavanda y romero. Rescatamos los preparados botánicos tradicionales y el botiquín natural para cuidar la salud hogareña.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#E5B837]/30 text-[#85591d] shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-[#3D2E24]">El Arte como Terapia y Nutriente</h4>
                  <p className="text-xs sm:text-sm text-[#3D2E24]/75">
                    Acuarelas húmedo sobre húmedo, modelado en cera de abejas tibia y lanas hiladas. La experiencia artística calma el sistema nervioso y restaura la armonía de los sentidos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#B24016]/15 text-[#B24016] shrink-0 mt-0.5">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-[#3D2E24]">Comunidad que Abraza y Sana</h4>
                  <p className="text-xs sm:text-sm text-[#3D2E24]/75">
                    La verdadera salud florece cuando los adultos tejemos una red segura, fraterna y consciente donde las infancias puedan desplegar su ser en libertad y serenidad.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs sm:text-sm font-bold text-[#466270]">
              <MapPin className="w-4 h-4 text-[#4A6B53]" />
              <span>Predio al aire libre: Los Aromos 3100, Loma Verde, Escobar.</span>
            </div>
          </div>

          {/* Columna de Imágenes reales del predio y afiche */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative group">
              <div className="overflow-hidden rounded-3xl border-4 border-white shadow-warm-lg transform -rotate-1 group-hover:rotate-0 transition-transform duration-300">
                <img 
                  src="./foto-comunidad.jpg" 
                  alt="Encuentro de la comunidad La Colmena en Loma Verde" 
                  className="w-full h-56 sm:h-64 object-cover"
                />
              </div>
              <span className="block text-center text-[11px] font-bold text-[#3D2E24]/60 mt-1 italic">
                Encuentro comunitario en nuestro predio de Loma Verde
              </span>
            </div>

            <div className="bg-white/80 border border-[#4A6B53]/40 rounded-2xl p-4 text-xs text-[#3D2E24]/80 flex items-center gap-3 shadow-sm">
              <span className="text-3xl shrink-0">🌿</span>
              <p>
                <strong>Un día para respirar hondo:</strong> En La Colmena nos autogestionamos para construir este espacio de sosiego, salud comunitaria y alegría compartida.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
