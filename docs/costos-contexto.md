# DASHBOARD COSTOS & RENTABILIDAD — Contexto para Claude

> Carga este archivo al inicio de la sesión para que Claude tenga todo el contexto
> del dashboard sin necesidad de reconstruirlo desde cero.

---

## El archivo

**Hogar único (desde 13-jun-2026):**
`/Users/mackeyzenteno/Downloads/DLT/6.OPERACIONES/HERRAMIENTAS/dashboard-costos-vam.html`

> Ya no hay copia doble. Todas las herramientas HTML viven en `6.OPERACIONES/HERRAMIENTAS/`. Editar solo ahí.

> NOTA (13-jun-2026): el dashboard se simplificó a herramienta SOLO de precios. Se quitaron las
> tabs de Proyección y P&L Real, y todo lo de gastos / sueldo del dueño / utilidad real ("eso es
> de otro lado"). Estructura actual: **4 tabs — Resumen, Servicios, Rentabilidad, Equipo**, todo
> por trabajo. Las descripciones de 5 tabs más abajo son de la versión vieja.

---

## Qué es

Herramienta interna de gestión financiera para VAM Garage. Single-file HTML (sin npm, sin build).
Abre directo en el browser — no necesita servidor.

**Persistencia:** localStorage, clave `vam_dash_v3`
**Backup:** botón "↓ Exportar" genera `.json`; "↑ Importar" lo restaura

---

## Los 5 tabs

| Tab | Qué hace |
|-----|----------|
| **Equipo** | Tarifas por técnico, costos fijos mensuales, sueldos sugeridos (% del ingreso), checklist de 6 acciones prioritarias |
| **Servicios** | 19 servicios con grilla de precios 4 vehículos, costo desglosado, margen visual, botón Fase 1 |
| **Rentabilidad** | 4 KPIs, acción de hoy, ranking de servicios peor→mejor margen |
| **Proyección** | Selector de mes, 3 escenarios (Actual / Fase 1 / Objetivo), tabla completa por servicio |
| **P&L Real** | Histórico mensual editable, desglose por 10 categorías de gasto, alerta cuando "Diversión" es alta |

---

## Datos pre-cargados (estado inicial / reset)

### Equipo
- Mackey — $90/hr — Técnico principal
- Isra — $35/hr — Segundo técnico

### Overhead mensual
| Concepto | Mensual |
|----------|---------|
| Renta + servicios | $2,557 |
| Software | $2,334 |
| Meta Ads | $3,629 |
| Impuestos + contabilidad | $900 |
| Otros fijos | $600 |
| **Total** | **$10,020** |

### P&L histórico
| Mes | Ingresos | Gastos |
|-----|----------|--------|
| Enero 2026 | $67,100 | $64,318 |
| Febrero 2026 | $61,700 | $58,942 |
| Marzo 2026 | $57,950 | $51,620 |
| Abril 2026 | $47,550 | $46,959 |
| Mayo 2026 | $75,400 | $72,351 |
| **Promedio** | **$61,940** | **~$58,838** |

**Margen neto real YTD: ~5%** — El problema central del negocio.

---

## Lógica de precios

```
ohPerJob()    = overhead_total / jobsPerMonth
calcCost(svc) = materiales + (horas_mackey × tarifa_mackey) + (horas_isra × tarifa_isra) + (ohPerJob × overhead_factor) + amortizacion
mg(p, c)      = (p - c) / p × 100
sug(c, tgt)   = c / (1 - tgt/100)
applyF1(id)   = sube precio Mediano a Fase 1, ajusta proporcional Compacto/SUV/3 Filas
```

**overhead_factor** (0.0–1.0): qué fracción del overhead fijo absorbe este servicio.
Servicios rápidos/de add-on tienen factor bajo (0.1–0.3); cerámicos tienen factor alto (0.8–1.0).

---

## Los 19 servicios (categorías)

- **Interior (5):** Detailing básico, Detailing completo, Limpieza de asientos de piel, Ozonización, Sanitizado UV
- **Exterior (4):** Lavado premium, Pulido 1 paso, Pulido 2 pasos, Descontaminación de pintura
- **Adicionales (4):** Restauración de plásticos, Limpieza de motor, Restauración de faros, Limpieza de rines + llantas
- **Cerámico / PPF (6):** Corrección 1 paso + Cerámico 1 año, Corrección 2 pasos + Cerámico 3 años, Corrección 2 pasos + Cerámico 5 años, Cerámico básico sin corrección, PPF parcial (cofre + espejos), PPF completo

---

## Plan de precios — 3 Fases (cerámico)

El cerámico es el 39% de ingresos y está subpreciado. Aplicar Fase 1 sube margen neto de 5% a ~22%.

| Servicio | Actual | Fase 1 | Fase 2 | Fase 3 (target) |
|----------|--------|--------|--------|-----------------|
| Corrección 1 paso + Cerámico 1 año | $2,500 | $4,000 | $5,000 | $5,500 |
| Corrección 2 pasos + Cerámico 3 años | $7,000 | $8,500 | $10,000 | — |
| Corrección 2 pasos + Cerámico 5 años | $8,000 | $10,000 | $12,000 | $12,500 |

El botón "F1" en cada tarjeta de servicio aplica estos precios y ajusta proporcional los 4 tamaños.

---

## Diseño — Estética APEX

Basado en el sistema de marca premium negro + rosa VAM.

```css
--bg:#050505;  --bg2:#0c0c0c;  --bg3:#131313;  --border:#1e1e1e;
--text:#f0f0f0; --muted:#555;  --accent:#e8178a;
--green:#27c76f; --yellow:#f0a500; --red:#e04040; --silver:#8a8a8a;
```

- Borde superior rosa 3px en el header
- SVG mark geométrico APEX en el logo
- Wordmark `V A M  G A R A G E` uppercase letter-spacing 6px
- Tabs/labels/encabezados de tabla: 9px uppercase letter-spacing 1.5px
- Avatares de técnicos: cuadrados (no círculos)

---

## Checklist de 6 acciones (tab Equipo)

1. Cuenta bancaria separada para el negocio
2. Sueldo fijo mensual transferido (separar finanzas personales)
3. Isra ejecuta cerámico solo (formalizar delegación)
4. SOP-003 Cerámica documentado
5. Actualizar precios cerámico a Fase 1 en cotizaciones
6. Revisar tasa de cierre de prospectos

---

## Otras herramientas HTML en la misma carpeta

Ruta: `/Users/mackeyzenteno/Downloads/DLT/6.OPERACIONES/HERRAMIENTAS/`

- `editor-paquetes-vam.html` — Editor de paquetes v6, con lógica de costeo y proyecciones
- `vam_citas.html` — Citas
- `vam_garantia.html` — Garantía

(Borrados en limpieza 13-jun-2026 porque el dashboard ya los reemplaza: `costos-labor.html`,
`tabla-precios-sugeridos.html`.)

---

## Historial de versiones

| Versión | Qué cambió |
|---------|------------|
| v1 | MVP inicial — 4 tabs básicos, bug en tabla de proyección (grid/flex mixto) |
| v2 | Fix tabla proyección a `<table>` real, P&L Real tab añadido, checklist, export/import JSON |
| v2 + rediseño | Estética APEX aplicada: colores, tipografía, SVG mark, sin emojis, vehicle grid con acento rosa |

*Última actualización: 12 junio 2026*
