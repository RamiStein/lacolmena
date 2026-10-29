import React, { useState, useEffect } from 'react';
import { INITIAL_CAMPAIGN_DATA } from './data/initialData';
import { Header } from './components/Header';
import { InicioSection } from './components/InicioSection';
import { ComisionesSection } from './components/ComisionesSection';
import { PanalProgress } from './components/PanalProgress';
import { CeldasPropositos } from './components/CeldasPropositos';
import { DonationSection } from './components/DonationSection';
import { RafaelInfoSection } from './components/RafaelInfoSection';
import { MuroComunidad } from './components/MuroComunidad';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';

const VALID_TABS = ['inicio', 'comisiones', 'panal', 'sobre-rafael', 'muro'];

export default function App() {
  // Determinar pestaña inicial según el hash de la URL si existe
  const getInitialTab = () => {
    const hash = window.location.hash.replace('#', '');
    if (VALID_TABS.includes(hash)) {
      return hash;
    }
    // Compatibilidad con hashes antiguos
    if (hash === 'propositos' || hash === 'donar') return 'panal';
    return 'inicio';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  // Cargar estado inicial o recuperar desde localStorage
  const [campaignData, setCampaignData] = useState(() => {
    // Limpieza de claves de prueba anteriores
    try {
      localStorage.removeItem('la_colmena_campaign_data_v1');
      localStorage.removeItem('la_colmena_campaign_data_v2_rafael');
      localStorage.removeItem('la_colmena_campaign_data_v3_kermesse');
      localStorage.removeItem('la_colmena_campaign_data_real');
    } catch (e) {
      // ignore
    }

    const saved = localStorage.getItem('la_colmena_campaign_data_v144');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_CAMPAIGN_DATA,
          ...parsed,
          targetAmount: parsed.targetAmount || INITIAL_CAMPAIGN_DATA.targetAmount,
          propositos: parsed.propositos || INITIAL_CAMPAIGN_DATA.propositos,
          comisiones: INITIAL_CAMPAIGN_DATA.comisiones,
          jornadas: INITIAL_CAMPAIGN_DATA.jornadas,
          eventDate: INITIAL_CAMPAIGN_DATA.eventDate,
        };
      } catch (e) {
        console.error("Error al cargar datos guardados:", e);
      }
    }
    return INITIAL_CAMPAIGN_DATA;
  });

  const [selectedPropositoId, setSelectedPropositoId] = useState('general');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Escuchar cambios en el hash de la URL
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (VALID_TABS.includes(hash)) {
        setActiveTab(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Guardar en localStorage ante cualquier cambio
  useEffect(() => {
    localStorage.setItem('la_colmena_campaign_data_v144', JSON.stringify(campaignData));
  }, [campaignData]);

  // Navegación fluida entre pestañas
  const handleNavigate = (tabId) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calcular el total recaudado sumando las donaciones confirmadas
  const totalRaised = campaignData.donaciones.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const donorsCount = campaignData.donaciones.filter(d => d.amount > 0).length;
  const voluntariosCount = (campaignData.voluntarios || []).length;

  // Actualizar fondos por propósito
  const propositosConProgreso = campaignData.propositos.map((prop) => {
    const propDonations = campaignData.donaciones
      .filter((d) => d.propositoId === prop.id)
      .reduce((sum, d) => sum + (d.amount || 0), 0);
    
    const generalDonations = campaignData.donaciones
      .filter((d) => !d.propositoId || d.propositoId === 'general')
      .reduce((sum, d) => sum + (d.amount || 0), 0);
    
    const generalShare = Math.round(generalDonations / campaignData.propositos.length);

    return {
      ...prop,
      raised: propDonations + generalShare,
    };
  });

  // Handler para agregar nueva donación económica
  const handleAddDonation = (newDonation) => {
    setCampaignData((prev) => ({
      ...prev,
      donaciones: [newDonation, ...prev.donaciones],
    }));
  };

  // Handler para agregar nuevo voluntario a una comisión
  const handleAddVoluntario = (newVoluntario) => {
    setCampaignData((prev) => ({
      ...prev,
      voluntarios: [newVoluntario, ...(prev.voluntarios || [])],
    }));
  };

  // Handler para eliminar un voluntario (desde admin)
  const handleDeleteVoluntario = (id) => {
    setCampaignData((prev) => ({
      ...prev,
      voluntarios: (prev.voluntarios || []).filter(v => v.id !== id),
    }));
  };

  // Handler para agregar un mensaje simple sin dinero
  const handleAddSimpleMessage = (newMsg) => {
    setCampaignData((prev) => ({
      ...prev,
      donaciones: [newMsg, ...prev.donaciones],
    }));
  };

  // Handler para cambiar la meta global
  const handleUpdateTarget = (newTarget) => {
    setCampaignData((prev) => ({
      ...prev,
      targetAmount: newTarget,
    }));
  };

  // Handler para eliminar un aporte
  const handleDeleteDonation = (id) => {
    setCampaignData((prev) => ({
      ...prev,
      donaciones: prev.donaciones.filter((d) => d.id !== id),
    }));
  };

  // Selección de propósito y salto al formulario
  const handleSelectProposito = (propId) => {
    setSelectedPropositoId(propId);
    handleNavigate('panal');
    setTimeout(() => {
      const el = document.getElementById('donar');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#E5B837]/30 selection:text-[#B24016]">
      {/* Menú Superior Sticky */}
      <Header 
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onOpenAdmin={() => setIsAdminOpen(true)}
        voluntariosCount={voluntariosCount}
      />

      {/* Contenido Principal según la pestaña seleccionada */}
      <main className="flex-1">
        {/* 1. SECCIÓN INICIO */}
        {activeTab === 'inicio' && (
          <InicioSection 
            eventDate={campaignData.eventDate}
            totalRaised={totalRaised}
            targetAmount={campaignData.targetAmount}
            donorsCount={donorsCount}
            voluntariosCount={voluntariosCount}
            onNavigate={handleNavigate}
          />
        )}

        {/* 2. SECCIÓN COMISIONES Y VOLUNTARIADO */}
        {activeTab === 'comisiones' && (
          <ComisionesSection 
            comisiones={campaignData.comisiones}
            voluntarios={campaignData.voluntarios}
            onAddVoluntario={handleAddVoluntario}
          />
        )}

        {/* 3. SECCIÓN EL PANAL Y DONACIONES */}
        {activeTab === 'panal' && (
          <div className="animate-in fade-in duration-300 py-6">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-4 text-center">
              <span className="text-xs font-black uppercase tracking-wider text-[#B24016] bg-[#E5B837]/20 border border-[#E5B837] px-4 py-1.5 rounded-full">
                🍯 FONDO COMUNITARIO Y PROPÓSITOS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#3D2E24] mt-3">
                El Panal del Festival de Primavera
              </h2>
              <p className="text-xs sm:text-sm text-[#3D2E24]/80 max-w-xl mx-auto mt-2">
                Con tu colaboración adquirimos los insumos nobles para los talleres, juegos, música y sostenimiento del predio escolar.
              </p>
            </div>

            {/* Progreso del Panal */}
            <PanalProgress 
              targetAmount={campaignData.targetAmount}
              totalRaised={totalRaised}
              donorsCount={donorsCount}
              onDonateClick={() => {
                const el = document.getElementById('donar');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Los 5 Propósitos */}
            <CeldasPropositos 
              propositos={propositosConProgreso}
              onSelectProposito={(propId) => {
                setSelectedPropositoId(propId);
                const el = document.getElementById('donar');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Formulario de Donación */}
            <DonationSection 
              presetAmounts={campaignData.presetAmounts}
              propositos={campaignData.propositos}
              bankDetails={campaignData.bankDetails}
              selectedPropositoId={selectedPropositoId}
              onAddDonation={handleAddDonation}
            />
          </div>
        )}

        {/* 4. SECCIÓN SOBRE RAFAEL Y SALUD */}
        {activeTab === 'sobre-rafael' && (
          <div className="animate-in fade-in duration-300">
            <RafaelInfoSection />
          </div>
        )}

        {/* 5. SECCIÓN MURO DE LA COMUNIDAD */}
        {activeTab === 'muro' && (
          <div className="animate-in fade-in duration-300 py-6">
            <MuroComunidad 
              donaciones={campaignData.donaciones}
              onAddSimpleMessage={handleAddSimpleMessage}
            />
          </div>
        )}
      </main>

      {/* Pie de página con datos institucionales y navegación */}
      <Footer onNavigate={handleNavigate} />

      {/* Modal para el equipo de coordinación */}
      <AdminModal 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        campaignData={{ 
          ...campaignData, 
          propositos: propositosConProgreso 
        }}
        onUpdateTarget={handleUpdateTarget}
        onAddManualDonation={handleAddDonation}
        onDeleteDonation={handleDeleteDonation}
        onDeleteVoluntario={handleDeleteVoluntario}
      />
    </div>
  );
}
