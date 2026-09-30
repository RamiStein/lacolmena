import React, { useState } from 'react';
import { X, Check, Trash2, Download, Plus, Save, Settings, ShieldCheck, DollarSign } from 'lucide-react';

export function AdminModal({ 
  isOpen, 
  onClose, 
  campaignData, 
  onUpdateTarget, 
  onAddManualDonation,
  onDeleteDonation,
  onToggleConfirm 
}) {
  const [newTarget, setNewTarget] = useState(campaignData.targetAmount);
  const [showAddForm, setShowAddForm] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualAmount, setManualAmount] = useState('');
  const [manualMessage, setManualMessage] = useState('');
  const [manualProp, setManualProp] = useState('general');

  if (!isOpen) return null;

  const formatMoney = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleSaveTarget = (e) => {
    e.preventDefault();
    onUpdateTarget(Number(newTarget));
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualAmount || Number(manualAmount) <= 0) return;

    onAddManualDonation({
      id: 'don-man-' + Date.now(),
      donorName: manualName.trim() || 'Aporte en Efectivo / Sobre',
      amount: Number(manualAmount),
      date: new Date().toISOString(),
      propositoId: manualProp === 'general' ? null : manualProp,
      message: manualMessage.trim() || 'Aporte manual asentado por coordinación.',
      isAnonymous: false,
      confirmed: true,
    });

    setManualName('');
    setManualAmount('');
    setManualMessage('');
    setShowAddForm(false);
  };

  const exportCSV = () => {
    const headers = ["ID", "Fecha", "Donante", "Monto", "Propósito", "Mensaje", "Confirmado"];
    const rows = campaignData.donaciones.map(d => [
      d.id,
      d.date,
      `"${d.donorName.replace(/"/g, '""')}"`,
      d.amount,
      d.propositoId || "General",
      `"${(d.message || '').replace(/"/g, '""')}"`,
      d.confirmed ? "SI" : "NO"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `donaciones_kermess_colmena_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF6E9] border-2 border-[#E5B837] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 flex flex-col justify-between">
        
        {/* Cabecera del Modal */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#E5B837]/40 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#B24016] text-[#FAF6E9] rounded-2xl">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#3D2E24]">
                  Panel de Coordinación • Kermess de Micael
                </h3>
                <p className="text-xs text-[#3D2E24]/70">
                  Gestión interna de recaudación y libro de aportes
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#E5B837]/30 text-[#3D2E24]/70 hover:text-[#3D2E24] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Configuración de Meta y Acciones Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Editar Meta */}
            <form onSubmit={handleSaveTarget} className="bg-white rounded-2xl p-4 border border-[#E5B837] shadow-sm">
              <label className="block text-xs font-black text-[#3D2E24]/80 uppercase mb-1">
                Meta Global de Recaudación ($)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full bg-[#FAF6E9] border border-[#E5B837] rounded-xl px-3 py-2 text-sm font-bold text-[#B24016] focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#4A6B53] text-[#FAF6E9] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Actualizar</span>
                </button>
              </div>
            </form>

            {/* Acciones de exportación y carga manual */}
            <div className="bg-white rounded-2xl p-4 border border-[#E5B837] shadow-sm flex items-center justify-between gap-3">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex-1 bg-[#E5B837] hover:bg-[#d8a825] text-[#3D2E24] py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Asentar Aporte Manual</span>
              </button>

              <button
                onClick={exportCSV}
                className="bg-[#466270] hover:bg-[#39505c] text-white py-2 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
                title="Descargar planilla CSV para Excel o Sheets"
              >
                <Download className="w-4 h-4" />
                <span>Exportar CSV</span>
              </button>
            </div>
          </div>

          {/* Formulario de carga manual */}
          {showAddForm && (
            <form onSubmit={handleManualSubmit} className="bg-white/90 border-2 border-[#B24016] rounded-2xl p-4 mb-6 animate-in fade-in duration-200">
              <h4 className="font-black text-sm text-[#3D2E24] mb-3">
                Registrar colaboración en efectivo o transferencia externa:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Nombre de la familia o persona"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  required
                  className="border border-[#E5B837] rounded-xl p-2 text-xs font-bold"
                />
                <input
                  type="number"
                  placeholder="Monto ($)"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  required
                  className="border border-[#E5B837] rounded-xl p-2 text-xs font-bold text-[#B24016]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <select
                  value={manualProp}
                  onChange={(e) => setManualProp(e.target.value)}
                  className="border border-[#E5B837] rounded-xl p-2 text-xs font-bold"
                >
                  <option value="general">Fondo General</option>
                  {campaignData.propositos.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Nota o mensaje breve"
                  value={manualMessage}
                  onChange={(e) => setManualMessage(e.target.value)}
                  className="border border-[#E5B837] rounded-xl p-2 text-xs"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-xs text-[#3D2E24]/70"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#B24016] text-[#FAF6E9] px-4 py-1.5 rounded-xl text-xs font-bold"
                >
                  Guardar Aporte
                </button>
              </div>
            </form>
          )}

          {/* Tabla de Donaciones Recibidas */}
          <div className="bg-white rounded-2xl border border-[#E5B837] overflow-hidden shadow-sm">
            <div className="p-3 bg-[#FAF6E9] border-b border-[#E5B837] flex justify-between items-center text-xs font-bold text-[#3D2E24]">
              <span>Registro de Aportes ({campaignData.donaciones.length})</span>
              <span className="text-[#B24016]">Total: {formatMoney(campaignData.donaciones.reduce((acc, d) => acc + (d.amount || 0), 0))}</span>
            </div>

            <div className="overflow-x-auto max-h-72">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-100 text-[#3D2E24]/70 uppercase font-black">
                  <tr>
                    <th className="p-3">Donante</th>
                    <th className="p-3">Monto</th>
                    <th className="p-3">Destino</th>
                    <th className="p-3">Mensaje</th>
                    <th className="p-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {campaignData.donaciones.map((d) => (
                    <tr key={d.id} className="hover:bg-[#FAF6E9]/40 transition-colors">
                      <td className="p-3 font-bold text-[#3D2E24]">{d.donorName}</td>
                      <td className="p-3 font-black text-[#B24016]">{formatMoney(d.amount)}</td>
                      <td className="p-3 text-[#3D2E24]/80">
                        {d.propositoId ? campaignData.propositos.find(p => p.id === d.propositoId)?.title || d.propositoId : 'General'}
                      </td>
                      <td className="p-3 text-[#3D2E24]/70 max-w-xs truncate" title={d.message}>
                        {d.message || '-'}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onDeleteDonation(d.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Eliminar aporte"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pie del modal */}
        <div className="mt-6 pt-4 border-t border-[#E5B837]/30 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#3D2E24] text-[#FAF6E9] px-6 py-2.5 rounded-full font-bold text-xs hover:bg-[#2B1E16] transition-colors"
          >
            Cerrar Panel
          </button>
        </div>
      </div>
    </div>
  );
}
