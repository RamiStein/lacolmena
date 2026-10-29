// slidesData.js - Propuesta digital "El Despertar del Órgano del Corazón"
// Basada íntegramente en el documento fundacional de La Colmena (Loma Verde, Escobar | 2026)

export const SLIDES = [
  {
    id: 1,
    badge: "DOCUMENTO FUNDACIONAL",
    type: "cover",
    title: "LA COLMENA",
    subtitle: "Hacia una Comunidad Ampliada: El Despertar del Órgano del Corazón",
    tagline: "Propuesta de Desarrollo Comunitario y Organización Evolutiva",
    dedication: "Para compartir y trabajar junto a Sebastián",
    locationYear: "Loma Verde, Escobar • 2026",
    theme: "warm-cover",
    speakerNotes: "Portada formal de la propuesta dirigida a Sebastián. Plantea el umbral evolutivo en el que se encuentra la escuela La Colmena tras 5 años de vida pedagógica y el paso necesario hacia una comunidad ampliada que abrace a los adultos y sostenga a los maestros."
  },
  {
    id: 2,
    badge: "SECCIÓN 1 • CONTEXTO",
    type: "content-split",
    sectionNumber: "01",
    title: "Introducción y Contexto del Organismo",
    subtitle: "El Momento Umbral y la Necesidad de Trascender hacia la Comunidad Ampliada",
    summary: "La escuela La Colmena, con sus 4 a 5 años de vida y un desarrollo pedagógico que ya alcanza el sexto grado, se encuentra en un momento umbral decisivo.",
    points: [
      {
        title: "Crisis de Transición Vital",
        desc: "Como organismo vivo, ha crecido velozmente en su estructura física y pedagógica, pero este mismo crecimiento impone una crisis de maduración indispensable.",
        icon: "TrendingUp",
        highlight: "Umbral de 6° grado"
      },
      {
        title: "El Futuro en Juego",
        desc: "Para asegurar su existencia, su paso hacia la secundaria (si así se decide) y su futuro vinculado a la escuela en el campo, el organismo debe evolucionar de ser solo una 'comunidad educativa' a una 'comunidad ampliada'.",
        icon: "Compass",
        highlight: "Comunidad Ampliada"
      },
      {
        title: "El Vacío Estructural y Jurídico",
        desc: "Actualmente la escuela carece de una encarnación plena en su aspecto jurídico y legal. Funciona bajo una figura civil que aún no tiene una estructura real ni es consciente de sí misma, reflejándose en desequilibrios energéticos y organizativos diarios.",
        icon: "AlertCircle",
        highlight: "Vacío legal y civil"
      }
    ],
    quote: "«El organismo necesita evolucionar de ser puramente una 'comunidad educativa' hacia una 'comunidad ampliada'.»",
    speakerNotes: "Enfatizar que el crecimiento hasta 6to grado es un logro enorme, pero que la estructura actual llegó a su límite elástico. Sin una comunidad ampliada madura y una encarnación civil/jurídica clara, las exigencias de la secundaria y la escuela en el campo terminarán quebrando el sistema."
  },
  {
    id: 3,
    badge: "SECCIÓN 2 • DIAGNÓSTICO",
    type: "grid-cards",
    sectionNumber: "02",
    title: "Diagnóstico del Desequilibrio Actual",
    subtitle: "El exceso de intervención desde 'la mente' descuidando el latido del corazón integrador",
    summary: "El organismo social de La Colmena está siendo habitado e intervenido en exceso desde 'la mente' y el intelecto, descuidando el latido del corazón que debe integrar y armonizar. Este desequilibrio se manifiesta en 4 síntomas muy concretos:",
    cards: [
      {
        id: "burnout",
        number: "A",
        title: "Sobrecarga y Centralización en los Maestros",
        body: "Los docentes asumen no solo la pedagogía, sino el sostén emocional de familias, la gestión escolar y proyectos comunitarios. Esto desdibuja los límites, centraliza involuntariamente el poder y genera un profundo agotamiento (burnout) en los maestros.",
        tag: "Agotamiento docente",
        color: "amber"
      },
      {
        id: "fraterno",
        number: "B",
        title: "Crisis del Ingreso Fraterno",
        body: "La economía fraterna corre el riesgo de mutar a cuota fija. Falta conciencia grupal del sostén: existe la disonancia de aportar $40.000 para educación pero gastar $20.000 en una pizza congelada. Los maestros terminan asumiendo el déficit financiero.",
        tag: "Disonancia económica",
        color: "rose"
      },
      {
        id: "caos",
        number: "C",
        title: "Voluntad Caótica y Falta de Ritmo",
        body: "La energía de las familias se aporta desordenadamente. Se piden favores sin marco claro (si es remunerado o voluntario), ocultando la realidad de familias agotadas física o económicamente que no hallan espacio para expresarlo.",
        tag: "Falta de claridad",
        color: "orange"
      },
      {
        id: "fuga",
        number: "D",
        title: "La Fuga de Energía (Claros y Oscuros)",
        body: "Como señaló Alejandro Urtizberea (especialista en economía antroposófica), aprendemos por 'claros y oscuros'. Familias valiosas se alejan por quemarse: su entrega no pudo ser validada ni abrazada amorosamente por el desborde escolar.",
        tag: "Pérdida de vitalidad",
        color: "red"
      }
    ],
    speakerNotes: "El diagnóstico es honesto y compasivo. No busca culpables, sino reconocer una ley biológica-espiritual: cuando la cabeza (pensar) manda sola sin el calor del corazón (sentir), los miembros (hacer/voluntad) actúan en espasmos caóticos y el organismo se desgasta."
  },
  {
    id: 4,
    badge: "SECCIÓN 3 • LA VISIÓN",
    type: "vision-focus",
    sectionNumber: "03",
    title: "La Visión: Hacia la Comunidad Ampliada",
    subtitle: "Trascender lo pedagógico para abrazar amorosamente las necesidades de los adultos",
    columns: [
      {
        badge: "La Realidad Actual",
        heading: "La Escuela ya Entra en la Vida Íntima",
        points: [
          "La escuela ya trasciende lo puramente curricular: busca formar adultos e interviene en la intimidad del hogar (directrices de pantallas, admisiones intensas).",
          "Sin un acompañamiento amoroso y estructurado, esta intervención inevitablemente genera fricciones, choques y malentendidos defensivos."
        ],
        icon: "ShieldAlert"
      },
      {
        badge: "El Salto Cualitativo",
        heading: "Abrazar al Adulto en Todas sus Esferas",
        points: [
          "Una comunidad ampliada abraza no solo a los niños, sino las necesidades personales, emocionales, económicas y espirituales de los adultos.",
          "Generar identidad desde adentro, integrando con calidez a las familias que no conocen la antroposofía o cuyas prácticas difieren de la conciencia de grupo."
        ],
        icon: "HeartHandshake"
      }
    ],
    conclusionCallout: "«Necesitamos generar nuestra propia identidad desde adentro, de forma interna, integrando amorosamente sin exigencias dogmáticas.»",
    speakerNotes: "Clave de esta diapositiva: una escuela Waldorf no puede educar niños sanos si sus padres están en conflicto o excluidos por no saber antroposofía. La comunidad ampliada es el útero social que protege a la infancia."
  },
  {
    id: 5,
    badge: "SECCIÓN 4 • LA PROPUESTA (I)",
    type: "proposal-core",
    sectionNumber: "04",
    title: "Creación del Órgano del Corazón",
    subtitle: "Un nuevo órgano dentro de la esfera cultural-espiritual comunitaria de La Colmena",
    premise: "Para guiar la energía de la escuela hacia su próxima etapa evolutiva y asegurar que la vitalidad de las familias no se vuelva a perder, proponemos la creación formal del Órgano del Corazón.",
    functions: [
      {
        number: "01",
        title: "Amortiguar y Acompañar",
        desc: "Ser el espacio que recibe, acompaña y traduce las necesidades de las familias, evitando que se alejen por falta de contención o incomprensión de los procesos escolares.",
        icon: "Heart"
      },
      {
        number: "02",
        title: "Descentralizar y Cuidar al Maestro",
        desc: "Liberar a los maestros de responsabilidades no pedagógicas (fiestas del año, encuentros de familias, gestión emocional comunitaria), devolviendo estas tareas vitales a la comunidad.",
        icon: "Feather"
      },
      {
        number: "03",
        title: "Gestión Energética Integral",
        desc: "Administrar las fuerzas voluntarias dándoles un pulso, un ritmo y un latido compartido, protegiendo a la comunidad del desgaste estéril.",
        icon: "Activity"
      }
    ],
    speakerNotes: "El Órgano del Corazón se concibe como un amortiguador amoroso. Libera al claustro docente para que se dedique plenamente al arte de educar y despierta la soberanía y responsabilidad comunitaria de los padres."
  },
  {
    id: 6,
    badge: "SECCIÓN 4 • LA PROPUESTA (II)",
    type: "two-dimensions",
    sectionNumber: "04b",
    title: "Cuidado y Organización Consciente de la Energía",
    subtitle: "Estructurar el tiempo voluntario dividiéndolo con claridad en dos dimensiones",
    dimensions: [
      {
        type: "comun",
        title: "1. Energía Comunitaria Común",
        tag: "EL PISO COMPARTIDO",
        subtitle: "Responsabilidades y tareas base que todos debemos sostener en conjunto",
        features: [
          "Mantenimiento básico, limpieza, guardias y sostén operativo del predio.",
          "Participación obligatoria / fraternal compartida por todas las familias por igual.",
          "Independiente de los talentos o profesiones personales: es el cuidado del nido común."
        ],
        icon: "Users"
      },
      {
        type: "virtudes",
        title: "2. Virtudes Personales al Servicio",
        tag: "EL FLORECER INDIVIDUAL",
        subtitle: "El aporte específico basado en los dones, oficios y vocaciones singulares",
        features: [
          "Integrar los oficios reales: el electricista, el constructor, el maestro, el verdulero, el cultivador, el productor artesanal.",
          "Cada individuo florece aportando generosamente aquello que mejor sabe hacer.",
          "Valoración y dignificación del tiempo y los saberes de cada familia."
        ],
        icon: "Sparkles"
      }
    ],
    footerNote: "Al separar la tarea común del don singular, se acaba la culpa, se evita el desgaste y se potencia la sinergia colectiva.",
    speakerNotes: "Esta distinción es fundamental: resuelve el conflicto recurrente donde unos pocos hacen todo y otros no saben cómo aportar. Todos barren y cuidan (común); cada uno aporta su maestría técnica o creativa (virtudes)."
  },
  {
    id: 7,
    badge: "SECCIÓN 5 • TRABAJO CONJUNTO",
    type: "partnership",
    sectionNumber: "05",
    title: "El Rol de Sebastián y el Trabajo Conjunto",
    subtitle: "Construir la identidad comunitaria con guía y nutrición espiritual antroposófica",
    statement: "«Entendemos que la construcción de esta identidad comunitaria no debe recaer sobre los maestros, sino que es responsabilidad de las familias. Aquí es donde la guía de Sebastián resulta fundamental.»",
    proposalBox: {
      title: "Propuesta de Acompañamiento a Sebastián:",
      text: "Solicitamos a Sebastián que nos acompañe en la creación de un Espacio de Desarrollo de Familias: un ámbito de encuentro donde él pueda guiar el cultivo de una cultura comunitaria inspirada en la antroposofía, aportando nutrición espiritual profunda y viva."
    },
    outcomes: [
      {
        title: "Identidad Orgánica Interna",
        desc: "Desarrollar la identidad de la comunidad no pedagógica de manera orgánica, cálida y de adentro hacia afuera.",
        icon: "Compass"
      },
      {
        title: "Alivio y Confianza Docente",
        desc: "Que los maestros perciban con alivio real que las familias se están unificando y madurando como una sólida red de sostén.",
        icon: "ShieldCheck"
      },
      {
        title: "Puente Cálido a la Antroposofía",
        desc: "Acompañar a los adultos a comprender los ritmos y valores de la escuela desde la calidez del encuentro, integrando a quienes la desconocen.",
        icon: "Sun"
      }
    ],
    speakerNotes: "Esta diapositiva es el corazón de la petición a Sebastián. Se le pide su sabiduría y guía espiritual para formar a los padres, no para meterse en la pedagogía ni en la administración cotidiana, sino para nutrir el alma de la comunidad."
  },
  {
    id: 8,
    badge: "SECCIÓN 6 • SÍNTESIS Y VISIÓN VIVA",
    type: "platonic-triad",
    sectionNumber: "06",
    title: "Hacia un Equilibrio Orgánico",
    subtitle: "La Geometría Sagrada de la Naturaleza y la Triarticulación Social en La Colmena",
    triadText: "Así como las formas geométricas de la naturaleza (como los sólidos platónicos y el panal de las abejas) distribuyen las tensiones de manera perfecta, el Órgano del Corazón busca ser el centro integrador que equilibre las tres fuerzas del organismo vivo:",
    triad: [
      {
        realm: "PENSAR • LUZ",
        organ: "Pedagogía y Visión",
        domain: "Esfera Cultural-Espiritual",
        desc: "La luz que guía el claustro docente, el currículo Waldorf y el futuro de la escuela.",
        color: "text-amber-800 bg-amber-50 border-amber-200"
      },
      {
        realm: "SENTIR • CALOR",
        organ: "Órgano del Corazón",
        domain: "Comunidad y Familias",
        desc: "El centro rítmico que bombea amor, contención, encuentros y cultura familiar.",
        color: "text-rose-900 bg-rose-50 border-rose-300 ring-2 ring-rose-400/40 font-bold"
      },
      {
        realm: "HACER • VOLUNTAD",
        organ: "Economía y Trabajo",
        domain: "Escuela en el Campo / Sostén",
        desc: "Las manos en la tierra, la economía fraterna, la infraestructura y el trabajo real.",
        color: "text-emerald-900 bg-emerald-50 border-emerald-200"
      }
    ],
    closingMessage: "«Permitiendo que el organismo respire, crezca y albergue a todos sus integrantes con salud y fraternidad.»",
    speakerNotes: "El cierre magistral con la trinidad goetheana/antroposófica: Pensar (Luz/Pedagogía), Sentir (Calor/Corazón), Hacer (Voluntad/Economía y Campo). El corazón es el puente rítmico indispensable entre el pensar y el hacer."
  },
  {
    id: 9,
    badge: "PRÓXIMOS PASOS • ENCUENTRO",
    type: "action-call",
    sectionNumber: "07",
    title: "El Umbral Está Abierto",
    subtitle: "Ronda de diálogo, cocreación y primeros pasos de encuentro",
    steps: [
      {
        step: "1",
        title: "Escucha y Resonancia",
        desc: "Abrir la conversación con Sebastián para recibir sus percepciones, enriquecer la propuesta y afinar el sentido del espacio."
      },
      {
        step: "2",
        title: "Conformación del Círculo Gestor",
        desc: "Convocar a los primeros referentes de familias que sientan el llamado a sostener el pulso del Órgano del Corazón."
      },
      {
        step: "3",
        title: "Primer Ciclo de Encuentros de Familias",
        desc: "Planificar los primeros talleres de nutrición antroposófica y mapeo amoroso de virtudes comunitarias para este 2026."
      }
    ],
    closingQuote: "«Lo que pulsa con fuerza aquí... es la fuerza de la creación comunitaria.»",
    speakerNotes: "Agradecimiento final y propuesta de fecha o ronda de intercambio directo con Sebastián para acordar el ritmo y formato de los primeros encuentros."
  }
];
