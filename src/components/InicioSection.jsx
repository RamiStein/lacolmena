import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, Heart, Users, Sparkles, 
  ArrowRight, ShieldCheck, HeartHandshake, Compass, CheckCircle2 
} from 'lucide-react';

export function InicioSection({ 
  eventDate, 
  totalRaised, 
  targetAmount, 
  donorsCount,
  voluntariosCount, 
  onNavigate 
}) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const target = new Date(eventDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 1000)) / (1000 * 60));
        setTimeLeft({ days, hours, minutes });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [eventDate]);

  const percentage = Math.min(Math.round((totalRaised / targetAmount) * 100), 100);

  const formatMoney = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero Central */}
      <section className="text-center max-w-4xl mx-auto pt-2 pb-8">
        {/* Pastilla Superior */}
        <div className="inline-flex items-center gap-2 bg-[#FAF6E9] border-2 border-[#E5B837] text-[#B24016] px-5 py-2 rounded-full text-xs sm:text-sm font-black tracking-wider mb-6 shadow-sm animate-pulse">
          <span>🎪 SE ACERCA LA KERMESSE EN LA COLMENA 🎡</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#3D2E24] tracking-tight leading-tight mb-4">
          Una fiesta tejida con las manos y el corazón de todas las familias
        </h1>

        {/* Lema central de la comunidad */}
        <div className="bg-[#FAF6E9] border-2 border-[#4A6B53] rounded-3xl p-6 sm:p-7 shadow-sm max-w-3xl mx-auto my-6 text-[#3D2E24]">
          <p className="font-hand text-2xl sm:text-3xl text-[#4A6B53] font-bold leading-relaxed mb-3">
            "🪄 ¡El éxito de este evento dependerá de todos! Juntos se hará más simple para cada uno."
          </p>
          <div className="h-0.5 w-16 bg-[#E5B837] mx-auto my-2"></div>
          <p className="text-sm sm:text-base font-semibold text-[#3D2E24]/90 mt-2">
            El propósito es: <strong>encontrarnos, trabajar en comunidad, tender redes, abrirnos al mundo, ser colmena.</strong>
          </p>
        </div>

        {/* Las dos jornadas destacadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto my-8 text-left">
          {/* Viernes 20 */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#B24016] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl p-2 bg-[#B24016]/10 rounded-2xl">🛠️</span>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#B24016] block">
                  Jornada Comunitaria
                </span>
                <h3 className="text-lg sm:text-xl font-black text-[#3D2E24]">
                  Viernes 20 de Noviembre
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#B24016] mb-2 bg-[#FAF6E9] px-3 py-1 rounded-xl w-fit">
              <Clock className="w-3.5 h-3.5" />
              <span>De 14:00 a 18:00 hs</span>
            </div>
            <p className="text-xs sm:text-sm text-[#3D2E24]/80 leading-relaxed font-medium">
              Preparativos generales, montaje de puestos, colgado de banderines, ambientación, pruebas de sonido y acondicionamiento del predio.
            </p>
          </div>

          {/* Sábado 21 */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#4A6B53] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl p-2 bg-[#4A6B53]/10 rounded-2xl">🎪</span>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#4A6B53] block">
                  Día del Evento
                </span>
                <h3 className="text-lg sm:text-xl font-black text-[#3D2E24]">
                  Sábado 21 de Noviembre
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#4A6B53] mb-2 bg-[#FAF6E9] px-3 py-1 rounded-xl w-fit">
              <Clock className="w-3.5 h-3.5" />
              <span>De 13:00 a 18:00 hs</span>
            </div>
            <p className="text-xs sm:text-sm text-[#3D2E24]/80 leading-relaxed font-medium">
              ¡La gran Kermesse en vivo! Juegos tradicionales, talleres artísticos, música acústica, buffet saludable, tómbola de premios y encuentro.
            </p>
          </div>
        </div>

        {/* Cuenta Regresiva */}
        <div className="my-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3D2E24]/60 block mb-3">
            Tiempo hasta el inicio de la Kermesse
          </span>
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            <div className="bg-white border-2 border-[#E5B837] shadow-sm rounded-2xl p-3 min-w-[70px] sm:min-w-[85px] text-center">
              <span className="block text-2xl sm:text-3xl font-black text-[#B24016]">{timeLeft.days}</span>
              <span className="text-[10px] font-bold text-[#3D2E24]/70 uppercase tracking-wider">Días</span>
            </div>
            <span className="text-2xl font-bold text-[#E5B837]">:</span>
            <div className="bg-white border-2 border-[#E5B837] shadow-sm rounded-2xl p-3 min-w-[70px] sm:min-w-[85px] text-center">
              <span className="block text-2xl sm:text-3xl font-black text-[#B24016]">{timeLeft.hours}</span>
              <span className="text-[10px] font-bold text-[#3D2E24]/70 uppercase tracking-wider">Horas</span>
            </div>
            <span className="text-2xl font-bold text-[#E5B837]">:</span>
            <div className="bg-white border-2 border-[#E5B837] shadow-sm rounded-2xl p-3 min-w-[70px] sm:min-w-[85px] text-center">
              <span className="block text-2xl sm:text-3xl font-black text-[#B24016]">{timeLeft.minutes}</span>
              <span className="text-[10px] font-bold text-[#3D2E24]/70 uppercase tracking-wider">Minutos</span>
            </div>
          </div>
        </div>

        {/* Botones de acción directa */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8">
          <button
            onClick={() => onNavigate('comisiones')}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-[#B24016] hover:bg-[#963410] text-[#FAF6E9] px-7 py-4 rounded-2xl font-extrabold text-base shadow-warm hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            <Users className="w-5 h-5" />
            <span>Anotarme en una Comisión</span>
          </button>

          <button
            onClick={() => onNavigate('panal')}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-[#E5B837] hover:bg-[#d8a825] text-[#3D2E24] px-7 py-4 rounded-2xl font-extrabold text-base shadow-warm hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            <span>🍯</span>
            <span>Ver el Panal y Donar</span>
          </button>
        </div>
      </section>

      {/* Tarjetas de Navegación Rápida a Cada Sección */}
      <section className="mt-12 pt-8 border-t border-[#E5B837]/30">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#3D2E24]">
            Explorá el espacio del encuentro
          </h2>
          <p className="text-xs sm:text-sm text-[#3D2E24]/70">
            Elegí la sección que querés visitar
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Comisiones */}
          <div 
            onClick={() => onNavigate('comisiones')}
            className="bg-white rounded-3xl p-6 border-2 border-[#E5B837]/60 hover:border-[#B24016] shadow-sm hover:shadow-warm transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <span className="text-4xl block mb-3 transform group-hover:scale-110 transition-transform">
                🎟️
              </span>
              <h3 className="font-black text-lg text-[#3D2E24] group-hover:text-[#B24016] transition-colors mb-1.5">
                Comisiones de Trabajo
              </h3>
              <p className="text-xs text-[#3D2E24]/80 leading-relaxed mb-4">
                Anotate en uno de los 7 sectores: Entrada, Juegos, Ambientación, Sonido, Buffet, Premios o Residuos.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-[#B24016] pt-3 border-t border-gray-100">
              <span>{voluntariosCount} voluntarios inscriptos</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: El Panal */}
          <div 
            onClick={() => onNavigate('panal')}
            className="bg-white rounded-3xl p-6 border-2 border-[#E5B837]/60 hover:border-[#E5B837] shadow-sm hover:shadow-warm transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <span className="text-4xl block mb-3 transform group-hover:scale-110 transition-transform">
                🍯
              </span>
              <h3 className="font-black text-lg text-[#3D2E24] group-hover:text-[#B24016] transition-colors mb-1.5">
                El Panal de Aportes
              </h3>
              <p className="text-xs text-[#3D2E24]/80 leading-relaxed mb-4">
                Financiamiento colectivo para insumos nobles, artistas y sostenimiento comunitario del predio.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-[#4A6B53] pt-3 border-t border-gray-100">
              <span>{percentage}% de la meta</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Sobre Rafael */}
          <div 
            onClick={() => onNavigate('sobre-rafael')}
            className="bg-white rounded-3xl p-6 border-2 border-[#E5B837]/60 hover:border-[#4A6B53] shadow-sm hover:shadow-warm transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <span className="text-4xl block mb-3 transform group-hover:scale-110 transition-transform">
                🌿
              </span>
              <h3 className="font-black text-lg text-[#3D2E24] group-hover:text-[#4A6B53] transition-colors mb-1.5">
                Sobre Rafael y Salud
              </h3>
              <p className="text-xs text-[#3D2E24]/80 leading-relaxed mb-4">
                La cosmovisión antroposófica de noviembre: medicina viva, huerto biodinámico, arte y abrazo comunitario.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-[#4A6B53] pt-3 border-t border-gray-100">
              <span>Conocé el espíritu</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Muro */}
          <div 
            onClick={() => onNavigate('muro')}
            className="bg-white rounded-3xl p-6 border-2 border-[#E5B837]/60 hover:border-[#466270] shadow-sm hover:shadow-warm transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <span className="text-4xl block mb-3 transform group-hover:scale-110 transition-transform">
                💌
              </span>
              <h3 className="font-black text-lg text-[#3D2E24] group-hover:text-[#466270] transition-colors mb-1.5">
                Muro Comunitario
              </h3>
              <p className="text-xs text-[#3D2E24]/80 leading-relaxed mb-4">
                Dedicatorias, mensajes de aliento y deseos compartidos por las familias y docentes de la escuela.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-[#466270] pt-3 border-t border-gray-100">
              <span>{donorsCount} mensajes de amor</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Widget Resumen del Panal */}
      <section className="mt-12 bg-[#FAF6E9] border-2 border-[#E5B837] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-[#B24016] uppercase tracking-wider">
            <span>🐝 Estado del Fondo Común</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#3D2E24]">
            {formatMoney(totalRaised)} <span className="text-sm font-medium text-[#3D2E24]/70">de {formatMoney(targetAmount)}</span>
          </h3>
          <p className="text-xs text-[#3D2E24]/80">
            {donorsCount} familias ya sumaron su granito de arena al panal.
          </p>
        </div>

        {/* Barra de progreso visual */}
        <div className="w-full md:w-1/3">
          <div className="flex justify-between text-xs font-black text-[#3D2E24] mb-1.5">
            <span>Avance</span>
            <span className="text-[#B24016]">{percentage}%</span>
          </div>
          <div className="w-full h-3.5 bg-white border border-[#E5B837] rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-[#E5B837] to-[#B24016] rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('panal')}
          className="shrink-0 bg-[#E5B837] hover:bg-[#d8a825] text-[#3D2E24] px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
        >
          <span>Ir a Donar</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Ubicación y Datos Prácticos */}
      <div className="mt-8 text-center text-xs text-[#3D2E24]/70 flex flex-wrap items-center justify-center gap-3">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-[#B24016]" />
          Los Aromos 3100, Loma Verde, Escobar
        </span>
        <span>•</span>
        <span>Comunidad La Colmena</span>
        <span>•</span>
        <span>Entrada abierta a todas las familias</span>
      </div>
    </div>
  );
}
