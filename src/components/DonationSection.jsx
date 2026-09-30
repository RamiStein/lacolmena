import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart, Copy, Check, Send, Sparkles, AlertCircle, 
  MessageCircle, QrCode, ArrowRight, ShieldCheck, CheckCircle
} from 'lucide-react';

export function DonationSection({ 
  presetAmounts, 
  propositos, 
  bankDetails, 
  selectedPropositoId, 
  onAddDonation 
}) {
  const [selectedAmount, setSelectedAmount] = useState(15000);
  const [customAmount, setCustomAmount] = useState('');
  const [targetPropId, setTargetPropId] = useState(selectedPropositoId || 'general');
  const [donorName, setDonorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorMessage, setDonorMessage] = useState('');
  const [copiedField, setCopiedField] = useState(null);
  const [submittedDonation, setSubmittedDonation] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Sincronizar si cambia desde afuera
  React.useEffect(() => {
    if (selectedPropositoId) {
      setTargetPropId(selectedPropositoId);
    }
  }, [selectedPropositoId]);

  const effectiveAmount = customAmount !== '' ? Number(customAmount) : selectedAmount;

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSelectPreset = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setCustomAmount(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!effectiveAmount || effectiveAmount <= 0) {
      setErrorMsg('Por favor seleccioná o ingresá un monto para colaborar.');
      return;
    }

    const finalName = isAnonymous ? 'Aporte Anónimo' : (donorName.trim() || 'Familia de La Colmena');

    const newDonation = {
      id: 'don-' + Date.now(),
      donorName: finalName,
      amount: effectiveAmount,
      date: new Date().toISOString(),
      propositoId: targetPropId === 'general' ? null : targetPropId,
      message: donorMessage.trim() || '¡Acompañando con amor la Kermess de Micael!',
      isAnonymous: isAnonymous,
      confirmed: true,
    };

    onAddDonation(newDonation);
    setSubmittedDonation(newDonation);
    setErrorMsg('');

    // Disparar lluvia de confeti comunitario
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E5B837', '#B24016', '#4A6B53', '#f0c34e', '#FAF6E9']
      });
    } catch (err) {
      // Ignorar si confetti falla
    }
  };

  const formatMoney = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Enlace para WhatsApp con mensaje pre-armado
  const whatsappUrl = submittedDonation 
    ? `https://wa.me/${bankDetails.whatsappNumber}?text=${encodeURIComponent(
        `¡Hola Comunidad La Colmena! 👋 Acabo de registrar mi donación de ${formatMoney(submittedDonation.amount)} para la Kermess de Micael a nombre de "${submittedDonation.donorName}". ¡Aquí les adjunto el comprobante de transferencia! 🐝🍯`
      )}`
    : `https://wa.me/${bankDetails.whatsappNumber}?text=${encodeURIComponent(
        `¡Hola Comunidad La Colmena! Quisiera consultar sobre las donaciones para la Kermess de Micael.`
      )}`;

  return (
    <section id="donar" className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-[#FAF6E9] border-2 border-[#B24016]/40 rounded-3xl p-6 sm:p-10 shadow-warm-lg relative">
        {/* Cabecera del formulario */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#E5B837]/30 text-[#B24016] text-3xl mb-3 border border-[#E5B837]">
            🍯
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#3D2E24] mb-3">
            Sumá tu Aporte al Panal
          </h2>
          <p className="text-sm sm:text-base text-[#3D2E24]/80 font-medium">
            Elegí tu colaboración comunitaria, transferí desde tu banco o billetera virtual favorita y registrá tu aporte para el muro de la escuela.
          </p>
        </div>

        {submittedDonation ? (
          /* Estado de Agradecimiento y Éxito */
          <div className="bg-white/90 border-2 border-[#4A6B53] rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto shadow-warm animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-[#4A6B53]/20 text-[#4A6B53] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#4A6B53]">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-black text-[#3D2E24] mb-2">
              ¡Muchas Gracias por tu Fuerza!
            </h3>
            <p className="text-[#B24016] font-hand text-2xl font-bold mb-4">
              "Una pequeña abeja hace la miel más dulce del bosque"
            </p>

            <div className="bg-[#FAF6E9] rounded-2xl p-4 border border-[#E5B837] mb-6 text-left text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-[#3D2E24]/70">Aporte registrado:</span>
                <span className="font-extrabold text-[#B24016]">{formatMoney(submittedDonation.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#3D2E24]/70">A nombre de:</span>
                <span className="font-bold text-[#3D2E24]">{submittedDonation.donorName}</span>
              </div>
              {submittedDonation.message && (
                <div className="pt-2 border-t border-[#E5B837]/40 text-xs italic text-[#3D2E24]/85">
                  "{submittedDonation.message}"
                </div>
              )}
            </div>

            {/* Aviso para enviar comprobante por WhatsApp */}
            <div className="space-y-3">
              <p className="text-xs text-[#3D2E24]/80">
                Para conciliar más rápido la transferencia en tesorería, podés enviar el comprobante directo por WhatsApp:
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3 rounded-full font-bold text-sm shadow-md transition-all transform hover:scale-105"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Enviar Comprobante por WhatsApp</span>
              </a>

              <div className="pt-4">
                <button
                  onClick={() => setSubmittedDonation(null)}
                  className="text-xs font-bold text-[#466270] hover:underline"
                >
                  ← Realizar otro aporte
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Formulario de Donación */
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Paso 1: Seleccionar Monto */}
            <div>
              <label className="block text-sm font-black text-[#3D2E24] mb-3 uppercase tracking-wide">
                1. Seleccioná el tamaño de tu gota de néctar:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
                {presetAmounts.map((tier) => {
                  const isSelected = effectiveAmount === tier.amount && customAmount === '';
                  return (
                    <button
                      type="button"
                      key={tier.amount}
                      onClick={() => handleSelectPreset(tier.amount)}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all duration-200 transform hover:-translate-y-0.5 ${
                        isSelected 
                          ? 'border-[#B24016] bg-[#B24016] text-[#FAF6E9] shadow-md scale-102' 
                          : 'border-[#E5B837]/60 bg-white/70 hover:border-[#E5B837] text-[#3D2E24]'
                      }`}
                    >
                      <div className="text-2xl mb-1">{tier.emoji}</div>
                      <div className={`text-base font-black ${isSelected ? 'text-[#FAF6E9]' : 'text-[#B24016]'}`}>
                        {formatMoney(tier.amount)}
                      </div>
                      <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-[#FAF6E9]/90' : 'text-[#3D2E24]'}`}>
                        {tier.title}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Opción de Monto Personalizado */}
              <div className="flex items-center gap-3 bg-white/80 border-2 border-[#E5B837]/60 rounded-2xl p-3 max-w-sm">
                <span className="text-xl">✏️</span>
                <div className="flex-1">
                  <label htmlFor="custom-amount" className="block text-[11px] font-bold text-[#3D2E24]/70 uppercase">
                    O ingresá otro monto libre ($):
                  </label>
                  <input
                    id="custom-amount"
                    type="text"
                    inputMode="numeric"
                    placeholder="Ej: 10000"
                    value={customAmount}
                    onChange={handleCustomChange}
                    className="w-full bg-transparent font-black text-lg text-[#B24016] focus:outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Paso 2: Destino del Fondo */}
            <div>
              <label htmlFor="proposito-select" className="block text-sm font-black text-[#3D2E24] mb-2 uppercase tracking-wide">
                2. ¿A qué meta querés orientar tu aporte?
              </label>
              <select
                id="proposito-select"
                value={targetPropId}
                onChange={(e) => setTargetPropId(e.target.value)}
                className="w-full sm:max-w-md bg-white border-2 border-[#E5B837] text-[#3D2E24] font-bold rounded-2xl py-3 px-4 shadow-sm focus:outline-none focus:border-[#B24016]"
              >
                <option value="general">🍯 Fondo General del Panal (Donde más se necesite)</option>
                {propositos.map((prop) => (
                  <option key={prop.id} value={prop.id}>
                    🎯 {prop.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Paso 3: Datos Bancarios de La Colmena */}
            <div className="bg-[#FAF6E9] border-2 border-[#E5B837] rounded-3xl p-5 sm:p-6 shadow-inner">
              <div className="flex items-center gap-2 mb-3 text-sm font-black text-[#B24016] uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#E5B837]" />
                <span>3. Datos para realizar la transferencia:</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {/* Caja de Alias */}
                <div className="bg-white rounded-2xl p-4 border border-[#E5B837]/60 shadow-sm flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-[#3D2E24]/60 uppercase block">Alias Mercado Pago / Bco</span>
                    <strong className="text-base text-[#3D2E24] tracking-wide font-black">
                      {bankDetails.alias}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(bankDetails.alias, 'alias')}
                    className="flex items-center gap-1.5 bg-[#FAF6E9] hover:bg-[#E5B837]/20 border border-[#E5B837] text-[#3D2E24] px-3 py-1.5 rounded-xl font-bold text-xs transition-colors shrink-0"
                  >
                    {copiedField === 'alias' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-green-700">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#B24016]" />
                        <span>Copiar Alias</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Caja de CBU */}
                <div className="bg-white rounded-2xl p-4 border border-[#E5B837]/60 shadow-sm flex items-center justify-between gap-2">
                  <div className="overflow-hidden">
                    <span className="text-[11px] font-bold text-[#3D2E24]/60 uppercase block">CBU / CVU Bancario</span>
                    <strong className="text-xs sm:text-sm text-[#3D2E24] tracking-wider font-mono block truncate">
                      {bankDetails.cbu}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(bankDetails.cbu, 'cbu')}
                    className="flex items-center gap-1.5 bg-[#FAF6E9] hover:bg-[#E5B837]/20 border border-[#E5B837] text-[#3D2E24] px-3 py-1.5 rounded-xl font-bold text-xs transition-colors shrink-0"
                  >
                    {copiedField === 'cbu' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-green-700">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#B24016]" />
                        <span>Copiar CBU</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-3 text-xs text-[#3D2E24]/75 flex flex-wrap gap-x-6 gap-y-1">
                <span><strong>Titular:</strong> {bankDetails.accountHolder}</span>
                <span><strong>CUIT:</strong> {bankDetails.cuit}</span>
              </div>
            </div>

            {/* Paso 4: Dejar Nombre y Mensaje Comunitario */}
            <div className="space-y-4">
              <label className="block text-sm font-black text-[#3D2E24] uppercase tracking-wide">
                4. Dejanos tu mensaje para el Muro de la Colmena:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Nombre o Familia (ej: Familia Rossi - 2do Grado)"
                    value={donorName}
                    disabled={isAnonymous}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full bg-white border-2 border-[#E5B837]/70 rounded-2xl py-3 px-4 font-bold text-[#3D2E24] placeholder:text-gray-400 focus:outline-none focus:border-[#B24016] disabled:opacity-50"
                  />
                  <label className="mt-2 flex items-center gap-2 text-xs font-bold text-[#3D2E24]/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded border-[#E5B837] text-[#B24016] focus:ring-[#B24016]"
                    />
                    <span>Prefiero que mi aporte aparezca como Anónimo</span>
                  </label>
                </div>

                <div>
                  <textarea
                    rows="2"
                    placeholder="Escribí unas palabras de aliento o intención para la Kermess..."
                    value={donorMessage}
                    onChange={(e) => setDonorMessage(e.target.value)}
                    className="w-full bg-white border-2 border-[#E5B837]/70 rounded-2xl py-2.5 px-4 text-sm font-medium text-[#3D2E24] placeholder:text-gray-400 focus:outline-none focus:border-[#B24016]"
                  ></textarea>
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 text-sm text-[#B24016] bg-red-50 p-3 rounded-2xl border border-red-200">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Botón de Enviar Aporte */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#B24016] hover:bg-[#9e3410] text-[#FAF6E9] px-10 py-4 rounded-2xl font-black text-lg shadow-warm-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Registrar mi Aporte de {formatMoney(effectiveAmount)}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-xs text-[#3D2E24]/60 mt-2">
                * Al hacer clic, tu aporte se reflejará en el avance colectivo de la Colmena y en el muro de familias.
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
