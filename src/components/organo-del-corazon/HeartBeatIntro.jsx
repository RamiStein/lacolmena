// HeartBeatIntro.jsx - Animación inmersiva del Órgano del Corazón
// El corazón late con pulso vivo y bombea sangre / calor vital a toda la colmena (panal).
// Transmite la fuerza de la creación comunitaria y da paso a la presentación en Google Slides.

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, ArrowRight, Sparkles, Heart } from 'lucide-react';

export function HeartBeatIntro({ onEnterPresentation }) {
  const [phase, setPhase] = useState(0); // 0, 1, 2, 3
  const [isMuted, setIsMuted] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const audioCtxRef = useRef(null);

  // Sintetizador orgánico de latido con Web Audio API (cero dependencias externas)
  const playHeartBeatSound = () => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      // Primer golpe (Lub) - Diástole
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(62, now);
      osc1.frequency.exponentialRampToValueAtTime(32, now + 0.14);
      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.17);

      // Segundo golpe más potente (Dub) - Sístole bombeando a la colmena
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(54, now + 0.18);
      osc2.frequency.exponentialRampToValueAtTime(28, now + 0.36);
      gain2.gain.setValueAtTime(0.48, now + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.40);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.18);
      osc2.stop(now + 0.41);
    } catch (e) {
      // Audio no disponible o bloqueado por el navegador
    }
  };

  // Ciclo de latidos periódicos (cada 1.1s)
  useEffect(() => {
    const beatInterval = setInterval(() => {
      playHeartBeatSound();
    }, 1100);

    return () => clearInterval(beatInterval);
  }, [isMuted]);

  // Secuencia narrativa poética
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 2200);
    const t2 = setTimeout(() => setPhase(2), 5200);
    const t3 = setTimeout(() => setPhase(3), 8500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleStart = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      onEnterPresentation();
    }, 850);
  };

  const toggleSound = () => {
    if (isMuted && !audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className={`relative min-h-screen w-full overflow-hidden bg-[#180D09] text-[#FAF6E9] flex flex-col items-center justify-between transition-all duration-1000 ${
      isTransitioning ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
    }`}>
      {/* Fondo con gradiente místico y calor vital */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(178,64,22,0.35)_0%,_rgba(229,184,55,0.12)_40%,_rgba(24,13,9,0.98)_75%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B24016]/20 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Barra superior con controles sutiles */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between text-xs sm:text-sm text-[#FAF6E9]/70">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#E5B837] animate-ping" />
          <span className="tracking-widest uppercase font-semibold text-[#E5B837]/90 text-[11px] sm:text-xs">
            La Colmena • Experiencia Evolutiva
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            aria-label="Activar o silenciar sonido del latido"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF6E9]/10 hover:bg-[#FAF6E9]/20 border border-[#FAF6E9]/15 text-[#FAF6E9] transition-all text-xs"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-[#FAF6E9]/60" /> : <Volume2 className="w-3.5 h-3.5 text-[#E5B837]" />}
            <span className="hidden sm:inline">{isMuted ? 'Activar latido sonoro' : 'Latido activo'}</span>
          </button>

          <button
            onClick={handleStart}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#B24016] hover:bg-[#9E3410] text-[#FAF6E9] font-medium shadow-lg shadow-[#B24016]/30 transition-all text-xs group"
          >
            <span>Ver presentación</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </header>

      {/* Escena Central: Corazón Biológico-Espiritual + Panal de La Colmena */}
      <main className="relative z-10 flex-1 w-full flex flex-col items-center justify-center px-4 my-auto">
        <div className="relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] md:w-[540px] md:h-[540px] flex items-center justify-center">
          
          {/* MATRIZ DE HEXÁGONOS DE LA COLMENA (Reciben el bombeo de sangre) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 500 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Gradientes de la sangre / calor vital */}
              <linearGradient id="arteryGrad" x1="250" y1="250" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#E5B837" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#B24016" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#7F1D1D" stopOpacity="0.2" />
              </linearGradient>

              <radialGradient id="honeyCellGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#E5B837" stopOpacity="0.5" />
                <stop offset="70%" stopColor="#B24016" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#180D09" stopOpacity="0" />
              </radialGradient>

              {/* Patrón de hexágono reusable */}
              <path
                id="hex"
                d="M 0 -28 L 24.2 -14 L 24.2 14 L 0 28 L -24.2 14 L -24.2 -14 Z"
                strokeWidth="1.5"
              />
            </defs>

            {/* Red de Canales Arteriales que conectan el centro con la colmena */}
            <g className="arteries opacity-80">
              {/* Vías cardinales de sangre viva */}
              <line x1="250" y1="250" x2="110" y2="140" stroke="url(#arteryGrad)" strokeWidth="2.5" strokeDasharray="6 4" className="animate-pulse" />
              <line x1="250" y1="250" x2="390" y2="140" stroke="url(#arteryGrad)" strokeWidth="2.5" strokeDasharray="6 4" className="animate-pulse" />
              <line x1="250" y1="250" x2="100" y2="330" stroke="url(#arteryGrad)" strokeWidth="2.5" strokeDasharray="6 4" className="animate-pulse" />
              <line x1="250" y1="250" x2="400" y2="330" stroke="url(#arteryGrad)" strokeWidth="2.5" strokeDasharray="6 4" className="animate-pulse" />
              <line x1="250" y1="250" x2="250" y2="60"  stroke="url(#arteryGrad)" strokeWidth="2.5" strokeDasharray="6 4" className="animate-pulse" />
              <line x1="250" y1="250" x2="250" y2="440" stroke="url(#arteryGrad)" strokeWidth="2.5" strokeDasharray="6 4" className="animate-pulse" />
            </g>

            {/* Olas de pulsación de sangre que viajan por el panal */}
            <circle cx="250" cy="250" r="90" stroke="#E5B837" strokeWidth="1.5" opacity="0.3" className="animate-ping" style={{ animationDuration: '2.2s' }} />
            <circle cx="250" cy="250" r="160" stroke="#B24016" strokeWidth="1.5" opacity="0.2" className="animate-ping" style={{ animationDuration: '3.3s', animationDelay: '0.4s' }} />
            <circle cx="250" cy="250" r="220" stroke="#E5B837" strokeWidth="1" opacity="0.15" className="animate-ping" style={{ animationDuration: '4.4s', animationDelay: '0.8s' }} />

            {/* Celdas Hexagonales de la Comunidad (Maestros, Familias, Niños, Tierra, Fiestas, Economía) */}
            <g className="hex-cells">
              {/* Celda Norte: Pedagogía y Maestros */}
              <g transform="translate(250, 75)" className="transition-all duration-700">
                <use href="#hex" fill="url(#honeyCellGlow)" stroke="#E5B837" strokeOpacity="0.7" />
                <text x="0" y="3" textAnchor="middle" fill="#FAF6E9" fontSize="8" fontWeight="bold" letterSpacing="1">PEDAGOGÍA</text>
              </g>

              {/* Celda Noreste: Fiestas y Encuentros */}
              <g transform="translate(370, 145)">
                <use href="#hex" fill="url(#honeyCellGlow)" stroke="#E5B837" strokeOpacity="0.6" />
                <text x="0" y="3" textAnchor="middle" fill="#FAF6E9" fontSize="8" fontWeight="bold" letterSpacing="1">FIESTAS</text>
              </g>

              {/* Celda Noroeste: Familias y Adultos */}
              <g transform="translate(130, 145)">
                <use href="#hex" fill="url(#honeyCellGlow)" stroke="#E5B837" strokeOpacity="0.6" />
                <text x="0" y="3" textAnchor="middle" fill="#FAF6E9" fontSize="8" fontWeight="bold" letterSpacing="1">FAMILIAS</text>
              </g>

              {/* Celda Sureste: Economía Fraterna */}
              <g transform="translate(370, 355)">
                <use href="#hex" fill="url(#honeyCellGlow)" stroke="#E5B837" strokeOpacity="0.6" />
                <text x="0" y="3" textAnchor="middle" fill="#FAF6E9" fontSize="8" fontWeight="bold" letterSpacing="1">ECONOMÍA</text>
              </g>

              {/* Celda Suroeste: Escuela en el Campo */}
              <g transform="translate(130, 355)">
                <use href="#hex" fill="url(#honeyCellGlow)" stroke="#E5B837" strokeOpacity="0.6" />
                <text x="0" y="3" textAnchor="middle" fill="#FAF6E9" fontSize="8" fontWeight="bold" letterSpacing="1">EL CAMPO</text>
              </g>

              {/* Celda Sur: Oficios y Virtudes */}
              <g transform="translate(250, 425)">
                <use href="#hex" fill="url(#honeyCellGlow)" stroke="#E5B837" strokeOpacity="0.7" />
                <text x="0" y="3" textAnchor="middle" fill="#FAF6E9" fontSize="8" fontWeight="bold" letterSpacing="1">VIRTUDES</text>
              </g>

              {/* Celdas intermedias de soporte */}
              <g transform="translate(190, 110)">
                <use href="#hex" fill="none" stroke="#B24016" strokeOpacity="0.4" />
              </g>
              <g transform="translate(310, 110)">
                <use href="#hex" fill="none" stroke="#B24016" strokeOpacity="0.4" />
              </g>
              <g transform="translate(70, 250)">
                <use href="#hex" fill="url(#honeyCellGlow)" stroke="#E5B837" strokeOpacity="0.5" />
                <text x="0" y="3" textAnchor="middle" fill="#FAF6E9" fontSize="7" fontWeight="bold">SABERES</text>
              </g>
              <g transform="translate(430, 250)">
                <use href="#hex" fill="url(#honeyCellGlow)" stroke="#E5B837" strokeOpacity="0.5" />
                <text x="0" y="3" textAnchor="middle" fill="#FAF6E9" fontSize="7" fontWeight="bold">SOSTÉN</text>
              </g>
              <g transform="translate(190, 390)">
                <use href="#hex" fill="none" stroke="#B24016" strokeOpacity="0.4" />
              </g>
              <g transform="translate(310, 390)">
                <use href="#hex" fill="none" stroke="#B24016" strokeOpacity="0.4" />
              </g>
            </g>
          </svg>

          {/* EL CORAZÓN LATIENDO VIVO (Animación Orgánica) */}
          <div className="relative flex items-center justify-center animate-heart-lubdub">
            {/* Halo radiante de calor espiritual */}
            <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-[#B24016]/40 via-[#E5B837]/30 to-[#9E3410]/20 blur-2xl animate-pulse" />

            {/* Estructura del Corazón en SVG de alta fidelidad orgánica */}
            <div className="relative z-10 w-36 h-36 sm:w-48 sm:h-48 drop-shadow-[0_0_35px_rgba(229,184,55,0.45)]">
              <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-[0_0_20px_rgba(178,64,22,0.8)]">
                <defs>
                  {/* Gradiente vivo del músculo cardíaco */}
                  <radialGradient id="myocardium" cx="40%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#FF6B4A" />
                    <stop offset="35%" stopColor="#D9381E" />
                    <stop offset="70%" stopColor="#9E1E0B" />
                    <stop offset="100%" stopColor="#4A0E05" />
                  </radialGradient>

                  {/* Vena / Aorta brillante */}
                  <linearGradient id="vessels" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFE17D" />
                    <stop offset="50%" stopColor="#E5B837" />
                    <stop offset="100%" stopColor="#B24016" />
                  </linearGradient>

                  <filter id="innerGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff" />
                    <feFlood floodColor="#FFE89E" floodOpacity="0.6" />
                    <feComposite in2="shadowDiff" operator="in" />
                    <feComposite in2="SourceGraphic" operator="over" />
                  </filter>
                </defs>

                {/* Arco de la Aorta Superior (Conecta a la cabeza/pedagogía) */}
                <path
                  d="M 85 45 C 85 20, 115 15, 125 35 C 132 48, 130 65, 128 75"
                  fill="none"
                  stroke="url(#vessels)"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                {/* Arteria pulmonar ramificada */}
                <path
                  d="M 68 55 C 68 35, 88 30, 96 45"
                  fill="none"
                  stroke="#C2410C"
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                {/* Cuerpo Anatómico-Simbólico del Corazón */}
                <path
                  d="M 100 178 C 82 160, 28 122, 28 78 C 28 46, 52 28, 80 28 C 94 28, 100 38, 100 38 C 100 38, 106 28, 120 28 C 148 28, 172 46, 172 78 C 172 122, 118 160, 100 178 Z"
                  fill="url(#myocardium)"
                  stroke="#FFD580"
                  strokeWidth="1.5"
                />

                {/* Válvulas y surcos coronarios luminosos */}
                <path
                  d="M 100 45 Q 92 90 68 140"
                  fill="none"
                  stroke="url(#vessels)"
                  strokeWidth="2.5"
                  strokeOpacity="0.85"
                />
                <path
                  d="M 105 70 Q 128 100 135 130"
                  fill="none"
                  stroke="url(#vessels)"
                  strokeWidth="1.8"
                  strokeOpacity="0.75"
                />

                {/* Sello Hexagonal Interior del Corazón (El Panal en el Alma) */}
                <polygon
                  points="100,75 114,83 114,99 100,107 86,99 86,83"
                  fill="#E5B837"
                  fillOpacity="0.35"
                  stroke="#FFE17D"
                  strokeWidth="1.5"
                  className="animate-spin"
                  style={{ transformOrigin: '100px 91px', animationDuration: '24s' }}
                />
                <circle cx="100" cy="91" r="3.5" fill="#FAF6E9" />
              </svg>
            </div>
          </div>
        </div>

        {/* SECUENCIA NARRATIVA EN TEXTO DINÁMICO */}
        <div className="relative z-20 text-center max-w-2xl mx-auto mt-4 px-4 min-h-[140px] flex flex-col items-center justify-center">
          {phase === 0 && (
            <div className="animate-fade-in-up space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#E5B837] font-semibold">
                La Biología de la Comunidad
              </span>
              <p className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-[#FAF6E9] leading-snug">
                En el centro de todo organismo vivo,<br />
                <span className="text-[#E5B837]">late un corazón que unifica y nutre.</span>
              </p>
            </div>
          )}

          {phase === 1 && (
            <div className="animate-fade-in-up space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#B24016] bg-[#FAF6E9]/10 px-3 py-1 rounded-full font-semibold">
                El Latido de La Colmena
              </span>
              <p className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-[#FAF6E9] leading-snug">
                Este corazón bombea sangre, calor y vida<br />
                <span className="text-[#F0C64B]">a cada celda y a cada familia del panal.</span>
              </p>
            </div>
          )}

          {phase >= 2 && (
            <div className="animate-fade-in-up space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B24016]/30 border border-[#E5B837]/40 text-[#E5B837] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#E5B837]" />
                <span>La Fuerza Comunitaria</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-[#FAF6E9] leading-tight">
                Lo que pulsa aquí con fuerza...<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0C64B] via-[#FAF6E9] to-[#E5B837]">
                  es la fuerza de la creación comunitaria.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-[#FAF6E9]/80 max-w-lg mx-auto">
                Hacia una Comunidad Ampliada • El Despertar del Órgano del Corazón
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Barra de progreso inferior y botón directo de entrada */}
      <footer className="relative z-20 w-full max-w-4xl mx-auto px-6 pb-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="text-xs text-[#FAF6E9]/60">
            Propuesta para compartir y trabajar junto a <strong className="text-[#FAF6E9]">Sebastián</strong>
          </p>
          <p className="text-[11px] text-[#FAF6E9]/40">
            Escuela La Colmena • Loma Verde, Escobar | 2026
          </p>
        </div>

        <button
          onClick={handleStart}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#E5B837] via-[#D3BD7B] to-[#E5B837] hover:brightness-110 text-[#3D2E24] font-display font-black text-sm tracking-wide shadow-xl shadow-[#E5B837]/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Heart className="w-4 h-4 text-[#B24016] fill-[#B24016]" />
          <span>Abrir Propuesta en Diapositivas</span>
          <ArrowRight className="w-4 h-4 text-[#3D2E24]" />
        </button>
      </footer>

      {/* Estilos CSS específicos para la animación fisiológica del corazón y el flujo */}
      <style>{`
        @keyframes heartLubDub {
          0% { transform: scale(1); }
          12% { transform: scale(1.14); filter: drop-shadow(0 0 35px rgba(229,184,55,0.7)); }
          22% { transform: scale(0.98); }
          34% { transform: scale(1.22); filter: drop-shadow(0 0 50px rgba(178,64,22,0.9)); }
          48% { transform: scale(1); }
          100% { transform: scale(1); }
        }

        .animate-heart-lubdub {
          animation: heartLubDub 1.1s cubic-bezier(0.21, 0.61, 0.35, 1) infinite;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
