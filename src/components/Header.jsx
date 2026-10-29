import React, { useState } from 'react';
import { 
  Calendar, MapPin, Heart, Settings, Menu, X, 
  Users, Sparkles, MessageSquare, Compass, ShieldCheck 
} from 'lucide-react';

export function Header({ 
  activeTab = 'inicio', 
  onNavigate, 
  onOpenAdmin,
  voluntariosCount = 0 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'inicio', label: 'Inicio', emoji: '🎪' },
    { id: 'comisiones', label: 'Comisiones', emoji: '🎟️', badge: voluntariosCount },
    { id: 'panal', label: 'El Panal & Donar', emoji: '🍯' },
    { id: 'sobre-rafael', label: 'Sobre Rafael', emoji: '🌿' },
    { id: 'muro', label: 'Muro', emoji: '💌' },
  ];

  const handleItemClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF6E9]/95 backdrop-blur-md border-b-2 border-[#E5B837]/40 shadow-xs transition-all">
        {/* Franja superior de aviso con las dos fechas oficiales */}
        <div className="bg-[#4A6B53] text-[#FAF6E9] text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-center gap-2 tracking-wide overflow-x-auto whitespace-nowrap">
          <span>🌸 <strong>Festival de Primavera en La Colmena</strong></span>
          <span className="opacity-60">•</span>
          <span>🛠️ Vie 20 (Preparativos 14-18hs)</span>
          <span className="opacity-60">•</span>
          <span>🎪 Sáb 21 (Evento 13-18hs)</span>
          <span className="hidden md:inline opacity-60">•</span>
          <span className="hidden md:inline">Loma Verde, Escobar</span>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          {/* Logo Oficial de La Colmena */}
          <button 
            onClick={() => handleItemClick('inicio')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <img 
              src="./logo-colmena.png" 
              alt="Logo Comunidad La Colmena" 
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105 duration-200"
            />
          </button>

          {/* Menú de Navegación Principal en Desktop */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/70 p-1.5 rounded-2xl border border-[#E5B837]/60 shadow-xs">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                    isActive
                      ? 'bg-[#B24016] text-[#FAF6E9] shadow-xs'
                      : 'text-[#3D2E24] hover:bg-[#E5B837]/30 hover:text-[#B24016]'
                  }`}
                >
                  <span>{item.emoji}</span>
                  <span>{item.label}</span>

                  {item.badge > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white text-[#B24016]' : 'bg-[#E5B837] text-[#3D2E24]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Botones de Acción Derecha */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botón rápido para ir a Comisiones */}
            <button
              onClick={() => handleItemClick('comisiones')}
              className="hidden sm:flex items-center gap-1.5 bg-[#E5B837] hover:bg-[#d8a825] text-[#3D2E24] px-3.5 py-1.5 rounded-xl font-black text-xs shadow-xs transition-transform hover:scale-105"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Sumate</span>
            </button>

            {/* Panel de administración */}
            <button
              onClick={onOpenAdmin}
              title="Panel de gestión de coordinación"
              className="p-2 rounded-xl text-[#3D2E24]/70 hover:text-[#B24016] hover:bg-[#E5B837]/30 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Botón hamburguesa para móvil / tablet */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#3D2E24] hover:bg-[#E5B837]/30 transition-colors focus:outline-none"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menú desplegable Móvil */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF6E9] border-t border-[#E5B837]/40 px-4 py-3 space-y-1.5 shadow-md animate-in slide-in-from-top-2 duration-200">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-sm font-black transition-all ${
                    isActive
                      ? 'bg-[#B24016] text-[#FAF6E9]'
                      : 'bg-white/80 text-[#3D2E24] border border-[#E5B837]/40 hover:bg-[#E5B837]/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{item.emoji}</span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white text-[#B24016]' : 'bg-[#E5B837] text-[#3D2E24]'
                    }`}>
                      {item.badge} {item.id === 'comisiones' ? 'inscriptos' : ''}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Barra de Navegación Flotante Inferior en Móvil para navegación ultra-rápida con 1 toque */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF6E9]/95 backdrop-blur-md border-t-2 border-[#E5B837]/60 py-2 px-3 shadow-warm-lg flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all ${
                isActive 
                  ? 'text-[#B24016] font-black scale-105' 
                  : 'text-[#3D2E24]/70 font-bold hover:text-[#B24016]'
              }`}
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="text-[10px] leading-tight mt-0.5">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
