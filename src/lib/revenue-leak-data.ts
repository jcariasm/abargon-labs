export interface LeakCategory {
  id: string;
  name: string;
  description: string;
  benchmarkPct: number; // industry avg leak as % of revenue
  icon: string;
  questions: { id: string; label: string; weight: number; defaultPct: number }[];
}

export const leakCategories: LeakCategory[] = [
  {
    id: "pricing",
    name: "Errores de precio",
    description: "Discrepancias entre precio en sistema, anaquel y ticket de venta",
    benchmarkPct: 1.2,
    icon: "💰",
    questions: [
      { id: "price-mismatch", label: "¿Hay diferencias frecuentes entre precio en anaquel y en POS?", weight: 0.4, defaultPct: 1.5 },
      { id: "promo-errors", label: "¿Las promociones se aplican manualmente?", weight: 0.35, defaultPct: 1.0 },
      { id: "price-updates", label: "¿Los cambios de precio tardan >24hrs en reflejarse?", weight: 0.25, defaultPct: 0.8 },
    ],
  },
  {
    id: "shrinkage",
    name: "Merma e inventario",
    description: "Pérdida por robo, caducidad, daño y errores de conteo",
    benchmarkPct: 1.8,
    icon: "📦",
    questions: [
      { id: "inventory-accuracy", label: "¿La exactitud de inventario es menor al 95%?", weight: 0.35, defaultPct: 2.0 },
      { id: "expiry-waste", label: "¿Hay merma significativa por caducidad?", weight: 0.35, defaultPct: 1.5 },
      { id: "theft", label: "¿Se detectan faltantes no explicados regularmente?", weight: 0.3, defaultPct: 1.2 },
    ],
  },
  {
    id: "checkout",
    name: "Errores en punto de venta",
    description: "Transacciones duplicadas, devoluciones no procesadas, descuentos no autorizados",
    benchmarkPct: 0.8,
    icon: "🛒",
    questions: [
      { id: "refund-process", label: "¿Las devoluciones se procesan manualmente sin validación?", weight: 0.4, defaultPct: 0.9 },
      { id: "discount-auth", label: "¿Los descuentos manuales no requieren autorización?", weight: 0.35, defaultPct: 0.7 },
      { id: "duplicate-tx", label: "¿Se han detectado transacciones duplicadas o anuladas sospechosas?", weight: 0.25, defaultPct: 0.5 },
    ],
  },
  {
    id: "digital",
    name: "Canal digital",
    description: "Abandono de carrito, errores en e-commerce, fugas en omnicanal",
    benchmarkPct: 0.6,
    icon: "🌐",
    questions: [
      { id: "cart-abandon", label: "¿La tasa de abandono de carrito es mayor al 70%?", weight: 0.4, defaultPct: 0.8 },
      { id: "omni-sync", label: "¿El inventario online y físico no están sincronizados?", weight: 0.35, defaultPct: 0.5 },
      { id: "digital-promo", label: "¿Hay cupones/códigos que se filtran o abusan?", weight: 0.25, defaultPct: 0.4 },
    ],
  },
  {
    id: "supply",
    name: "Cadena de suministro",
    description: "Errores de recepción, facturación incorrecta de proveedores, logística",
    benchmarkPct: 0.9,
    icon: "🚛",
    questions: [
      { id: "receiving", label: "¿La recepción de mercancía se valida manualmente?", weight: 0.4, defaultPct: 1.0 },
      { id: "invoice-errors", label: "¿Hay discrepancias frecuentes en facturación de proveedores?", weight: 0.35, defaultPct: 0.8 },
      { id: "logistics-loss", label: "¿Se pierde producto en tránsito o distribución interna?", weight: 0.25, defaultPct: 0.6 },
    ],
  },
];

export interface LeakResult {
  categoryId: string;
  categoryName: string;
  icon: string;
  leakPct: number;
  leakAmount: number;
  severity: "low" | "medium" | "high" | "critical";
  answers: { questionId: string; value: number }[];
}

export function calculateLeaks(
  annualRevenue: number,
  answers: Record<string, number> // questionId → severity 0-3
): { results: LeakResult[]; totalLeak: number; totalPct: number } {
  const results: LeakResult[] = leakCategories.map((cat) => {
    let weightedPct = 0;
    const catAnswers: { questionId: string; value: number }[] = [];

    cat.questions.forEach((q) => {
      const severity = answers[q.id] ?? 1;
      catAnswers.push({ questionId: q.id, value: severity });
      const multiplier = severity / 2; // 0=none, 1=low, 2=avg, 3=high → 0, 0.5, 1, 1.5
      weightedPct += q.defaultPct * q.weight * multiplier;
    });

    const leakAmount = annualRevenue * (weightedPct / 100);
    const sev: "low" | "medium" | "high" | "critical" =
      weightedPct < 0.5 ? "low" : weightedPct < 1.0 ? "medium" : weightedPct < 1.5 ? "high" : "critical";

    return {
      categoryId: cat.id,
      categoryName: cat.name,
      icon: cat.icon,
      leakPct: Math.round(weightedPct * 100) / 100,
      leakAmount: Math.round(leakAmount),
      severity: sev,
      answers: catAnswers,
    };
  });

  const totalLeak = results.reduce((s, r) => s + r.leakAmount, 0);
  const totalPct = annualRevenue > 0 ? Math.round((totalLeak / annualRevenue) * 10000) / 100 : 0;

  return { results: results.sort((a, b) => b.leakAmount - a.leakAmount), totalLeak, totalPct };
}
