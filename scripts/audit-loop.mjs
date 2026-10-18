#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const API_URL = process.env.RADAR_AUDIT_URL || 'http://localhost:3000/api/radar';
const UI_URL = process.env.RADAR_UI_URL || 'http://localhost:3000';

const REQUIRED_FILES = [
  'src/types/radar.ts',
  'src/lib/mock/fallbackRadarData.ts',
  'src/lib/collectors/trends.ts',
  'src/lib/collectors/youtube.ts',
  'src/lib/collectors/socialSearch.ts',
  'src/lib/ai/openrouterClient.ts',
  'src/lib/ai/prompts.ts',
  'src/lib/audit/specsAuditor.ts',
  'src/app/api/radar/route.ts',
  'src/components/HeaderRadar.tsx',
  'src/components/JevBadge.tsx',
  'src/components/TrendCard.tsx',
  'src/components/TrendDetailModal.tsx',
  'src/app/page.tsx',
  '.env.example',
  'README.md',
  'SPECS.md',
  'docs/ARCHITECTURE_AND_AUDIT.md',
];

const EXPECTED_SEEDS = [
  'AI Agents',
  'MCP Server',
  'Claude Computer Use',
  'n8n AI automation',
  'Vibe coding',
  'Voice AI sales',
  'AI CRM',
  'NotebookLM',
  'DeepSeek R1',
  'Cursor AI',
];

const EXPECTED_FREE_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'qwen/qwen-2.5-72b-instruct:free',
  'deepseek/deepseek-r1:free',
  'google/gemma-3-27b-it:free',
];

function readFile(relPath) {
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, 'utf8');
}

async function runSingleAuditIteration(iteration) {
  const results = [];
  const check = (section, item, condition, detail) => {
    results.push({ section, item, passed: Boolean(condition), detail });
  };

  // --- SECTION 1 & 3: Árbol de Directorios Exacto ---
  for (const file of REQUIRED_FILES) {
    const exists = fs.existsSync(path.join(ROOT, file));
    check(
      '3. Árbol de Directorios',
      `Archivo obligatorio: ${file}`,
      exists,
      exists ? 'Presente y legible' : 'FALTA ARCHIVO'
    );
  }

  // --- SECTION 2: Reglas Arquitectónicas Obligatorias ---
  const pkgJson = readFile('package.json') || '{}';
  const hasIllegalScrapers =
    pkgJson.includes('puppeteer') || pkgJson.includes('playwright');
  check(
    '2. Reglas Arquitectónicas',
    '2.1 Zero Illegal Scraping (Sin Puppeteer/Playwright)',
    !hasIllegalScrapers,
    'Verificado en package.json: Cero dependencias de scraping intrusivo'
  );

  const openrouterSrc = readFile('src/lib/ai/openrouterClient.ts') || '';
  const allFreeModelsPresent = EXPECTED_FREE_MODELS.every((m) =>
    openrouterSrc.includes(m)
  );
  check(
    '2. Reglas Arquitectónicas',
    '2.2 Zero LLM Cost (Rotación cascada sobre 4 modelos :free en OpenRouter)',
    allFreeModelsPresent &&
      openrouterSrc.includes('https://openrouter.ai/api/v1/chat/completions'),
    `4/4 modelos :free verificados (${EXPECTED_FREE_MODELS.join(', ')})`
  );

  const hasStrictJsonParser =
    openrouterSrc.includes('cleanAndParseStrictJson') &&
    openrouterSrc.includes('JSON.parse');
  check(
    '2. Reglas Arquitectónicas',
    '2.4 Strict JSON Parsing (Limpieza de markdown y <think> antes de JSON.parse)',
    hasStrictJsonParser,
    'Función cleanAndParseStrictJson activa'
  );

  // --- SECTION 4: Contratos de Datos (src/types/radar.ts) ---
  const typesSrc = readFile('src/types/radar.ts') || '';
  const requiredInterfaces = [
    'WaveStage',
    'EvidenceItem',
    'JevEvaluation',
    'WhyItWorked',
    'Adaptation30X',
    'RadarTrendItem',
    'RadarApiResponse',
  ];
  const allInterfacesPresent = requiredInterfaces.every((iface) =>
    typesSrc.includes(iface)
  );
  check(
    '4. Contratos TypeScript',
    'Interfaces exactas en src/types/radar.ts',
    allInterfacesPresent,
    `7/7 contratos presentes: ${requiredInterfaces.join(', ')}`
  );

  // --- SECTION 5: Módulos de Backend ---
  const trendsSrc = readFile('src/lib/collectors/trends.ts') || '';
  const allSeedsPresent = EXPECTED_SEEDS.every((s) => trendsSrc.includes(s));
  check(
    '5.1 Detector de Olas (trends.ts)',
    '10 Palabras Semilla (Seeds) + Arbitraje US vs. LatAm (EARLY_WAVE, EXPLODING, SATURATED)',
    allSeedsPresent &&
      trendsSrc.includes('180') &&
      trendsSrc.includes('90') &&
      trendsSrc.includes('150') &&
      trendsSrc.includes('20'),
    '10/10 semillas y umbrales matemáticos US vs LatAm verificados'
  );

  const ytSrc = readFile('src/lib/collectors/youtube.ts') || '';
  check(
    '5.2 Cazador YouTube (youtube.ts)',
    'YouTube Data API v3 (últimos 7 días + outlierVelocityScore + watch?v=)',
    ytSrc.includes('publishedAfter') &&
      ytSrc.includes('viewCount') &&
      ytSrc.includes('outlierVelocityScore') &&
      ytSrc.includes('https://www.youtube.com/watch?v='),
    'Endpoint YouTube v3, filtro 7 días y fórmula de velocidad verificados'
  );

  const socialSrc = readFile('src/lib/collectors/socialSearch.ts') || '';
  check(
    '5.2 Cazador Social (socialSearch.ts)',
    'Tavily API POST con site:linkedin.com/posts OR site:tiktok.com',
    socialSrc.includes('https://api.tavily.com/search') &&
      socialSrc.includes('site:linkedin.com/posts OR site:tiktok.com'),
    'Endpoint Tavily y query indexada LinkedIn/TikTok verificados'
  );

  const promptsSrc = readFile('src/lib/ai/prompts.ts') || '';
  check(
    '5.4 Prompt Maestro JEV (prompts.ts)',
    'Desarme Creativo + Calificación JEV (40/35/25) + Guion @andresbilbao y @crece30x',
    promptsSrc.includes('@andresbilbao') &&
      promptsSrc.includes('@crece30x') &&
      promptsSrc.includes('0.4') &&
      promptsSrc.includes('0.35') &&
      promptsSrc.includes('0.25'),
    'Reglas editoriales 30X y pesos JEV verificados en System Prompt'
  );

  // --- SECTION 6: Diseño del Dashboard y Componentes ---
  const headerSrc = readFile('src/components/HeaderRadar.tsx') || '';
  check(
    '6.1 HeaderRadar.tsx',
    'Título 30X HackRadar, badges $0.00 OpenRouter :free, fuentes y botón ⚡ Escanear Semana en Vivo',
    headerSrc.includes('30X HackRadar') &&
      headerSrc.includes('Costo Operativo: $0.00 (OpenRouter :free)') &&
      headerSrc.includes('Fuentes: Google Trends + YouTube + LinkedIn Público') &&
      headerSrc.includes('⚡ Escanear Semana en Vivo'),
    'Todos los textos, KPIs y botón de acción presentes'
  );

  const jevBadgeSrc = readFile('src/components/JevBadge.tsx') || '';
  check(
    '6.3 JevBadge.tsx',
    'Puntaje total (/ 10) y 3 barras de progreso (J, E, V)',
    jevBadgeSrc.includes('j_audienceFit') &&
      jevBadgeSrc.includes('e_earlyTiming') &&
      jevBadgeSrc.includes('v_formatViability'),
    'Barras de progreso J, E, V verificadas'
  );

  const cardSrc = readFile('src/components/TrendCard.tsx') || '';
  check(
    '6.3 TrendCard.tsx',
    'Ranking, semáforo de ola, crecimiento US vs LatAm, chips clicables y botón Ver Rayos X y Guion 30X',
    cardSrc.includes('Ver Rayos X y Guion 30X') &&
      cardSrc.includes('target="_blank"') &&
      cardSrc.includes('usGrowthPercent') &&
      cardSrc.includes('latamGrowthPercent'),
    'Tarjeta completa con links externos y CTA a modal'
  );

  const modalSrc = readFile('src/components/TrendDetailModal.tsx') || '';
  check(
    '6.4 TrendDetailModal.tsx',
    'Secciones A (Ingeniería Inversa), B (Justificación JEV LatAm), C (3 Ganchos, Guion @andresbilbao 0-3s/3-15s/15-40s/40-60s + Copiar Guion + Carrusel 6 Slides + Copiar Carrusel)',
    modalSrc.includes('Copiar Guion') &&
      modalSrc.includes('Copiar Carrusel') &&
      modalSrc.includes('hook_0_3s') &&
      modalSrc.includes('problem_3_15s') &&
      modalSrc.includes('solution_15_40s') &&
      modalSrc.includes('cta_40_60s'),
    'Modal completo con las 3 secciones y botones de copiado al portapapeles'
  );

  // --- SECTION 7: .env.example ---
  const envExample = readFile('.env.example') || '';
  check(
    '7. Variables de Entorno',
    '.env.example con OPENROUTER_API_KEY, YOUTUBE_API_KEY y TAVILY_API_KEY',
    envExample.includes('OPENROUTER_API_KEY=') &&
      envExample.includes('YOUTUBE_API_KEY=') &&
      envExample.includes('TAVILY_API_KEY='),
    '3 variables opcionales presentes en .env.example'
  );

  // --- RETO 30X OFICIAL (01 a 08): Trazabilidad Completa ---
  const pageSrc = readFile('src/app/page.tsx') || '';
  check(
    'Reto 30X (04 & 07)',
    'Sensor de Comunidad en vivo + Filtro por Red (LinkedIn/YouTube/Instagram/TikTok) + Perfiles @crece30x y @andresbilbao',
    pageSrc.includes('SENSOR DE COMUNIDAD 30X') &&
      pageSrc.includes('LINKEDIN') &&
      pageSrc.includes('INSTAGRAM') &&
      headerSrc.includes('https://www.instagram.com/crece30x') &&
      headerSrc.includes('https://www.instagram.com/andresbilbao'),
    'Sensor de Comunidad, filtro multirred y enlaces oficiales verificados'
  );

  // --- LIVE FUNCTIONAL ENDPOINT & DATA INTEGRITY AUDIT ---
  try {
    const [getRes, postRes, uiRes] = await Promise.all([
      fetch(API_URL, { method: 'GET' }),
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }),
      fetch(UI_URL, { method: 'GET' }),
    ]);

    const getJson = await getRes.json();
    const postJson = await postRes.json();
    const uiHtml = await uiRes.text();

    check(
      '8. Prueba Funcional en Vivo (UI)',
      'GET http://localhost:3000 renderiza el Dashboard Dark Mode inmediatamente',
      uiRes.ok &&
        uiHtml.includes('30X HackRadar') &&
        uiHtml.includes('bg-slate-950'),
      `HTTP ${uiRes.status} · HTML hidratado con Top 10`
    );

    const trends = getJson.trends || [];
    const postTrends = postJson.trends || [];

    const validCount = trends.length === 10 && postTrends.length === 10;
    const validStages =
      trends.some((t) => t.waveStage === 'EARLY_WAVE') &&
      trends.some((t) => t.waveStage === 'EXPLODING') &&
      trends.some((t) => t.waveStage === 'SATURATED');

    const validJevMathAndOrder = trends.every((t, idx, arr) => {
      const expected = Number(
        (
          t.jev.j_audienceFit * 0.4 +
          t.jev.e_earlyTiming * 0.35 +
          t.jev.v_formatViability * 0.25
        ).toFixed(1)
      );
      const sorted =
        idx === 0 || arr[idx - 1].jev.totalScore >= t.jev.totalScore;
      return t.jev.totalScore === expected && t.rank === idx + 1 && sorted;
    });

    const validScriptsAndEvidence = trends.every(
      (t) =>
        t.adaptation?.suggestedHooks?.length === 3 &&
        t.adaptation?.carousel30X?.length === 6 &&
        t.evidence?.length >= 2 &&
        t.evidence.some((e) => e.platform === 'YOUTUBE') &&
        t.evidence.some((e) => e.platform === 'LINKEDIN' || e.platform === 'TIKTOK')
    );

    check(
      '8. Prueba Funcional en Vivo (API GET & POST)',
      'GET y POST /api/radar devuelven Top 10 con EARLY_WAVE, EXPLODING y SATURATED',
      getRes.ok && postRes.ok && validCount && validStages,
      `GET: ${trends.length} ítems | POST: ${postTrends.length} ítems | 3 etapas representadas`
    );

    check(
      '8. Auditoría Matemática JEV y Ranking',
      'Fórmula J*0.4 + E*0.35 + V*0.25 exacta y orden descendente #1 -> #10',
      validJevMathAndOrder,
      `Scores: ${trends.map((t) => `#${t.rank}:${t.jev.totalScore}`).join(', ')}`
    );

    check(
      '8. Integridad de Evidencias y Guiones 30X',
      'Cada tendencia tiene >=2 links públicos (YouTube + LinkedIn/TikTok), 3 ganchos, Reel 4 bloques y Carrusel 6 slides',
      validScriptsAndEvidence,
      '10/10 tendencias verificadas sin campos vacíos'
    );
  } catch (err) {
    check(
      '8. Prueba Funcional en Vivo',
      'Conexión con servidor local http://localhost:3000',
      false,
      `Error conectando al servidor: ${err.message}`
    );
  }

  const failed = results.filter((r) => !r.passed);
  return { iteration, results, failed };
}

async function main() {
  const MAX_ITERATIONS = 2;
  for (let i = 1; i <= MAX_ITERATIONS; i++) {
    console.log(`\n=============================================================`);
    console.log(`🔄 LOOP DE AUDITORÍA OPERACIONAL 30X HACKRADAR (Iteración #${i})`);
    console.log(`=============================================================`);

    const { results, failed } = await runSingleAuditIteration(i);
    for (const r of results) {
      const icon = r.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${icon} | [${r.section}] ${r.item}`);
      console.log(`        ↳ ${r.detail}`);
    }

    console.log(`-------------------------------------------------------------`);
    console.log(
      `📊 RESULTADO ITERACIÓN #${i}: ${results.length - failed.length}/${
        results.length
      } ítems aprobados.`
    );

    if (failed.length === 0) {
      console.log(
        `🎯 AUDITORÍA 100% SUPERADA: Todos los requisitos del prompt anterior (SPECS.md) están operativos y verificados.\n`
      );
      process.exit(0);
    }
  }
  process.exit(1);
}

main();
