export interface Fintech {
  name: string;
  category: string;
  description: string;
  regulation: "Regulada" | "En proceso" | "No regulada";
  founded: number;
  hq: string;
  funding: string;
  techStack?: string;
}

export const categories = [
  "Todos", "Pagos", "Crédito", "Neobancos", "Seguros", "Inversión",
  "Remesas", "Infraestructura", "Crypto", "Factoraje",
];

export const fintechs: Fintech[] = [
  { name: "Clip", category: "Pagos", description: "Terminal de cobro móvil para PyMEs y comercios", regulation: "Regulada", founded: 2012, hq: "CDMX", funding: "$500M+ USD", techStack: "AWS, Kotlin, React" },
  { name: "Konfío", category: "Crédito", description: "Créditos para PyMEs basados en data alternativa", regulation: "Regulada", founded: 2014, hq: "CDMX", funding: "$400M+ USD", techStack: "AWS, Python, React" },
  { name: "Stori", category: "Neobancos", description: "Tarjeta de crédito digital para no bancarizados", regulation: "Regulada", founded: 2018, hq: "CDMX", funding: "$250M+ USD", techStack: "GCP, Go, React Native" },
  { name: "Bitso", category: "Crypto", description: "Exchange de criptomonedas líder en LatAm", regulation: "En proceso", founded: 2014, hq: "CDMX", funding: "$400M+ USD", techStack: "AWS, Go, React" },
  { name: "Kueski", category: "Crédito", description: "BNPL y préstamos personales en línea", regulation: "Regulada", founded: 2012, hq: "Guadalajara", funding: "$200M+ USD", techStack: "AWS, Python, Angular" },
  { name: "Nu México", category: "Neobancos", description: "Banco digital del grupo Nubank Brasil", regulation: "Regulada", founded: 2019, hq: "CDMX", funding: "Parte de Nubank ($30B mkt cap)", techStack: "AWS, Clojure, Flutter" },
  { name: "Albo", category: "Neobancos", description: "Cuenta digital con tarjeta de débito", regulation: "Regulada", founded: 2016, hq: "CDMX", funding: "$50M+ USD" },
  { name: "Credijusto", category: "Crédito", description: "Créditos empresariales, ahora fusionado con Covalto", regulation: "Regulada", founded: 2015, hq: "CDMX", funding: "$500M+ USD" },
  { name: "Oyster Financial", category: "Pagos", description: "Infraestructura de pagos cross-border para LatAm", regulation: "En proceso", founded: 2020, hq: "CDMX", funding: "$20M+ USD" },
  { name: "Conekta", category: "Pagos", description: "Pasarela de pagos para e-commerce México", regulation: "Regulada", founded: 2012, hq: "CDMX", funding: "$30M+ USD", techStack: "AWS, Ruby, React" },
  { name: "Fondeadora", category: "Neobancos", description: "Banco digital con tarjeta y cashback", regulation: "Regulada", founded: 2018, hq: "CDMX", funding: "$50M+ USD" },
  { name: "Coru", category: "Crédito", description: "Comparador y originador de productos financieros", regulation: "No regulada", founded: 2016, hq: "CDMX", funding: "$15M+ USD" },
  { name: "Kavak", category: "Crédito", description: "Financiamiento y compra-venta de autos usados", regulation: "En proceso", founded: 2016, hq: "CDMX", funding: "$900M+ USD" },
  { name: "GBM+", category: "Inversión", description: "Plataforma de inversión en bolsa para retail", regulation: "Regulada", founded: 2017, hq: "CDMX", funding: "Parte de GBM (establecido)" },
  { name: "Flink", category: "Inversión", description: "App de inversión fractional en acciones US/MX", regulation: "Regulada", founded: 2017, hq: "CDMX", funding: "$30M+ USD" },
  { name: "Covalto", category: "Neobancos", description: "Banco digital para empresas (ex-Credijusto)", regulation: "Regulada", founded: 2015, hq: "CDMX", funding: "$500M+ USD" },
  { name: "Arcus", category: "Infraestructura", description: "API de pagos de servicios (adquirida por Mastercard)", regulation: "Regulada", founded: 2014, hq: "CDMX", funding: "Adquirida" },
  { name: "Vexi", category: "Neobancos", description: "Tarjeta de crédito para jóvenes y primer crédito", regulation: "Regulada", founded: 2018, hq: "CDMX", funding: "$15M+ USD" },
  { name: "Zell (Tribal)", category: "Crédito", description: "Crédito empresarial cross-border para LatAm", regulation: "En proceso", founded: 2020, hq: "CDMX", funding: "$60M+ USD" },
  { name: "Ualá", category: "Neobancos", description: "Tarjeta prepagada y servicios financieros (argentina en MX)", regulation: "En proceso", founded: 2020, hq: "CDMX", funding: "$544M USD (global)" },
  { name: "Bien para Bien", category: "Crédito", description: "Créditos hipotecarios y personales online", regulation: "Regulada", founded: 2014, hq: "CDMX", funding: "$30M+ USD" },
  { name: "UnDosTres", category: "Pagos", description: "Plataforma de pagos de servicios y recargas", regulation: "Regulada", founded: 2014, hq: "CDMX", funding: "$15M+ USD" },
  { name: "Lendera", category: "Factoraje", description: "Factoraje digital para PyMEs", regulation: "No regulada", founded: 2017, hq: "CDMX", funding: "$10M+ USD" },
  { name: "Druo", category: "Infraestructura", description: "Open banking y account-to-account payments", regulation: "En proceso", founded: 2020, hq: "CDMX", funding: "$5M+ USD" },
  { name: "Swap", category: "Infraestructura", description: "Banking-as-a-service para empresas fintech", regulation: "Regulada", founded: 2019, hq: "CDMX", funding: "$10M+ USD" },
  { name: "Facturedo", category: "Factoraje", description: "Factoraje electrónico para cadenas de suministro", regulation: "No regulada", founded: 2016, hq: "Monterrey", funding: "$5M+ USD" },
  { name: "Cumplo", category: "Crédito", description: "Marketplace de crédito P2P para empresas", regulation: "No regulada", founded: 2012, hq: "CDMX", funding: "$15M+ USD" },
  { name: "Yo Te Presto", category: "Crédito", description: "Plataforma de préstamos entre personas (P2P)", regulation: "Regulada", founded: 2012, hq: "CDMX", funding: "$10M+ USD" },
  { name: "a]lestra Fintech", category: "Infraestructura", description: "Soluciones cloud para el sector financiero", regulation: "No regulada", founded: 2018, hq: "Monterrey", funding: "Corporativo" },
  { name: "SR Pago", category: "Pagos", description: "Soluciones de cobro para comercios (adq. Clip)", regulation: "Regulada", founded: 2013, hq: "CDMX", funding: "Adquirida" },
  { name: "Klar", category: "Neobancos", description: "Tarjeta de crédito y débito 100% digital", regulation: "En proceso", founded: 2019, hq: "CDMX", funding: "$100M+ USD" },
  { name: "Minu", category: "Crédito", description: "Adelanto de nómina para empleados", regulation: "No regulada", founded: 2019, hq: "CDMX", funding: "$20M+ USD" },
  { name: "Assured", category: "Seguros", description: "Seguros embebidos via API para plataformas", regulation: "Regulada", founded: 2020, hq: "CDMX", funding: "$5M+ USD" },
  { name: "Crabi", category: "Seguros", description: "Seguros de auto 100% digitales", regulation: "Regulada", founded: 2019, hq: "CDMX", funding: "$10M+ USD" },
  { name: "Clupp", category: "Seguros", description: "Seguro de auto basado en telemática", regulation: "Regulada", founded: 2018, hq: "CDMX", funding: "$5M+ USD" },
  { name: "Remitly", category: "Remesas", description: "Envío de remesas internacionales digitales", regulation: "Regulada", founded: 2011, hq: "Global/MX", funding: "Pública (NASDAQ)" },
  { name: "Félix Pago", category: "Remesas", description: "Remesas vía WhatsApp", regulation: "En proceso", founded: 2021, hq: "CDMX", funding: "$5M+ USD" },
];
