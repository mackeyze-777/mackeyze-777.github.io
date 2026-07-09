<title>Cotizador Inteligente DLT Studio — Lógica de Servicios</title>

# 🧠 Cotizador Inteligente DLT Studio
## Matriz de servicios, compatibilidades y reglas — v1 (7 jul 2026)

**Cómo leer este documento:** cada servicio tiene un `id` para desarrollo. La lógica se implementa con 6 mecanismos (sección 2). Las tablas por categoría (sección 3) y las reglas IF/THEN (sección 4) son la fuente de verdad. El cotizador actual de dltstudio.com/cotizador ya implementa este motor con el catálogo corto; este documento lo extiende a los 48 servicios.

**Estado:** ✅ = ya está en el cotizador en vivo con precio · 🆕 = falta precio en la hoja de costos para activarlo.

---

## 1 · Catálogo por categorías

| Categoría | Servicios (id) |
|---|---|
| **Lavado** | Lavado exterior premium `lav-ext` ✅ · Lavado de motor `lav-mot` ✅ |
| **Interior** | Detallado interior básico `int-bas` ✅ (Vestiduras·Mantenimiento) · Detallado interior profundo `int-pro` ✅ (Vestiduras·Avanzado) · Lavado de vestiduras `vest` 🆕 (módulo) · Ozono `ozono` 🆕 |
| **Piel** | Limpieza de piel `piel-lim` 🆕 · Hidratación de piel `piel-hid` 🆕 · Cerámico para piel `piel-cer` 🆕 |
| **Pintura (preparación)** | Descontaminación química `dq` ✅ (Cera+Descontaminación) · Clay bar `clay` (módulo, nunca se vende solo) · Eliminación de lluvia ácida `lluvia` 🆕 |
| **Pintura (corrección)** | Pulido 3 en 1 `pul-3en1` ✅ · Pulido One Step `pul-1step` ✅ (Pulido+Cera) · Corrección 2 pasos `corr-2p` ✅ · Corrección 3 pasos `corr-3p` 🆕 |
| **Cerámicos** | Cerámico 1 año `cer-1` ✅ · Cerámico 3 años `cer-3` ✅ · Cerámico 5 años `cer-5` ✅ · Cerámico Mate `cer-mate` ✅ · Cristales `cris-cer` 🆕 · Rines `rines-cer` 🆕 · Plásticos ext. `plast-cer` 🆕 · Para wrap/vinil `cer-vinil` 🆕 · Para PPF `cer-ppf` 🆕 |
| **Cristales / Faros** | Pulido de cristales `cris-pul` 🆕 · Restauración de faros `faros-rest` ✅ · Lamin-X faros `lamx-faros` 🆕 · Lamin-X calaveras `lamx-calav` 🆕 |
| **PPF zonas** | Pantalla interior `ppf-pantalla` 🆕 · Piano black `ppf-piano` 🆕 · Postes `ppf-postes` 🆕 · Filos de puerta `ppf-filos` 🆕 · Conchas de manija `ppf-manijas` 🆕 · Cofre `ppf-cofre` 🆕 · Fascia `ppf-fascia` 🆕 |
| **PPF coberturas** | Frente parcial `ppf-fparcial` ✅ · Frente completo `ppf-fcompleto` ✅ · PPF completo `ppf-full` ✅ ⚠️ proyecto especial |
| **Vinil / Wrap** | Franjas decorativas `franjas` 🆕 · Toldo negro `toldo` 🆕 · Wrap parcial `wrap-parcial` 🆕 · Wrap completo `wrap-full` 🆕 ⚠️ proyecto especial |
| **Mantenimientos** | De cerámico `mant-cer` 🆕 · De wrap `mant-wrap` 🆕 · De PPF `mant-ppf` 🆕 (solo visibles si el cliente YA tiene esa protección) |
| **Motocicletas** | Detallado `moto-det` 🆕 · Cerámico `moto-cer` 🆕 · PPF `moto-ppf` 🆕 · Wrap `moto-wrap` 🆕 (solo visibles en modo moto) |
| **Paquete** | Pulido + Interior + Motor `paq-total` ✅ |

---

## 2 · Modelo de datos (el motor, listo para desarrollo)

Cada servicio es un objeto con estos campos. El motor actual del cotizador ya usa `group`, `covers` y `tag`; se agregan 4 campos nuevos:

```js
{
  id: 'cer-3',
  nombre: 'Cerámico 3 años · corrección profunda 2 pasos',
  cat: 'Cerámicos',
  group: 'ceramico-pintura',   // RADIO: solo 1 seleccionable por grupo (elegir otro lo reemplaza)
  tag: 'ceramico',             // etiqueta que otros pueden cubrir/bloquear
  covers: ['lavado','cera','pulido','paquete'],  // lo que YA INCLUYE → esos se deshabilitan con nota
  blocks: ['cer-vinil'],       // incompatible técnico (distinto a "ya incluido")
  requires: ['dq','clay'],     // obligatorio antes; si está incluido en el precio, se marca incluido:true
  recommends: ['cris-cer','rines-cer','ppf-fparcial'],  // upsell al seleccionarlo
  hideIf: (estado) => estado.tiene_wrap,   // ocultar según estado del vehículo
  replaces: ['mant-cer'],      // si se elige, quita/oculta estos
  stage: 8                     // posición en el orden técnico de ejecución
}
```

**Grupos radio (elige máximo 1):**

| Grupo | Miembros |
|---|---|
| `pulido-pintura` | pul-3en1 · pul-1step · corr-2p · corr-3p |
| `ceramico-pintura` | cer-1 · cer-3 · cer-5 · cer-mate |
| `ppf-frente` | ppf-fparcial · ppf-fcompleto · ppf-full |
| `interior` | int-bas · int-pro |
| `wrap` | wrap-parcial · wrap-full |

**Estado del vehículo (se pregunta ANTES del catálogo):** tipo (auto/camioneta/moto) · pintura (nueva / buena / con rayas / dañada) · ¿tiene wrap? · ¿tiene PPF? · ¿tiene cerámico vigente? · interior (piel / tela / mixto) · ¿faros opacos? · ¿interior con mal olor / muy sucio?

---

## 3 · Matriz por categoría

### 3.1 Corrección de pintura

| Servicio | Combina bien con | Bloquea / oculta | Requiere antes | Recomendar | Nota técnica |
|---|---|---|---|---|---|
| `pul-3en1` | lavados, interior, ozono, faros, cris-pul, cris-cer, rines-cer | cer-1/3/5 (el cerámico ya trae su pulido), corr-2p/3p (grupo), wrap-full, ppf-full | — (incluye lavado+descont) | pul-1step como upgrade | Pulido comercial; NO deja base para cerámico premium |
| `pul-1step` | cer-1/3/5, cris-cer, rines-cer, plast-cer, interior, lav-mot, faros, PPF zonas y frentes | pul-3en1/corr (grupo), wrap-full | — (incluye lavado+descont) | cer-1 ("protege el brillo que acabamos de sacar") | Base correcta para cerámico en pintura sana |
| `corr-2p` | cer-1/3/5, PPF frentes/full, cris-cer, rines-cer, int-pro, lav-mot, faros | pul-3en1/1step (grupo), mant-cer, wrap-full como principal | — (incluye lavado+descont+clay) | cer-3 o cer-5 ("no dejes la corrección desprotegida") | Si el destino es wrap, la corrección solo se hace si el instalador la pide |
| `corr-3p` 🆕 | cer-3/5, ppf-full, cris-cer, rines-cer, int-pro | resto del grupo pulido, wrap-full | — | cer-5 + ppf-fcompleto | Nivel concurso; pinturas muy dañadas o negras |

### 3.2 Cerámicos de pintura

| Servicio | Combina bien con | Bloquea / oculta | Requiere antes | Recomendar | Nota técnica |
|---|---|---|---|---|---|
| `cer-1` | pul-1step/corr (integrado), cris-cer, rines-cer, plast-cer, interior, lav-mot, PPF zonas | otros cerámicos (grupo), pul-3en1, wrap-full, cer-vinil, mant-cer | dq + clay (INCLUIDOS en precio) | cris-cer + rines-cer (combo) | Ya incluye su nivel de corrección — no vender pulido aparte |
| `cer-3` | igual que cer-1 + ppf-fparcial/fcompleto | igual que cer-1 | dq + clay (incluidos) | ppf-fparcial ("zona de impacto protegida física + química") | El más vendido; sweet spot uso diario |
| `cer-5` | corr-2p/3p (integrado), ppf frentes/full, cris-cer, rines-cer, plast-cer, int-pro | igual que cer-1 | dq + clay (incluidos) | ppf-fcompleto + cris-cer | Doble capa; exigir pintura corregida |
| `cer-mate` | interior, lav-mot, cris-cer, rines-cer | TODOS los pulidos y correcciones (el mate NO se pule), ceras | dq + clay especial mate (incluidos) | cris-cer, mant-cer a 6 meses | ⚠️ El mate JAMÁS se pule ni se encera — se pierde el acabado |
| `cer-vinil` 🆕 | wrap-parcial/full, toldo, franjas, moto-wrap | cer-1/3/5 (son para pintura) | wrap instalado y curado (≥72 h) | mant-wrap | Química específica para vinil; respetar textura (mate/satín) |
| `cer-ppf` 🆕 | cualquier PPF | — | PPF instalado | mant-ppf | Facilita lavado del PPF y evita marcas de agua |

### 3.3 PPF

| Servicio | Combina bien con | Bloquea / oculta | Requiere antes | Recomendar | Nota técnica |
|---|---|---|---|---|---|
| Zonas (`ppf-pantalla/piano/postes/filos/manijas`) | TODO — incluso wrap e interior | — | superficie limpia (incluido) | entre sí (kit de zonas) | Alta rotación, margen alto, se instalan el mismo día |
| `ppf-cofre` / `ppf-fascia` | cerámicos, pulidos previos, faros | ppf-fparcial/fcompleto/full (ya los incluyen) | pintura sin daño en la zona; si dañada → corrección | ppf-fcompleto como upgrade | Si pide cofre + fascia sueltos, casi siempre conviene frente parcial |
| `ppf-fparcial` | cer-1/3/5, pul-1step/corr previos, faros | resto grupo ppf-frente, ppf-cofre/fascia (incluidos) | pintura preparada; si dañada → corr obligatoria | cer-3 encima, lamx-faros | Fascia + faros + parcial cofre/salpicaderas |
| `ppf-fcompleto` | igual | igual | igual | cer-ppf, cris-cer | La cobertura recomendada por default |
| `ppf-full` ⚠️ | corr previa, cer-ppf, cris-cer, rines-cer, interior, PPF interior | wrap-full (elegir UNO), pul-3en1, franjas/toldo sin validar | corrección según estado + valoración presencial | cer-ppf | **Proyecto especial**: sin precio directo en el cotizador → botón "Agendar valoración" |

### 3.4 Vinil / Wrap

| Servicio | Combina bien con | Bloquea / oculta | Requiere antes | Recomendar | Nota técnica |
|---|---|---|---|---|---|
| `franjas` | wrap-parcial, toldo, pul-1step previo ligero, cer-vinil | instalación sobre cerámico <21 días (warning de agenda), pintura contaminada | dq de la zona | toldo, cer-vinil | Sobre cerámico recién aplicado el vinil no ancla: esperar curado o instalar antes del cerámico |
| `toldo` | wrap-parcial, franjas, cer-vinil, interior | wrap-full (ya lo incluye), cer-1/3/5 sobre el vinil | dq del toldo | cer-vinil | — |
| `wrap-parcial` | franjas, toldo, cer-vinil, PPF zonas, interior | wrap-full (grupo) | superficie sin cera/cerámico fresco | cer-vinil | — |
| `wrap-full` ⚠️ | cer-vinil, ppf-pantalla/piano, lamx-faros/calav, interior, lav-mot, cris-cer | cer-1/3/5/mate, TODOS los pulidos, ppf-full, toldo y wrap-parcial (incluidos), franjas van DENTRO del proyecto | superficie desengrasada; NUNCA sobre cerámico fresco ni cera | cer-vinil + lamx | **Proyecto especial** → valoración. La pintura bajo el wrap no se corrige salvo defectos que marquen el vinil |

### 3.5 Interior y piel

| Servicio | Combina bien con | Bloquea / oculta | Requiere antes | Recomendar | Nota técnica |
|---|---|---|---|---|---|
| `int-bas` | todo exterior, lav-mot | int-pro (grupo), paq-total | — | int-pro como upgrade si está sucio | — |
| `int-pro` | piel-*, ozono, exterior, lav-mot, ppf-pantalla/piano | int-bas (grupo), vest suelto (YA lo incluye), paq-total | — | ozono, piel-lim si tiene piel | Incluye vestiduras |
| `vest` 🆕 | int-bas, ozono, exterior | int-pro (incluido), piel-cer si el auto es piel completa | — | int-pro como upgrade | Módulo; en autos de piel completa no aplica tela |
| `piel-lim` 🆕 | piel-hid, piel-cer, int-pro, ozono | — | — | piel-hid (secuencia natural) | — |
| `piel-hid` 🆕 | piel-lim, int-pro | — | **piel-lim** (auto-agregar) | piel-cer | Nunca hidratar piel sucia |
| `piel-cer` 🆕 | int-pro, piel-lim | — | **piel-lim** (auto-agregar; hid opcional antes NO después) | — | El cerámico sella: la hidratación va antes o no va |
| `ozono` 🆕 | int-bas/pro, vest, piel | venderse SOLO si interior muy sucio (estado) → forzar int-pro | int-pro si hay suciedad fuerte | int-pro | El ozono elimina olor, no mugre: sin limpieza el olor regresa |

### 3.6 Cristales, faros, rines

| Servicio | Combina bien con | Bloquea / oculta | Requiere antes | Recomendar | Nota técnica |
|---|---|---|---|---|---|
| `cris-pul` 🆕 | lluvia, cris-cer, todo exterior | — | — | cris-cer | — |
| `lluvia` 🆕 | cris-pul, cris-cer, cerámicos | — | — | cris-cer ("para que no regrese") | WSR/WRC según grado |
| `cris-cer` 🆕 | TODO (el mejor cross-sell del taller) | — | si hay lluvia ácida → `lluvia` o `cris-pul` primero (auto-agregar) | — | Nunca sellar sobre cristal contaminado |
| `faros-rest` | lamx-faros, cerámicos, pulidos | — | — | **lamx-faros** ("restaurado + protegido = no vuelve a opacarse") | — |
| `lamx-faros` 🆕 | faros-rest, PPF, wrap | — | **faros-rest SI el faro está opaco** (pregunta de estado) | — | Lamin-X sobre faro opaco sella el daño adentro |
| `lamx-calav` 🆕 | lamx-faros, wrap, PPF | — | — | lamx-faros (kit) | Verificar normativa local de oscurecido |
| `rines-cer` 🆕 | TODO | — | limpieza profunda de rines (INCLUIDA en precio) | — | Descontaminación férrica del rin antes de sellar |
| `plast-cer` 🆕 | cerámicos, pulidos | — | limpieza (incluida) | — | Restaura y protege plástico exterior |

### 3.7 Mantenimientos (condicionados al estado)

| Servicio | Visible solo si | Bloquea | Nota |
|---|---|---|---|
| `mant-cer` 🆕 | estado.tiene_ceramico = sí | cer-1/3/5/mate en el mismo carrito (elegir cerámico nuevo lo reemplaza) | Lavado técnico + descontaminación suave + booster |
| `mant-wrap` 🆕 | estado.tiene_wrap = sí | pulidos sobre el wrap | Nunca pulir vinil |
| `mant-ppf` 🆕 | estado.tiene_ppf = sí | pul-3en1/corr sobre zonas con PPF | El PPF autoregenera con calor; no abrasivos |

### 3.8 Motocicletas (modo moto: oculta catálogo de auto)

| Servicio | Combina bien con | Bloquea | Requiere antes | Recomendar |
|---|---|---|---|---|
| `moto-det` 🆕 | moto-cer, moto-ppf, moto-wrap, rines-cer | catálogo de auto | — | moto-cer |
| `moto-cer` 🆕 | moto-det, moto-ppf | cer de pintura sobre zonas con vinil (usar cer-vinil) | descontaminación (incluida en moto-det) | moto-ppf tanque |
| `moto-ppf` 🆕 | moto-cer (cer-ppf encima), moto-det, protección tanque/faro | pulido agresivo sobre el PPF | superficie preparada | cer-ppf |
| `moto-wrap` 🆕 | moto-det, cer-vinil, lamx | moto-cer de pintura encima del vinil | superficie desengrasada | cer-vinil |

---

## 4 · Reglas IF / THEN (motor de validación)

```
R01  IF cer-* seleccionado                 THEN dq+clay incluidos (mostrar "incluye descontaminación") — nunca cobrar doble
R02  IF cer-* y pintura=rayada/dañada      THEN forzar nivel con corrección integrada (2 pasos) o sugerir corr-3p
R03  IF pul-3en1 THEN bloquear corr-2p/3p y cer-1/3/5 (y viceversa) — grupo pulido-pintura + covers
R04  IF estado.tiene_wrap                  THEN ocultar pul-*, corr-*, cer-1/3/5/mate → mostrar cer-vinil y mant-wrap
R05  IF estado.tiene_ppf                   THEN bloquear pul-3en1/corr sobre zonas cubiertas → ofrecer mant-ppf + cer-ppf
R06  IF wrap-parcial/full o toldo/franjas en carrito THEN cerámico de pintura NO aplica sobre el vinil → ofrecer cer-vinil
R07  IF lamx-faros y estado.faros_opacos   THEN auto-agregar faros-rest ("el Lamin-X sella el faro: primero lo restauramos")
R08  IF ppf-full y wrap-full juntos        THEN bloquear: "elige UNO como base; agenda valoración de proyecto"
R09  IF mant-cer y NOT estado.tiene_ceramico THEN ocultar mant-cer
R10  IF mant-wrap y NOT estado.tiene_wrap  THEN ocultar mant-wrap
R11  IF mant-ppf y NOT estado.tiene_ppf    THEN ocultar mant-ppf
R12  IF ozono y estado.interior_muy_sucio  THEN exigir int-pro en el carrito ("el olor vuelve si no se limpia la fuente")
R13  IF piel-cer                           THEN auto-agregar piel-lim
R14  IF piel-hid                           THEN auto-agregar piel-lim; IF piel-cer también → orden lim→hid→cer
R15  IF cris-cer y estado.lluvia_acida     THEN auto-agregar lluvia (o cris-pul en grado severo)
R16  IF rines-cer                          THEN limpieza profunda de rines incluida (mostrar en alcances)
R17  IF ppf-* y pintura=dañada             THEN corr-2p obligatoria antes ("el PPF encapsula lo que esté abajo")
R18  IF wrap-* y (cer aplicado <21 días o cera reciente) THEN warning de agenda: preparar/desengrasar; nunca sobre cerámico fresco
R19  IF wrap-full THEN cubrir toldo y wrap-parcial (ya incluidos) — no cobrarlos aparte
R20  IF franjas y cer-* en el mismo carrito THEN nota de orden: franjas se instalan ANTES del cerámico o 21 días después
R21  IF cer-mate THEN bloquear todo pulido/encerado presente y futuro (mensaje educativo)
R22  IF tipo=moto THEN mostrar solo catálogo moto + rines-cer/lamx
R23  IF paq-total THEN cubre pul, int, lav-mot, lavado (motor actual ya lo hace); cer-* lo reemplaza
R24  IF carrito solo tiene ozono/lavado y pintura=dañada THEN sugerir diagnóstico ("tu pintura necesita más que lavado")
```

---

## 5 · Orden técnico de ejecución (pipeline del taller)

1. Lavado / prelavado a presión
2. Descontaminación química (férrica + brea)
3. Clay bar
4. Eliminación de lluvia ácida (cristales y carrocería)
5. Lavado de motor (antes de detallar exterior fino)
6. Interior: aspirado → vestiduras/tela → piel (limpieza → hidratación) → plásticos → pantalla/piano PPF interior
7. Corrección de pintura (1, 2 o 3 pasos) / pulido de cristales / restauración de faros
8. Instalación de vinil: franjas → toldo → wrap (superficie recién corregida y desengrasada)
9. Instalación de PPF (zonas y frentes)
10. Cerámicos: pintura → PPF (cer-ppf) → vinil (cer-vinil) → cristales → rines → plásticos → faros → piel
11. Ozono (interior cerrado, al final)
12. Curado (12–48 h según producto) + inspección con luz
13. Reporte fotográfico + entrega con indicaciones de cuidado

> ⚠️ Regla de oro del pipeline: **lo abrasivo antes que lo adhesivo, lo adhesivo antes que lo químico-protector, el ozono al final.**

---

## 6 · Flujo ideal del cotizador (wizard)

**Paso 0 — Tu vehículo:** tipo (auto/camioneta/moto) · modelo/año · estado de pintura (nueva/buena/con rayas/dañada) · ¿wrap? ¿PPF? ¿cerámico vigente? · interior piel/tela · ¿faros opacos? · ¿olores/interior muy sucio?
→ *Con esto el catálogo ya sale filtrado (R04, R05, R09-R11, R22) y los mantenimientos aparecen solo a quien aplican.*

**Paso 1 — ¿Qué buscas?** (atajo opcional): Proteger 🛡️ / Corregir y dar brillo ✨ / Renovar interior 🪑 / Cambiar el look 🎨 / Mantener mi protección 🔁 → preselecciona categoría.

**Paso 2 — Catálogo inteligente:** el actual (cards con precio, incluye, horas), aplicando grupos radio, covers, bloqueos con nota y auto-agregados con aviso.

**Paso 3 — Upsells contextuales** (máx 2, según sección 8): "Quienes llevan Cerámico 3 años suelen agregar → Cristales + Rines".

**Paso 4 — Resumen:** desglose + horas + total → fecha (sin domingos) + horario + forma de pago (MSI) → **WhatsApp** (hoy) / **pagar anticipo** (cuando haya pasarela). `wrap-full` y `ppf-full` muestran "desde" + botón **Agendar valoración** en lugar de total cerrado.

---

## 7 · Textos al cliente y notas internas

| Momento / regla | Mensaje al cliente | Nota interna del taller |
|---|---|---|
| Cerámico bloquea pulido (R03) | "✓ Tu cerámico ya incluye la corrección y descontaminación — no necesitas pagarlo aparte." | Verificar nivel de corrección real vs estado de pintura al recibir |
| Cerámico y pintura dañada (R02) | "Por el estado de tu pintura te conviene el nivel con corrección profunda: el cerámico sella lo que esté debajo." | No aplicar cerámico sobre defectos sin autorización firmada |
| Mate (R21) | "El acabado mate no se pule ni se encera nunca — por eso lleva su preparación y cerámico especiales." | Solo químicos aptos para mate; jamás abrasivos ni siliconas |
| Wrap detectado (R04) | "Tu auto trae wrap: te mostramos los servicios seguros para vinil (el cerámico normal es solo para pintura)." | Identificar marca/antigüedad del vinil antes de químicos |
| Lamin-X + faro opaco (R07) | "Agregamos la restauración: si sellamos el faro opaco, el daño se queda adentro para siempre." | Lijado + pulido + verificar sellado antes de instalar film |
| PPF y pintura dañada (R17) | "El PPF encapsula lo que esté debajo — primero corregimos, luego blindamos." | Inspección con luz + firma de estado de pintura pre-instalación |
| Ozono solo (R12) | "El ozono mata el olor, pero si no limpiamos la fuente, vuelve. Va con el detallado profundo." | Ozono siempre al final, interior seco |
| Piel (R13-14) | "La piel se trabaja en orden: limpieza, hidratación y sellado — así el producto sí penetra." | Nunca hidratar/sellar piel sucia; probar en zona oculta |
| Franjas + cerámico (R20) | "Instalamos tus franjas antes del cerámico (o 3 semanas después) para que el vinil ancle bien." | Vinil sobre cerámico curado requiere primer/validación |
| Proyecto especial (R08) | "Wrap completo y PPF completo son proyectos a la medida: agenda una valoración de 20 min y te damos precio exacto." | Levantar ficha: fotos, medidas, estado, expectativa |
| Mantenimiento sin protección (R09-11) | *(no se muestra el servicio)* | Si el cliente insiste, verificar la protección en piso |
| Cristales con lluvia ácida (R15) | "Tus cristales traen lluvia ácida: la quitamos antes de sellar, si no, queda atrapada bajo el cerámico." | WSR 1+2 a 1+5 según grado; parabrisas con cuidado extra |

---

## 8 · Upsell / cross-sell (subir ticket sin vender mal)

| Si elige… | Ofrecer (en este orden) | Guion de venta |
|---|---|---|
| cer-1 / cer-3 / cer-5 | ① cris-cer ② rines-cer ③ ppf-fparcial | "Ya que el auto está descontaminado, cristales y rines quedan sellados el mismo día por mucho menos que por separado." |
| corr-2p / corr-3p | ① cer-3/5 ② cris-cer | "Acabas de invertir en dejar tu pintura perfecta — el cerámico es lo que evita que se raye igual en 3 meses." |
| ppf-fparcial / fcompleto | ① cer-ppf ② lamx-faros ③ cris-cer | "El cerámico encima del PPF hace que el lavado sea 5 minutos y evita marcas de agua." |
| wrap-* / toldo / franjas | ① cer-vinil ② lamx | "El vinil también se protege: el cerámico para wrap alarga su vida y mantiene el color." |
| int-pro | ① ozono ② piel-lim→hid ③ ppf-pantalla | "Con el interior ya desarmado, el ozono y la pantalla salen al costo de oportunidad más bajo." |
| faros-rest | ① lamx-faros | "Restaurado + film = no vuelve a opacarse; sin film, en 1-2 años estará igual." |
| moto-det | ① moto-cer ② moto-ppf tanque | "El tanque es lo primero que se raya — el PPF de tanque es el favorito." |
| Cualquier cerámico/PPF/wrap | mantenimiento programado a 6 meses | "Te agendamos el mantenimiento desde hoy y aseguras la garantía." |
| Regla anti-mala-venta | — | NUNCA ofrecer: pulido con cerámico ya elegido, cerámico de pintura con wrap, ozono solo con interior sucio, Lamin-X sobre faro opaco sin restauración. |

---

## 9 · Validaciones anti-error (checklist de desarrollo)

1. Grupos radio: seleccionar un miembro deselecciona al resto del grupo ✅ *(ya en vivo)*
2. `covers`: lo cubierto se deshabilita con nota "✓ Ya viene incluido con «X»" ✅ *(ya en vivo)*
3. `covers` inverso: al elegir algo que cubre a un seleccionado, el cubierto se quita solo ✅ *(ya en vivo)*
4. `requires`: auto-agregar con aviso visible (no silencioso) y sin doble cobro si está incluido
5. `hideIf`: filtrar catálogo según estado del vehículo ANTES de renderizar
6. Proyectos especiales sin total cerrado: CTA de valoración
7. Precio "desde" siempre marcado en PPF/wrap/proyectos
8. Domingos bloqueados en agenda ✅ *(ya en vivo)* · horario real del taller ✅
9. El mensaje de WhatsApp refleja EXACTAMENTE el carrito validado (id por id) ✅
10. Si la hoja de precios no carga → fallback a caché + aviso ✅
11. Nunca mostrar un servicio sin precio: los 🆕 quedan ocultos hasta tener fila en la hoja
12. Log del carrito (opcional): guardar cotizaciones enviadas para medir conversión

---

## 10 · Casos especiales

| Caso | Qué mostrar / hacer |
|---|---|
| **Auto nuevo (agencia)** | Saltar corrección profunda → pul-1step + cer-3/5, PPF frente como estrella ("protégelo antes del primer rayón"). |
| **Auto usado recién comprado** | Diagnóstico → corr-2p + cer-3 + int-pro + ozono (paquete "auto nuevo otra vez"). |
| **Pintura dañada** | corr-2p/3p obligatoria antes de cualquier cerámico/PPF (R02, R17); si presupuesto corto → pul-3en1 SIN cerámico, honesto. |
| **Wrap mate o satinado** | NUNCA pulir/encerar; solo shampoo neutro, cer-vinil apto para mate, mant-wrap. |
| **PPF existente** | mant-ppf + cer-ppf; corrección solo en paneles SIN film. |
| **Cerámico previo vigente** | mant-cer; si quiere renovar → descontaminación + evaluación (el cerámico viejo se elimina puliendo). |
| **Interior de piel** | Ruta piel: lim → hid → cer; ocultar lavado de vestiduras de tela si es piel completa. |
| **Interior de tela** | vest + int-pro + ozono; ocultar ruta piel. |
| **Olores fuertes (mascota/cigarro)** | int-pro + ozono juntos SIEMPRE (R12). |
| **Moto** | Catálogo moto (R22); tanque = zona estrella de PPF. |
| **Uso diario / carretera** | cer-3 + ppf-fparcial + cris-cer = el combo que más se recomienda. |
| **Show car / concurso** | corr-3p + cer-5 + ppf-full → tratar como proyecto especial con valoración. |

---

## 11 · Qué falta para implementarlo (en orden)

1. **Precios de los servicios 🆕** — filas nuevas en la hoja de costos (misma estructura: Servicio | Tipo | Personas | Tiempo | … | Precio). Sin fila = no aparece. Los "Tipo" nuevos sugeridos: `Piel`, `Cristales`, `Vinil`, `Mantenimiento`, `Moto`, `PPF zona`.
2. **Decidir cuáles son públicos** en el cotizador y cuáles solo se cotizan por WhatsApp (sugerencia: Lamin-X calaveras y wrap-full solo valoración).
3. **Paso 0 de estado del vehículo** — lo desarrollo en cuanto haya 5+ servicios nuevos con precio (si no, filtra sobre nada).
4. Fotos antes/después (comparador), links de reels (videos), cuenta de Mercado Pago (pasarela) — pendientes previos.

*Documento generado el 7 de julio de 2026 · Fuente de precios: hoja "Costeo Servicios v2" en vivo · El motor descrito en §2 es compatible con el cotizador ya publicado en dltstudio.com/cotizador.*
