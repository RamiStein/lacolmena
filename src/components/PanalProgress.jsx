import React from 'react';
import { Sparkles, Users, Award, ShieldCheck, HeartHandshake } from 'lucide-react';

export function PanalProgress({ targetAmount, totalRaised, donorsCount, onDonateClick }) {
  const percentage = Math.min(Math.round((totalRaised / targetAmount) * 100), 100);
  const remaining = Math.max(targetAmount - totalRaised, 0);

  // Formateador de moneda argentina
  const formatMoney = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Crear 12 celdas de panal para representar visualmente el avance
  const totalCells = 12;
  const filledCells = Math.floor((percentage / 100) * totalCells);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 my-6">
      <div className="bg-[#FAF6E9] border-2 border-[#E5B837]/60 rounded-3xl p-6 sm:p-8 shadow-warm relative overflow-hidden">
        {/* Adorno superior sutil */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E5B837]/30">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🐝</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#3D2E24] tracking-tight">
                El Panal de la Kermess
              </h2>
              <p className="text-xs sm:text-sm text-[#3D2E24]/70">
                Progreso del fondo común comunitario
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#4A6B53]/15 text-[#4A6B53] font-bold text-xs sm:text-sm px-3.5 py-1.5 rounded-full border border-[#4A6B53]/30">
            <ShieldCheck className="w-4 h-4 text-[#4A6B53]" />
            <span>Fondo Autogestionado y Transparente</span>
          </div>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Recaudado */}
          <div className="bg-white/70 border border-[#E5B837]/40 rounded-2xl p-5 shadow-sm">
            <span className="text-xs font-bold text-[#B24016] uppercase tracking-wider block mb-1">
              Recaudado hasta hoy
            </span>
            <div className="text-3xl sm:text-4xl font-black text-[#B24016]">
              {formatMoney(totalRaised)}
            </div>
            <span className="text-xs text-[#3D2E24]/75 mt-1 block">
              Equivale al <strong>{percentage}%</strong> de la meta
            </span>
          </div>

          {/* Meta Total */}
          <div className="bg-white/70 border border-[#E5B837]/40 rounded-2xl p-5 shadow-sm">
            <span className="text-xs font-bold text-[#3D2E24]/70 uppercase tracking-wider block mb-1">
              Meta para los 5 propósitos
            </span>
            <div className="text-3xl sm:text-4xl font-black text-[#3D2E24]">
              {formatMoney(targetAmount)}
            </div>
            <span className="text-xs text-[#3D2E24]/75 mt-1 block">
              Faltan <strong>{formatMoney(remaining)}</strong> para completar el panal
            </span>
          </div>

          {/* Colaboradores */}
          <div className="bg-white/70 border border-[#E5B837]/40 rounded-2xl p-5 shadow-sm">
            <span className="text-xs font-bold text-[#466270] uppercase tracking-wider block mb-1">
              Comunidad Participando
            </span>
            <div className="text-3xl sm:text-4xl font-black text-[#466270] flex items-center gap-2">
              <Users className="w-7 h-7 text-[#466270]" />
              <span>{donorsCount}</span>
            </div>
            <span className="text-xs text-[#3D2E24]/75 mt-1 block">
              Familias, docentes, amigos y exalumnos
            </span>
          </div>
        </div>

        {/* Barra de progreso de Miel Dorada */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between items-center text-sm font-bold text-[#3D2E24]">
            <span className="flex items-center gap-1.5">
              <span>Nivel de néctar acumulado</span>
              <span className="text-base">🍯</span>
            </span>
            <span className="text-[#B24016] font-black text-base">{percentage}%</span>
          </div>

          <div className="w-full bg-[#FAF6E9] h-5 rounded-full border-2 border-[#E5B837] p-0.5 overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-[#E5B837] via-[#f0c34e] to-[#B24016] h-full rounded-full transition-all duration-1000 relative shadow-sm"
              style={{ width: `${percentage}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Visualización de las Celdas Hexagonales del Panal */}
        <div className="bg-[#FAF6E9]/90 border border-[#E5B837]/40 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3 text-xs sm:text-sm font-bold text-[#3D2E24]">
            <span className="flex items-center gap-1.5">
              <span>Celdas de Miel Colectivas ({filledCells} de {totalCells} colmadas)</span>
            </span>
            <span className="text-xs text-[#3D2E24]/70">Cada celda suma el esfuerzo de varias familias</span>
          </div>

          {/* Grilla de hexágonos estilizados */}
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 sm:gap-3 py-2">
            {Array.from({ length: totalCells }).map((_, index) => {
              const isFilled = index < filledCells;
              return (
                <div 
                  key={index} 
                  className={`aspect-square rounded-xl sm:rounded-2xl flex items-center justify-center text-xs font-bold transition-all duration-500 transform hover:scale-110 shadow-sm ${
                    isFilled 
                      ? 'bg-[#E5B837] text-[#3D2E24] shadow-warm border-2 border-[#ca9623]' 
                      : 'bg-white/60 text-[#3D2E24]/30 border-2 border-dashed border-[#E5B837]/50'
                  }`}
                  title={`Celda #${index + 1}: ${isFilled ? 'Completada con néctar' : 'Esperando tu colaboración'}`}
                >
                  {isFilled ? '🍯' : '⬡'}
                </div>
              );
            })}
          </div>
        </div>

        {/* Botón CTA complementario */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E5B837]/30 text-xs sm:text-sm text-[#3D2E24]/80">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-[#B24016] shrink-0" />
            <span>Todos los aportes, sin importar el monto, impulsan directamente la fiesta de los chicos.</span>
          </div>
          <button
            onClick={onDonateClick}
            className="w-full sm:w-auto bg-[#B24016] hover:bg-[#9e3410] text-[#FAF6E9] px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-transform active:scale-95 shadow-sm"
          >
            Aportar a una celda
          </button>
        </div>
      </div>
    </section>
  );
}
