// Nombre del proceso en el sistema operativo (ps, top, htop)
process.title = 'holidays_cl';

const path = require('path');
const express = require('express');
const data = require('./holidayscl.json');

// Carga el .env si existe (process.loadEnvFile requiere Node >= 20.12)
try {
  process.loadEnvFile(path.join(__dirname, '.env'));
} catch (err) {
  if (err.code !== 'ENOENT') throw err;
}

const app = express();
const PORT = process.env.PORT || 3003;

// Índice fecha -> feriado general, para búsquedas O(1)
const feriados = new Map();
for (const anio of Object.values(data.anios)) {
  for (const feriado of anio.feriados_generales) {
    feriados.set(feriado.fecha, feriado);
  }
}

function esFechaValida(fecha) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
  const d = new Date(`${fecha}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === fecha;
}

app.get('/festivos/:fecha', (req, res) => {
  const { fecha } = req.params;

  if (!esFechaValida(fecha)) {
    return res.status(400).json({ error: 'Fecha inválida, use el formato YYYY-MM-DD' });
  }

  const anio = fecha.slice(0, 4);
  if (!data.anios[anio]) {
    return res.status(404).json({
      error: `No hay datos para el año ${anio}`,
      anios_disponibles: Object.keys(data.anios),
    });
  }

  const feriado = feriados.get(fecha);
  if (!feriado) {
    return res.json({ fecha, festivo: false });
  }
  res.json({ ...feriado, festivo: true });
});

app.listen(PORT, () => {
  console.log(`API de feriados escuchando en http://localhost:${PORT}`);
});
