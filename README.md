# 🍯 Sistema de Panal • Crowdfunding La Colmena

Sistema web de financiamiento colectivo comunitario para la **Kermess de Micael 2026** de la **Comunidad Escuela La Colmena** (Ingeniero Maschwitz, Escobar).

---

## 🌟 Identidad y Temática

* **Evento:** Kermess Comunitaria — Sábado 22 de Noviembre.
* **Espíritu:** Celebración de la fuerza, luz interior y valor de Micael (pedagogía antroposófica / Waldorf) junto al arte, la música acústica y el compartir comunitario.
* **Estética:** Diseñado respetando los colores y elementos reales de La Colmena:
  - Amarillo Miel / Mostaza (`#E5B837`)
  - Terracota / Arcilla (`#B24016`)
  - Verde Huerta / Bosque (`#4A6B53`)
  - Fondo cálido de papel artesanal con textura de fibras (`#FAF6E9`)
  - Logotipo oficial, banderines y celdas hexagonales de panal.

---

## 🚀 Cómo Correr el Proyecto Localmente

El servidor de desarrollo ya se encuentra corriendo en:
- **Local:** [http://localhost:5173/](http://localhost:5173/)
- **Red Local (para ver desde el celular en el mismo Wi-Fi):** `http://192.168.1.4:5173/`

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
2. **Los 5 Propósitos del Panal:**
   - *Talleres de Arte y Oficios de Micael* (maderas, arcilla, acuarelas Stockmar).
   - *Juegos de Valor, Destreza y Coraje* (tirolesa, puentes de ramas, dragón de Micael).
   - *Horno Comunitario y Pan de Micael* (pan horneado a la leña, harinas agroecológicas).
   - *Escenario Acústico y Músicos Invitados* (sonido al aire libre, bombo y coros).
   - *Sombra, Pérgolas y Huerto Escolar* (toldos de lino, cañas y plantines).
3. **Formulario de Donaciones y Transferencia:**
   - Niveles sugeridos (*Gota de Néctar*, *Flor Silvestre*, *Celda de Miel*, *Espada de Micael*, *Sol de la Colmena*) o monto libre.
   - Datos bancarios con **botón de 1-clic para Copiar Alias** (`la.colmena.micael`) y CBU.
   - Enlace directo a WhatsApp para adjuntar comprobante con mensaje pre-redactado.
   - Lluvia de confeti de celebración al enviar el aporte.
4. **Muro de la Colmena:**
   - Mensajes de aliento, dedicatorias y salutaciones de las familias.
5. **Panel de Coordinación (⚙️):**
   - Acceso desde el icono superior de engranaje para que el equipo docente/tesorería pueda asentar aportes en efectivo, actualizar la meta y exportar la planilla completa en formato CSV.
6. **Persistencia Local:**
   - Todos los aportes y mensajes se guardan automáticamente en el navegador (`localStorage`) para pruebas completas sin necesidad de configurar una base de datos externa de entrada.
