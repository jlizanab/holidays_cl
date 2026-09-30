# holidays-cl

API REST en Node.js/Express para consultar si una fecha es feriado en Chile.

Los datos provienen de [feriados.cl](https://www.feriados.cl) y están en `holidayscl.json`, con los feriados de los años **2026, 2027 y 2028**.

## Requisitos

- Node.js 22.9 o superior (se usa `--env-file-if-exists` para leer el `.env` sin dependencias extra)

## Instalación

```bash
npm install
```

## Configuración

El puerto se define en el archivo `.env`, que no se versiona (está en `.gitignore`). Créalo a partir de la plantilla `.env.example`:

```bash
cp .env.example .env
```

Contenido de `.env.example`:

```
PORT=3003
```

Si no existe `.env` o no define `PORT`, la API usa el puerto **3003** por defecto.

## Ejecución

```bash
npm start
```

> Nota: `npm start` carga el `.env`. Si ejecutas `node index.js` directamente, el `.env` no se lee y se usa el puerto por defecto.

## Uso

### `GET /festivos/:fecha`

Consulta si una fecha (formato `YYYY-MM-DD`) es feriado.

**Día no festivo**

```bash
curl http://localhost:3003/festivos/2026-09-30
```

```json
{ "fecha": "2026-09-30", "festivo": false }
```

**Día festivo**

```bash
curl http://localhost:3003/festivos/2026-09-18
```

```json
{
  "fecha": "2026-09-18",
  "dia": "Viernes, 18 de Septiembre",
  "festividad": "Independencia Nacional",
  "tipo": "Civil",
  "respaldo_legal": ["Ley 2.977", "Ley 19.973"],
  "irrenunciable": true,
  "por_confirmar": false,
  "festivo": true
}
```

| Campo            | Descripción                                                  |
|------------------|--------------------------------------------------------------|
| `fecha`          | Fecha en formato ISO (`YYYY-MM-DD`)                          |
| `dia`            | Texto del día tal como aparece en feriados.cl                |
| `festividad`     | Nombre del feriado                                           |
| `tipo`           | `Civil` o `Religioso`                                        |
| `respaldo_legal` | Leyes que establecen el feriado                              |
| `irrenunciable`  | `true` si es feriado irrenunciable                           |
| `por_confirmar`  | `true` si la fecha aún no está confirmada oficialmente       |
| `festivo`        | `true` si la fecha es feriado                                |

### Errores

| Código | Caso                          | Ejemplo de respuesta                                                                 |
|--------|-------------------------------|--------------------------------------------------------------------------------------|
| 400    | Fecha con formato inválido    | `{ "error": "Fecha inválida, use el formato YYYY-MM-DD" }`                           |
| 404    | Año sin datos disponibles     | `{ "error": "No hay datos para el año 2025", "anios_disponibles": ["2026", "2027", "2028"] }` |

## Consideraciones

- Solo se consideran los **feriados de carácter general** (nacionales). Los feriados específicos (regionales o comunales, como el Asalto y Toma del Morro de Arica o el Nacimiento del Prócer de la Independencia en Chillán) están en `holidayscl.json` pero la API los informa como `festivo: false`.
- Los domingos no se informan como festivos, salvo que coincidan con un feriado.

## Estructura de `holidayscl.json`

```json
{
  "fuente": "https://www.feriados.cl",
  "anios": {
    "2026": {
      "feriados_generales": [ { "fecha": "...", "festividad": "...", "...": "..." } ],
      "feriados_especificos": [ { "fecha": "...", "motivo": "...", "beneficiados": "...", "respaldo_legal": [] } ]
    }
  }
}
```
