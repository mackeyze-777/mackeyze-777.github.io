/**
 * PUENTE GASTOS VAM  ->  Google Sheet
 * Pega este código en Extensiones > Apps Script de tu hoja,
 * y publícalo como "Aplicación web" (ver INSTRUCCIONES.md).
 *
 * La app del celular se conecta aquí por JSONP (GET) para
 * evitar problemas de CORS. Funciona para un solo usuario.
 */

var MESES = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO',
             'JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];

function doGet(e) {
  var p = (e && e.parameter) ? e.parameter : {};
  var cb = p.callback || 'callback';
  var out;
  try {
    if (p.action === 'lists')      out = getLists(p.mes);
    else if (p.action === 'add')   out = addRow(p);
    else if (p.action === 'ping')  out = { ok: true, msg: 'conectado', hoja: SpreadsheetApp.getActiveSpreadsheet().getName() };
    else                           out = { ok: false, error: 'accion desconocida: ' + p.action };
  } catch (err) {
    out = { ok: false, error: String(err) };
  }
  return ContentService
    .createTextOutput(cb + '(' + JSON.stringify(out) + ')')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

/* ---------- localizar la pestaña del mes ---------- */
function sheetForMonth(mes) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var name = (mes || MESES[new Date().getMonth()]).toString().toUpperCase().trim();
  var all = ss.getSheets();
  for (var i = 0; i < all.length; i++) {
    if (all[i].getName().toUpperCase().trim() === name) return all[i];
  }
  return null;
}

/* ---------- buscar una celda por su texto ---------- */
function findHeader(values, label) {
  label = label.toUpperCase().trim();
  for (var r = 0; r < values.length; r++) {
    for (var c = 0; c < values[r].length; c++) {
      var v = values[r][c];
      if (v && String(v).toUpperCase().trim() === label) return { row: r, col: c };
    }
  }
  return null;
}

/* ---------- leer la lista de un menú desplegable (o valores únicos) ---------- */
function validationList(sh, row1, col1, values, headerRow, dataCol) {
  // 1) intentar leer la validación de datos de la primera celda de datos
  try {
    var rule = sh.getRange(row1, col1).getDataValidation();
    if (rule) {
      var crit = rule.getCriteriaType();
      var args = rule.getCriteriaValues();
      if (crit === SpreadsheetApp.DataValidationCriteria.VALUE_IN_LIST) {
        return args[0].filter(String);
      }
      if (crit === SpreadsheetApp.DataValidationCriteria.VALUE_IN_RANGE) {
        return args[0].getValues().map(function (r) { return r[0]; }).filter(String);
      }
    }
  } catch (err) {}
  // 2) fallback: valores únicos ya escritos en esa columna
  var seen = {}, list = [];
  for (var r = headerRow + 1; r < values.length; r++) {
    var v = values[r][dataCol];
    if (v && !seen[v]) { seen[v] = 1; list.push(v); }
  }
  return list;
}

/* ---------- devolver las listas para los botones de la app ---------- */
function getLists(mes) {
  var sh = sheetForMonth(mes);
  if (!sh) return { ok: false, error: 'No encontré la pestaña del mes: ' + (mes || MESES[new Date().getMonth()]) };
  var values = sh.getDataRange().getValues();

  var catH  = findHeader(values, 'CATEGORIA');
  var prodH = findHeader(values, 'PRODUCTO');
  var cliH  = findHeader(values, 'CLIENTE');

  var categorias = catH  ? validationList(sh, catH.row + 2,  catH.col + 1,  values, catH.row,  catH.col)   : [];
  var productos  = prodH ? validationList(sh, prodH.row + 2, prodH.col + 1, values, prodH.row, prodH.col)  : [];
  var clientes   = cliH  ? uniqueCol(values, cliH.row, cliH.col)                                           : [];

  return { ok: true, mes: sh.getName(), categorias: categorias, productos: productos, clientes: clientes };
}

function uniqueCol(values, headerRow, col) {
  var seen = {}, list = [];
  for (var r = headerRow + 1; r < values.length; r++) {
    var v = values[r][col];
    if (v && v !== '-' && !seen[v]) { seen[v] = 1; list.push(v); }
  }
  return list.slice(0, 40);
}

/* ---------- agregar una fila (gasto o ingreso) ---------- */
function addRow(p) {
  var sh = sheetForMonth(p.mes);
  if (!sh) return { ok: false, error: 'No encontré la pestaña del mes: ' + (p.mes || MESES[new Date().getMonth()]) };

  var values = sh.getDataRange().getValues();
  var isIngreso = (p.type === 'ingreso');

  // localizar la tabla correcta por su columna única: RAZÓN (gasto) o PRODUCTO (ingreso)
  var anchor = isIngreso ? (findHeader(values, 'PRODUCTO'))
                         : (findHeader(values, 'RAZÓN') || findHeader(values, 'RAZON'));
  if (!anchor) return { ok: false, error: 'No encontré la tabla de ' + (isIngreso ? 'ingresos' : 'gastos') };

  // estructura:  FECHA | CANTIDAD | (RAZÓN/PRODUCTO) | (CATEGORIA/CLIENTE)
  var midCol   = anchor.col;
  var fechaCol = anchor.col - 2;
  var cantCol  = anchor.col - 1;
  var lastCol  = anchor.col + 1;
  if (fechaCol < 0) return { ok: false, error: 'Estructura de columnas inesperada' };

  // encontrar la primera fila vacía después del encabezado
  var startRow = anchor.row + 1;
  var writeRow = startRow, blanks = 0;
  for (var r = startRow; r < values.length; r++) {
    var f = values[r][fechaCol], c = values[r][cantCol], m = values[r][midCol];
    var empty = (f === '' || f == null) && (c === '' || c == null) && (m === '' || m == null);
    if (empty) { blanks++; if (blanks === 1) writeRow = r; if (blanks >= 3) break; }
    else { blanks = 0; writeRow = r + 1; }
  }

  var dia      = p.dia ? Number(p.dia) : new Date().getDate();
  var cantidad = Number(String(p.cantidad).replace(/[^0-9.\-]/g, ''));
  if (!cantidad) return { ok: false, error: 'Cantidad inválida' };

  var R = writeRow + 1; // 1-indexed
  sh.getRange(R, fechaCol + 1).setValue(dia);
  sh.getRange(R, cantCol + 1).setValue(cantidad);
  sh.getRange(R, midCol + 1).setValue(p.mid || '');
  sh.getRange(R, lastCol + 1).setValue(p.last || '');

  return { ok: true, fila: R, mes: sh.getName(), dia: dia, cantidad: cantidad };
}
