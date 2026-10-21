import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Users, CheckCircle2, Calendar, Clock, MessageSquare, 
  Phone, User, Sparkles, HeartHandshake, ArrowRight, MessageCircle 
} from 'lucide-react';

export function ComisionesSection({ 
  comisiones = [], 
  voluntarios = [], 
  onAddVoluntario 
}) {
  const [selectedComisionId, setSelectedComisionId] = useState('buffet');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [disponibilidad, setDisponibilidad] = useState('ambos');
  const [mensaje, setMensaje] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Manejador al hacer click en "Sumarme" desde una tarjeta
  const handleSelectCard = (comisionId) => {
    setSelectedComisionId(comisionId);
    setSuccessData(null);
    const formElement = document.getElementById('formulario-inscripcion');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setErrorMsg('Por favor ingresá tu nombre o el de tu familia.');
      return;
    }
    if (!telefono.trim()) {
      setErrorMsg('Por favor ingresá un teléfono o WhatsApp de contacto.');
      return;
    }

    const comisionObj = comisiones.find(c => c.id === selectedComisionId) || comisiones[0];

    const nuevoVoluntario = {
      id: 'vol-' + Date.now(),
      name: nombre.trim(),
      phone: telefono.trim(),
      comisionId: selectedComisionId,
      disponibilidad: disponibilidad,
      message: mensaje.trim() || '¡Con muchas ganas de colaborar en comunidad!',
      date: new Date().toISOString()
    };

    onAddVoluntario(nuevoVoluntario);

    // Lanza confeti de celebración
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#E5B837', '#B24016', '#4A6B53', '#FAF6E9']
      });
    } catch (err) {
      // ignore
    }

    setSuccessData({
      nombre: nuevoVoluntario.name,
      comisionNombre: comisionObj.name,
      comisionEmoji: comisionObj.emoji,
      referentes: comisionObj.referentes,
      disponibilidad: disponibilidad === 'ambos' ? 'Viernes y Sábado' : (disponibilidad === 'viernes' ? 'Viernes 20 (Preparativos)' : 'Sábado 21 (Evento)')
    });

    setNombre('');
    setTelefono('');
    setMensaje('');
    setErrorMsg('');
  };

  // Contar voluntarios por comisión
  const getCount = (comisionId) => {
    return voluntarios.filter(v => v.comisionId === comisionId).length;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Encabezado Principal */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 bg-[#E5B837]/20 border border-[#E5B837] text-[#B24016] px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wide mb-4">
          <span>🎪 COMISIONES Y VOLUNTARIADO COMUNITARIO 🎡</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#3D2E24] tracking-tight mb-4">
          ¡Sumate a ser Colmena!
        </h2>

        {/* Lema destacado solicitado por la comunidad */}
        <div className="bg-[#FAF6E9] border-2 border-[#4A6B53] rounded-3xl p-5 sm:p-6 shadow-sm my-4 text-[#3D2E24]">
          <p className="font-hand text-xl sm:text-2xl text-[#4A6B53] font-bold leading-relaxed mb-2">
            "El éxito de este evento dependerá de todos. Juntos se hará más simple para cada uno."
          </p>
          <p className="text-xs sm:text-sm text-[#3D2E24]/80 font-medium">
            🪄 El propósito es: <strong>encontrarnos, trabajar en comunidad, tender redes, abrirnos al mundo, ser colmena.</strong>
          </p>
        </div>

        {/* Recordatorio de las dos jornadas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto mt-6 text-left">
          <div className="bg-white/80 border border-[#B24016]/30 rounded-2xl p-3.5 flex items-start gap-3 shadow-xs">
            <span className="text-2xl">🛠️</span>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#B24016]">
                Viernes 20 de Noviembre
              </h4>
              <p className="text-xs font-semibold text-[#3D2E24]">
                Jornada y preparativos de 14:00 a 18:00 hs.
              </p>
            </div>
          </div>

          <div className="bg-white/80 border border-[#4A6B53]/30 rounded-2xl p-3.5 flex items-start gap-3 shadow-xs">
            <span className="text-2xl">🎪</span>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#4A6B53]">
                Sábado 21 de Noviembre
              </h4>
              <p className="text-xs font-semibold text-[#3D2E24]">
                Día del evento de 13:00 a 18:00 hs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de las 7 Comisiones */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl sm:text-2xl font-black text-[#3D2E24] flex items-center gap-2">
            <span>Elegí tu Comisión</span>
            <span className="text-xs font-normal text-[#3D2E24]/60 bg-white px-2.5 py-1 rounded-full border border-[#E5B837]">
              7 sectores de trabajo
            </span>
          </h3>
          <span className="text-xs text-[#3D2E24]/70 hidden sm:inline">
            Ante cualquier duda comunicate con el referente de cada sector
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {comisiones.map((com) => {
            const count = getCount(com.id);
            const isSelected = selectedComisionId === com.id;

            return (
              <div 
                key={com.id}
                className={`bg-white rounded-3xl p-5 border-2 transition-all flex flex-col justify-between shadow-sm hover:shadow-md ${
                  isSelected 
                    ? 'border-[#B24016] ring-2 ring-[#B24016]/20 bg-[#FAF6E9]/40' 
                    : 'border-[#E5B837]/50 hover:border-[#E5B837]'
                }`}
              >
                <div>
                  {/* Encabezado de la Tarjeta */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl p-2 bg-[#FAF6E9] rounded-2xl border border-[#E5B837]/40 shadow-xs">
                        {com.emoji}
                      </span>
                      <div>
                        <h4 className="font-black text-lg text-[#3D2E24] leading-tight">
                          {com.name}
                        </h4>
                        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#B24016] mt-0.5">
                          <User className="w-3 h-3 text-[#B24016]" />
                          <span>Referente: {com.referentes}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FAF6E9] text-[#4A6B53] border border-[#4A6B53]/30 whitespace-nowrap">
                      {count} {count === 1 ? 'anotado' : 'anotados'}
                    </span>
                  </div>

                  {/* Descripción */}
                  <p className="text-xs text-[#3D2E24]/80 leading-relaxed mb-4">
                    {com.desc}
                  </p>
                </div>

                {/* Botón de Selección */}
                <button
                  type="button"
                  onClick={() => handleSelectCard(com.id)}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-[#B24016] text-[#FAF6E9] shadow-sm'
                      : 'bg-[#FAF6E9] text-[#3D2E24] border border-[#E5B837] hover:bg-[#E5B837] hover:text-[#3D2E24]'
                  }`}
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>{isSelected ? 'Comisión Seleccionada' : '¡Me anoto en esta comisión!'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Formulario de Inscripción */}
      <div id="formulario-inscripcion" className="max-w-2xl mx-auto bg-white rounded-3xl border-2 border-[#E5B837] p-6 sm:p-8 shadow-warm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E5B837]/40">
          <div className="p-3 bg-[#E5B837]/30 text-[#B24016] rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#3D2E24]">
              Anotarme como Voluntario(a)
            </h3>
            <p className="text-xs sm:text-sm text-[#3D2E24]/70">
              Completá tus datos para que el equipo coordinador cuente con vos
            </p>
          </div>
        </div>

        {/* Mensaje de éxito tras registrarse */}
        {successData && (
          <div className="bg-[#4A6B53]/15 border-2 border-[#4A6B53] rounded-2xl p-5 mb-6 animate-in fade-in duration-300">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#4A6B53] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-black text-base text-[#2B3A2F]">
                  ¡Muchas gracias, {successData.nombre}!
                </h4>
                <p className="text-xs sm:text-sm text-[#3D2E24]/90 mt-1">
                  Ya quedaste registrado(a) en la comisión de <strong>{successData.comisionEmoji} {successData.comisionNombre}</strong> ({successData.disponibilidad}).
                </p>
                <p className="text-xs text-[#3D2E24]/80 mt-1">
                  Referente del sector: <strong>{successData.referentes}</strong>
                </p>

                {/* Botón opcional para avisar por WhatsApp directo */}
                <div className="mt-3">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `¡Hola! Me anoté como voluntario(a) para la comisión de ${successData.comisionNombre} en la Kermesse de La Colmena. Soy ${successData.nombre} y podré participar el ${successData.disponibilidad}. ¡Con alegría de construir juntos!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Compartir por WhatsApp con la coordinación</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-50 border border-red-300 text-red-700 text-xs rounded-xl p-3 mb-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Comisión */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[#3D2E24]/80 mb-1.5">
              1. Elegí la Comisión
            </label>
            <select
              value={selectedComisionId}
              onChange={(e) => setSelectedComisionId(e.target.value)}
              className="w-full bg-[#FAF6E9] border-2 border-[#E5B837] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#3D2E24] focus:outline-none focus:border-[#B24016]"
            >
              {comisiones.map(c => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.name} — Referente: {c.referentes}
                </option>
              ))}
            </select>
          </div>

          {/* Nombre y Teléfono en dos columnas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#3D2E24]/80 mb-1.5">
                2. Tu Nombre o Familia *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#3D2E24]/40 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Ej: Familia Morales (2do Grado)"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF6E9] border border-[#E5B837] rounded-xl text-sm font-medium text-[#3D2E24] focus:outline-none focus:border-[#B24016]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#3D2E24]/80 mb-1.5">
                3. Teléfono / WhatsApp *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#3D2E24]/40 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  placeholder="Ej: 11 4455-6677"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF6E9] border border-[#E5B837] rounded-xl text-sm font-medium text-[#3D2E24] focus:outline-none focus:border-[#B24016]"
                />
              </div>
            </div>
          </div>

          {/* Disponibilidad */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[#3D2E24]/80 mb-1.5">
              4. ¿Cuándo podés participar?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer text-xs font-bold transition-all ${
                disponibilidad === 'viernes' ? 'bg-[#E5B837]/30 border-[#B24016] text-[#B24016]' : 'bg-[#FAF6E9] border-[#E5B837]/60 text-[#3D2E24]'
              }`}>
                <input 
                  type="radio" 
                  name="disponibilidad" 
                  value="viernes" 
                  checked={disponibilidad === 'viernes'} 
                  onChange={() => setDisponibilidad('viernes')}
                  className="accent-[#B24016]"
                />
                <span>🛠️ Viernes 20 (14 a 18 hs)</span>
              </label>

              <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer text-xs font-bold transition-all ${
                disponibilidad === 'sabado' ? 'bg-[#E5B837]/30 border-[#B24016] text-[#B24016]' : 'bg-[#FAF6E9] border-[#E5B837]/60 text-[#3D2E24]'
              }`}>
                <input 
                  type="radio" 
                  name="disponibilidad" 
                  value="sabado" 
                  checked={disponibilidad === 'sabado'} 
                  onChange={() => setDisponibilidad('sabado')}
                  className="accent-[#B24016]"
                />
                <span>🎪 Sábado 21 (13 a 18 hs)</span>
              </label>

              <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer text-xs font-bold transition-all ${
                disponibilidad === 'ambos' ? 'bg-[#4A6B53]/20 border-[#4A6B53] text-[#4A6B53]' : 'bg-[#FAF6E9] border-[#E5B837]/60 text-[#3D2E24]'
              }`}>
                <input 
                  type="radio" 
                  name="disponibilidad" 
                  value="ambos" 
                  checked={disponibilidad === 'ambos'} 
                  onChange={() => setDisponibilidad('ambos')}
                  className="accent-[#4A6B53]"
                />
                <span>✨ Ambos Días</span>
              </label>
            </div>
          </div>

          {/* Mensaje opcional */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[#3D2E24]/80 mb-1.5">
              5. ¿Tenés herramientas, don o algo para aportar? (Opcional)
            </label>
            <textarea
              rows="2"
              placeholder="Ej: Tengo escalera, puedo hornear 2 budines, cuento con herramientas de jardinería..."
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              className="w-full p-3 bg-[#FAF6E9] border border-[#E5B837] rounded-xl text-xs font-medium text-[#3D2E24] focus:outline-none focus:border-[#B24016]"
            />
          </div>

          {/* Botón Enviar */}
          <button
            type="submit"
            className="w-full bg-[#B24016] hover:bg-[#973410] text-[#FAF6E9] py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-warm hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>🐝 ¡Confirmar mi inscripción!</span>
          </button>
        </form>
      </div>

      {/* Muro de Voluntarios ya Inscriptos */}
      {voluntarios.length > 0 && (
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-black text-lg text-[#3D2E24] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#4A6B53]" />
              <span>Familias ya sumadas a las comisiones ({voluntarios.length})</span>
            </h4>
            <span className="text-xs text-[#3D2E24]/60 font-medium">¡Gracias por hacer comunidad!</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {voluntarios.map((vol) => {
              const com = comisiones.find(c => c.id === vol.comisionId);
              return (
                <div key={vol.id} className="bg-white/80 border border-[#E5B837]/50 rounded-2xl p-3 shadow-xs">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-xs text-[#3D2E24] truncate">{vol.name}</span>
                    <span className="text-sm shrink-0" title={com?.name}>{com?.emoji || '🐝'}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-[#B24016]">
                    {com?.name || 'Comisión'}
                  </div>
                  <div className="text-[10px] text-[#3D2E24]/60 mt-0.5">
                    {vol.disponibilidad === 'ambos' ? 'Viernes y Sábado' : (vol.disponibilidad === 'viernes' ? 'Viernes (Preparativos)' : 'Sábado (Evento)')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
