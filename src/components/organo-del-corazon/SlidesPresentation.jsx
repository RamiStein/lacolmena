// SlidesPresentation.jsx - Presentación digital en formato Google Slides
// Muestra fielmente las 4 páginas del documento de propuesta de "El Órgano del Corazón" de La Colmena.

import React, { useState, useEffect, useRef } from 'react';
import { SLIDES } from './slidesData';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause, 
  FileText, 
  Share2, 
  Heart, 
  Sparkles, 
  TrendingUp, 
  Compass, 
  AlertCircle, 
  ShieldAlert, 
  HeartHandshake, 
  Feather, 
  Activity, 
  Users, 
  ShieldCheck, 
  Sun,
  LayoutGrid,
  Check
} from 'lucide-react';

export function SlidesPresentation({ onReplayIntro }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showFilmstrip, setShowFilmstrip] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false); // Modo pantalla completa limpia (slideshow)

  const containerRef = useRef(null);
  const slideRef = useRef(null);
  const currentSlide = SLIDES[currentSlideIndex];

  // Navegación
  const goToSlide = (idx) => {
    if (idx >= 0 && idx < SLIDES.length) {
      setCurrentSlideIndex(idx);
    }
  };

  const nextSlide = () => {
    if (currentSlideIndex < SLIDES.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    } else if (isPlaying) {
      setIsPlaying(false);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  // Autoplay
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentSlideIndex(prev => {
          if (prev < SLIDES.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 7000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Teclado (Flechas, Espacio, Escape, F)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        if (presentationMode) setPresentationMode(false);
        if (isFullscreen) {
          if (document.exitFullscreen) document.exitFullscreen();
          setIsFullscreen(false);
        }
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, presentationMode, isFullscreen]);

  // Fullscreen nativo del navegador
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  // Copiar enlace directo
  const handleCopyLink = () => {
    const url = window.location.origin + '/organo-del-corazon';
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  // Función para renderizar el icono adecuado
  const renderIcon = (name, className = "w-5 h-5") => {
    switch (name) {
      case 'TrendingUp': return <TrendingUp className={className} />;
      case 'Compass': return <Compass className={className} />;
      case 'AlertCircle': return <AlertCircle className={className} />;
      case 'ShieldAlert': return <ShieldAlert className={className} />;
      case 'HeartHandshake': return <HeartHandshake className={className} />;
      case 'Heart': return <Heart className={className} />;
      case 'Feather': return <Feather className={className} />;
      case 'Activity': return <Activity className={className} />;
      case 'Users': return <Users className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'Sun': return <Sun className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen w-full flex flex-col bg-[#202124] text-[#FAF6E9] select-none transition-colors duration-300 font-sans ${
        presentationMode ? 'p-0 justify-center items-center overflow-hidden' : ''
      }`}
    >
      {/* 1. BARRA SUPERIOR ESTILO GOOGLE SLIDES (Oculta en modo presentación limpia) */}
      {!presentationMode && (
        <header className="w-full bg-[#1e1f22] border-b border-[#3c4043] px-3 sm:px-5 py-2 flex items-center justify-between z-30 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Ícono amarillo clásico de presentaciones */}
            <div className="w-8 h-8 rounded bg-[#E5B837] flex items-center justify-center shrink-0 shadow-md">
              <div className="w-4 h-3 bg-[#FAF6E9] rounded-[2px] flex items-center justify-center">
                <div className="w-2.5 h-1.5 bg-[#B24016] rounded-[1px]" />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold text-[#FAF6E9] truncate">
                  LA COLMENA • El Despertar del Órgano del Corazón
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#E5B837]/20 text-[#E5B837] border border-[#E5B837]/30">
                  Propuesta 2026
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#FAF6E9]/60">
                <span>Para compartir y trabajar junto a Sebastián</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Loma Verde, Escobar</span>
              </div>
            </div>
          </div>

          {/* Acciones principales de la barra */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Botón Rebobinar a la animación del corazón */}
            <button
              onClick={onReplayIntro}
              title="Volver a ver la animación inicial del latido"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#B24016]/20 hover:bg-[#B24016]/30 border border-[#B24016]/40 text-[#FAF6E9] text-xs transition-colors"
            >
              <Heart className="w-3.5 h-3.5 text-[#E5B837] fill-[#E5B837]" />
              <span>Ver animación del latido</span>
            </button>

            {/* Compartir link */}
            <button
              onClick={handleCopyLink}
              title="Copiar URL directa de la propuesta"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[#303134] hover:bg-[#3c4043] text-xs text-[#FAF6E9] border border-[#5f6368]/40 transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-[#E5B837]" />}
              <span className="hidden sm:inline">{copiedLink ? '¡Enlace copiado!' : 'Compartir'}</span>
            </button>

            {/* Botón "Presentar" estilo Google Slides */}
            <button
              onClick={() => setPresentationMode(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#E5B837] hover:bg-[#d8a82a] text-[#3D2E24] font-display font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-[#3D2E24]" />
              <span>Presentar</span>
            </button>
          </div>
        </header>
      )}

      {/* 2. ÁREA DE TRABAJO: FILMSTRIP LATERAL + LIENZO 16:9 */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* MINIATURAS (FILMSTRIP LATERAL) */}
        {!presentationMode && showFilmstrip && (
          <aside className="hidden md:flex flex-col w-48 lg:w-56 bg-[#18191a] border-r border-[#3c4043] overflow-y-auto py-3 px-2 gap-2.5 shrink-0 custom-scrollbar z-20">
            <div className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#FAF6E9]/50 flex items-center justify-between">
              <span>Diapositivas ({SLIDES.length})</span>
            </div>

            {SLIDES.map((slide, idx) => {
              const isActive = idx === currentSlideIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(idx)}
                  className={`group relative text-left rounded-lg p-2 transition-all border ${
                    isActive 
                      ? 'bg-[#E5B837]/15 border-[#E5B837] ring-1 ring-[#E5B837]' 
                      : 'bg-[#202124] border-[#3c4043]/60 hover:border-[#FAF6E9]/30 hover:bg-[#282a2d]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-[#E5B837] text-[#3D2E24]' : 'bg-[#303134] text-[#FAF6E9]/70'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="text-[9px] font-semibold text-[#FAF6E9]/50 truncate max-w-[120px]">
                      {slide.badge}
                    </span>
                  </div>

                  {/* Previsualización en miniatura de la lámina */}
                  <div className="w-full aspect-video rounded bg-[#FAF6E9] p-2 flex flex-col justify-between overflow-hidden shadow-inner text-[#3D2E24]">
                    <div className="text-[7.5px] font-extrabold leading-tight line-clamp-2 text-[#3D2E24]">
                      {slide.title}
                    </div>
                    <div className="text-[6.5px] text-[#B24016] font-bold truncate">
                      {slide.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </aside>
        )}

        {/* LIENZO DE LA DIAPOSITIVA (16:9 Widescreen) */}
        <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 overflow-auto relative">
          
          {/* Marco de Diapositiva 16:9 con sombra realista Google Slides */}
          <div 
            ref={slideRef}
            className={`w-full max-w-5xl aspect-video bg-[#FAF6E9] text-[#3D2E24] rounded-xl shadow-2xl overflow-hidden relative flex flex-col justify-between border border-[#e5dcc7] transition-all duration-300 ${
              presentationMode ? 'max-w-7xl max-h-[96vh]' : ''
            }`}
            style={{
              backgroundImage: 'radial-gradient(#e5b837 0.65px, transparent 0.65px), radial-gradient(#b24016 0.45px, #FAF6E9 0.45px)',
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0, 12px 12px'
            }}
          >
            {/* Marca de agua decorativa sutil en esquina */}
            <div className="absolute top-4 right-5 flex items-center gap-1.5 pointer-events-none opacity-40">
              <div className="w-3.5 h-3.5 clip-hexagon bg-[#E5B837]" />
              <span className="text-[9px] font-bold tracking-widest text-[#B24016] uppercase font-display">
                La Colmena 2026
              </span>
            </div>

            {/* CONTENIDO ESPECÍFICO SEGÚN EL TIPO DE DIAPOSITIVA */}
            <div className="flex-1 p-6 sm:p-10 md:p-12 flex flex-col justify-between relative z-10 overflow-hidden">
              
              {/* SLIDE 1: PORTADA */}
              {currentSlide.type === 'cover' && (
                <div className="h-full flex flex-col items-center justify-center text-center my-auto space-y-6">
                  {/* Sello Geométrico Hexagonal con Corazón */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 clip-hexagon bg-gradient-to-tr from-[#E5B837] via-[#f0c64b] to-[#B24016] flex items-center justify-center shadow-xl animate-pulse">
                      <Heart className="w-10 h-10 text-[#FAF6E9] fill-[#FAF6E9]" />
                    </div>
                  </div>

                  <div className="space-y-3 max-w-3xl">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-black tracking-wider text-[#3D2E24]">
                      {currentSlide.title}
                    </h2>
                    <p className="text-base sm:text-xl md:text-2xl font-serif italic text-[#B24016] font-medium leading-relaxed">
                      {currentSlide.subtitle}
                    </p>
                    <div className="h-0.5 w-24 bg-[#E5B837] mx-auto rounded-full my-3" />
                    <p className="text-xs sm:text-sm font-semibold text-[#3D2E24]/80 tracking-wide">
                      {currentSlide.tagline}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E5B837]/30 text-xs sm:text-sm text-[#3D2E24]/70 space-y-1">
                    <p className="font-bold text-[#B24016]">{currentSlide.dedication}</p>
                    <p className="text-[11px] text-[#3D2E24]/60">{currentSlide.locationYear}</p>
                  </div>
                </div>
              )}

              {/* SLIDE 2: INTRODUCCIÓN Y CONTEXTO DEL ORGANISMO */}
              {currentSlide.type === 'content-split' && (
                <div className="h-full flex flex-col justify-between space-y-4">
                  {/* Cabecera de lámina */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black text-[#B24016] bg-[#B24016]/10 px-2.5 py-0.5 rounded-full">
                        {currentSlide.badge}
                      </span>
                      <span className="text-xs text-[#3D2E24]/60 font-semibold">El Despertar del Órgano del Corazón</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-[#3D2E24]">
                      {currentSlide.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#B24016] font-semibold mt-0.5">
                      {currentSlide.subtitle}
                    </p>
                  </div>

                  {/* Tarjetas de Puntos Clave */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 my-auto">
                    {currentSlide.points.map((pt, i) => (
                      <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-[#e8dcb9] shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="w-9 h-9 rounded-lg bg-[#E5B837]/20 text-[#B24016] flex items-center justify-center mb-3">
                            {renderIcon(pt.icon, "w-5 h-5")}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#B24016]">
                            {pt.highlight}
                          </span>
                          <h3 className="text-sm font-bold text-[#3D2E24] mt-1 mb-2">
                            {pt.title}
                          </h3>
                          <p className="text-xs text-[#3D2E24]/80 leading-relaxed">
                            {pt.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cita destacada inferior */}
                  <div className="p-3 bg-[#E5B837]/15 border-l-4 border-[#B24016] rounded-r-lg">
                    <p className="text-xs sm:text-sm font-serif italic text-[#3D2E24] font-medium">
                      {currentSlide.quote}
                    </p>
                  </div>
                </div>
              )}

              {/* SLIDE 3: DIAGNÓSTICO DEL DESEQUILIBRIO ACTUAL */}
              {currentSlide.type === 'grid-cards' && (
                <div className="h-full flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black text-[#B24016] bg-[#B24016]/10 px-2.5 py-0.5 rounded-full">
                        {currentSlide.badge}
                      </span>
                      <span className="text-xs text-[#3D2E24]/60 font-semibold">Diagnóstico Profundo</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-[#3D2E24]">
                      {currentSlide.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#3D2E24]/80 max-w-3xl mt-1">
                      Observamos que el organismo social está siendo habitado e intervenido en exceso desde <strong>"la mente" y el intelecto</strong>, descuidando el latido del corazón que debe integrar y armonizar:
                    </p>
                  </div>

                  {/* 4 Síntomas Concretos del Documento */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 my-auto">
                    {currentSlide.cards.map((card) => (
                      <div 
                        key={card.id}
                        className="bg-white/90 backdrop-blur-sm p-3.5 sm:p-4 rounded-xl border border-[#ebd8ad] shadow-sm flex flex-col justify-between hover:border-[#B24016]/50 transition-colors"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="w-5 h-5 rounded-full bg-[#B24016] text-[#FAF6E9] font-black text-[11px] flex items-center justify-center">
                              {card.number}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B24016] bg-[#B24016]/10 px-2 py-0.5 rounded-full">
                              {card.tag}
                            </span>
                          </div>
                          <h3 className="text-xs sm:text-sm font-extrabold text-[#3D2E24] mb-1">
                            {card.title}
                          </h3>
                          <p className="text-[11px] sm:text-xs text-[#3D2E24]/85 leading-relaxed">
                            {card.body}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SLIDE 4: LA VISIÓN: HACIA LA COMUNIDAD AMPLIADA */}
              {currentSlide.type === 'vision-focus' && (
                <div className="h-full flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs font-black text-[#B24016] bg-[#B24016]/10 px-2.5 py-0.5 rounded-full">
                      {currentSlide.badge}
                    </span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-[#3D2E24] mt-1">
                      {currentSlide.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#B24016] font-semibold">
                      {currentSlide.subtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 my-auto">
                    {currentSlide.columns.map((col, idx) => (
                      <div key={idx} className="bg-white/90 rounded-xl p-5 border border-[#e8dcb9] shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-[#E5B837]/20 text-[#B24016] flex items-center justify-center">
                              {renderIcon(col.icon, "w-4 h-4")}
                            </div>
                            <span className="text-[11px] font-black uppercase text-[#B24016] tracking-wider">
                              {col.badge}
                            </span>
                          </div>
                          <h3 className="text-sm sm:text-base font-bold text-[#3D2E24] mb-3">
                            {col.heading}
                          </h3>
                          <ul className="space-y-2 text-xs text-[#3D2E24]/80 leading-relaxed">
                            {col.points.map((pt, pIdx) => (
                              <li key={pIdx} className="flex items-start gap-2">
                                <span className="text-[#E5B837] font-bold text-sm leading-none">•</span>
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-[#E5B837]/20 border border-[#E5B837] rounded-xl text-center">
                    <p className="text-xs sm:text-sm font-serif italic text-[#3D2E24] font-bold">
                      {currentSlide.conclusionCallout}
                    </p>
                  </div>
                </div>
              )}

              {/* SLIDE 5: LA PROPUESTA (I) - CREACIÓN DEL ÓRGANO DEL CORAZÓN */}
              {currentSlide.type === 'proposal-core' && (
                <div className="h-full flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-black text-[#B24016] bg-[#B24016]/10 px-2.5 py-0.5 rounded-full">
                      {currentSlide.badge}
                    </span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-[#3D2E24] mt-1">
                      {currentSlide.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#B24016] font-semibold">
                      {currentSlide.subtitle}
                    </p>
                    <p className="text-xs text-[#3D2E24]/80 mt-1 max-w-3xl">
                      {currentSlide.premise}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 my-auto">
                    {currentSlide.functions.map((fn, idx) => (
                      <div key={idx} className="bg-white/90 rounded-xl p-4 sm:p-5 border border-[#ebd8ad] shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xl font-display font-black text-[#E5B837]">
                              {fn.number}
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-[#B24016]/10 text-[#B24016] flex items-center justify-center">
                              {renderIcon(fn.icon, "w-4 h-4")}
                            </div>
                          </div>
                          <h3 className="text-sm font-bold text-[#3D2E24] mb-2">
                            {fn.title}
                          </h3>
                          <p className="text-xs text-[#3D2E24]/80 leading-relaxed">
                            {fn.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-xs">
                    <Heart className="w-4 h-4 text-[#B24016] fill-[#B24016] shrink-0" />
                    <span className="font-medium">
                      Perteneciente a la esfera cultural-espiritual comunitaria: centro rítmico integrador.
                    </span>
                  </div>
                </div>
              )}

              {/* SLIDE 6: LA PROPUESTA (II) - CUIDADO Y ORGANIZACIÓN DE LA ENERGÍA */}
              {currentSlide.type === 'two-dimensions' && (
                <div className="h-full flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-black text-[#B24016] bg-[#B24016]/10 px-2.5 py-0.5 rounded-full">
                      {currentSlide.badge}
                    </span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-[#3D2E24] mt-1">
                      {currentSlide.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#B24016] font-semibold">
                      {currentSlide.subtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 my-auto">
                    {currentSlide.dimensions.map((dim, idx) => (
                      <div 
                        key={idx}
                        className={`rounded-xl p-5 border shadow-sm flex flex-col justify-between ${
                          dim.type === 'comun' 
                            ? 'bg-amber-50/70 border-amber-200' 
                            : 'bg-rose-50/70 border-rose-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 text-[#3D2E24]">
                              {dim.tag}
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-white/80 text-[#B24016] flex items-center justify-center">
                              {renderIcon(dim.icon, "w-4 h-4")}
                            </div>
                          </div>
                          <h3 className="text-sm sm:text-base font-extrabold text-[#3D2E24]">
                            {dim.title}
                          </h3>
                          <p className="text-xs font-semibold text-[#B24016] mb-3">
                            {dim.subtitle}
                          </p>
                          <ul className="space-y-2 text-xs text-[#3D2E24]/85 leading-relaxed">
                            {dim.features.map((feat, fIdx) => (
                              <li key={fIdx} className="flex items-start gap-2">
                                <span className="text-[#B24016] font-bold">•</span>
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-center font-serif italic text-[#3D2E24]/80">
                    {currentSlide.footerNote}
                  </p>
                </div>
              )}

              {/* SLIDE 7: EL ROL DE SEBASTIÁN Y EL TRABAJO CONJUNTO */}
              {currentSlide.type === 'partnership' && (
                <div className="h-full flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-black text-[#B24016] bg-[#B24016]/10 px-2.5 py-0.5 rounded-full">
                      {currentSlide.badge}
                    </span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-[#3D2E24] mt-1">
                      {currentSlide.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#B24016] font-semibold">
                      {currentSlide.subtitle}
                    </p>
                  </div>

                  {/* Cuadro destacado de la petición a Sebastián */}
                  <div className="bg-gradient-to-r from-[#FAF6E9] via-amber-50 to-[#FAF6E9] border-2 border-[#E5B837] rounded-xl p-4 sm:p-5 shadow-sm">
                    <span className="text-[11px] font-black uppercase text-[#B24016] tracking-wider block mb-1">
                      {currentSlide.proposalBox.title}
                    </span>
                    <p className="text-xs sm:text-sm font-serif italic text-[#3D2E24] font-medium leading-relaxed">
                      "{currentSlide.proposalBox.text}"
                    </p>
                  </div>

                  {/* 3 Impactos / Resultados Clave */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {currentSlide.outcomes.map((out, idx) => (
                      <div key={idx} className="bg-white/90 rounded-xl p-3 sm:p-4 border border-[#e8dcb9] shadow-sm">
                        <div className="w-7 h-7 rounded-lg bg-[#E5B837]/20 text-[#B24016] flex items-center justify-center mb-2">
                          {renderIcon(out.icon, "w-4 h-4")}
                        </div>
                        <h3 className="text-xs font-bold text-[#3D2E24] mb-1">
                          {out.title}
                        </h3>
                        <p className="text-[11px] text-[#3D2E24]/80 leading-relaxed">
                          {out.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SLIDE 8: HACIA UN EQUILIBRIO ORGÁNICO (SÓLIDOS PLATÓNICOS Y TRIADA) */}
              {currentSlide.type === 'platonic-triad' && (
                <div className="h-full flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-black text-[#B24016] bg-[#B24016]/10 px-2.5 py-0.5 rounded-full">
                      {currentSlide.badge}
                    </span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-[#3D2E24] mt-1">
                      {currentSlide.title}
                    </h2>
                    <p className="text-xs text-[#3D2E24]/80 mt-1 max-w-3xl">
                      {currentSlide.triadText}
                    </p>
                  </div>

                  {/* Las Tres Fuerzas Antroposóficas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 my-auto">
                    {currentSlide.triad.map((tr, idx) => (
                      <div 
                        key={idx}
                        className={`rounded-xl p-4 sm:p-5 border shadow-sm flex flex-col justify-between ${tr.color}`}
                      >
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider block mb-1">
                            {tr.realm}
                          </span>
                          <h3 className="text-base sm:text-lg font-display font-extrabold mb-1">
                            {tr.organ}
                          </h3>
                          <span className="text-[11px] font-semibold opacity-80 block mb-2">
                            {tr.domain}
                          </span>
                          <p className="text-xs leading-relaxed opacity-90">
                            {tr.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-gradient-to-r from-[#E5B837]/20 via-[#B24016]/10 to-[#E5B837]/20 border border-[#E5B837] rounded-xl text-center">
                    <p className="text-xs sm:text-sm font-serif italic text-[#3D2E24] font-extrabold">
                      {currentSlide.closingMessage}
                    </p>
                  </div>
                </div>
              )}

              {/* SLIDE 9: ACCIÓN Y PRÓXIMOS PASOS */}
              {currentSlide.type === 'action-call' && (
                <div className="h-full flex flex-col justify-between space-y-4 text-center my-auto">
                  <div>
                    <span className="text-xs font-black text-[#B24016] bg-[#B24016]/10 px-3 py-1 rounded-full">
                      {currentSlide.badge}
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-display font-black text-[#3D2E24] mt-2">
                      {currentSlide.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#B24016] font-semibold">
                      {currentSlide.subtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left my-auto">
                    {currentSlide.steps.map((st, idx) => (
                      <div key={idx} className="bg-white/90 rounded-xl p-5 border border-[#e8dcb9] shadow-sm flex flex-col justify-between">
                        <div>
                          <span className="w-8 h-8 rounded-full bg-[#E5B837] text-[#3D2E24] font-black text-sm flex items-center justify-center mb-3">
                            {st.step}
                          </span>
                          <h3 className="text-sm font-bold text-[#3D2E24] mb-2">
                            {st.title}
                          </h3>
                          <p className="text-xs text-[#3D2E24]/80 leading-relaxed">
                            {st.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm sm:text-base font-serif italic text-[#B24016] font-bold">
                      {currentSlide.closingQuote}
                    </p>
                    <p className="text-xs text-[#3D2E24]/60">
                      La Colmena • Loma Verde, Escobar | 2026
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Número de Diapositiva en la esquina inferior */}
            <div className="absolute bottom-3 right-4 text-[10px] font-bold text-[#3D2E24]/40 z-10">
              {currentSlideIndex + 1} / {SLIDES.length}
            </div>
          </div>

          {/* NOTAS DEL ORADOR (PANEL EXPANDIBLE ESTILO GOOGLE SLIDES) */}
          {showNotes && (
            <div className="w-full max-w-5xl mt-3 bg-[#1e1f22] border border-[#3c4043] rounded-lg p-3 text-xs text-[#FAF6E9]/80 shadow-lg animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-1 mb-1 border-b border-[#3c4043]">
                <span className="font-bold text-[#E5B837] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Notas del Orador • Diapositiva {currentSlideIndex + 1}
                </span>
                <button
                  onClick={() => setShowNotes(false)}
                  className="text-[#FAF6E9]/50 hover:text-[#FAF6E9] text-[11px]"
                >
                  Ocultar
                </button>
              </div>
              <p className="leading-relaxed font-sans text-[11px] sm:text-xs">
                {currentSlide.speakerNotes}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* 3. BARRA DE CONTROL INFERIOR (ESTILO GOOGLE SLIDES PRESENTATION CONTROLS) */}
      <footer className="w-full bg-[#1e1f22] border-t border-[#3c4043] px-3 sm:px-6 py-2 flex items-center justify-between z-30 shrink-0">
        
        {/* Selector y controles de diapositiva */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Alternar panel lateral de miniaturas */}
          {!presentationMode && (
            <button
              onClick={() => setShowFilmstrip(!showFilmstrip)}
              title={showFilmstrip ? "Ocultar miniaturas" : "Mostrar miniaturas"}
              className="p-1.5 rounded hover:bg-[#303134] text-[#FAF6E9]/70 hover:text-[#FAF6E9] transition-colors"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          )}

          {/* Anterior */}
          <button
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            title="Diapositiva anterior (Flecha izquierda)"
            className="p-1.5 rounded hover:bg-[#303134] disabled:opacity-30 disabled:hover:bg-transparent text-[#FAF6E9] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Indicador de posición */}
          <div className="text-xs font-medium text-[#FAF6E9] px-2 flex items-center gap-1">
            <span>{currentSlideIndex + 1}</span>
            <span className="text-[#FAF6E9]/40">/</span>
            <span>{SLIDES.length}</span>
          </div>

          {/* Siguiente */}
          <button
            onClick={nextSlide}
            disabled={currentSlideIndex === SLIDES.length - 1}
            title="Diapositiva siguiente (Flecha derecha o Espacio)"
            className="p-1.5 rounded hover:bg-[#303134] disabled:opacity-30 disabled:hover:bg-transparent text-[#FAF6E9] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Menú desplegable rápido de diapositivas */}
          <select
            value={currentSlideIndex}
            onChange={(e) => goToSlide(Number(e.target.value))}
            aria-label="Seleccionar diapositiva"
            className="hidden sm:inline-block bg-[#303134] text-xs text-[#FAF6E9] border border-[#3c4043] rounded px-2 py-1 ml-1 cursor-pointer focus:outline-none focus:border-[#E5B837]"
          >
            {SLIDES.map((s, idx) => (
              <option key={s.id} value={idx}>
                {idx + 1}. {s.title}
              </option>
            ))}
          </select>
        </div>

        {/* Controles de reproducción, notas y pantalla completa */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Autoplay */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pausar avance automático" : "Reproducir diapositivas automáticamente"}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
              isPlaying ? 'bg-[#E5B837] text-[#3D2E24] font-bold' : 'hover:bg-[#303134] text-[#FAF6E9]/80'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPlaying ? 'Pausa' : 'Auto'}</span>
          </button>

          {/* Toggle Notas del Orador */}
          {!presentationMode && (
            <button
              onClick={() => setShowNotes(!showNotes)}
              title="Mostrar u ocultar notas pedagógicas del orador"
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                showNotes ? 'bg-[#FAF6E9]/20 text-[#E5B837]' : 'hover:bg-[#303134] text-[#FAF6E9]/80'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Notas del orador</span>
            </button>
          )}

          {/* Salir de modo presentación si está activo */}
          {presentationMode && (
            <button
              onClick={() => setPresentationMode(false)}
              className="px-3 py-1 bg-[#3c4043] hover:bg-[#5f6368] text-xs rounded text-[#FAF6E9] font-medium"
            >
              Salir de presentación (Esc)
            </button>
          )}

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Salir de pantalla completa (F)" : "Pantalla completa (F)"}
            className="p-1.5 rounded hover:bg-[#303134] text-[#FAF6E9]/80 hover:text-[#FAF6E9] transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </footer>

      {/* Estilos para scrollbar estilizado */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #18191a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3c4043;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #E5B837;
        }
      `}</style>
    </div>
  );
}
