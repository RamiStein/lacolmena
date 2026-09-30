import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles, Heart, Sun, ArrowDown, Users } from 'lucide-react';

export function HeroBanner({ eventDate, onDonateClick }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const target = new Date(eventDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft({ days, hours, minutes });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [eventDate]);

  return (
    <section className="relative overflow-hidden pt-8 pb-14 px-4 sm:px-6">
      {/* Elementos decorativos de fondo: destellos y soles de acuarela */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#E5B837]/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#B24016]/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-5xl mx-auto text-center">
        {/* Pastilla superior con fecha y temática */}
        <div className="inline-flex items-center gap-2 bg-[#E5B837]/25 border border-[#E5B837]/60 text-[#3D2E24] px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wide mb-6 shadow-sm">
          <Calendar className="w-4 h-4 text-[#B24016]" />
          <span>SÁBADO 22 DE NOVIEMBRE • LOMA VERDE</span>
          <span className="text-[#B24016]">●</span>
          <span>DÍA DE ARTE Y FUERZA DE MICAEL</span>
        </div>

        {/* Título Principal con la pincelada de La Colmena */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#3D2E24] tracking-tight leading-tight mb-4">
          Construyamos juntos la <br />
          <span className="relative inline-block mt-1 sm:mt-2">
            <span className="relative z-10 px-4 py-0.5 text-[#FAF6E9]">
              Kermess de Micael
            </span>
            <span className="absolute inset-0 bg-[#B24016] rounded-2xl transform -rotate-1 shadow-md -z-0"></span>
          </span>
        </h1>

        {/* Lema poético antroposófico / Waldorf */}
        <p className="font-hand text-xl sm:text-2xl md:text-3xl text-[#B24016] font-bold mt-3 mb-5 max-w-2xl mx-auto">
          "Uniendo voluntades, tejemos la luz y la calidez del panal"
        </p>

        {/* Descripción cálida */}
        <p className="text-base sm:text-lg md:text-xl text-[#3D2E24]/85 max-w-3xl mx-auto mb-8 leading-relaxed font-medium">
          El 22 de noviembre celebramos el encuentro comunitario, el valor interior y la creatividad de nuestras infancias. 
          En <strong>La Colmena</strong> nos autogestionamos: cada aporte es una gota de néctar que financia 
          los materiales nobles de arte, los juegos de destreza, el pan horneado a la leña y el escenario de nuestra fiesta.
        </p>

        {/* Contador regresivo en forma de celdas de madera y miel */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mb-9">
          <div className="bg-[#FAF6E9] border-2 border-[#E5B837] shadow-warm rounded-2xl p-3 sm:p-4 min-w-[70px] sm:min-w-[95px] text-center transform hover:scale-105 transition-transform">
            <span className="block text-2xl sm:text-4xl font-extrabold text-[#B24016]">{timeLeft.days}</span>
            <span className="text-[11px] sm:text-xs font-bold text-[#3D2E24]/70 uppercase tracking-wider">Días</span>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-[#E5B837]">:</span>
          <div className="bg-[#FAF6E9] border-2 border-[#E5B837] shadow-warm rounded-2xl p-3 sm:p-4 min-w-[70px] sm:min-w-[95px] text-center transform hover:scale-105 transition-transform">
            <span className="block text-2xl sm:text-4xl font-extrabold text-[#B24016]">{timeLeft.hours}</span>
            <span className="text-[11px] sm:text-xs font-bold text-[#3D2E24]/70 uppercase tracking-wider">Horas</span>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-[#E5B837]">:</span>
          <div className="bg-[#FAF6E9] border-2 border-[#E5B837] shadow-warm rounded-2xl p-3 sm:p-4 min-w-[70px] sm:min-w-[95px] text-center transform hover:scale-105 transition-transform">
            <span className="block text-2xl sm:text-4xl font-extrabold text-[#B24016]">{timeLeft.minutes}</span>
            <span className="text-[11px] sm:text-xs font-bold text-[#3D2E24]/70 uppercase tracking-wider">Minutos</span>
          </div>
        </div>

        {/* Acciones principales */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onDonateClick}
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#E5B837] hover:bg-[#d4a525] text-[#3D2E24] px-8 py-4 rounded-2xl font-extrabold text-lg shadow-warm-lg hover:shadow-celda transform hover:-translate-y-1 transition-all"
          >
            <span className="text-2xl">🍯</span>
            <span>Sumar mi gota al Panal</span>
          </button>

          <a
            href="#propositos"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FAF6E9] border-2 border-[#4A6B53] text-[#4A6B53] hover:bg-[#4A6B53] hover:text-[#FAF6E9] px-6 py-4 rounded-2xl font-bold text-base transition-all"
          >
            <span>Conocer los 5 Propósitos</span>
            <ArrowDown className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
