import React, { useState, useEffect } from 'react';
import { INITIAL_CAMPAIGN_DATA } from './data/initialData';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { PanalProgress } from './components/PanalProgress';
import { CeldasPropositos } from './components/CeldasPropositos';
import { DonationSection } from './components/DonationSection';
import { MuroComunidad } from './components/MuroComunidad';
import { MicaelInfoSection } from './components/MicaelInfoSection';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';

export default function App() {
  // Cargar estado inicial o recuperar desde localStorage para persistencia local
  const [campaignData, setCampaignData] = useState(() => {
    const saved = localStorage.getItem('la_colmena_campaign_data_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error al cargar datos guardados:", e);
      }
    }
    return INITIAL_CAMPAIGN_DATA;
  });

  const [selectedPropositoId, setSelectedPropositoId] = useState('general');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Guardar en localStorage ante cualquier cambio
  useEffect(() => {
    localStorage.setItem('la_colmena_campaign_data_v1', JSON.stringify(campaignData));
  }, [campaignData]);

  // Calcular el total recaudado sumando las donaciones confirmadas
  const totalRaised = campaignData.donaciones.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const donorsCount = campaignData.donaciones.filter(d => d.amount > 0).length;

  // Actualizar también los fondos recaudados por propósito
  const propositosConProgreso = campaignData.propositos.map((prop) => {
    const propDonations = campaignData.donaciones
      .filter((d) => d.propositoId === prop.id)
      .reduce((sum, d) => sum + (d.amount || 0), 0);
    
    // Proporción del fondo general repartido equitativamente
    const generalDonations = campaignData.donaciones
      .filter((d) => !d.propositoId || d.propositoId === 'general')
      .reduce((sum, d) => sum + (d.amount || 0), 0);
    
    const generalShare = Math.round(generalDonations / campaignData.propositos.length);

    return {
      ...prop,
      raised: propDonations + generalShare,
    };
  });

  // Handler para agregar nueva donación
  const handleAddDonation = (newDonation) => {
    setCampaignData((prev) => ({
      ...prev,
      donaciones: [newDonation, ...prev.donaciones],
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

  // Handler para eliminar un aporte (desde el panel de admin)
  const handleDeleteDonation = (id) => {
    setCampaignData((prev) => ({
      ...prev,
      donaciones: prev.donaciones.filter((d) => d.id !== id),
    }));
  };

  // Smooth scroll a la sección de donación
  const scrollToDonation = (propositoId = 'general') => {
    setSelectedPropositoId(propositoId);
    const element = document.getElementById('donar');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#E5B837]/30 selection:text-[#B24016]">
      {/* Barra de Navegación Principal */}
      <Header 
        onOpenAdmin={() => setIsAdminOpen(true)}
        onDonateClick={() => scrollToDonation('general')}
      />

      {/* Hero Principal con Sol de Micael y cuenta regresiva */}
      <main className="flex-1">
        <HeroBanner 
          eventDate={campaignData.eventDate}
          onDonateClick={() => scrollToDonation('general')}
        />

        {/* Panal Colectivo: Avance general y celdas doradas */}
        <PanalProgress 
          targetAmount={campaignData.targetAmount}
          totalRaised={totalRaised}
          donorsCount={donorsCount}
          onDonateClick={() => scrollToDonation('general')}
        />

        {/* Los 5 Propósitos del Panal de Micael */}
        <CeldasPropositos 
          propositos={propositosConProgreso}
          onSelectProposito={(propId) => scrollToDonation(propId)}
        />

        {/* Explicación de la Festividad de Micael y Fotos de la Comunidad */}
        <MicaelInfoSection />

        {/* Formulario y Métodos de Aporte Comunitario */}
        <DonationSection 
          presetAmounts={campaignData.presetAmounts}
          propositos={campaignData.propositos}
          bankDetails={campaignData.bankDetails}
          selectedPropositoId={selectedPropositoId}
          onAddDonation={handleAddDonation}
        />

        {/* Muro de la Colmena: Mensajes y agradecimientos */}
        <MuroComunidad 
          donaciones={campaignData.donaciones}
          onAddSimpleMessage={handleAddSimpleMessage}
        />
      </main>

      {/* Pie de página con datos institucionales */}
      <Footer />

      {/* Modal para el equipo de coordinación */}
      <AdminModal 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        campaignData={{ ...campaignData, propositos: propositosConProgreso }}
        onUpdateTarget={handleUpdateTarget}
        onAddManualDonation={handleAddDonation}
        onDeleteDonation={handleDeleteDonation}
      />
    </div>
  );
}
