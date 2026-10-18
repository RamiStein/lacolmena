# 🍯 Sistema de Panal • Crowdfunding La Colmena

Sistema web de financiamiento colectivo comunitario para la **Feria de Rafael 2026 • Salud y Cuidado de la Comunidad** de la **Comunidad La Colmena** (Loma Verde, Escobar).

---

## 🌟 Identidad y Temática

* **Evento:** Feria de Primavera y Cuidado Comunitario — Sábado 22 de Noviembre.
* **Espíritu:** Celebración de la salud, la sanación y la mirada del Arcángel Rafael (guardián del mes de noviembre en la tradición antroposófica / Waldorf) junto al arte terapéutico, la botica natural, la alimentación viva y el cuidado fraternal entre familias.
* **Estética:** Diseñado respetando los colores y elementos de La Colmena:
  - Amarillo Miel / Mostaza (`#E5B837`)
  - Terracota / Arcilla (`#B24016`)
  - Verde Huerta / Bosque (`#4A6B53`)
  - Fondo cálido de papel artesanal con textura de fibras (`#FAF6E9`)
  - Logotipo oficial de Comunidad La Colmena, banderines y celdas hexagonales de panal.

---

## 🚀 Cómo Correr el Proyecto Localmente

El servidor de desarrollo ya se encuentra corriendo en:
- **Local:** [http://localhost:5173/](http://localhost:5173/)

Si en el futuro deseás detenerlo e iniciarlo nuevamente, ejecutá:
```bash
npm run dev
```

Para generar la versión de producción optimizada:
```bash
npm run build
```

---

## 🐝 Funcionalidades Principales

1. **El Panal de Progreso:**
   - Muestra el monto recaudado acumulado, la meta global, porcentaje y familias colaboradoras.
   - Celdas de miel hexagonales interactivas que se van iluminando a medida que avanza la campaña.
2. **Los 5 Propósitos de la Salud y el Cuidado:**
   - *Herbolario, Tinturas y Botiquín Natural* (caléndula, manzanilla, bálsamos artesanales).
   - *Arte Terapéutico y Modelado con Cera* (acuarela húmedo sobre húmedo, arcilla y lana).
   - *Cocina Alquímica, Masa Madre y Nutrición Viva* (panadería saludable, fermentos y caldos nutritivos).
   - *Música Armónica, Liras y Rondas Sonoras* (cantos curativos, cuencos y movimiento rítmico).
   - *Oasis de Descanso, Pérgolas y Cuidado Familiar* (sombra fresca, infusiones y espacio de escucha).
3. **Formulario de Donaciones y Transferencia:**
   - Niveles sugeridos (*Semilla de Salud*, *Bálsamo de Caléndula*, *Miel Reparadora*, *Manto de Rafael*, *Guardián de la Comunidad*) o monto libre.
   - Datos bancarios con **botón de 1-clic para Copiar Alias** (`la.colmena.rafael`) y CBU.
   - Enlace directo a WhatsApp para adjuntar comprobante con mensaje pre-redactado.
   - Lluvia de confeti de celebración al enviar el aporte.
4. **Muro de la Colmena:**
   - Mensajes de aliento, dedicatorias y salutaciones de las familias.
5. **Panel de Coordinación (⚙️):**
   - Acceso desde el icono superior de engranaje para que el equipo docente/tesorería pueda asentar aportes en efectivo, actualizar la meta y exportar la planilla completa en formato CSV.
6. **Persistencia Local:**
   - Todos los aportes y mensajes se guardan automáticamente en el navegador (`localStorage`) para pruebas completas sin necesidad de configurar una base de datos externa de entrada.
