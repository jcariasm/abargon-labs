export interface ScoringFactor {
  id: string;
  name: string;
  weight: number;
  description: string;
  options: { label: string; value: number; detail: string }[];
}

export const scoringFactors: ScoringFactor[] = [
  {
    id: "income",
    name: "Ingreso mensual",
    weight: 0.20,
    description: "Nivel de ingreso comprobable del solicitante",
    options: [
      { label: "< $10K", value: 20, detail: "Ingreso muy bajo — alto riesgo de impago" },
      { label: "$10K – $25K", value: 45, detail: "Ingreso bajo-medio — riesgo moderado" },
      { label: "$25K – $50K", value: 70, detail: "Ingreso medio — perfil estándar" },
      { label: "$50K – $100K", value: 85, detail: "Ingreso alto — buen perfil" },
      { label: "> $100K", value: 95, detail: "Ingreso premium — excelente capacidad de pago" },
    ],
  },
  {
    id: "credit-history",
    name: "Historial crediticio",
    weight: 0.25,
    description: "Score en buró de crédito y comportamiento de pago",
    options: [
      { label: "Sin historial", value: 30, detail: "No bancarizado — evaluación alternativa necesaria" },
      { label: "Malo (< 550)", value: 15, detail: "Atrasos recurrentes o cuentas en cobranza" },
      { label: "Regular (550-650)", value: 45, detail: "Algunos atrasos pero recuperado" },
      { label: "Bueno (650-750)", value: 75, detail: "Pagos puntuales con historial sólido" },
      { label: "Excelente (> 750)", value: 95, detail: "Historial impecable y diversificado" },
    ],
  },
  {
    id: "employment",
    name: "Estabilidad laboral",
    weight: 0.15,
    description: "Tipo de empleo y antigüedad",
    options: [
      { label: "Desempleado", value: 10, detail: "Sin fuente de ingreso verificable" },
      { label: "Freelance < 1 año", value: 35, detail: "Ingreso variable, poca trayectoria" },
      { label: "Empleado < 2 años", value: 55, detail: "Empleo formal pero reciente" },
      { label: "Empleado 2-5 años", value: 75, detail: "Estabilidad demostrada" },
      { label: "Empleado > 5 años / Empresario", value: 90, detail: "Alta estabilidad o negocio establecido" },
    ],
  },
  {
    id: "debt-ratio",
    name: "Nivel de endeudamiento",
    weight: 0.18,
    description: "Deuda actual como porcentaje del ingreso",
    options: [
      { label: "> 60% del ingreso", value: 10, detail: "Sobreendeudamiento severo" },
      { label: "40-60%", value: 30, detail: "Endeudamiento alto — capacidad limitada" },
      { label: "20-40%", value: 60, detail: "Endeudamiento moderado — manejable" },
      { label: "10-20%", value: 80, detail: "Endeudamiento bajo — buena capacidad" },
      { label: "< 10%", value: 95, detail: "Mínimo endeudamiento — excelente" },
    ],
  },
  {
    id: "collateral",
    name: "Garantía / Colateral",
    weight: 0.12,
    description: "Activos que respaldan la operación",
    options: [
      { label: "Sin garantía", value: 20, detail: "Crédito sin respaldo — mayor riesgo" },
      { label: "Aval personal", value: 40, detail: "Respaldo parcial por tercero" },
      { label: "Vehículo", value: 60, detail: "Activo depreciable como garantía" },
      { label: "Inmueble parcial", value: 80, detail: "Propiedad con gravamen existente" },
      { label: "Inmueble libre", value: 95, detail: "Propiedad libre de gravámenes — máxima seguridad" },
    ],
  },
  {
    id: "purpose",
    name: "Destino del crédito",
    weight: 0.10,
    description: "Para qué se usarán los recursos",
    options: [
      { label: "Reestructura de deuda", value: 25, detail: "Señal de estrés financiero previo" },
      { label: "Consumo personal", value: 40, detail: "Sin retorno productivo directo" },
      { label: "Capital de trabajo", value: 65, detail: "Operación del negocio — retorno esperado" },
      { label: "Inversión en activos", value: 80, detail: "Compra de maquinaria/equipo productivo" },
      { label: "Expansión de negocio", value: 90, detail: "Crecimiento con plan documentado" },
    ],
  },
];

export interface ScoreResult {
  totalScore: number;
  decision: "Aprobado" | "Revisión manual" | "Rechazado";
  decisionColor: string;
  riskLevel: string;
  factors: { id: string; name: string; weight: number; rawScore: number; weightedScore: number; detail: string }[];
  maxLoanPct: number;
  suggestedRate: number;
}

export function calculateScore(selections: Record<string, number>): ScoreResult {
  const factors = scoringFactors.map((f) => {
    const selectedIdx = selections[f.id] ?? 2;
    const option = f.options[selectedIdx];
    const rawScore = option.value;
    const weightedScore = Math.round(rawScore * f.weight * 100) / 100;
    return {
      id: f.id, name: f.name, weight: f.weight,
      rawScore, weightedScore, detail: option.detail,
    };
  });

  const totalScore = Math.round(factors.reduce((s, f) => s + f.weightedScore, 0));

  let decision: "Aprobado" | "Revisión manual" | "Rechazado";
  let decisionColor: string;
  let riskLevel: string;

  if (totalScore >= 70) {
    decision = "Aprobado"; decisionColor = "#10b981"; riskLevel = "Bajo";
  } else if (totalScore >= 50) {
    decision = "Revisión manual"; decisionColor = "#f59e0b"; riskLevel = "Medio";
  } else {
    decision = "Rechazado"; decisionColor = "#ef4444"; riskLevel = "Alto";
  }

  const maxLoanPct = totalScore >= 70 ? 100 : totalScore >= 50 ? 60 : 0;
  const suggestedRate = totalScore >= 80 ? 12 : totalScore >= 70 ? 18 : totalScore >= 60 ? 24 : totalScore >= 50 ? 32 : 0;

  return { totalScore, decision, decisionColor, riskLevel, factors, maxLoanPct, suggestedRate };
}
