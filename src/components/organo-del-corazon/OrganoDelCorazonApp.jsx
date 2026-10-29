// OrganoDelCorazonApp.jsx - Experiencia digital interactiva
// Inicia con la animación del corazón latiendo y bombeando sangre a toda la colmena,
// manifestando la fuerza de la creación comunitaria, para luego dar paso a la presentación en Google Slides.

import React, { useState, useEffect } from 'react';
import { HeartBeatIntro } from './HeartBeatIntro';
import { SlidesPresentation } from './SlidesPresentation';

export function OrganoDelCorazonApp() {
  // Comprobar si se especificó el modo directo en la URL
  const getInitialView = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('vista') === 'slides' || params.get('directo') === 'true') {
        return 'presentation';
      }
    }
    return 'intro';
  };

  const [currentView, setCurrentView] = useState(getInitialView);

  // Actualizar el título del documento mientras se visualiza la propuesta
  useEffect(() => {
    const originalTitle = document.title;
    document.title = "LA COLMENA • El Despertar del Órgano del Corazón (Propuesta 2026)";

    // Scroll arriba
    window.scrollTo(0, 0);

    return () => {
      document.title = originalTitle;
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#180D09] text-[#FAF6E9] font-sans">
      {currentView === 'intro' ? (
        <HeartBeatIntro 
          onEnterPresentation={() => {
            setCurrentView('presentation');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
        />
      ) : (
        <SlidesPresentation 
          onReplayIntro={() => {
            setCurrentView('intro');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
        />
      )}
    </div>
  );
}

export default OrganoDelCorazonApp;
