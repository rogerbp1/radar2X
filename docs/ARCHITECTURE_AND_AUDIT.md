# Documentación de Arquitectura y Loop de Auditoría Continua (`ARCHITECTURE_AND_AUDIT.md`)

## 1. Filosofía de Diseño: Terminal Editorial vs. "AI Slop"

El frontend de **30X HackRadar** fue diseñado siguiendo principios de **diseño editorial suizo e instrumentos de precisión** (inspirado en terminales financieras y herramientas como Linear):
- **Jerarquía Tipográfica y Tabular**: Uso de tipografía monoespaciada para métricas de velocidad (`vistas/h`), brechas de arbitraje (`US +340% vs LatAm +38%`), cronómetros de guion (`00:00 – 00:03`) y calificaciones de la Matriz JEV.
- **Cero Ruido Visual**: Sin degradados neón decorativos ni cajas anidadas redundantes. Las señales de color se reservan exclusivamente para datos accionables (`🌱 Ola Temprana`, `🔥 En Explosión`, `💀 Saturado`).
- **Diálogo Nativo Accesible**: El componente `TrendDetailModal.tsx` utiliza el elemento nativo `<dialog closedby="any">` abierto mediante `showModal()` junto con reglas CSS `overscroll-behavior: contain` en `globals.css` para bloquear el encadenamiento de scroll sin alterar el `<body>`.

---

## 2. Arquitectura de Resiliencia y Degradación Elegante (Demo-Safe)

| Capa / Módulo | Fuente Primaria (En Vivo) | Condición de Fallo / Conmutación | Mecanismo de Respaldo Automático |
| :--- | :--- | :--- | :--- |
| **1. Tendencias (`trends.ts`)** | Google Trends RSS (`US`, `MX`, `CO`) con timeout de `2.2s` | Timeout de red o bloqueo regional | Semillas curadas con métricas de arbitraje verificadas US vs. LatAm |
| **2. Videos (`youtube.ts`)** | YouTube Data API v3 (`publishedAfter` 7 días + `statistics`) | Sin `YOUTUBE_API_KEY` o cuota agotada (`403`/`429`) | Evidencias reales de YouTube pre-verificadas con `outlierVelocityScore` |
| **3. Social (`socialSearch.ts`)** | Tavily Search API (`site:linkedin.com/posts OR site:tiktok.com`) | Sin `TAVILY_API_KEY` o límite mensual alcanzado | Posts públicos de LinkedIn y TikTok del dataset semilla |
| **4. Evaluación IA (`openrouterClient.ts`)** | Cascada de 4 modelos `:free` en OpenRouter (`Llama 3.3 70B` → `Qwen 2.5 72B` → `DeepSeek R1` → `Gemma 3 27B`) | Error `429`, timeout (`9.5s`) o JSON malformado en los 4 modelos | Conmutación transparente a la evaluación JEV y guiones curados de `fallbackRadarData.ts` |

---

## 3. Funcionamiento del Loop de Auditoría y Auto-Reparación (`specsAuditor.ts`)

Cada vez que el endpoint `/api/radar` o la interfaz principal procesan un conjunto de tendencias, se ejecuta `auditAndHealRadarResponse(response)` en un ciclo iterativo de hasta 3 pasadas:

1. **Verificación de Completitud (Top 10)**:
   - Garantiza que existan exactamente 10 tendencias cubriendo las palabras semilla del radar. Si falta alguna, la inyecta desde el catálogo semilla.
2. **Verificación Matemática JEV**:
   - Recalcula `Number(((J * 0.4) + (E * 0.35) + (V * 0.25)).toFixed(1))` para cada ítem. Si un LLM devuelve un promedio mal redondeado, el loop corrige el valor automáticamente.
3. **Verificación de Umbrales de Arbitraje (`WaveStage`)**:
   - Comprueba que `waveStage` coincida con `classifyWaveStage(usGrowthPercent, latamGrowthPercent)`:
     - `EARLY_WAVE`: `US > 180%` y `LatAm < 90%` (o brecha `>= 100 pts`).
     - `EXPLODING`: `US > 150%` y `LatAm > 150%`.
     - `SATURATED`: `US < 20%` y `LatAm < 20%`.
4. **Verificación de Entregables Editoriales 30X**:
   - Confirma que cada tendencia posea:
     - Exactamente **3 ganchos sugeridos** (`suggestedHooks`).
     - Los **4 bloques de tiempo** del guion de Reel para `@andresbilbao` (`hook_0_3s`, `problem_3_15s`, `solution_15_40s`, `cta_40_60s`).
     - Exactamente **6 slides estructurados** para el carrusel de `@crece30x` (`carousel30X`).
5. **Verificación de Ordenamiento y Ranking**:
   - Ordena de mayor a menor por `jev.totalScore` y reasigna secuencialmente `rank: 1..10`.

---

## 4. Auditoría por Línea de Comandos (`scripts/audit-loop.mjs`)

El script `npm run audit:loop` ejecuta **31 comprobaciones automatizadas** divididas en 8 bloques:
1. Existencia e integridad de los **14 archivos obligatorios** del proyecto.
2. Cumplimiento de **Zero Illegal Scraping** (ausencia total de Puppeteer/Playwright).
3. Configuración del pool de **4 modelos gratuitos (`:free`)** en OpenRouter y limpieza estricta de JSON (`cleanAndParseStrictJson`).
4. Presencia de los **7 contratos de datos TypeScript** en `src/types/radar.ts`.
5. Presencia de las **10 palabras semilla** y umbrales de arbitraje en `src/lib/collectors/trends.ts`.
6. Verificación de los recolectores `youtube.ts` y `socialSearch.ts`.
7. Verificación de componentes UI (`HeaderRadar.tsx`, `JevBadge.tsx`, `TrendCard.tsx`, `TrendDetailModal.tsx`, `page.tsx`).
8. **Pruebas HTTP en vivo** contra `GET http://localhost:3000`, `GET http://localhost:3000/api/radar` y `POST http://localhost:3000/api/radar`.
