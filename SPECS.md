# 📘 TECHNICAL SPECIFICATIONS (`SPECS.md`)

- **Project Name:** 30X HackRadar
- **Version:** 1.0.0 (MVP Hackathon)
- **Target Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide Icons
- **Cost Constraint:** $0.00 USD (Arquitectura 100% gratuita usando Free Tiers y rotación de modelos `:free` en OpenRouter)

---

## 1. VISIÓN GENERAL Y OBJETIVO DEL SISTEMA
**30X HackRadar** es una plataforma de inteligencia de contenido automatizada para el equipo de media de **30X** (`@crece30x` y `@andresbilbao`).

Resuelve las 4 preguntas del reto sin pagar scrapers costosos ni violar términos de servicio (ToS):
1. **¿Qué está despegando?** Detecta automáticamente los **10 temas de IA** con mayor aceleración semanal cruzando **Google Trends (US vs. LatAm)**.
2. **¿Dónde están las pruebas?** Encuentra automáticamente los videos/Shorts y posts públicos reales en **YouTube, LinkedIn y TikTok** que están impulsando esa tendencia.
3. **¿Por qué funcionó?** Deconstruye la psicología de las piezas ganadoras (patrón del gancho en los primeros 3 segundos / 2 líneas, formato visual y driver emocional).
4. **¿Encaja con 30X y cómo lo adaptamos?** Evalúa cada tendencia con la **Matriz JEV** para líderes y ejecutivos en Latinoamérica y redacta el guion de Reel para **Andrés Bilbao** y el carrusel para **30X**.

---

## 2. REGLAS ARQUITECTÓNICAS OBLIGATORIAS
1. **Zero Illegal Scraping:** Prohibido usar Puppeteer/Playwright logueado en Instagram o LinkedIn. Toda la recolección usa APIs oficiales gratuitas (`YouTube Data API v3`, `Google Trends`) y búsqueda web indexada (`Tavily API`).
2. **Zero LLM Cost (OpenRouter Free Fallback):** Ninguna llamada a IA debe generar cobro. Se debe implementar un cliente con rotación automática en cascada sobre modelos `:free` de OpenRouter.
3. **Graceful Degradation (Demo-Safe):** Si alguna API externa falla por límite de peticiones (Rate Limit) o falta de API Key en `.env.local`, el sistema debe conmutar automáticamente y sin errores al dataset realista de respaldo (`fallbackRadarData.ts`) para garantizar que la demo funcione siempre al 100%.
4. **Strict JSON Parsing:** Toda salida del LLM debe limpiarse de bloques markdown y parsearse con seguridad antes de enviarse al frontend.

---

## 3. ÁRBOL DE DIRECTORIOS DEL PROYECTO
- `src/types/radar.ts` -> Contratos e interfaces TypeScript estrictas.
- `src/lib/mock/fallbackRadarData.ts` -> Dataset semilla completo (Top 10 realistas) para modo Demo/Fallback.
- `src/lib/collectors/trends.ts` -> Detector de tendencias y arbitraje US vs. LatAm (Google Trends).
- `src/lib/collectors/youtube.ts` -> Buscador de videos/Shorts de los últimos 7 días + cálculo de Outlier Velocity Score.
- `src/lib/collectors/socialSearch.ts` -> Buscador indexado de posts públicos en LinkedIn y TikTok vía Tavily API.
- `src/lib/ai/openrouterClient.ts` -> Cliente con rotación automática de modelos `:free` en OpenRouter.
- `src/lib/ai/prompts.ts` -> System Prompts con la metodología JEV y el estilo editorial de Andrés Bilbao / 30X.
- `src/lib/audit/specsAuditor.ts` -> Motor de auditoría operacional y auto-reparación en tiempo real.
- `src/app/api/radar/route.ts` -> Endpoint principal (`GET` y `POST`) que orquesta los 4 pasos y devuelve el Top 10 ordenado por Score JEV.
- `src/components/HeaderRadar.tsx` -> Barra superior con estado del motor gratuito, KPIs y botón de escaneo.
- `src/components/JevBadge.tsx` -> Componente visual para mostrar el puntaje J-E-V (Juicio, Etapa, Viabilidad).
- `src/components/TrendCard.tsx` -> Tarjeta de cada tendencia en el ranking con semáforo de ola y links de evidencia.
- `src/components/TrendDetailModal.tsx` -> Modal/Dossier con la radiografía del gancho ("Por qué funcionó") y los guiones listos para copiar ("Cómo lo adaptamos").
- `src/app/page.tsx` -> Dashboard principal interactivo en Dark Mode.
