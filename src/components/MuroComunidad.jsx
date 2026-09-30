import React, { useState } from 'react';
import { Heart, MessageSquare, Sparkles, Send, Shield } from 'lucide-react';

export function MuroComunidad({ donaciones, onAddSimpleMessage }) {
  const [filter, setFilter] = useState('all');
  const [quickName, setQuickName] = useState('');
  const [quickMsg, setQuickMsg] = useState('');
  const [showQuickForm, setShowQuickForm] = useState(false);

  const formatMoney = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!quickMsg.trim()) return;

    onAddSimpleMessage({
      id: 'msg-' + Date.now(),
      donorName: quickName.trim() || 'Amigo de La Colmena',
      amount: 0,
      date: new Date().toISOString(),
      message: quickMsg.trim(),
      isAnonymous: !quickName.trim(),
      confirmed: true,
    });

    setQuickName('');
    setQuickMsg('');
    setShowQuickForm(false);
  };

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
    } catch {
      return 'Reciente';
    }
  };

  return (
    <section id="muro" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#B24016] bg-[#B24016]/10 px-3 py-1 rounded-full border border-[#B24016]/20 mb-2">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Ecos de la Comunidad</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#3D2E24]">
            El Muro de la Colmena
          </h2>
          <p className="text-sm sm:text-base text-[#3D2E24]/75 font-medium mt-1">
            Palabras de aliento, intenciones y mensajes de las familias que tejen este encuentro.
          </p>
        </div>

        <button
          onClick={() => setShowQuickForm(!showQuickForm)}
          className="self-start md:self-auto flex items-center gap-2 bg-[#FAF6E9] hover:bg-[#E5B837]/20 border-2 border-[#E5B837] text-[#3D2E24] px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-sm"
        >
          <MessageSquare className="w-4 h-4 text-[#B24016]" />
          <span>{showQuickForm ? 'Cerrar formulario' : 'Dejar un mensaje de aliento'}</span>
        </button>
      </div>

      {/* Formulario rápido para dejar solo un mensaje */}
      {showQuickForm && (
        <form onSubmit={handleQuickSubmit} className="bg-white border-2 border-[#E5B837] rounded-3xl p-5 mb-8 shadow-warm animate-in fade-in duration-200 max-w-xl">
          <h4 className="text-base font-black text-[#3D2E24] mb-3">
            Envía tu saludo a la comunidad de La Colmena:
          </h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Tu nombre o familia (opcional)"
              value={quickName}
              onChange={(e) => setQuickName(e.target.value)}
              className="w-full bg-[#FAF6E9] border border-[#E5B837] rounded-xl p-2.5 text-sm font-bold text-[#3D2E24] focus:outline-none focus:border-[#B24016]"
            />
            <textarea
              rows="2"
              placeholder="Escribe tu mensaje de aliento para la Kermess..."
              value={quickMsg}
              onChange={(e) => setQuickMsg(e.target.value)}
              required
              className="w-full bg-[#FAF6E9] border border-[#E5B837] rounded-xl p-2.5 text-sm font-medium text-[#3D2E24] focus:outline-none focus:border-[#B24016]"
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowQuickForm(false)}
                className="px-3 py-1.5 text-xs font-bold text-[#3D2E24]/70 hover:underline"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[#B24016] text-[#FAF6E9] px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publicar en el Muro</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tarjetas de Donantes y Mensajes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {donaciones.map((item) => (
          <div
            key={item.id}
            className="bg-white/90 border border-[#E5B837]/50 rounded-3xl p-5 shadow-warm hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between relative group overflow-hidden"
          >
            {/* Pequeña celda dorada de fondo decorativa */}
            <div className="absolute -top-3 -right-3 text-4xl opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              🍯
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-extrabold text-[#3D2E24] text-sm sm:text-base truncate">
                  {item.donorName}
                </span>
                <span className="text-[11px] font-bold text-[#3D2E24]/50 shrink-0">
                  {formatDate(item.date)}
                </span>
              </div>

              {item.amount > 0 && (
                <div className="inline-block bg-[#E5B837]/25 text-[#85591d] font-black text-xs px-2.5 py-0.5 rounded-full border border-[#E5B837]/50 mb-3">
                  Aporte de {formatMoney(item.amount)}
                </div>
              )}

              <p className="text-xs sm:text-sm text-[#3D2E24]/85 italic leading-relaxed">
                "{item.message}"
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E5B837]/20 flex items-center justify-between text-[11px] text-[#3D2E24]/60">
              <span className="flex items-center gap-1">
                <span>🐝 Comunidad La Colmena</span>
              </span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <span>✓ Colaboración comunitaria</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
