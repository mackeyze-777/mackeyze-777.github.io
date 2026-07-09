# 🚗 VAM Garage — Sistema completo (resumen)

_Última actualización: 6 jul 2026_

Todo está guardado en 3 lugares (no se pierde nada):
1. **GitHub** (la nube) — las apps viven aquí, respaldadas para siempre.
2. **Tu computadora** — copias locales en `~/Downloads/DLT/9.CLAUDE/`.
3. **Google Drive / Calendar** — la hoja de citas y el calendario.

### ⭐ NUEVO — 8. Tablero del Taller (para el equipo)
**https://mackeyze-777.github.io/vam-garage-taller/**
- Lee la agenda en vivo y muestra **HOY y MAÑANA**: qué carro entra, a qué hora, qué servicio se le hace (nombre épico) y **para qué hora debe estar listo** (hora + duración del servicio)
- Cada trabajo trae botón **📖 Ver el SOP** que abre directo el proceso de ese servicio
- Arriba: el flujo de trabajo (recepción→hoja de control→fases→inspección→entrega) y las reglas de siempre
- Read-only y SIN teléfonos de clientes — es para que el equipo llegue sabiendo qué hay que hacer
- Se refresca solo cada 5 min · Repo `mackeyze-777/vam-garage-taller` · local `9.CLAUDE/vam-taller/`
- **Portada QR imprimible** (SOPs + Tablero): `6.OPERACIONES/HERRAMIENTAS/portada-qr-sops.html` — va arriba del paquete impreso de SOPs

### ⭐ NUEVO — 7. Playbook de Ventas
**https://mackeyze-777.github.io/vam-garage-playbook/**
- **🏆 Ofertas:** 7 ofertas Grand Slam con nombres épicos — la escalera cerámica **Escudo (1a) → Armadura (3a) → Titán (5a)**, **Efecto Showroom** (pulido+encerado), **Interior Cero KM**, **Blindaje Invisible** (PPF), **Transformación Total** (paquete) y **Club VAM** — cada una con stack de valor y mensaje de WhatsApp copiable
- **⬆️ Upsells:** eliges el servicio que toma el cliente → qué ofrecerle, cuándo (cotizar/taller/entrega), guion copiable y ticket máximo de la ruta + detectores (lluvia ácida, faros, motor…)
- **💬 Mensajes:** ~50 mensajes de WhatsApp con buscador y botón copiar (bienvenida, reactivación, objeciones, cierres, recompra)
- **📊 Inteligencia:** más vendidos, rentabilidad real por servicio, qué anunciar en Facebook y qué no, tablero de 4 KPIs, rutina diaria
- Repo `mackeyze-777/vam-garage-playbook` · local `~/Downloads/DLT/9.CLAUDE/vam-playbook/`

---

## 📱 TUS APPS (ábrelas desde el celular y agrégalas a la pantalla de inicio)

### 1. Citas
**https://mackeyze-777.github.io/vam-garage-citas/**
- Agendar citas → se guardan en Google Sheets + Calendario VAM GARAGE
- Secciones Hoy / Mañana / Próximas
- Botón Confirmar (manda WhatsApp "un día antes")
- Botón 💬 Mensajes (plantillas de WhatsApp)
- Botón Cancelar

### 2. Recepción y Entrega
**https://mackeyze-777.github.io/vam-garage-recepcion/**
- **🚗 Recepción:** datos, gasolina, daños, fotos → Enviar hoja + Fotos al cliente
- **✅ Entrega:** hoja de entrega + fotos + garantía de satisfacción 48 h
- **🛡️ Garantía:** genera el Certificado de cerámico (multi-selección, placas, años) y lo manda con mensaje
- **📅 Recordatorio de mantenimiento:** en la pestaña Garantía, eliges 3/4/6 meses y el botón crea un evento de "todo el día" en tu Google Calendar (fecha de instalación + meses). El día del aviso, dentro del evento está el teléfono del cliente y un enlace de WhatsApp con el mensaje ya escrito para ofrecerle el mantenimiento. No bloquea horas, es gratis y no necesita servidor.

### 3. Manual de Operaciones (proceso real por fases)
**https://mackeyze-777.github.io/vam-garage-sops/**
- **15 servicios reales** (de tu hoja de costeo) en 5 categorías: Cerámicos (6), Pulido (2), Interior (2), Paquete (1), Adicionales (4)
- Construido con tus **SOPs reales** (SOP-001 Pulido y SOP-002 Mini Interior), NO inventado
- Cada servicio muestra el proceso por **fases, con tiempos y tareas**: qué hacer, cuánto tarda, ✓ cómo se ve bien y ✗ qué evitar
- Solo lectura (sin checkboxes): el técnico elige el servicio, ve la "ruta" y abre cada fase
- Pendiente menor: Faros y Motor sin SOP formal (proceso base; si los dictas se actualizan)
- Repo `mackeyze-777/vam-garage-sops` · local `~/Desktop/vam-garage-sops/`

### 4. Presupuestos (cotizaciones)
**https://mackeyze-777.github.io/vam-garage-presupuestos/**
- Elige Auto/Camioneta → selecciona servicios (19, con precio y alcances) → captura nombre, placa, fecha, vehículo
- Genera la **cotización como imagen** y la manda al WhatsApp del cliente (vigencia 15 días, alcances incluidos)
- Precio por línea editable (descuentos). Repo `mackeyze-777/vam-garage-presupuestos`

### 5. Recibos y Anticipos
**https://mackeyze-777.github.io/vam-garage-recibos/**
- Anticipo / Abono / Liquidación → captura cliente, vehículo, concepto, total y monto recibido
- Calcula el **saldo pendiente** y genera el **recibo como imagen** para mandar al WhatsApp del cliente
- Repo `mackeyze-777/vam-garage-recibos`

### 6. Reglamento y Contratos (RH)
**https://mackeyze-777.github.io/vam-garage-contratos/**
- Genera el **Reglamento Interior de Trabajo** y el **Contrato Individual** (borradores base Ley Federal del Trabajo)
- Llenas los datos (patrón, trabajador, jornada, sueldo) e imprime / guarda PDF para firmar
- ⚠️ Validar con contador/abogado antes de firmar · recomendado dar de alta en IMSS
- Repo `mackeyze-777/vam-garage-contratos`

> 💡 Si una app se ve "vieja", ábrela agregando `?nuevo` al final para refrescar el caché.

---

## 🔑 DATOS IMPORTANTES

- **Hoja de citas (Google Sheets):** "Citas VAM Garage 2026" — NO borrar, NO reordenar columnas. Mover/renombrar/colorear: libre.
- **Calendario:** "VAM GARAGE" (actívalo en Google Calendar del celular para ver las citas).
- **URL del backend de citas (Apps Script):** `https://script.google.com/macros/s/AKfycbwnupn0A3GRj0nXuqo7bQvFEHKElhBPu09YcJaTNXkf6qzVk_VSJO3zPX8v9EB0xhM/exec`
- **Repos GitHub:** `mackeyze-777/vam-garage-citas` y `mackeyze-777/vam-garage-recepcion`
- **Archivos locales:** `~/Desktop/vam-citas-web/` y `~/Desktop/vam-recepcion/`
- **Contacto en mensajes:** VAM Garage · 771 802 1389

---

## 💰 COSTO: $0 / mes
GitHub Pages (hosting), Google Sheets/Calendar y WhatsApp manual son gratis. No hay nada que pagar.

---

## 📌 PENDIENTES / IDEAS A FUTURO
- (Opcional) "Editar cita" en el dashboard de citas — requiere actualizar el Apps Script.
- (Opcional) Conectar la cita con la recepción para no recapturar datos.
- (Opcional) Ficha/historial del cliente por placa (mini-CRM en el Sheets).

## ❌ DESCARTADO (ya se evaluó, no conviene)
- **Mensajes automáticos con Twilio:** la API oficial de WhatsApp exige un segundo número dedicado + verificación de Meta + costo por mensaje. Los WhatsApp manuales con texto ya escrito cubren el 90% gratis. No vale la pena.
- **Botón de pedir reseña de Google en Entrega:** se pide en persona con la tarjeta NFC de Google, no hace falta.
