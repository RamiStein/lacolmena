// HeartBeatIntro.jsx - Animación inmersiva del Órgano del Corazón
// Estética de Acuarela Viva (Watercolor Waldorf/Goetheana)
// Dinámica de Fluidos: Vórtice Cardíaco y Banda Helicoidal Miocárdica (Efecto toalla escurrida)

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, ArrowRight, Sparkles, Heart, Info, X } from 'lucide-react';

export function HeartBeatIntro({ onEnterPresentation }) {
  const [phase, setPhase] = useState(0); // 0, 1, 2, 3
  const [isMuted, setIsMuted] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showVortexModal, setShowVortexModal] = useState(false);
  const audioCtxRef = useRef(null);

  // Sintetizador orgánico de latido con Web Audio API (cero dependencias externas)
  const playHeartBeatSound = useCallback(() => {
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
      // Primer golpe (Lub) - Diástole / Vórtice de llenado
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(60, now);
      osc1.frequency.exponentialRampToValueAtTime(30, now + 0.15);
      gain1.gain.setValueAtTime(0.32, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.18);

      // Segundo golpe más potente (Dub) - Sístole con torsión helicoidal
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(52, now + 0.20);
      osc2.frequency.exponentialRampToValueAtTime(26, now + 0.40);
      gain2.gain.setValueAtTime(0.50, now + 0.20);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.20);
      osc2.stop(now + 0.43);
    } catch (_err) {
      // Audio no disponible o bloqueado por el navegador
    }
  }, [isMuted]);

  // Ciclo de latidos periódicos (cada 1.15s, ritmo natural vivo)
  useEffect(() => {
    const beatInterval = setInterval(() => {
      playHeartBeatSound();
    }, 1150);

    return () => clearInterval(beatInterval);
  }, [playHeartBeatSound]);

  // Secuencia narrativa poética y fisiológica
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 2600);
    const t2 = setTimeout(() => setPhase(2), 5800);
    const t3 = setTimeout(() => setPhase(3), 9000);

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
    <div className={`relative min-h-screen w-full overflow-hidden bg-[#160B08] text-[#FAF6E9] flex flex-col items-center justify-between transition-all duration-1000 ${
      isTransitioning ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
    }`}>
      {/* Fondo con textura de papel de acuarela húmedo y calor vital */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Halo central de calor espiritual y sangre arterial */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(178,64,22,0.40)_0%,_rgba(229,184,55,0.14)_38%,_rgba(22,11,8,0.98)_72%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#B24016]/25 rounded-full blur-[140px] animate-pulse" />
        
        {/* Manchas suaves de lavado de acuarela en esquinas */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#E5B837]/10 blur-[90px]" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#7F1D1D]/25 blur-[100px]" />
      </div>

      {/* 1. BARRA SUPERIOR CON CONTROLES */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between text-xs sm:text-sm text-[#FAF6E9]/80 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#E5B837] animate-ping" />
          <span className="tracking-widest uppercase font-semibold text-[#E5B837]/90 text-[10px] sm:text-xs font-display">
            La Colmena • Experiencia Evolutiva
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowVortexModal(true)}
            aria-label="Ver explicación de la dinámica de fluidos y el vórtice"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF6E9]/10 hover:bg-[#FAF6E9]/20 border border-[#FAF6E9]/15 text-[#FAF6E9] transition-all text-xs"
          >
            <Info className="w-3.5 h-3.5 text-[#E5B837]" />
            <span className="hidden sm:inline">El Vórtice Cardíaco</span>
          </button>

          <button
            onClick={toggleSound}
            aria-label="Activar o silenciar sonido del latido"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF6E9]/10 hover:bg-[#FAF6E9]/20 border border-[#FAF6E9]/15 text-[#FAF6E9] transition-all text-xs"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-[#FAF6E9]/60" /> : <Volume2 className="w-3.5 h-3.5 text-[#E5B837]" />}
            <span className="hidden sm:inline">{isMuted ? 'Activar sonido' : 'Latido activo'}</span>
          </button>

          <button
            onClick={handleStart}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#B24016] hover:bg-[#9E3410] text-[#FAF6E9] font-medium shadow-lg shadow-[#B24016]/30 transition-all text-xs group"
          >
            <span>Ver presentación</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </header>

      {/* 2. ESCENA CENTRAL: CORAZÓN DE ACUARELA REAL + VÓRTICE HELICOIDAL + PANAL */}
      <main className="relative z-10 flex-1 w-full flex flex-col items-center justify-center px-4 my-auto min-h-0">
        <div className="relative w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] md:w-[500px] md:h-[500px] flex items-center justify-center">
          
          {/* MATRIZ DE HEXÁGONOS DE LA COLMENA + CANALES HELICOIDALES */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 500 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* FILTRO DE PIGMENTO DE ACUARELA HÚMEDA (Wet-on-wet watercolor) */}
              <filter id="watercolorFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" result="displaced" />
                <feGaussianBlur in="displaced" stdDeviation="0.6" result="softened" />
                <feMerge>
                  <feMergeNode in="softened" />
                  <feMergeNode in="SourceGraphic" opacity="0.92" />
                </feMerge>
              </filter>

              {/* Gradiente sanguíneo para el vórtice */}
              <linearGradient id="vortexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2B2" stopOpacity="0.95" />
                <stop offset="35%" stopColor="#E5B837" stopOpacity="0.85" />
                <stop offset="70%" stopColor="#B24016" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#80180B" stopOpacity="0.1" />
              </linearGradient>

              {/* Gradiente de celda de panal bañada en calor de miel */}
              <radialGradient id="honeyCellGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#E5B837" stopOpacity="0.55" />
                <stop offset="65%" stopColor="#B24016" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#160B08" stopOpacity="0" />
              </radialGradient>

              {/* Patrón de hexágono reusable */}
              <path
                id="hex"
                d="M 0 -26 L 22.5 -13 L 22.5 13 L 0 26 L -22.5 13 L -22.5 -13 Z"
                strokeWidth="1.5"
              />
            </defs>

            {/* VÓRTICES Y ONDAS HELICOIDALES HACIA LA COLMENA */}
            {/* La sangre viaja en espiral ondulante (dinámica de fluidos), no en línea recta */}
            <g className="helical-channels">
              {/* Vía Helicoidal hacia Pedagogía (Norte) */}
              <path
                d="M 250,170 Q 242,145 250,120 T 250,75"
                fill="none"
                stroke="url(#vortexGrad)"
                strokeWidth="2.5"
                className="animate-helical-flow"
              />
              {/* Vía Helicoidal hacia Fiestas (Noreste) */}
              <path
                d="M 290,210 Q 330,175 350,160 T 370,145"
                fill="none"
                stroke="url(#vortexGrad)"
                strokeWidth="2.2"
                className="animate-helical-flow"
              />
              {/* Vía Helicoidal hacia Familias (Noroeste) */}
              <path
                d="M 210,210 Q 170,175 150,160 T 130,145"
                fill="none"
                stroke="url(#vortexGrad)"
                strokeWidth="2.2"
                className="animate-helical-flow"
              />
              {/* Vía Helicoidal hacia Economía (Sureste) */}
              <path
                d="M 285,290 Q 325,320 350,335 T 370,355"
                fill="none"
                stroke="url(#vortexGrad)"
                strokeWidth="2"
                className="animate-helical-flow"
              />
              {/* Vía Helicoidal hacia El Campo (Suroeste) */}
              <path
                d="M 215,290 Q 175,320 150,335 T 130,355"
                fill="none"
                stroke="url(#vortexGrad)"
                strokeWidth="2"
                className="animate-helical-flow"
              />
              {/* Vía Helicoidal hacia Virtudes (Sur) */}
              <path
                d="M 250,330 Q 258,360 250,390 T 250,425"
                fill="none"
                stroke="url(#vortexGrad)"
                strokeWidth="2.2"
                className="animate-helical-flow"
              />
              {/* Vía hacia Saberes (Oeste) */}
              <path
                d="M 195,250 Q 140,242 105,250 T 70,250"
                fill="none"
                stroke="url(#vortexGrad)"
                strokeWidth="1.8"
                className="animate-helical-flow"
              />
              {/* Vía hacia Sostén (Este) */}
              <path
                d="M 305,250 Q 360,258 395,250 T 430,250"
                fill="none"
                stroke="url(#vortexGrad)"
                strokeWidth="1.8"
                className="animate-helical-flow"
              />
            </g>

            {/* Espirales rotativas de fluidos que se desprenden del latido */}
            <g transform="translate(250,250) scale(1.6)" className="opacity-40 animate-spin" style={{ animationDuration: '18s' }}>
              <path
                d="M 0,0 C 25,-15 50,-10 70,10 C 90,30 95,60 85,90"
                fill="none"
                stroke="#E5B837"
                strokeWidth="1.2"
                strokeDasharray="4 6"
              />
              <path
                d="M 0,0 C -25,15 -50,10 -70,-10 C -90,-30 -95,-60 -85,-90"
                fill="none"
                stroke="#B24016"
                strokeWidth="1.2"
                strokeDasharray="4 6"
              />
            </g>

            {/* Celdas Hexagonales de La Colmena */}
            <g className="hex-cells">
              {/* Celda Norte: Pedagogía y Maestros */}
              <g transform="translate(250, 75)">
                <use href="#hex" fill="url(#honeyCellGlow)" stroke="#E5B837" strokeOpacity="0.8" />
                <text x="0" y="3" textAnchor="middle" fill="#FAF6E9" fontSize="8" fontWeight="bold" letterSpacing="1">PEDAGOGÍA</text>
              </g>

              {/* Celda Noreste: Fiestas y Encuentros */}
              <g transform="translate(370, 145)">
                <use href="#hex" fill="url(#honeyCellGlow)" stroke="#E5B837" strokeOpacity="0.7" />
                <text x="0" y="3" textAnchor="middle" fill="#FAF6E9" fontSize="8" fontWeight="bold" letterSpacing="1">FIESTAS</text>
              </g>

              {/* Celda Noroeste: Familias y Adultos */}
              <g transform="translate(130, 145)">
                <use href="#hex" fill="url(#honeyCellGlow)" stroke="#E5B837" strokeOpacity="0.7" />
                <text x="0" y="3" textAnchor="middle" fill="#FAF6E9" fontSize="8" fontWeight="bold" letterSpacing="1">FAMILIAS</text>
              </g>

              {/* Celda Sureste: Economía Fraterna */}
              <g transform="translate(370, 355)">
                <use href="#hex" fill="url(#honeyCellGlow)" stroke="#E5B837" strokeOpacity="0.7" />
                <text x="0" y="3" textAnchor="middle" fill="#FAF6E9" fontSize="8" fontWeight="bold" letterSpacing="1">ECONOMÍA</text>
              </g>

              {/* Celda Suroeste: Escuela en el Campo */}
              <g transform="translate(130, 355)">
                <use href="#hex" fill="url(#honeyCellGlow)" stroke="#E5B837" strokeOpacity="0.7" />
                <text x="0" y="3" textAnchor="middle" fill="#FAF6E9" fontSize="8" fontWeight="bold" letterSpacing="1">EL CAMPO</text>
              </g>

              {/* Celda Sur: Oficios y Virtudes */}
              <g transform="translate(250, 425)">
                <use href="#hex" fill="url(#honeyCellGlow)" stroke="#E5B837" strokeOpacity="0.8" />
                <text x="0" y="3" textAnchor="middle" fill="#FAF6E9" fontSize="8" fontWeight="bold" letterSpacing="1">VIRTUDES</text>
              </g>

              {/* Celdas intermedias */}
              <g transform="translate(70, 250)">
                <use href="#hex" fill="url(#honeyCellGlow)" stroke="#E5B837" strokeOpacity="0.6" />
                <text x="0" y="3" textAnchor="middle" fill="#FAF6E9" fontSize="7" fontWeight="bold">SABERES</text>
              </g>
              <g transform="translate(430, 250)">
                <use href="#hex" fill="url(#honeyCellGlow)" stroke="#E5B837" strokeOpacity="0.6" />
                <text x="0" y="3" textAnchor="middle" fill="#FAF6E9" fontSize="7" fontWeight="bold">SOSTÉN</text>
              </g>
            </g>
          </svg>

          {/* EL CORAZÓN DE ACUARELA CON TORSIÓN HELICOIDAL (Efecto toalla escurrida) */}
          <div className="relative flex items-center justify-center animate-cardiac-wring">
            
            {/* Halo de calor vital irradiante */}
            <div className="absolute w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-gradient-to-tr from-[#B24016]/40 via-[#E5B837]/35 to-[#7F1D1D]/30 blur-2xl animate-pulse" />

            {/* ESTRUCTURA ANATÓMICA EN ACUARELA VIVA */}
            <div className="relative z-10 w-44 h-44 sm:w-56 sm:h-56 drop-shadow-[0_0_35px_rgba(229,184,55,0.45)]">
              <svg 
                viewBox="0 0 240 240" 
                className="w-full h-full filter drop-shadow-[0_0_22px_rgba(178,64,22,0.85)]"
                style={{ overflow: 'visible' }}
              >
                <defs>
                  {/* Gradiente acuarela para masa ventricular */}
                  <radialGradient id="ventricleWash" cx="42%" cy="46%" r="62%">
                    <stop offset="0%" stopColor="#FF7A5C" stopOpacity="0.95" />
                    <stop offset="28%" stopColor="#D9381E" stopOpacity="0.90" />
                    <stop offset="60%" stopColor="#A82010" stopOpacity="0.92" />
                    <stop offset="85%" stopColor="#6B1309" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#3D0A05" stopOpacity="0.98" />
                  </radialGradient>

                  {/* Gradiente acuarela para Aorta y grandes vasos */}
                  <linearGradient id="aortaWatercolor" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFE699" stopOpacity="0.95" />
                    <stop offset="30%" stopColor="#E5B837" stopOpacity="0.90" />
                    <stop offset="70%" stopColor="#C44B1C" stopOpacity="0.88" />
                    <stop offset="100%" stopColor="#8A230D" stopOpacity="0.95" />
                  </linearGradient>

                  {/* Mancha acuosa transparente para aurícula y base */}
                  <radialGradient id="atriumWash" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#E26D5C" stopOpacity="0.85" />
                    <stop offset="60%" stopColor="#9C201A" stopOpacity="0.88" />
                    <stop offset="100%" stopColor="#5E110A" stopOpacity="0.95" />
                  </radialGradient>
                </defs>

                {/* GRUPO PRINCIPAL DEL CORAZÓN CON FILTRO DE ACUARELA */}
                <g filter="url(#watercolorFilter)">
                  
                  {/* 1. VASOS SUPERIORES ANATÓMICOS EN ACUARELA */}
                  {/* Vena Cava Superior */}
                  <path
                    d="M 72,42 C 72,28 85,25 90,38 C 93,46 92,62 88,72"
                    fill="none"
                    stroke="#8A3859"
                    strokeWidth="11"
                    strokeLinecap="round"
                    opacity="0.85"
                  />

                  {/* Cayado Aórtico (Arco de la Aorta) emergiendo en curva helicoidal */}
                  <path
                    d="M 108,70 C 108,35 146,24 162,50 C 172,66 168,85 160,98"
                    fill="none"
                    stroke="url(#aortaWatercolor)"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />

                  {/* Las 3 ramas arteriales del cayado aórtico (Tronco braquiocefálico, carótida, subclavia) */}
                  <path d="M 124,36 L 122,18" stroke="url(#aortaWatercolor)" strokeWidth="5.5" strokeLinecap="round" />
                  <path d="M 137,32 L 138,15" stroke="url(#aortaWatercolor)" strokeWidth="4.8" strokeLinecap="round" />
                  <path d="M 150,34 L 154,18" stroke="url(#aortaWatercolor)" strokeWidth="4.5" strokeLinecap="round" />

                  {/* Tronco Pulmonar cruzando por delante */}
                  <path
                    d="M 88,80 C 85,55 110,48 122,65"
                    fill="none"
                    stroke="#B24016"
                    strokeWidth="13"
                    strokeLinecap="round"
                    opacity="0.9"
                  />

                  {/* 2. AURÍCULAS (Fondos suaves de acuarela difuminada) */}
                  {/* Aurícula Derecha */}
                  <path
                    d="M 52,80 C 42,95 45,120 60,132 C 68,125 72,105 70,88 Z"
                    fill="url(#atriumWash)"
                    opacity="0.9"
                  />
                  {/* Aurícula Izquierda / Orejuela */}
                  <path
                    d="M 160,86 C 176,96 178,118 165,130 C 156,122 152,104 156,90 Z"
                    fill="url(#atriumWash)"
                    opacity="0.85"
                  />

                  {/* 3. MASA VENTRICULAR ANATÓMICA (Acuarela Viva con Ápex orientado) */}
                  {/* Cuerpo anatómico del miocardio con el ápice hacia abajo a la izquierda */}
                  <path
                    d="M 118,212 C 92,198 48,155 48,106 C 48,78 72,68 96,75 C 108,79 116,90 118,94 C 122,90 132,79 146,75 C 172,68 194,84 192,114 C 188,155 146,196 118,212 Z"
                    fill="url(#ventricleWash)"
                    stroke="#FFD180"
                    strokeWidth="1.6"
                    strokeOpacity="0.7"
                  />

                  {/* 4. LA BANDA MIOCÁRDICA HELICOIDAL (Fibras musculares en espiral de acuarela) */}
                  {/* Pinceladas curvadas que muestran la estructura de toalla escurrida */}
                  <path
                    d="M 68,98 Q 110,130 118,206"
                    fill="none"
                    stroke="#FFD580"
                    strokeWidth="3"
                    strokeOpacity="0.65"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 85,92 Q 125,125 124,198"
                    fill="none"
                    stroke="#FFA07A"
                    strokeWidth="2.5"
                    strokeOpacity="0.55"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 166,104 Q 135,145 116,210"
                    fill="none"
                    stroke="#FFE17D"
                    strokeWidth="2.8"
                    strokeOpacity="0.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 148,96 Q 124,136 112,190"
                    fill="none"
                    stroke="#FF8C69"
                    strokeWidth="2"
                    strokeOpacity="0.5"
                    strokeLinecap="round"
                  />

                  {/* Manchas de pigmento concentrado de acuarela en el surco interventricular */}
                  <ellipse cx="118" cy="148" rx="8" ry="24" fill="#4A0B05" opacity="0.4" transform="rotate(-15 118 148)" />
                </g>

                {/* 5. EL VÓRTICE CARDIACO VIVO (Torbellino en Espiral / Dinámica de Fluidos) */}
                {/* Visualización translúcida del remolino tridimensional en el interior del ventrículo */}
                <g className="cardiac-vortex-layer" opacity="0.95">
                  {/* Espiral áurea / Remolino de flujo sanguíneo */}
                  <path
                    d="M 118,175 C 100,165 96,145 106,130 C 118,112 140,118 142,135 C 144,152 126,164 114,155 C 106,148 108,138 116,134 C 122,130 128,136 124,142"
                    fill="none"
                    stroke="url(#vortexGrad)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="animate-vortex-spin"
                  />

                  {/* Segundo filamento del vórtice helicoidal ascendente hacia la aorta */}
                  <path
                    d="M 118,198 C 102,178 98,142 114,120 C 128,100 138,85 142,65"
                    fill="none"
                    stroke="#FFF2B2"
                    strokeWidth="2"
                    strokeDasharray="5 3"
                    className="animate-pulse"
                  />

                  {/* Partículas de sangre en remolino centrípeto */}
                  <circle cx="118" cy="142" r="3" fill="#FFF2B2" className="animate-ping" style={{ animationDuration: '1.4s' }} />
                  <circle cx="110" cy="132" r="2" fill="#E5B837" className="animate-pulse" />
                  <circle cx="128" cy="150" r="2" fill="#FF8C69" className="animate-pulse" />
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* 3. SECUENCIA NARRATIVA EN TEXTO DINÁMICO */}
        <div className="relative z-20 text-center max-w-2xl mx-auto mt-2 sm:mt-4 px-4 min-h-[140px] sm:min-h-[150px] flex flex-col items-center justify-center">
          {phase === 0 && (
            <div className="animate-fade-in-up space-y-2">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#E5B837] font-semibold font-display">
                El Músculo Helicoidal Vivo
              </span>
              <p className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-[#FAF6E9] leading-snug">
                El corazón se contrae <span className="text-[#E5B837]">retorciéndose como una toalla mojada.</span>
              </p>
              <p className="text-xs sm:text-sm text-[#FAF6E9]/80 max-w-lg mx-auto">
                Sus fibras helicoidales exprimen la sangre en una espiral tridimensional.
              </p>
            </div>
          )}

          {phase === 1 && (
            <div className="animate-fade-in-up space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5B837]/20 border border-[#E5B837]/40 text-[#E5B837] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Dinámica de Fluidos • El Vórtice Cardíaco</span>
              </div>
              <p className="text-lg sm:text-2xl md:text-3xl font-display font-bold text-[#FAF6E9] leading-snug">
                La sangre no sale en línea recta:<br />
                <span className="text-[#F0C64B]">forma un torbellino en espiral que ahorra energía.</span>
              </p>
              <p className="text-xs sm:text-sm text-[#FAF6E9]/75 max-w-lg mx-auto">
                Este vórtice vivo minimiza la fricción y evita el estancamiento de las fuerzas.
              </p>
            </div>
          )}

          {phase >= 2 && (
            <div className="animate-fade-in-up space-y-2.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B24016]/30 border border-[#E5B837]/40 text-[#E5B837] text-[10px] sm:text-xs font-semibold uppercase tracking-wider font-display">
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

      {/* 4. BARRA INFERIOR Y BOTÓN DIRECTO */}
      <footer className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 pb-6 pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
        <div className="text-center sm:text-left">
          <p className="text-xs text-[#FAF6E9]/70">
            Propuesta para compartir y trabajar junto a <strong className="text-[#FAF6E9]">Sebastián</strong>
          </p>
          <p className="text-[11px] text-[#FAF6E9]/45">
            Escuela La Colmena • Loma Verde, Escobar | 2026
          </p>
        </div>

        <button
          onClick={handleStart}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-[#E5B837] via-[#D3BD7B] to-[#E5B837] hover:brightness-110 text-[#3D2E24] font-display font-black text-xs sm:text-sm tracking-wide shadow-xl shadow-[#E5B837]/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Heart className="w-4 h-4 text-[#B24016] fill-[#B24016]" />
          <span>Abrir Propuesta en Diapositivas</span>
          <ArrowRight className="w-4 h-4 text-[#3D2E24]" />
        </button>
      </footer>

      {/* 5. MODAL PEDAGÓGICO: EL VÓRTICE CARDIACO Y LA BANDA HELICOIDAL */}
      {showVortexModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#24140F] border border-[#E5B837]/40 rounded-2xl max-w-lg w-full p-5 sm:p-6 text-[#FAF6E9] shadow-2xl relative">
            <button
              onClick={() => setShowVortexModal(false)}
              className="absolute top-4 right-4 text-[#FAF6E9]/60 hover:text-[#FAF6E9] p-1 rounded-lg hover:bg-white/10"
              aria-label="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-3 rounded-full bg-[#E5B837] animate-ping" />
              <h3 className="font-display font-black text-base sm:text-lg text-[#E5B837]">
                1. El Flujo de la Sangre: El Vórtice Cardíaco
              </h3>
            </div>
            
            <p className="text-xs font-semibold uppercase tracking-wider text-[#B24016] mb-3">
              Dinámica de Fluidos y la Banda Miocárdica Helicoidal
            </p>

            <div className="space-y-3 text-xs sm:text-[13px] text-[#FAF6E9]/85 leading-relaxed">
              <p>
                Físicamente, cuando el corazón bombea sangre, las fibras de los ventrículos están dispuestas en una <strong>banda helicoidal</strong> (un giro en espiral o <em>helical band</em>).
              </p>
              <ul className="space-y-2 list-disc list-inside bg-black/30 p-3.5 rounded-xl border border-white/5">
                <li>
                  <strong>Torsión viva:</strong> Al contraerse, el corazón se exprime <em>"retorciéndose"</em> como cuando escurres una toalla mojada.
                </li>
                <li>
                  <strong>El vórtice en espiral:</strong> Esto hace que la sangre no salga disparada en línea recta, sino que forma un <strong>vórtice o torbellino en espiral</strong> dentro del ventrículo.
                </li>
                <li>
                  <strong>Ahorro y dinamismo:</strong> Este movimiento tridimensional en remolino minimiza la fricción, evita que la sangre se estanque y ahorra una enorme cantidad de energía física.
                </li>
                <li>
                  <strong>Salida aórtica:</strong> Al salir hacia la aorta, viaja con un patrón helicoidal, impulsando la vitalidad hacia todo el organismo social.
                </li>
              </ul>
              <p className="font-serif italic text-xs text-[#E5B837]/90 text-center pt-1">
                «Lo que pulsa con tanta fuerza en este órgano es la fuerza creadora de la comunidad.»
              </p>
            </div>

            <button
              onClick={() => setShowVortexModal(false)}
              className="w-full mt-4 py-2 rounded-xl bg-[#E5B837] text-[#3D2E24] font-display font-bold text-xs hover:bg-[#F0C64B] transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* ESTILOS CSS PARA LA TORSIÓN (TOALLA ESCURRIDA) Y EL FLUJO HELICOIDAL */}
      <style>{`
        /* Animación fisiológica de torsión cardíaca: wringing towel systole & untwist diastole */
        @keyframes cardiacWring {
          0% {
            transform: scale(1) rotate(0deg) skewX(0deg);
          }
          15% {
            /* Primer golpe (Lub): Torsión del ápex hacia un lado y la base hacia el otro */
            transform: scale(0.92, 1.05) rotate(-3.5deg) skewX(-2.5deg);
            filter: drop-shadow(0 0 32px rgba(229,184,55,0.7));
          }
          28% {
            /* Retorcimiento máximo (efecto toalla mojada exprimida) */
            transform: scale(0.86, 1.08) rotate(4deg) skewX(3deg);
          }
          40% {
            /* Segundo golpe potente (Dub): Eyección helicoidal y succión diastólica */
            transform: scale(1.10, 0.95) rotate(-1.5deg) skewX(-1deg);
            filter: drop-shadow(0 0 55px rgba(178,64,22,0.9));
          }
          58% {
            transform: scale(1) rotate(0deg) skewX(0deg);
          }
          100% {
            transform: scale(1) rotate(0deg) skewX(0deg);
          }
        }

        .animate-cardiac-wring {
          animation: cardiacWring 1.15s cubic-bezier(0.22, 0.61, 0.36, 1) infinite;
        }

        /* Giro del vórtice dentro del ventrículo */
        @keyframes vortexSpin {
          0% {
            transform: rotate(0deg);
            transform-origin: 118px 145px;
          }
          100% {
            transform: rotate(360deg);
            transform-origin: 118px 145px;
          }
        }

        .animate-vortex-spin {
          animation: vortexSpin 3s linear infinite;
        }

        /* Flujo helicoidal ondulante en los canales de sangre */
        @keyframes helicalFlow {
          0% {
            stroke-dasharray: 4 10;
            stroke-dashoffset: 28;
            opacity: 0.4;
          }
          50% {
            stroke-dasharray: 8 6;
            opacity: 0.95;
          }
          100% {
            stroke-dasharray: 4 10;
            stroke-dashoffset: 0;
            opacity: 0.4;
          }
        }

        .animate-helical-flow {
          animation: helicalFlow 1.6s ease-in-out infinite;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
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
