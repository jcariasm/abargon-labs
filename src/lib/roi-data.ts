export interface Process {
  id: string;
  name: string;
  description: string;
  avgHoursMonth: number;
  avgCostPerHour: number;
  errorRatePct: number;
  aiReductionPct: number;
  aiAccuracyGain: number;
  setupCost: number;
  monthlyCost: number;
}

export interface Industry {
  id: string;
  name: string;
  icon: string;
  color: string;
  processes: Process[];
}

export const industries: Industry[] = [
  {
    id: "retail",
    name: "Retail",
    icon: "🏪",
    color: "#3b82f6",
    processes: [
      {
        id: "inventory",
        name: "Gestión de inventario",
        description: "Pronóstico de demanda, reorden automático, detección de merma",
        avgHoursMonth: 160,
        avgCostPerHour: 350,
        errorRatePct: 12,
        aiReductionPct: 65,
        aiAccuracyGain: 40,
        setupCost: 450000,
        monthlyCost: 25000,
      },
      {
        id: "pricing",
        name: "Optimización de precios",
        description: "Pricing dinámico, análisis competitivo, elasticidad de demanda",
        avgHoursMonth: 80,
        avgCostPerHour: 500,
        errorRatePct: 15,
        aiReductionPct: 70,
        aiAccuracyGain: 35,
        setupCost: 350000,
        monthlyCost: 20000,
      },
      {
        id: "customer-service",
        name: "Atención al cliente",
        description: "Chatbot, clasificación de tickets, respuestas automatizadas",
        avgHoursMonth: 320,
        avgCostPerHour: 200,
        errorRatePct: 8,
        aiReductionPct: 55,
        aiAccuracyGain: 25,
        setupCost: 250000,
        monthlyCost: 15000,
      },
      {
        id: "revenue-leak",
        name: "Detección de fugas de ingreso",
        description: "Errores de cobro, descuentos no autorizados, shrinkage digital",
        avgHoursMonth: 60,
        avgCostPerHour: 600,
        errorRatePct: 18,
        aiReductionPct: 75,
        aiAccuracyGain: 50,
        setupCost: 300000,
        monthlyCost: 18000,
      },
    ],
  },
  {
    id: "banca",
    name: "Banca / Fintech",
    icon: "🏦",
    color: "#10b981",
    processes: [
      {
        id: "kyc",
        name: "KYC / Compliance",
        description: "Verificación de identidad, PLD, onboarding regulatorio",
        avgHoursMonth: 200,
        avgCostPerHour: 450,
        errorRatePct: 5,
        aiReductionPct: 60,
        aiAccuracyGain: 30,
        setupCost: 500000,
        monthlyCost: 30000,
      },
      {
        id: "credit-scoring",
        name: "Scoring crediticio",
        description: "Evaluación de riesgo, decisión crediticia, bureau alternativo",
        avgHoursMonth: 120,
        avgCostPerHour: 550,
        errorRatePct: 10,
        aiReductionPct: 80,
        aiAccuracyGain: 45,
        setupCost: 600000,
        monthlyCost: 35000,
      },
      {
        id: "fraud",
        name: "Detección de fraude",
        description: "Monitoreo transaccional, anomalías, alertas en tiempo real",
        avgHoursMonth: 160,
        avgCostPerHour: 500,
        errorRatePct: 3,
        aiReductionPct: 70,
        aiAccuracyGain: 60,
        setupCost: 550000,
        monthlyCost: 28000,
      },
      {
        id: "onboarding",
        name: "Onboarding digital",
        description: "Apertura de cuenta, validación documental, biométricos",
        avgHoursMonth: 240,
        avgCostPerHour: 300,
        errorRatePct: 8,
        aiReductionPct: 65,
        aiAccuracyGain: 35,
        setupCost: 400000,
        monthlyCost: 22000,
      },
    ],
  },
  {
    id: "sofom",
    name: "SOFOM / Factoraje",
    icon: "📊",
    color: "#8b5cf6",
    processes: [
      {
        id: "scoring-sofom",
        name: "Scoring y decisión crediticia",
        description: "Evaluación de riesgo de facturas, scoring de cedentes y deudores",
        avgHoursMonth: 100,
        avgCostPerHour: 600,
        errorRatePct: 12,
        aiReductionPct: 85,
        aiAccuracyGain: 50,
        setupCost: 500000,
        monthlyCost: 30000,
      },
      {
        id: "collections",
        name: "Cobranza automatizada",
        description: "Gestión de cartera vencida, WhatsApp bots, estrategias por segmento",
        avgHoursMonth: 200,
        avgCostPerHour: 250,
        errorRatePct: 15,
        aiReductionPct: 60,
        aiAccuracyGain: 40,
        setupCost: 350000,
        monthlyCost: 20000,
      },
      {
        id: "doc-processing",
        name: "Procesamiento documental",
        description: "OCR de facturas, validación SAT, conciliación automática",
        avgHoursMonth: 180,
        avgCostPerHour: 300,
        errorRatePct: 10,
        aiReductionPct: 75,
        aiAccuracyGain: 45,
        setupCost: 300000,
        monthlyCost: 18000,
      },
      {
        id: "risk",
        name: "Monitoreo de riesgo",
        description: "Alertas tempranas, concentración de cartera, análisis de tendencias",
        avgHoursMonth: 80,
        avgCostPerHour: 700,
        errorRatePct: 8,
        aiReductionPct: 70,
        aiAccuracyGain: 55,
        setupCost: 450000,
        monthlyCost: 25000,
      },
    ],
  },
];

export function calculateROI(process: Process, volumeMultiplier: number = 1) {
  const currentMonthlyCost = process.avgHoursMonth * process.avgCostPerHour * volumeMultiplier;
  const errorCostMonthly = currentMonthlyCost * (process.errorRatePct / 100);
  const totalCurrentMonthly = currentMonthlyCost + errorCostMonthly;

  const aiMonthlyCost = process.monthlyCost * volumeMultiplier;
  const reducedHumanCost = currentMonthlyCost * (1 - process.aiReductionPct / 100);
  const reducedErrorCost = errorCostMonthly * (1 - process.aiAccuracyGain / 100);
  const totalAiMonthly = aiMonthlyCost + reducedHumanCost + reducedErrorCost;

  const monthlySavings = totalCurrentMonthly - totalAiMonthly;
  const annualSavings = monthlySavings * 12;
  const setupCost = process.setupCost;
  const paybackMonths = monthlySavings > 0 ? Math.ceil(setupCost / monthlySavings) : Infinity;
  const roi3yr = ((annualSavings * 3 - setupCost) / setupCost) * 100;

  return {
    currentMonthlyCost: Math.round(totalCurrentMonthly),
    aiMonthlyCost: Math.round(totalAiMonthly),
    monthlySavings: Math.round(monthlySavings),
    annualSavings: Math.round(annualSavings),
    setupCost,
    paybackMonths,
    roi3yr: Math.round(roi3yr),
    reductionPct: process.aiReductionPct,
    accuracyGain: process.aiAccuracyGain,
  };
}
