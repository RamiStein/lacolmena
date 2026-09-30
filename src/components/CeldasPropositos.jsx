import React from 'react';
import { Palette, ShieldAlert, Wheat, Music, Sun, ArrowRight, CheckCircle2 } from 'lucide-react';

const ICONS = {
  Palette,
  ShieldAlert,
  Wheat,
  Music,
  Sun,
};

export function CeldasPropositos({ propositos, onSelectProposito }) {
  const formatMoney = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <section id="propositos" className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#B24016] bg-[#B24016]/10 px-3 py-1 rounded-full border border-[#B24016]/20">
          Metas Específicas de la Kermess
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#3D2E24] mt-3 mb-4">
          Los 5 Propósitos del Panal
        </h2>
        <p className="text-sm sm:text-base text-[#3D2E24]/80 leading-relaxed font-medium">
          Podés elegir a qué área querés destinar tu colaboración o dejar que la comunidad la asigne donde haga más falta. 
          Cada meta cubre materiales tangibles para el disfrute de las infancias.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {propositos.map((prop) => {
          const IconComponent = ICONS[prop.icon] || Palette;
          const percentage = Math.min(Math.round((prop.raised / prop.target) * 100), 100);
          const isComplete = percentage >= 100;

          // Clases dinámicas según el color base
          const colorStyles = {
            miel: {
              border: 'border-[#E5B837]',
              badge: 'bg-[#E5B837]/20 text-[#85591d] border-[#E5B837]/50',
              bar: 'from-[#E5B837] to-[#ca9623]',
              btn: 'bg-[#E5B837] hover:bg-[#ca9623] text-[#3D2E24]',
            },
            terracota: {
              border: 'border-[#B24016]/70',
              badge: 'bg-[#B24016]/15 text-[#B24016] border-[#B24016]/30',
              bar: 'from-[#eb8f75] to-[#B24016]',
              btn: 'bg-[#B24016] hover:bg-[#9e3410] text-[#FAF6E9]',
            },
            huerta: {
              border: 'border-[#4A6B53]/70',
              badge: 'bg-[#4A6B53]/15 text-[#4A6B53] border-[#4A6B53]/30',
              bar: 'from-[#77a47d] to-[#4A6B53]',
              btn: 'bg-[#4A6B53] hover:bg-[#3f5945] text-[#FAF6E9]',
            },
            cielo: {
              border: 'border-[#466270]/70',
              badge: 'bg-[#466270]/15 text-[#466270] border-[#466270]/30',
              bar: 'from-[#7fa4b9] to-[#466270]',
              btn: 'bg-[#466270] hover:bg-[#3a515e] text-[#FAF6E9]',
            }
          }[prop.color] || {
            border: 'border-[#E5B837]',
            badge: 'bg-[#E5B837]/20 text-[#85591d]',
            bar: 'from-[#E5B837] to-[#ca9623]',
            btn: 'bg-[#E5B837] text-[#3D2E24]',
          };

          return (
            <div 
              key={prop.id}
              className={`bg-white/80 rounded-3xl p-6 border-2 ${colorStyles.border} shadow-warm flex flex-col justify-between hover:shadow-warm-lg transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div>
                {/* Cabecera de la tarjeta con icono */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${colorStyles.badge} border`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full ${colorStyles.badge} border`}>
                    {percentage}% financiado
                  </span>
                </div>

                <h3 className="text-xl font-black text-[#3D2E24] mb-2 leading-snug">
                  {prop.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#3D2E24]/75 mb-6 leading-relaxed">
                  {prop.description}
                </p>
              </div>

              <div>
                {/* Métricas y barra */}
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between items-baseline text-xs font-bold text-[#3D2E24]">
                    <span>{formatMoney(prop.raised)}</span>
                    <span className="text-[#3D2E24]/60">Meta: {formatMoney(prop.target)}</span>
                  </div>

                  <div className="w-full bg-[#FAF6E9] h-3 rounded-full border border-[#E5B837]/50 overflow-hidden">
                    <div 
                      className={`bg-gradient-to-r ${colorStyles.bar} h-full rounded-full transition-all duration-700`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Botón de aportar a este propósito */}
                <button
                  onClick={() => onSelectProposito(prop.id)}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-sm ${colorStyles.btn}`}
                >
                  {isComplete ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>¡Meta alcanzada! Sumar extra</span>
                    </>
                  ) : (
                    <>
                      <span>Colaborar con esta meta</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
