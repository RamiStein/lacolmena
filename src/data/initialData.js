// Datos de la Kermesse Comunitaria en La Colmena
export const INITIAL_CAMPAIGN_DATA = {
  title: "Kermesse en La Colmena",
  subtitle: "Encontrarnos, trabajar en comunidad, tender redes, abrirnos al mundo, ser colmena",
  institution: "Comunidad La Colmena",
  location: "Los Aromos 3100, Loma Verde, Escobar",
  eventDate: "2026-11-21T13:00:00", // Sábado 21 de Noviembre a las 13 hs
  motto: "🪄 ¡El éxito de este evento dependerá de todos! Juntos se hará más simple para cada uno. El propósito es: encontrarnos, trabajar en comunidad, tender redes, abrirnos al mundo, ser colmena.",
  
  // Cronograma oficial de las dos jornadas
  jornadas: [
    {
      id: "preparativos",
      dia: "Viernes 20 de Noviembre",
      horario: "14:00 a 18:00 hs",
      titulo: "Jornada y Preparativos",
      emoji: "🛠️",
      descripcion: "Montaje de puestos, ambientación del predio, colocación de toldos y banderines, pruebas de sonido y preparación de insumos.",
      color: "terracota"
    },
    {
      id: "evento",
      dia: "Sábado 21 de Noviembre",
      horario: "13:00 a 18:00 hs",
      titulo: "Día de la Kermesse",
      emoji: "🎪",
      descripcion: "¡Gran día de fiesta abierta a toda la comunidad! Juegos y talleres, buffet casero, música en vivo, rondas y puestos artesanales.",
      color: "huerta"
    }
  ],

  // Comisiones de trabajo para que las familias se anoten
  comisiones: [
    {
      id: "entrada",
      name: "Entrada",
      emoji: "🎟️",
      referentes: "Agus O",
      desc: "Recepción amorosa de las familias en el portón, entrega de programas, cobro de bonos contribución y bienvenida con sonrisas.",
      color: "miel"
    },
    {
      id: "juegos-talleres",
      name: "Juegos y Talleres",
      emoji: "🤹‍♀️",
      referentes: "Lorena y Aixa",
      desc: "Atención y animación de las postas de juegos tradicionales y de destreza, rondas de movimiento y talleres artísticos para las infancias.",
      color: "huerta"
    },
    {
      id: "ambientacion",
      name: "Ambientación",
      emoji: "🎏",
      referentes: "Agus O",
      desc: "Decoración con banderines, guirnaldas, flores, telas y rincones bellos para que la escuela se vista de fiesta y calidez hogareña.",
      color: "terracota"
    },
    {
      id: "sonido-artistica",
      name: "Sonido y Artística",
      emoji: "🎻",
      referentes: "Aixa y Ramiro",
      desc: "Instalación del sonido acústico, cables, micrófonos, coordinación de los números artísticos, músicos invitados y avisos generales.",
      color: "cielo"
    },
    {
      id: "buffet",
      name: "Buffet",
      emoji: "🥙",
      referentes: "Marcos (papá de Fresia e Itanú)",
      desc: "Cocina y despacho de comidas ricas y saludables, horneados caseros, licuados naturales, café de higo e infusiones.",
      color: "miel"
    },
    {
      id: "premios",
      name: "Premios",
      emoji: "💡",
      referentes: "Lorena y Aixa",
      desc: "Recepción de donaciones familiares para premios, armado de paquetes sorpresa artesanales y entrega a los niños participantes.",
      color: "huerta"
    },
    {
      id: "gestion-residuos",
      name: "Gestión de Residuos",
      emoji: "♻️",
      referentes: "Ramiro",
      desc: "Organización de islas verdes para separación consciente de residuos, compostaje de orgánicos del buffet y cuidado ecológico del predio.",
      color: "huerta"
    }
  ],

  // Voluntarios anotados en comisiones
  voluntarios: [
    {
      id: "vol-1",
      name: "Familia Gómez Benítez",
      phone: "11-4455-6677",
      comisionId: "buffet",
      disponibilidad: "ambos",
      message: "Llevamos tortas caseras y podemos estar atendiendo el mostrador.",
      date: "2026-10-18T14:20:00"
    },
    {
      id: "vol-2",
      name: "Carla y Santi (Jardín)",
      phone: "11-3322-1100",
      comisionId: "ambientacion",
      disponibilidad: "viernes",
      message: "Disponibles el viernes a las 14 hs para colgar banderines y acomodar mesas.",
      date: "2026-10-19T10:15:00"
    },
    {
      id: "vol-3",
      name: "Mateo (papá de Clara)",
      phone: "11-6677-8899",
      comisionId: "gestion-residuos",
      disponibilidad: "sabado",
      message: "Me sumo al equipo de reciclaje y cuidado de tachos verdes durante la tarde.",
      date: "2026-10-20T16:00:00"
    },
    {
      id: "vol-4",
      name: "Valeria y Tomás",
      phone: "11-2233-4455",
      comisionId: "juegos-talleres",
      disponibilidad: "sabado",
      message: "Podemos coordinar la estación de pesca mágica o el tiro al blanco.",
      date: "2026-10-21T09:30:00"
    }
  ],

  targetAmount: 3800000, // Meta comunitaria global ($3.800.000)
  bankDetails: {
    bankName: "Banco Provincia / Cuenta DNI / Mercado Pago",
    accountHolder: "Asociación Civil Comunidad La Colmena",
    alias: "la.colmena.rafael",
    cbu: "0140000000000031002211",
    cuit: "30-71649821-4",
    whatsappNumber: "5491155554321", // Para enviar comprobante directo
  },
  propositos: [
    {
      id: "herbolario-salud",
      title: "Herbolario, Tinturas y Botiquín Natural",
      icon: "Sprout",
      description: "Plantines medicinales biodinámicos (manzanilla, caléndula, lavanda, romero), aceites esenciales, alcohol de cereales y frascos para el taller de medicina casera y el botiquín vivo de la escuela.",
      target: 750000,
      raised: 590000,
      color: "huerta",
    },
    {
      id: "arte-terapia",
      title: "Arte Terapéutico y Oficios de Armonía",
      icon: "Palette",
      description: "Acuarelas Stockmar para veladuras de color que serenan el alma, ceras de abejas tibias para modelar, lanas vellón teñidas con tintes de monte y maderas nobles para el trabajo sereno de los sentidos.",
      target: 850000,
      raised: 680000,
      color: "miel",
    },
    {
      id: "nutricion-cocina",
      title: "Alquimia de la Cocina y Pan Saludable",
      icon: "Wheat",
      description: "Harinas integrales agroecológicas, masa madre viva, miel de abejas pura, frutos secos, hierbas digestivas e ingredientes limpios para elaborar alimentos vitales y el buffet consciente de la feria.",
      target: 650000,
      raised: 520000,
      color: "miel",
    },
    {
      id: "ritmo-movimiento",
      title: "Música Armónica, Rondas y Movimiento Curativo",
      icon: "Music",
      description: "Instrumentos acústicos nobles (arpa, cítaras, flautas de madera, cuencos y sikus), mantas de telar y rondas de euritmia pedagógica que invitan a la respiración y armonía corporal de niños y grandes.",
      target: 800000,
      raised: 410000,
      color: "cielo",
    },
    {
      id: "oasis-cuidado",
      title: "Oasis de Sombra, Descanso y Abrazo Familiar",
      icon: "HeartHandshake",
      description: "Pérgolas y toldos de lino natural para cuidar del sol primaveral, rincones de reposo con fardos de pasto, flores de estación y espacios de escucha y bienestar para todas las familias.",
      target: 750000,
      raised: 380000,
      color: "terracota",
    }
  ],
  presetAmounts: [
    {
      amount: 3000,
      title: "Semilla de Salud",
      emoji: "🌿",
      desc: "Plantines aromáticos y semillas medicinales para la huerta de la escuela.",
    },
    {
      amount: 7500,
      title: "Bálsamo de Caléndula",
      emoji: "🌼",
      desc: "Aceites, ceras de abeja e insumos para preparados naturales de cuidado.",
    },
    {
      amount: 15000,
      title: "Miel Reparadora",
      emoji: "🍯",
      desc: "Harinas agroecológicas y frutos nobles para el pan y buffet consciente.",
    },
    {
      amount: 30000,
      title: "Manto de Rafael",
      emoji: "💚",
      desc: "Materiales nobles para talleres de arte sanador y música acústica.",
    },
    {
      amount: 60000,
      title: "Guardián de la Comunidad",
      emoji: "✨",
      desc: "Acondicionamiento de gazebos de sombra, descanso y sostenimiento del predio.",
    },
  ],
  donaciones: [
    {
      id: "don-1",
      donorName: "Familia Gómez Benítez (3er Grado)",
      amount: 30000,
      date: "2026-10-15T14:30:00",
      propositoId: "herbolario-salud",
      message: "¡Que la mirada sanadora de Rafael traiga salud, equilibrio y amor a todas nuestras familias!",
      isAnonymous: false,
      confirmed: true,
    },
    {
      id: "don-2",
      donorName: "Docentes de Jardín e Inicial",
      amount: 45000,
      date: "2026-10-14T11:20:00",
      propositoId: "arte-terapia",
      message: "Cuidando con ternura el calor anímico y el desarrollo libre y saludable de las infancias.",
      isAnonymous: false,
      confirmed: true,
    },
    {
      id: "don-3",
      donorName: "Abuelos de Clara y Mateo",
      amount: 60000,
      date: "2026-10-12T18:15:00",
      propositoId: "ritmo-movimiento",
      message: "Esperamos con ansias la música armónica, las rondas y el encuentro que tanto nos sana el corazón.",
      isAnonymous: false,
      confirmed: true,
    },
    {
      id: "don-4",
      donorName: "Familia Rossi",
      amount: 15000,
      date: "2026-10-10T09:45:00",
      propositoId: "nutricion-cocina",
      message: "¡Queremos aportar para que el alimento de la feria sea medicina viva para todos!",
      isAnonymous: false,
      confirmed: true,
    },
    {
      id: "don-5",
      donorName: "Aporte Anónimo",
      amount: 30000,
      date: "2026-10-08T16:10:00",
      propositoId: "oasis-cuidado",
      message: "Por un espacio que acoge, protege y acompaña el florecer de cada ser humano en Loma Verde.",
      isAnonymous: true,
      confirmed: true,
    },
    {
      id: "don-6",
      donorName: "Mariana y Facundo",
      amount: 7500,
      date: "2026-10-06T20:00:00",
      propositoId: "herbolario-salud",
      message: "Un granito de polen para los preparados y la huerta medicinal de la colmena.",
      isAnonymous: false,
      confirmed: true,
    }
  ]
};
