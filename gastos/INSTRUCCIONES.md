# 📲 App de Gastos VAM — Instalación (una sola vez)

Tu sheet:
https://docs.google.com/spreadsheets/d/13fS8Zs8T8UojkJNQ21XuGln7FO2FYFYqCyR8O_ifTyk/edit

Son 3 pasos. La parte "técnica" la haces una vez; después solo abres el ícono y registras.

---

## PASO 1 — Pegar el "puente" en tu hoja (Apps Script)

1. Abre tu Google Sheet.
2. Menú **Extensiones → Apps Script**.
3. Borra lo que haya en el editor y **pega todo el contenido del archivo `apps-script.gs`**.
4. Click en **Guardar** (💾).
5. Arriba a la derecha: **Implementar → Nueva implementación**.
6. En "Tipo", elige el engrane ⚙︎ → **Aplicación web**.
7. Configura:
   - **Ejecutar como:** Yo (tu correo).
   - **Quién tiene acceso:** **Cualquier persona**.
   *(Es necesario para que la app pueda escribir; nadie más tiene el link.)*
8. Click **Implementar**. Te pedirá **autorizar** → acepta los permisos (di "Permitir").
9. Copia la **URL de la aplicación web** (termina en `/exec`). 👈 esta la necesitas en el Paso 3.

> Si después cambias el código, usa **Implementar → Administrar implementaciones → editar (lápiz) → Nueva versión**, así la URL no cambia.

---

## PASO 2 — Poner la app online (para abrirla en el celular)

La app es el archivo `index.html`. Necesita un link para abrirla en el cel. La forma más fácil:

**Opción A — Netlify Drop (30 segundos, sin cuenta):**
1. Entra a https://app.netlify.com/drop
2. Arrastra el archivo `index.html` ahí.
3. Te da un link tipo `https://algo-random.netlify.app` → ese abres en el celular.

**Opción B — GitHub Pages** (si prefieres tu cuenta `mackeyze-777`): súbelo a un repo y activa Pages.

*(Avísame y te dejo el link listo por cualquiera de las dos.)*

---

## PASO 3 — Conectar y agregar al inicio del celular

1. Abre el link de la app en tu celular (Safari en iPhone / Chrome en Android).
2. Te abrirá la pantalla de **Configuración** → pega la **URL del Paso 1** → **Guardar**.
   - Cargará solas tus **categorías** y **productos** reales (con sus emojis).
3. **Agregar a pantalla de inicio:**
   - **iPhone (Safari):** botón Compartir ⬆️ → "Agregar a pantalla de inicio".
   - **Android (Chrome):** menú ⋮ → "Agregar a pantalla principal".
4. Listo. Aparece como ícono `$`. Lo abres y se ve como app normal.

---

## Cómo se usa (lo de todos los días)

1. Abres el ícono.
2. Eliges **− Gasto** o **+ Ingreso**.
3. Escribes el **monto**, la **razón** y tocas la **categoría** (o el cliente, si es ingreso).
4. **Guardar** → se escribe solo en la pestaña del **mes actual** de tu sheet. ✅

- El **día** se llena solo con el día de hoy (puedes cambiarlo).
- El **mes** se detecta automático. Si quieres registrar en otro mes, ⚙︎ → "Mes destino".
- Tus fórmulas, totales y gráficas siguen funcionando igual.

---

## Notas
- Es solo para ti: el link de la app es privado y no aparece en buscadores.
- Si algún emoji no coincide, es porque la app lee EXACTO lo que está en tus menús
  desplegables de la hoja — así que siempre van a empatar.
- ¿Cambiaste las categorías en la hoja? Abre ⚙︎ y vuelve a Guardar para recargarlas.
