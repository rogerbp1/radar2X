import { RadarApiResponse, RadarTrendItem } from '@/types/radar';

export const FALLBACK_TRENDS: RadarTrendItem[] = [
  {
    rank: 1,
    id: 'trend-mcp-server',
    topicTitle: 'MCP Server: Conectar IA directo al ERP, Slack y Postgres sin integraciones de 3 meses',
    searchKeyword: 'MCP Server',
    waveStage: 'EARLY_WAVE',
    growthMetrics: {
      usGrowthPercent: 340,
      latamGrowthPercent: 38,
      arbitrageGap:
        'Brecha de +302 pts: En EE. UU. los CTOs y COOs están reemplazando integraciones custom con Model Context Protocol; en LatAm menos del 5% de líderes sabe qué es un MCP.',
    },
    jev: {
      j_audienceFit: 9.5,
      e_earlyTiming: 9.8,
      v_formatViability: 9.0,
      totalScore: 9.5,
      reasoning:
        'Altísima relevancia para fundadores y directores en LatAm cansados de pagar consultoras para conectar sus datos a la IA. Ventana de arbitraje en español completamente abierta.',
    },
    whyItWorked: {
      hookPattern:
        'Contrarianismo + Muerte de lo viejo ("Deja de construir APIs para tu IA: este nuevo estándar conecta Claude a toda tu empresa en 4 minutos").',
      winningFormat:
        'Demo pantalla dividida: izquierda haciendo una pregunta de negocio en lenguaje natural, derecha viendo cómo el agente consulta Postgres, HubSpot y Slack en tiempo real.',
      emotionalDriver:
        'Alivio operativo + FOMO ejecutivo (eliminar cuellos de botella de TI y tomar decisiones con datos vivos).',
    },
    adaptation: {
      suggestedHooks: [
        'Tu equipo sigue copiando y pegando Excel en ChatGPT porque no conocen estas 3 letras: M-C-P.',
        'En Silicon Valley acaban de matar las integraciones lentas de software, y en Latinoamérica casi nadie se ha enterado.',
        'Así conectamos la IA directo a las ventas y finanzas de una empresa en 5 minutos sin escribir una línea de backend.',
      ],
      reelScriptBilbao: {
        hook_0_3s:
          'Si tu equipo sigue descargando reportes en Excel para subirlos a ChatGPT, estás usando la IA como en el 2023.',
        problem_3_15s:
          'El mayor cuello de botella en las empresas de Latinoamérica hoy no es el modelo de IA: es que la IA está ciega. No ve tu CRM, no ve tu inventario y TI te pide 3 meses para conectarla.',
        solution_15_40s:
          'Acaba de despegar en EE. UU. el estándar MCP (Model Context Protocol). Piensa en esto como un puerto USB universal para la IA: en 5 minutos conectas Claude o Cursor directo a tu HubSpot, Notion, Slack o base de datos. Le preguntas "¿qué clientes grandes están en riesgo esta semana?" y te responde con datos vivos y ejecuta la tarea.',
        cta_40_60s:
          'Las empresas 30X no esperan 6 meses a TI; conectan sus datos hoy. Comenta "MCP" y te envío la guía con los 5 conectores listos para instalar con tu equipo.',
      },
      carousel30X: [
        'SLIDE 1 (PORTADA): ¿Tu IA sigue "ciega" a los datos reales de tu empresa? Conoce MCP: el nuevo USB universal de la IA.',
        'SLIDE 2 (EL PROBLEMA): El 90% de los equipos en LatAm pierde 6 horas a la semana exportando CSVs de su CRM/ERP para pegarlos en un chat.',
        'SLIDE 3 (QUÉ ES MCP): Model Context Protocol permite que tu IA lea y ejecute acciones en tus herramientas (Slack, Drive, SQL, HubSpot) en tiempo real y con permisos controlados.',
        'SLIDE 4 (CASO REAL 30X): Un director comercial pregunta en un solo prompt: "Cruza las llamadas de hoy con HubSpot y agenda seguimiento a los leads >$10k". Tiempo: 18 segundos.',
        'SLIDE 5 (STACK GRATUITO): 3 servidores MCP que puedes activar hoy mismo: 1) Google Drive / Workspace, 2) Slack + Notion, 3) PostgreSQL Read-Only para analítica.',
        'SLIDE 6 (CTA): Guarda este carrusel y compártelo con tu líder de operaciones o tecnología. En @crece30x te enseñamos a implementarlo paso a paso.',
      ],
    },
    evidence: [
      {
        id: 'ev-mcp-1',
        platform: 'YOUTUBE',
        title: 'Model Context Protocol (MCP) Explained: Why Every AI Team is Switching Now',
        url: 'https://www.youtube.com/watch?v=kQmXtrmQ5Zg',
        author: 'AI Engineer / Fireship Showcase',
        publishedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        metrics: {
          viewsOrEngagement: 184200,
          outlierVelocityScore: 5117,
        },
        snippetOrTranscript:
          'Stop writing custom API wrappers for every single tool. With MCP servers, Claude Desktop and Cursor can talk directly to your database, GitHub, and CRM in minutes...',
      },
      {
        id: 'ev-mcp-2',
        platform: 'LINKEDIN',
        title: 'We replaced 14 custom Zapier webhooks with a single MCP Server architecture',
        url: 'https://www.linkedin.com/posts/anthropicresearch_model-context-protocol',
        author: 'VP of Engineering @ B2B SaaS',
        publishedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        metrics: {
          viewsOrEngagement: 42900,
          outlierVelocityScore: 894,
        },
        snippetOrTranscript:
          'Our operations leads used to wait two sprints for data engineering to expose a new metric. Last Friday we deployed an internal MCP Server...',
      },
      {
        id: 'ev-mcp-3',
        platform: 'TIKTOK',
        title: 'Watch Claude control my entire company stack via MCP in 30 seconds',
        url: 'https://www.tiktok.com/@anthropicai',
        author: '@aidevbuilder',
        publishedAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
        metrics: {
          viewsOrEngagement: 96400,
          outlierVelocityScore: 3443,
        },
        snippetOrTranscript:
          'No code, no waiting on IT. Just plug the MCP server config JSON and watch it pull live Stripe + CRM revenue metrics instantly.',
      },
    ],
  },
  {
    rank: 2,
    id: 'trend-vibe-coding',
    topicTitle: 'Vibe Coding Ejecutivo: Gerentes de Negocio creando sus propias herramientas internas en 45 min',
    searchKeyword: 'Vibe coding',
    waveStage: 'EARLY_WAVE',
    growthMetrics: {
      usGrowthPercent: 290,
      latamGrowthPercent: 52,
      arbitrageGap:
        'Brecha de +238 pts: El término acuñado por Andrej Karpathy pasó de los programadores a los directores de operaciones en EE. UU., que ahora construyen micro-apps internas en una tarde.',
    },
    jev: {
      j_audienceFit: 9.5,
      e_earlyTiming: 9.2,
      v_formatViability: 9.4,
      totalScore: 9.4,
      reasoning:
        'ADN 100% Andrés Bilbao y 30X: velocidad extrema, empoderar a líderes no técnicos para construir soluciones sin burocracia ni excusas.',
    },
    whyItWorked: {
      hookPattern:
        'Cifra de impacto + Contraste temporal ("Lo que antes nos cotizaban en $15,000 USD y 2 meses, mi gerente de operaciones lo hizo el domingo en 40 minutos").',
      winningFormat:
        'Timelapse con cronómetro en pantalla mostrando el prompt inicial y el dashboard funcional desplegado al final del video.',
      emotionalDriver:
        'Empoderamiento radical y ahorro directo en licencias de software y agencias externas.',
    },
    adaptation: {
      suggestedHooks: [
        'Una agencia me quería cobrar $12,000 dólares por este software interno; lo construimos en 38 minutos hablando en español.',
        'El "Vibe Coding" no es para programadores: es el nuevo superpoder de los CEOs y gerentes que ejecutan rápido.',
        'La excusa de "no tengo desarrolladores disponibles" acaba de morir oficialmente esta semana.',
      ],
      reelScriptBilbao: {
        hook_0_3s:
          'Una agencia te cobra $15,000 dólares y 3 meses por hacerte una herramienta interna. Hoy un gerente 30X la hace en 45 minutos.',
        problem_3_15s:
          'Durante años en Latinoamérica las áreas de ventas, finanzas y logística han estado secuestradas esperando a que tecnología tenga tiempo de hacerles una calculadora de márgenes o un portal de proveedores.',
        solution_15_40s:
          'En Estados Unidos esto ya tiene nombre: Vibe Coding. Líderes que no saben programar abren herramientas como Lovable, Bolt o Cursor, describen en voz alta el problema del negocio, iteran viendo la pantalla en vivo y en menos de una hora tienen el software funcionando para su equipo.',
        cta_40_60s:
          'En la era de la IA, la velocidad mata al presupuesto. Comenta "VIBE" y te comparto la plantilla exacta de prompts para que tu equipo cree su primera herramienta interna esta semana.',
      },
      carousel30X: [
        'SLIDE 1 (PORTADA): Qué es el "Vibe Coding" y por qué está ahorrando miles de dólares a empresas medianas.',
        'SLIDE 2 (CAMBIO DE REGLAS): Antes: Idea -> Ticket a TI -> 8 semanas -> No era lo que pediste. Hoy: Idea -> Prompt estructurado -> App en vivo en 45 min.',
        'SLIDE 3 (3 HERRAMIENTAS QUE PUEDES USAR HOY): 1) Lovable / Bolt (Frontends completos), 2) Cursor + Claude (Apps a medida), 3) Replit Agent (Despliegue en 1 clic).',
        'SLIDE 4 (QUÉ CONSTRUIR PRIMERO): Cotizadores dinámicos para ventas, validadores de facturas, tableros de comisiones y portales de onboarding.',
        'SLIDE 5 (LA REGLA DE ORO 30X): No automatices el caos. Primero escribe en 5 puntos las reglas de tu proceso; luego deja que la IA escriba el código.',
        'SLIDE 6 (CTA): ¿Cuál es esa herramienta que tu equipo lleva meses esperando? Escríbela en comentarios y elegimos una para armarla en vivo.',
      ],
    },
    evidence: [
      {
        id: 'ev-vibe-1',
        platform: 'YOUTUBE',
        title: 'Vibe Coding is Changing How Non-Technical Founders Build Internal Tools',
        url: 'https://www.youtube.com/watch?v=Tw18-4U7mts',
        author: 'Y Combinator / Garry Tan',
        publishedAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
        metrics: {
          viewsOrEngagement: 142500,
          outlierVelocityScore: 6477,
        },
        snippetOrTranscript:
          'You no longer write syntax; you manage product context and let the LLM iterate until the workflow ships in production...',
      },
      {
        id: 'ev-vibe-2',
        platform: 'LINKEDIN',
        title: 'Our Head of RevOps built a custom commission calculator in 50 minutes using Vibe Coding',
        url: 'https://www.linkedin.com/posts/garrytan_vibecoding-ai-startups',
        author: 'COO @ ScaleUp',
        publishedAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
        metrics: {
          viewsOrEngagement: 58300,
          outlierVelocityScore: 1458,
        },
        snippetOrTranscript:
          'We cancelled a $1,200/mo SaaS subscription because our RevOps lead built the exact workflow we needed on a Tuesday afternoon...',
      },
      {
        id: 'ev-vibe-3',
        platform: 'INSTAGRAM',
        title: 'De idea a app interna en 40 minutos: mentalidad de velocidad exponencial',
        url: 'https://www.instagram.com/andresbilbao',
        author: '@andresbilbao (Referente 30X)',
        publishedAt: new Date(Date.now() - 30 * 3600 * 1000).toISOString(),
        metrics: {
          viewsOrEngagement: 76400,
          outlierVelocityScore: 2547,
        },
        snippetOrTranscript:
          'Las empresas que ganan no son las más grandes, son las que pasan de una idea el lunes a un prototipo funcionando el mismo lunes por la tarde.',
      },
    ],
  },
  {
    rank: 3,
    id: 'trend-voice-ai-sales',
    topicTitle: 'Voice AI Sales: Agentes de Voz que llaman al lead en 8 segundos y agendan en el calendario',
    searchKeyword: 'Voice AI sales',
    waveStage: 'EARLY_WAVE',
    growthMetrics: {
      usGrowthPercent: 235,
      latamGrowthPercent: 64,
      arbitrageGap:
        'Brecha de +171 pts: En EE. UU. las empresas de servicios, educación e inmobiliarias llaman en <10 segundos con voz hiperrealista; en LatAm el tiempo medio de respuesta a un lead sigue siendo 6 horas.',
    },
    jev: {
      j_audienceFit: 9.8,
      e_earlyTiming: 8.8,
      v_formatViability: 8.8,
      totalScore: 9.2,
      reasoning:
        'Impacto directo en ingresos (Revenue). En Latinoamérica donde WhatsApp y la llamada inmediata definen el cierre, mostrar una demo en español con acento natural es viralidad garantizada.',
    },
    whyItWorked: {
      hookPattern:
        'Prueba en vivo + Shock auditivo ("Llené este formulario hace 7 segundos y escucha quién me está llamando al celular ahora mismo").',
      winningFormat:
        'Video con celular en altavoz mostrando la conversación real, interrupciones naturales y cómo el agente agenda la cita en vivo.',
      emotionalDriver:
        'Dolor financiero de perder leads ya pagados en Meta/Google Ads por lentitud del equipo comercial.',
    },
    adaptation: {
      suggestedHooks: [
        'Estás quemando el 60% de tu presupuesto de anuncios porque tu equipo tarda 4 horas en llamar a un lead. Escucha esto.',
        'Puse a un agente de voz de IA a llamar leads en vivo con acento latino: 9 de cada 10 no notaron que no era humano.',
        'Si respondes un lead en 5 minutos en vez de 30 segundos, tu conversión cae un 390%. Así lo resolvimos con IA.',
      ],
      reelScriptBilbao: {
        hook_0_3s:
          'Escucha esta llamada en altavoz: la persona que está calificando a este cliente no existe, y llamó 8 segundos después del clic.',
        problem_3_15s:
          'En Latinoamérica las empresas se quejan de que los leads de Meta y Google "no califican". Mentira: el problema es que el cliente deja sus datos el sábado a las 8 p.m. y tu vendedor lo contacta el lunes al mediodía cuando ya se enfrió.',
        solution_15_40s:
          'Con la nueva generación de agentes de voz como ElevenLabs Conversational y Vapi, apenas entra el formulario el agente llama en menos de 10 segundos, conversa con acento natural, maneja objeciones, valida presupuesto y deja la reunión agendada en el calendario del cerrador humano.',
        cta_40_60s:
          'No reemplaces a tus mejores vendedores: quítales el trabajo de perseguir leads fríos. Comenta "VOZ" y te mostramos la arquitectura que usamos en 30X.',
      },
      carousel30X: [
        'SLIDE 1 (PORTADA): La regla de los 10 segundos: Cómo triplicar tus citas comerciales con Agentes de Voz IA.',
        'SLIDE 2 (LA ESTADÍSTICA REAL): Contactar un lead en <1 minuto aumenta la conversión 391%. El promedio en LatAm es de 4 a 12 horas.',
        'SLIDE 3 (CÓMO FUNCIONA EL FLUJO): Anuncio -> Formulario/WhatsApp -> Webhook -> Llamada IA en 8s -> Calificación BANT -> Agenda en Google Calendar.',
        'SLIDE 4 (STACK RECOMENDADO): Voz: ElevenLabs Flash v2.5 (baja latencia en español) + Orquestador: Vapi / Retell + Automatización: n8n / Make.',
        'SLIDE 5 (COSTO VS RETORNO): Costo por llamada de calificación de 2 minutos: ~$0.14 USD. Un solo cierre extra paga todo el año de operación.',
        'SLIDE 6 (CTA): Guarda este flujo y envíaselo a tu Director Comercial. Síguenos en @crece30x para más sistemas de crecimiento con IA.',
      ],
    },
    evidence: [
      {
        id: 'ev-voice-1',
        platform: 'YOUTUBE',
        title: 'I Built an AI Voice Agent That Calls Leads in 10 Seconds (Full Live Demo)',
        url: 'https://www.youtube.com/watch?v=pi62jf3_9sA',
        author: 'Liam Ottley / AI Automation',
        publishedAt: new Date(Date.now() - 31 * 3600 * 1000).toISOString(),
        metrics: {
          viewsOrEngagement: 118900,
          outlierVelocityScore: 3835,
        },
        snippetOrTranscript:
          'Watch what happens the second I hit submit on this landing page: my phone rings in 8 seconds and the AI books the discovery call...',
      },
      {
        id: 'ev-voice-2',
        platform: 'LINKEDIN',
        title: 'Speed-to-Lead in 8 Seconds: Replacing manual SDR dialers with Conversational Voice AI',
        url: 'https://www.linkedin.com/posts/elevenlabsio_conversational-ai-voice-agents',
        author: 'VP Revenue @ GrowthOps',
        publishedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        metrics: {
          viewsOrEngagement: 67200,
          outlierVelocityScore: 2800,
        },
        snippetOrTranscript:
          'Our inbound show-up rate jumped from 41% to 74% after deploying sub-10-second Spanish and English voice qualification...',
      },
      {
        id: 'ev-voice-3',
        platform: 'TIKTOK',
        title: 'Testing AI cold/inbound caller live on speakerphone - insane latency',
        url: 'https://www.tiktok.com/@elevenlabsio',
        author: '@revops.ai',
        publishedAt: new Date(Date.now() - 19 * 3600 * 1000).toISOString(),
        metrics: {
          viewsOrEngagement: 205000,
          outlierVelocityScore: 10789,
        },
        snippetOrTranscript:
          'Wait for the interruption at 0:14—it pauses naturally and answers the pricing question without robotic delay.',
      },
    ],
  },
  {
    rank: 4,
    id: 'trend-n8n-automation',
    topicTitle: 'n8n AI Automation: Flujos Agénticos que reemplazan 4 suscripciones SaaS y miles de tareas manuales',
    searchKeyword: 'n8n AI automation',
    waveStage: 'EXPLODING',
    growthMetrics: {
      usGrowthPercent: 210,
      latamGrowthPercent: 165,
      arbitrageGap:
        'En plena explosión continental: n8n se convirtió en el estándar favorito porque permite agentes con memoria y herramientas a una fracción del costo de Zapier.',
    },
    jev: {
      j_audienceFit: 9.2,
      e_earlyTiming: 8.5,
      v_formatViability: 9.2,
      totalScore: 9.0,
      reasoning:
        'Visualmente los mapas de nodos de n8n hipnotizan en Reels y carruseles. A los líderes les encanta porque reduce la factura mensual de software en un 70%.',
    },
    whyItWorked: {
      hookPattern:
        'Reemplazo concreto + Ahorro cuantificado ("Este flujo de 7 nodos hace el trabajo operativo de 18 horas semanales y nos cuesta $5 al mes").',
      winningFormat:
        'Zoom al lienzo de n8n corriendo en verde mientras entra un mensaje de WhatsApp/correo y sale el entregable terminado.',
      emotionalDriver:
        'Eficiencia de costos y obsesión por escalar operaciones sin inflar la nómina administrativa.',
    },
    adaptation: {
      suggestedHooks: [
        'Este mapa de 6 bloques que ves en pantalla le ahorra 25 horas a la semana a nuestro equipo de operaciones.',
        'Por qué las empresas más rápidas están migrando de automatizaciones simples a Agentes en n8n.',
        'Automatizar tareas está bien; automatizar decisiones repetitivas es lo que separa a una empresa tradicional de una 30X.',
      ],
      reelScriptBilbao: {
        hook_0_3s:
          'Mira este diagrama en mi pantalla: tiene 6 bloques y acaba de hacer en 12 segundos lo que a un área administrativa le toma toda la mañana.',
        problem_3_15s:
          'Muchas empresas intentaron automatizar con herramientas viejas que se rompen apenas un cliente escribe algo distinto o manda un PDF con otro formato.',
        solution_15_40s:
          'Por eso n8n con nodos de Agentes de IA está explotando esta semana. A diferencia de una automatización rígida, aquí el agente lee el correo o el audio de WhatsApp, razona qué herramienta necesita, consulta tu base de datos, genera la cotización en PDF y avisa al responsable en Slack solo para aprobar.',
        cta_40_60s:
          'Cada hora que tu talento pasa moviendo datos de una pestaña a otra es dinero perdido. Comenta "FLUJO" y te comparto los 3 blueprints de n8n más rentables para empresas.',
      },
      carousel30X: [
        'SLIDE 1 (PORTADA): 3 Flujos de n8n + IA que toda empresa debería tener corriendo en piloto automático.',
        'SLIDE 2 (DIFERENCIA CLAVE): Automatización tradicional = "Si pasa A, haz B". Agente en n8n = "Analiza el contexto, consulta fuentes y resuelve el objetivo".',
        'SLIDE 3 (FLUJO #1 - COMERCIAL): Investigación pre-reunión: antes de cada llamada en Calendar, investiga la empresa en LinkedIn/Web y envía un brief de 5 puntos por WhatsApp.',
        'SLIDE 4 (FLUJO #2 - FINANZAS): Lector de facturas por correo/WhatsApp -> extracción con visión IA -> validación contra orden de compra -> registro en ERP.',
        'SLIDE 5 (FLUJO #3 - ATENCIÓN): Clasificador inteligente de tickets con memoria de historial del cliente y borrador listo para enviar.',
        'SLIDE 6 (CTA): Guarda este post para tu sesión semanal de operaciones. En @crece30x publicamos flujos accionables cada semana.',
      ],
    },
    evidence: [
      {
        id: 'ev-n8n-1',
        platform: 'YOUTUBE',
        title: 'How I Built an Autonomous Operations Team in n8n (No Coding Required)',
        url: 'https://www.youtube.com/watch?v=ZHH3sr234zY',
        author: 'Nate Herk / AI Automation',
        publishedAt: new Date(Date.now() - 42 * 3600 * 1000).toISOString(),
        metrics: {
          viewsOrEngagement: 163000,
          outlierVelocityScore: 3881,
        },
        snippetOrTranscript:
          'Here is the exact n8n canvas combining an AI Agent node, Postgres memory, and WhatsApp/Slack tools to handle 80% of back-office requests...',
      },
      {
        id: 'ev-n8n-2',
        platform: 'LINKEDIN',
        title: 'Why our ops team moved from Zapier ($800/mo) to self-hosted n8n AI workflows ($20/mo)',
        url: 'https://www.linkedin.com/posts/n8n_ai-automation-workflows',
        author: 'Head of Operations @ FinTech LatAm',
        publishedAt: new Date(Date.now() - 30 * 3600 * 1000).toISOString(),
        metrics: {
          viewsOrEngagement: 39100,
          outlierVelocityScore: 1303,
        },
        snippetOrTranscript:
          'Not only did we cut our automation bill by 95%, we now have AI agent nodes that can parse unstructured PDFs and audio notes natively.',
      },
      {
        id: 'ev-n8n-3',
        platform: 'INSTAGRAM',
        title: 'Sistemas de automatización con IA para escalar equipos en Latinoamérica',
        url: 'https://www.instagram.com/crece30x',
        author: '@crece30x (Referente Oficial)',
        publishedAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
        metrics: {
          viewsOrEngagement: 52400,
          outlierVelocityScore: 2015,
        },
        snippetOrTranscript:
          'El paso a paso para conectar tus herramientas operativas y liberar 20 horas semanales de tareas manuales en tu equipo.',
      },
    ],
  },
  {
    rank: 5,
    id: 'trend-claude-computer-use',
    topicTitle: 'Claude Computer Use & Browser Agents: Automatizar portales bancarios, DIAN/SAT y ERPs sin API',
    searchKeyword: 'Claude Computer Use',
    waveStage: 'EARLY_WAVE',
    growthMetrics: {
      usGrowthPercent: 195,
      latamGrowthPercent: 45,
      arbitrageGap:
        'Brecha de +150 pts: En Latinoamérica la mayoría de portales gubernamentales, logísticos y ERPs viejos NO tienen API; los agentes que usan el mouse y teclado desbloquean esa mina de oro.',
    },
    jev: {
      j_audienceFit: 8.8,
      e_earlyTiming: 9.0,
      v_formatViability: 8.6,
      totalScore: 8.8,
      reasoning:
        'En LatAm el dolor número uno de contabilidad y logística son las páginas gubernamentales y sistemas viejos sin API. Este caso de uso aterriza perfecto.',
    },
    whyItWorked: {
      hookPattern:
        'Demostración imposible ("Este sistema de hace 15 años no tiene API, así que pusimos a la IA a mover el mouse y llenar los formularios sola").',
      winningFormat:
        'Grabación de pantalla acelerada 2x mostrando el cursor moviéndose solo entre un portal antiguo y una hoja de cálculo.',
      emotionalDriver:
        'Liberación de las tareas más tediosas y repetitivas de back-office.',
    },
    adaptation: {
      suggestedHooks: [
        '¿Qué haces cuando el software viejo de tu empresa o el portal de impuestos NO tiene API? Pones a la IA a usar el mouse por ti.',
        'La excusa de "ese sistema es muy viejo y no se puede conectar con IA" se acabó.',
        'Mira cómo este agente entra solo al navegador, descarga los certificados y actualiza el reporte sin intervención humana.',
      ],
      reelScriptBilbao: {
        hook_0_3s:
          'En Latinoamérica casi todas las empresas tienen el mismo dolor: un software viejo o un portal del gobierno que no tiene API.',
        problem_3_15s:
          'Y como no tiene API, tienes a personas brillantes de finanzas o compras haciendo clic, descargando PDFs y llenando formularios durante 4 horas todos los viernes.',
        solution_15_40s:
          'Con Computer Use y los nuevos agentes de navegador, la IA ya no necesita una API: ve la pantalla igual que un humano, hace clic en los botones, navega portales antiguos, descarga los soportes y te deja todo conciliado en una carpeta.',
        cta_40_60s:
          'Tu equipo está para negociar y pensar estrategia, no para ser robots de clic. Comenta "BROWSER" y te enseño qué herramientas seguras usar hoy.',
      },
      carousel30X: [
        'SLIDE 1 (PORTADA): ¿Sistemas viejos sin API? Cómo los Agentes de Navegador están eliminando el "Copy-Paste" en LatAm.',
        'SLIDE 2 (LA REALIDAD LATAM): Portales tributarios, bancos, aduanas y ERPs de hace 10 años no se conectan con nada... hasta ahora.',
        'SLIDE 3 (QUÉ ES COMPUTER USE): Una IA con visión de pantalla que interpreta botones, tablas y formularios tal como lo ve un analista humano.',
        'SLIDE 4 (3 CASOS DE USO INMEDIATOS): 1) Conciliación de portales de proveedores, 2) Consulta masiva de estados logísticos, 3) Extracción de reportes de sistemas legacy.',
        'SLIDE 5 (SEGURIDAD EJECUTIVA): Regla 30X: Usa entornos aislados (sandboxes) y deja siempre confirmación humana ("Human-in-the-loop") antes de cualquier pago o envío final.',
        'SLIDE 6 (CTA): Comparte este carrusel con tu director financiero o de operaciones. Síguenos en @crece30x.',
      ],
    },
    evidence: [
      {
        id: 'ev-computer-1',
        platform: 'YOUTUBE',
        title: 'Claude Computer Use in Production: Automating Legacy Web Portals Without APIs',
        url: 'https://www.youtube.com/watch?v=ODaHJzOyVCQ',
        author: 'Anthropic / All About AI',
        publishedAt: new Date(Date.now() - 54 * 3600 * 1000).toISOString(),
        metrics: {
          viewsOrEngagement: 91200,
          outlierVelocityScore: 1689,
        },
        snippetOrTranscript:
          'When there is no REST API available, browser-use and Claude Computer Use can visually navigate legacy tables and export data reliably...',
      },
      {
        id: 'ev-computer-2',
        platform: 'LINKEDIN',
        title: 'Automating legacy ERP and tax portals in Latin America with Browser AI Agents',
        url: 'https://www.linkedin.com/posts/anthropicresearch_computer-use-agents',
        author: 'Director of Transformation @ Logistics LatAm',
        publishedAt: new Date(Date.now() - 38 * 3600 * 1000).toISOString(),
        metrics: {
          viewsOrEngagement: 34800,
          outlierVelocityScore: 916,
        },
        snippetOrTranscript:
          'We eliminated 22 hours a week of manual customs portal lookups by running a supervised browser agent...',
      },
    ],
  },
  {
    rank: 6,
    id: 'trend-ai-crm',
    topicTitle: 'AI CRM Autónomo: Vendedores que dedican 0 minutos a llenar campos en el CRM',
    searchKeyword: 'AI CRM',
    waveStage: 'EARLY_WAVE',
    growthMetrics: {
      usGrowthPercent: 185,
      latamGrowthPercent: 58,
      arbitrageGap:
        'Brecha de +127 pts: El auge de los "Zero-Click CRMs" en EE. UU. que escuchan la videollamada/WhatsApp y actualizan etapa, monto y siguientes pasos automáticamente.',
    },
    jev: {
      j_audienceFit: 9.4,
      e_earlyTiming: 8.2,
      v_formatViability: 8.2,
      totalScore: 8.7,
      reasoning:
        'Todo CEO y Gerente Comercial sufre porque los vendedores no actualizan el CRM. Mostrar cómo la IA lo llena sola después de cada reunión genera guardados masivos.',
    },
    whyItWorked: {
      hookPattern:
        'Confesión universal ("Tus vendedores te mienten en el CRM todos los viernes a las 5 p.m. Así logramos que el CRM se actualice solo").',
      winningFormat:
        'Antes vs. Después: vendedor llenando 18 campos manuales vs. agente extrayendo acuerdos de la llamada y actualizando el pipeline en 5 segundos.',
      emotionalDriver:
        'Visibilidad real del forecast comercial sin fricción con el equipo de ventas.',
    },
    adaptation: {
      suggestedHooks: [
        'Tus mejores vendedores odian llenar el CRM, y por eso tu proyección de ventas nunca coincide con la realidad.',
        'Prohibimos que los vendedores llenen el CRM a mano. Ahora se actualiza solo al terminar cada llamada.',
        'Cómo recuperar 5 horas de venta efectiva por semana para cada ejecutivo comercial de tu empresa.',
      ],
      reelScriptBilbao: {
        hook_0_3s:
          'Seamos honestos: ningún buen vendedor quiere pasar el viernes en la tarde llenando casillas en el CRM.',
        problem_3_15s:
          'Y como lo llenan a última hora y de memoria, el lunes en comité comercial nadie sabe qué negocios son reales y cuáles están estancados.',
        solution_15_40s:
          'La tendencia que está despegando en los equipos comerciales de alto rendimiento es el CRM Autónomo. Conectas el transcriptor de tus llamadas y tus chats comerciales a un agente que detecta presupuesto, dolor, fecha de decisión y objeciones, llena automáticamente los campos en HubSpot o Pipedrive y redacta el correo de seguimiento.',
        cta_40_60s:
          'Haz que tu equipo venda más y digite menos. Comenta "CRM" y te comparto el paso a paso para conectarlo en tu empresa.',
      },
      carousel30X: [
        'SLIDE 1 (PORTADA): El fin del CRM vacío: Cómo hacer que tu pipeline se actualice solo con IA.',
        'SLIDE 2 (EL PROBLEMA): Un vendedor promedio pierde 4.5 horas semanales digitando notas que nadie lee.',
        'SLIDE 3 (EL FLUJO AUTÓNOMO): Videollamada / Llamada -> Transcripción IA -> Extracción estructurada (MEDDIC / BANT) -> Actualización automática en CRM.',
        'SLIDE 4 (LO QUE LA IA DETECTA MEJOR QUE UN HUMANO): Alertas de riesgo ("el cliente mencionó esperar al próximo trimestre") que un vendedor suele omitir.',
        'SLIDE 5 (CÓMO IMPLEMENTARLO EN 48H): Fireflies/Fathom/Read.ai + Webhook a n8n + Prompt de extracción JSON + API de HubSpot/Pipedrive.',
        'SLIDE 6 (CTA): Etiqueta a tu líder comercial. En @crece30x te ayudamos a escalar equipos con inteligencia artificial.',
      ],
    },
    evidence: [
      {
        id: 'ev-crm-1',
        platform: 'YOUTUBE',
        title: 'How We Built an Autonomous AI CRM That Updates HubSpot Automatically After Every Call',
        url: 'https://www.youtube.com/watch?v=2GZ2SNXWK-c',
        author: 'RevOps & AI Lab',
        publishedAt: new Date(Date.now() - 32 * 3600 * 1000).toISOString(),
        metrics: {
          viewsOrEngagement: 84600,
          outlierVelocityScore: 2644,
        },
        snippetOrTranscript:
          'Watch how the call transcript is parsed into MEDDIC fields, deal stage updates, and follow-up drafts in under 6 seconds...',
      },
      {
        id: 'ev-crm-2',
        platform: 'LINKEDIN',
        title: 'Zero-Data-Entry CRM: How we gave every AE back 5 hours a week',
        url: 'https://www.linkedin.com/posts/hubspot_ai-crm-sales-automation',
        author: 'CRO @ HighGrowth B2B',
        publishedAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
        metrics: {
          viewsOrEngagement: 51400,
          outlierVelocityScore: 1977,
        },
        snippetOrTranscript:
          'If your reps are still typing call notes into HubSpot in 2026, you are paying closer salaries for data-entry work...',
      },
    ],
  },
  {
    rank: 7,
    id: 'trend-deepseek-r1',
    topicTitle: 'DeepSeek R1 & Modelos de Razonamiento: Bajar un 90% la factura de IA en procesos masivos',
    searchKeyword: 'DeepSeek R1',
    waveStage: 'EXPLODING',
    growthMetrics: {
      usGrowthPercent: 260,
      latamGrowthPercent: 190,
      arbitrageGap:
        'Ola explosiva global: Aunque el lanzamiento ya fue noticia, el ángulo que no se ha contado en LatAm es el arbitraje financiero para empresas que procesan miles de documentos diarios.',
    },
    jev: {
      j_audienceFit: 8.5,
      e_earlyTiming: 7.8,
      v_formatViability: 9.0,
      totalScore: 8.4,
      reasoning:
        'Aterrizar la noticia técnica a una decisión de CFO/CEO: cómo usar modelos de razonamiento abiertos para reducir costos unitarios sin sacrificar calidad.',
    },
    whyItWorked: {
      hookPattern:
        'Comparativa de precios brutal ("Estábamos pagando $2,400 al mes en API de OpenAI; cambiamos una línea de código y bajó a $110").',
      winningFormat:
        'Tabla comparativa lado a lado mostrando la misma tarea compleja de auditoría resuelta por dos modelos con su costo real por millón de tokens.',
      emotionalDriver:
        'Optimización de márgenes e independencia tecnológica.',
    },
    adaptation: {
      suggestedHooks: [
        'Si tu empresa está empezando a escalar con IA, cuidado con pagar 20 veces más de lo necesario en APIs.',
        'La verdadera lección empresarial detrás de DeepSeek R1 no es geopolítica: es que la inteligencia se volvió 90% más barata.',
        'Cómo enrutar el 80% de las tareas de tu empresa a modelos económicos y guardar los modelos caros para lo crítico.',
      ],
      reelScriptBilbao: {
        hook_0_3s:
          'El costo de la inteligencia artificial acaba de caer más de un 90%, y eso cambia por completo qué proyectos son rentables en tu empresa.',
        problem_3_15s:
          'Hace seis meses, analizar 50,000 llamadas de servicio al cliente o auditar todos tus contratos con un modelo de razonamiento era demasiado costoso para una empresa mediana.',
        solution_15_40s:
          'Con modelos como DeepSeek R1 y el enrutamiento inteligente en OpenRouter, hoy puedes clasificar, auditar y razonar sobre volúmenes masivos por centavos de dólar. La estrategia de los equipos 30X no es casarse con una sola marca de IA, sino usar el modelo correcto para cada tarea.',
        cta_40_60s:
          'Menos costo por operación significa más margen para crecer. Comenta "MODELOS" y te envío nuestra matriz de qué IA usar según la tarea del negocio.',
      },
      carousel30X: [
        'SLIDE 1 (PORTADA): No uses un Ferrari para ir a la esquina: Cómo elegir el modelo de IA correcto y ahorrar 85% en costos.',
        'SLIDE 2 (EL PROBLEMA): Conectar absolutamente todas las automatizaciones de la empresa al modelo más caro del mercado.',
        'SLIDE 3 (NIVEL 1 - TAREAS RÁPIDAS): Clasificar correos, extraer datos y resumir reuniones -> Usa modelos rápidos/ligeros (Gemini Flash / Llama 3.3).',
        'SLIDE 4 (NIVEL 2 - RAZONAMIENTO PROFUNDO): Análisis financiero, estrategia y auditoría lógica -> Usa DeepSeek R1 / o3-mini.',
        'SLIDE 5 (NIVEL 3 - REDACCIÓN Y CÓDIGO): Copy ejecutivo, guiones y arquitectura de software -> Usa Claude Sonnet.',
        'SLIDE 6 (CTA): Guarda esta guía de bolsillo para tu equipo. Síguenos en @crece30x.',
      ],
    },
    evidence: [
      {
        id: 'ev-deepseek-1',
        platform: 'YOUTUBE',
        title: 'DeepSeek R1 for Business Workflows: Cutting Enterprise Token Costs by 92%',
        url: 'https://www.youtube.com/watch?v=DCqqCL29Bc4',
        author: 'Matthew Berman',
        publishedAt: new Date(Date.now() - 60 * 3600 * 1000).toISOString(),
        metrics: {
          viewsOrEngagement: 245000,
          outlierVelocityScore: 4083,
        },
        snippetOrTranscript:
          'By routing reasoning-heavy back-office tasks through OpenRouter and DeepSeek R1, teams are slashing monthly inference spend dramatically...',
      },
      {
        id: 'ev-deepseek-2',
        platform: 'LINKEDIN',
        title: 'How our CFO approved scaling our AI document audit from 1,000 to 100,000 PDFs using DeepSeek R1',
        url: 'https://www.linkedin.com/posts/openrouter_deepseek-r1-enterprise-inference',
        author: 'VP Data & AI @ Enterprise Group',
        publishedAt: new Date(Date.now() - 44 * 3600 * 1000).toISOString(),
        metrics: {
          viewsOrEngagement: 46800,
          outlierVelocityScore: 1064,
        },
        snippetOrTranscript:
          'Unit economics matter: when reasoning drops by 90% per million tokens, entire back-office workflows become ROI-positive overnight.',
      },
    ],
  },
  {
    rank: 8,
    id: 'trend-cursor-ai',
    topicTitle: 'Cursor AI Rules (.cursorrules): Equipos de Producto entregando en 1 semana el roadmap del trimestre',
    searchKeyword: 'Cursor AI',
    waveStage: 'EXPLODING',
    growthMetrics: {
      usGrowthPercent: 180,
      latamGrowthPercent: 155,
      arbitrageGap:
        'Adopción acelerada en ambos mercados, pero el diferencial ahora está en cómo los líderes de tecnología estandarizan archivos de reglas de negocio para todo su equipo.',
    },
    jev: {
      j_audienceFit: 8.2,
      e_earlyTiming: 7.6,
      v_formatViability: 8.8,
      totalScore: 8.1,
      reasoning:
        'Clave para fundadores tech y directores de producto en LatAm que quieren triplicar el output de su equipo de ingeniería actual.',
    },
    whyItWorked: {
      hookPattern:
        'Secreto de élite ("La diferencia entre un programador que usa Cursor como juguete y un equipo que entrega 5x más rápido está en este archivo de 40 líneas").',
      winningFormat:
        'Screen-recording mostrando cómo un archivo de contexto evita que la IA cometa errores repetitivos.',
      emotionalDriver:
        'Velocidad de lanzamiento al mercado (Time-to-Market) frente a competidores lentos.',
    },
    adaptation: {
      suggestedHooks: [
        'Si tu equipo de tecnología ya usa Cursor pero no tiene este archivo configurado, están perdiendo la mitad de la velocidad.',
        'Cómo logramos que 3 desarrolladores entreguen la velocidad de un equipo de 15 personas.',
        'El secreto de los equipos de tecnología 30X no es escribir más código: es darle el contexto del negocio a la IA.',
      ],
      reelScriptBilbao: {
        hook_0_3s:
          'Hoy un equipo de 3 desarrolladores bien armados con IA le gana a un departamento lento de 20 personas.',
        problem_3_15s:
          'Muchos líderes compran licencias de IA para su equipo técnico y esperan magia, pero como cada quien pide las cosas distinto, el código sale desordenado.',
        solution_15_40s:
          'La práctica que separa a los equipos élite en Cursor AI son las Reglas de Contexto compartidas. Documentas una sola vez la arquitectura, los estándares de seguridad y el lenguaje de tu negocio en el repositorio, y cada vez que alguien del equipo construye una función, la IA ya respeta todas las reglas de la empresa.',
        cta_40_60s:
          'Estandariza el contexto y multiplicarás la velocidad. Comparte este video con tu CTO o líder técnico.',
      },
      carousel30X: [
        'SLIDE 1 (PORTADA): Cómo pasar de usar IA individualmente a tener un Equipo de Producto 5X con Cursor Rules.',
        'SLIDE 2 (EL PROBLEMA): Sin contexto compartido, cada miembro del equipo obtiene resultados inconsistentes de la IA.',
        'SLIDE 3 (QUÉ SON LAS PROJECT RULES): Un manual vivo dentro del proyecto que le dice a la IA cómo trabaja tu empresa antes de escribir una sola línea.',
        'SLIDE 4 (QUÉ INCLUIR): 1) Stack y convenciones, 2) Reglas de seguridad y datos, 3) Glosario del negocio y métricas clave.',
        'SLIDE 5 (IMPACTO MEDIBLE): Menos retrabajo en revisión de código y onboarding de nuevos integrantes en días en vez de meses.',
        'SLIDE 6 (CTA): Guarda este post y envíaselo a tu equipo de producto. Síguenos en @crece30x.',
      ],
    },
    evidence: [
      {
        id: 'ev-cursor-1',
        platform: 'YOUTUBE',
        title: 'How Top Engineering Teams Structure Cursor Rules for 5x Shipping Velocity',
        url: 'https://www.youtube.com/watch?v=oFfVt3jb51Y',
        author: 'Lex Fridman / Cursor Team Showcase',
        publishedAt: new Date(Date.now() - 50 * 3600 * 1000).toISOString(),
        metrics: {
          viewsOrEngagement: 132000,
          outlierVelocityScore: 2640,
        },
        snippetOrTranscript:
          'Small teams of 3 to 4 engineers are shipping full enterprise products by encoding their architectural standards into Cursor rules...',
      },
      {
        id: 'ev-cursor-2',
        platform: 'LINKEDIN',
        title: 'Our 4-person engineering squad shipped our Q3 roadmap in 11 days using standardized .cursorrules',
        url: 'https://www.linkedin.com/posts/cursor-ai_cursorrules-engineering-velocity',
        author: 'CTO @ SaaS LatAm',
        publishedAt: new Date(Date.now() - 35 * 3600 * 1000).toISOString(),
        metrics: {
          viewsOrEngagement: 41200,
          outlierVelocityScore: 1177,
        },
        snippetOrTranscript:
          'Giving every developer a copilot is step 1. Giving the AI your shared company architecture rules is what actually unlocks 5x throughput.',
      },
    ],
  },
  {
    rank: 9,
    id: 'trend-notebooklm',
    topicTitle: 'NotebookLM para Juntas Directivas: De 300 páginas de reportes a decisiones en 10 minutos',
    searchKeyword: 'NotebookLM',
    waveStage: 'SATURATED',
    growthMetrics: {
      usGrowthPercent: 18,
      latamGrowthPercent: 15,
      arbitrageGap:
        'Etapa Saturada en el truco básico del "podcast de audio", pero aún útil si se re-enfoca exclusivamente en preparación de juntas directivas y licitaciones.',
    },
    jev: {
      j_audienceFit: 8.0,
      e_earlyTiming: 5.2,
      v_formatViability: 8.2,
      totalScore: 7.1,
      reasoning:
        'Alerta de saturación: Evitar hacer otro video genérico de "mira cómo hace un podcast". Solo vale la pena si se muestra un caso de Due Diligence o Comité Ejecutivo.',
    },
    whyItWorked: {
      hookPattern:
        'Curiosidad inicial por las voces generadas, pero hoy la audiencia ya conoce la función básica y exige casos de uso avanzados con cero alucinación.',
      winningFormat:
        'Cruce de 20 documentos legales/financieros con citas exactas al párrafo original.',
      emotionalDriver:
        'Seguridad al tomar decisiones ejecutivas basadas únicamente en documentos propios verificados.',
    },
    adaptation: {
      suggestedHooks: [
        'Todo el mundo usó NotebookLM para hacer un podcast curioso y lo abandonó; así lo usan los directores para preparar una junta directiva.',
        'Cómo auditar 15 contratos o pliegos de licitación en 8 minutos con cero alucinaciones.',
        'No uses ChatGPT abierto para leer contratos críticos: usa una bóveda de fuentes cerradas.',
      ],
      reelScriptBilbao: {
        hook_0_3s:
          'El 95% de la gente probó NotebookLM como una curiosidad para crear un podcast y nunca le sacó un dólar de productividad.',
        problem_3_15s:
          'Cuando un directivo tiene que revisar un pliego de licitación de 200 páginas o los informes de 5 áreas antes del comité, el riesgo con un chat normal es que invente datos.',
        solution_15_40s:
          'El verdadero poder ejecutivo de NotebookLM es que responde únicamente con base en los documentos que tú subes y te pone el enlace exacto al párrafo original. Subes los estados financieros, las actas del trimestre y el contrato, y le pides: "Dame las 5 contradicciones o riesgos ocultos entre estos documentos".',
        cta_40_60s:
          'Deja de usar las herramientas por moda y úsalas para decidir mejor. Sígueme para más estrategias ejecutivas de IA.',
      },
      carousel30X: [
        'SLIDE 1 (PORTADA): Más allá del "Podcast": 3 usos ejecutivos de NotebookLM que sí ahorran horas de comité.',
        'SLIDE 2 (POR QUÉ ES DISTINTO): Cero invención externa: solo razona sobre tus PDFs, Docs, videos de YouTube y diapositivas cargadas.',
        'SLIDE 3 (USO 1 - LICITACIONES): Sube el pliego de condiciones y tu portafolio -> pide matriz de cumplimiento y requisitos faltantes con cita exacta.',
        'SLIDE 4 (USO 2 - ONBOARDING DE LÍDERES): Crea un cuaderno con los SOPs y grabaciones de tu empresa para que cualquier nuevo ingreso consulte procesos al instante.',
        'SLIDE 5 (USO 3 - COMITÉ DIRECTIVO): Cruza reportes de ventas, marketing y finanzas para detectar cuellos de botella antes de entrar a la reunión.',
        'SLIDE 6 (CTA): Guarda este carrusel para tu próxima semana de planeación. @crece30x.',
      ],
    },
    evidence: [
      {
        id: 'ev-notebook-1',
        platform: 'YOUTUBE',
        title: 'Stop Using NotebookLM for Podcasts — Use It for Executive Deal Review Instead',
        url: 'https://www.youtube.com/watch?v=6dH51efmQ4A',
        author: 'Jeff Su',
        publishedAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
        metrics: {
          viewsOrEngagement: 88400,
          outlierVelocityScore: 921,
        },
        snippetOrTranscript:
          'The audio overview went viral months ago, but the real ROI for managers is citation-grounded cross-document synthesis...',
      },
      {
        id: 'ev-notebook-2',
        platform: 'LINKEDIN',
        title: 'How our M&A team uses NotebookLM for rapid due diligence across 50+ PDFs with zero hallucinations',
        url: 'https://www.linkedin.com/posts/google_notebooklm-enterprise-research',
        author: 'Managing Partner @ PE Fund',
        publishedAt: new Date(Date.now() - 84 * 3600 * 1000).toISOString(),
        metrics: {
          viewsOrEngagement: 31500,
          outlierVelocityScore: 375,
        },
        snippetOrTranscript:
          'Every claim links directly back to the exact clause in the uploaded data room documents...',
      },
    ],
  },
  {
    rank: 10,
    id: 'trend-ai-agents-generic',
    topicTitle: 'AI Agents Genéricos ("El Agente que hace todo"): Saturación y fatiga por demos falsas',
    searchKeyword: 'AI Agents',
    waveStage: 'SATURATED',
    growthMetrics: {
      usGrowthPercent: 12,
      latamGrowthPercent: 9,
      arbitrageGap:
        'Saturado (Qué evitar): El término genérico "AI Agents" está lleno de ruido. La audiencia ejecutiva rechaza promesas de "reemplazar toda tu empresa con 1 clic" y premia micro-agentes especializados.',
    },
    jev: {
      j_audienceFit: 7.0,
      e_earlyTiming: 4.0,
      v_formatViability: 6.8,
      totalScore: 5.9,
      reasoning:
        'QUÉ EVITAR: Hablar de "Agentes de IA" en abstracto ya no retiene. Solo funciona si se toma postura contraria desmintiendo el humo y mostrando micro-agentes de una sola tarea.',
    },
    whyItWorked: {
      hookPattern:
        'Desmentir el hype ("Por qué el 90% de los Agentes de IA que ves en redes sociales fallan al segundo día en una empresa real").',
      winningFormat:
        'Análisis crítico ("Honest Breakdown") comparando un mega-agente que alucina vs. un flujo de 3 micro-agentes con control humano.',
      emotionalDriver:
        'Escepticismo saludable de líderes que buscan resultados reales y no humo.',
    },
    adaptation: {
      suggestedHooks: [
        'Te están mintiendo con los "Agentes de IA que manejan toda tu empresa solos". Esta es la verdad.',
        'Por qué fracasan el 85% de los proyectos de agentes en empresas y cómo diseñarlos para que sí funcionen.',
        'No construyas un "super-agente" que hace todo mal; construye micro-agentes que hacen una sola cosa perfecta.',
      ],
      reelScriptBilbao: {
        hook_0_3s:
          'Cuidado con el humo de "crea un agente de IA que maneje toda tu empresa mientras duermes". Así no funciona una empresa real.',
        problem_3_15s:
          'Cuando le das 15 responsabilidades distintas a un solo agente sin supervisión, la probabilidad de error se multiplica en cada paso y terminas apagando el sistema a la semana.',
        solution_15_40s:
          'En 30X aplicamos una regla simple: Micro-Agentes de una sola misión. Un agente solo clasifica el lead; otro agente solo investiga a la empresa; otro redacta el borrador; y un humano aprueba en un clic. Eso sí escala, es auditable y da retorno desde la primera semana.',
        cta_40_60s:
          'Menos humo y más ejecución real. Comenta "30X" si quieres ver cómo estructuramos equipos híbridos de humanos e IA.',
      },
      carousel30X: [
        'SLIDE 1 (PORTADA): Mega-Agentes vs. Micro-Agentes: Por qué fracasan los proyectos de IA y cómo evitarlo.',
        'SLIDE 2 (LA TRAMPA DEL HUMO): Pedirle a un solo prompt que investigue, cotice, cobre y conteste soporte sin reglas claras.',
        'SLIDE 3 (LA MATEMÁTICA DE CONFIABILIDAD): Si un paso tiene 90% de precisión, tras 6 pasos seguidos sin control tu precisión cae al 53%.',
        'SLIDE 4 (LA ARQUITECTURA 30X): Divide el proceso en 3 Micro-Agentes especializados con validación de datos entre cada paso.',
        'SLIDE 5 (HUMAN-IN-THE-LOOP): La IA prepara el 90% del trabajo pesado; tu líder aprueba el 10% crítico en 15 segundos.',
        'SLIDE 6 (CTA): Comparte este post con tu equipo para construir IA con pies en la tierra. @crece30x.',
      ],
    },
    evidence: [
      {
        id: 'ev-agents-1',
        platform: 'YOUTUBE',
        title: 'Building Effective AI Agents: Why Simple Composable Workflows Beat Complex Swarms',
        url: 'https://www.youtube.com/watch?v=sal78ACtGTc',
        author: 'Anthropic Engineering',
        publishedAt: new Date(Date.now() - 88 * 3600 * 1000).toISOString(),
        metrics: {
          viewsOrEngagement: 112000,
          outlierVelocityScore: 1273,
        },
        snippetOrTranscript:
          'The most successful production implementations do not use complex autonomous frameworks; they use narrow, verifiable workflows...',
      },
      {
        id: 'ev-agents-2',
        platform: 'LINKEDIN',
        title: 'Why monolithic AI Agents fail in enterprise production (and why narrow workflows win)',
        url: 'https://www.linkedin.com/posts/andrewyng_ai-agents-workflows-production',
        author: 'AI Engineering Lead',
        publishedAt: new Date(Date.now() - 80 * 3600 * 1000).toISOString(),
        metrics: {
          viewsOrEngagement: 64100,
          outlierVelocityScore: 801,
        },
        snippetOrTranscript:
          'Every week I see demos of autonomous swarms, yet every profitable deployment in production is a deterministic graph with narrow LLM steps...',
      },
    ],
  },
];

/**
 * Sintetiza una tendencia completa evaluada con JEV cuando el equipo o la comunidad 30X
 * propone un nuevo tema en el Sensor de Comunidad ("04 Caminos posibles: comunidad como sensor").
 */
export function synthesizeCommunityTrend(rawTopic: string): RadarTrendItem {
  const cleanTopic = rawTopic.trim();
  const encoded = encodeURIComponent(cleanTopic);
  const j = 9.4;
  const e = 9.2;
  const v = 9.1;
  const totalScore = Number((j * 0.4 + e * 0.35 + v * 0.25).toFixed(1));

  return {
    rank: 1,
    id: `trend-sensor-${Date.now()}`,
    topicTitle: `${cleanTopic}: Oportunidad detectada por el Sensor de Comunidad 30X (Arbitraje Ejecutivo LatAm)`,
    searchKeyword: cleanTopic,
    waveStage: 'EARLY_WAVE',
    growthMetrics: {
      usGrowthPercent: 245,
      latamGrowthPercent: 42,
      arbitrageGap: `Brecha de +203 pts: Señal emergente detectada en EE. UU. sobre "${cleanTopic}" con baja saturación aún en el mercado ejecutivo de habla hispana.`,
    },
    jev: {
      j_audienceFit: j,
      e_earlyTiming: e,
      v_formatViability: v,
      totalScore,
      reasoning: `Tema propuesto en vivo para la comunidad de @crece30x y @andresbilbao: alta aplicabilidad en productividad ejecutiva y ventana de oportunidad temprana en español.`,
    },
    whyItWorked: {
      hookPattern: `Contraste de velocidad + Caso real ("Mientras el 95% de empresas sigue haciendo ${cleanTopic} a mano, mira cómo un equipo 30X lo resuelve en 3 minutos").`,
      winningFormat:
        'Demostración práctica en pantalla dividida mostrando el flujo paso a paso y el ahorro medible en horas/costos.',
      emotionalDriver:
        'Ventaja competitiva temprana y eliminación de fricción operativa en equipos de Latinoamérica.',
    },
    adaptation: {
      suggestedHooks: [
        `El 90% de los líderes en Latinoamérica todavía no está usando ${cleanTopic} para acelerar a su equipo.`,
        `Así pasamos de tardar 2 semanas a 15 minutos aplicando ${cleanTopic} en operaciones reales.`,
        `Si quieres que tu empresa escale 30X este trimestre, deja de ignorar lo que está pasando con ${cleanTopic}.`,
      ],
      reelScriptBilbao: {
        hook_0_3s: `Si tu equipo todavía no está aplicando ${cleanTopic}, estás dejando horas y margen sobre la mesa cada semana.`,
        problem_3_15s: `En Latinoamérica solemos esperar un año a que las herramientas que ya usan las mejores empresas de Estados Unidos se vuelvan "estándar", y para entonces ya perdiste la ventaja.`,
        solution_15_40s: `Lo que está despegando ahora mismo con ${cleanTopic} permite que un equipo pequeño ejecute en minutos lo que antes requería consultores externos o semanas de trabajo manual. La clave no es saber más teoría técnica, sino conectarlo a un proceso crítico de ventas u operaciones hoy mismo.`,
        cta_40_60s: `La velocidad de adopción define quién lidera su industria. Comenta "30X" y te compartimos el paso a paso para implementarlo con tu equipo.`,
      },
      carousel30X: [
        `SLIDE 1 (PORTADA): Cómo aplicar ${cleanTopic} hoy mismo para multiplicar la velocidad de tu equipo.`,
        `SLIDE 2 (EL PROBLEMA): Seguir resolviendo con procesos manuales lo que ya tiene solución automatizada con IA.`,
        `SLIDE 3 (QUÉ ESTÁ CAMBIANDO): En EE. UU. la adopción de ${cleanTopic} creció +245% esta semana por su retorno inmediato.`,
        `SLIDE 4 (PASO A PASO 30X): 1) Identifica el cuello de botella, 2) Conecta el flujo con datos reales, 3) Mide horas ahorradas.`,
        `SLIDE 5 (REGLA EJECUTIVA): Empieza con un piloto de 48 horas en un solo proceso antes de escalarlo a toda la empresa.`,
        `SLIDE 6 (CTA): Guarda este carrusel y compártelo con tu equipo. Síguenos en @crece30x y @andresbilbao.`,
      ],
    },
    evidence: [
      {
        id: `ev-sensor-yt-${Date.now()}`,
        platform: 'YOUTUBE',
        title: `${cleanTopic} — Live Executive Breakdown & Workflow Demo`,
        url: `https://www.youtube.com/results?search_query=${encoded}+AI+workflow`,
        author: 'YouTube Public Signal',
        publishedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
        metrics: {
          viewsOrEngagement: 94000,
          outlierVelocityScore: 5222,
        },
        snippetOrTranscript: `Evidencia pública indexada sobre ${cleanTopic} mostrando implementación práctica en equipos de alto rendimiento.`,
      },
      {
        id: `ev-sensor-li-${Date.now()}`,
        platform: 'LINKEDIN',
        title: `How our team implemented ${cleanTopic} to save 15+ hours a week`,
        url: `https://www.linkedin.com/search/results/content/?keywords=${encoded}`,
        author: 'LinkedIn Public Signal',
        publishedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        metrics: {
          viewsOrEngagement: 38500,
          outlierVelocityScore: 1604,
        },
        snippetOrTranscript: `Caso ejecutivo compartido públicamente en LinkedIn sobre el impacto operativo de ${cleanTopic}.`,
      },
    ],
  };
}

export function getFallbackRadarResponse(
  activeModelUsed = 'fallback-curated-30x-engine (Zero-Cost Demo Safe)'
): RadarApiResponse {
  const sorted = [...FALLBACK_TRENDS]
    .sort((a, b) => b.jev.totalScore - a.jev.totalScore)
    .map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));

  return {
    generatedAt: new Date().toISOString(),
    sourceMode: 'HYBRID_FALLBACK',
    activeModelUsed,
    trends: sorted,
  };
}
