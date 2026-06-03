"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { leakCategories, calculateLeaks } from "@/lib/revenue-leak-data";

type Step = "revenue" | "diagnostic" | "results";

function fmt(n: number): string {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
}

const sevColors: Record<string, string> = {
  low: "#10b981", medium: "#f59e0b", high: "#f97316", critical: "#ef4444",
};
const sevLabels: Record<string, string> = {
  low: "Bajo", medium: "Medio", high: "Alto", critical: "Crítico",
};
const severityOptions = [
  { value: 0, label: "No aplica" },
  { value: 1, label: "Bajo" },
  { value: 2, label: "Moderado" },
  { value: 3, label: "Severo" },
];

export default function RevenueLeak() {
  const [step, setStep] = useState<Step>("revenue");
  const [revenue, setRevenue] = useState(50000000);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [activeCat, setActiveCat] = useState(0);

  function setAnswer(qId: string, val: number) {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  }

  const results = useMemo(() => calculateLeaks(revenue, answers), [revenue, answers]);

  const steps: { key: Step; label: string }[] = [
    { key: "revenue", label: "Ingresos" },
    { key: "diagnostic", label: "Diagnóstico" },
    { key: "results", label: "Resultados" },
  ];
  const currentIdx = steps.findIndex((s) => s.key === step);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 64px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <Link href="/" style={{
          width: 32, height: 32, borderRadius: 8, display: "flex",
          alignItems: "center", justifyContent: "center",
          border: "1px solid var(--border)", background: "var(--bg-card)",
          textDecoration: "none", color: "var(--text-secondary)", fontSize: 14,
        }}>←</Link>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 500 }}>Revenue Leak Calculator</h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Identifica fugas de ingreso en retail</p>
        </div>
      </div>

      {/* Stepper */}
      <div style={{ display: "flex", gap: 4, marginBottom: 32 }}>
        {steps.map((s, i) => (
          <div key={s.key} style={{ flex: 1 }}>
            <div style={{ height: 3, borderRadius: 2, background: i <= currentIdx ? "#10b981" : "var(--border)", transition: "background 0.3s" }} />
            <div style={{ fontSize: 11, marginTop: 4, color: i <= currentIdx ? "#10b981" : "var(--text-tertiary)", fontWeight: i === currentIdx ? 500 : 400 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Step 1: Revenue */}
      {step === "revenue" && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>¿Cuál es tu ingreso anual?</h2>
          <div style={{ padding: 20, borderRadius: 12, background: "var(--bg-card)", border: "1px solid var(--border)", marginBottom: 20 }}>
            <div style={{ fontSize: 32, fontWeight: 500, color: "var(--text)", textAlign: "center", marginBottom: 16 }}>
              {fmt(revenue)}
            </div>
            <input type="range" min={5000000} max={500000000} step={5000000} value={revenue}
              onChange={(e) => setRevenue(parseInt(e.target.value))}
              style={{ width: "100%", accentColor: "#10b981" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-tertiary)", marginTop: 4 }}>
              <span>$5M</span><span>$250M</span><span>$500M</span>
            </div>
          </div>
          <button onClick={() => setStep("diagnostic")} style={{
            width: "100%", padding: "12px 0", borderRadius: 8, fontSize: 14,
            border: "none", background: "#10b981", color: "#fff", cursor: "pointer", fontWeight: 500,
          }}>Iniciar diagnóstico →</button>
        </div>
      )}

      {/* Step 2: Diagnostic */}
      {step === "diagnostic" && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>Diagnóstico por categoría</h2>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
            Evalúa la severidad de cada factor en tu operación
          </p>

          {/* Category tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
            {leakCategories.map((cat, i) => {
              const answered = cat.questions.every((q) => answers[q.id] !== undefined);
              return (
                <button key={cat.id} onClick={() => setActiveCat(i)} style={{
                  padding: "8px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                  border: i === activeCat ? "1px solid #10b981" : "1px solid var(--border)",
                  background: i === activeCat ? "#10b98118" : "var(--bg-card)",
                  color: i === activeCat ? "#10b981" : "var(--text-secondary)",
                  fontWeight: i === activeCat ? 500 : 400,
                }}>
                  {cat.icon} {cat.name} {answered && "✓"}
                </button>
              );
            })}
          </div>

          {/* Questions for active category */}
          <div style={{ padding: 20, borderRadius: 12, background: "var(--bg-card)", border: "1px solid var(--border)", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
              {leakCategories[activeCat].icon} {leakCategories[activeCat].name}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16 }}>
              {leakCategories[activeCat].description}
            </div>
            {leakCategories[activeCat].questions.map((q) => (
              <div key={q.id} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, marginBottom: 8, color: "var(--text)" }}>{q.label}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {severityOptions.map((opt) => (
                    <button key={opt.value} onClick={() => setAnswer(q.id, opt.value)} style={{
                      flex: 1, padding: "8px 4px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                      border: answers[q.id] === opt.value ? "1px solid #10b981" : "1px solid var(--border)",
                      background: answers[q.id] === opt.value ? "#10b98118" : "transparent",
                      color: answers[q.id] === opt.value ? "#10b981" : "var(--text-secondary)",
                      fontWeight: answers[q.id] === opt.value ? 500 : 400,
                    }}>{opt.label}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", gap: 8 }}>
            {activeCat > 0 && (
              <button onClick={() => setActiveCat(activeCat - 1)} style={{
                padding: "10px 20px", borderRadius: 8, fontSize: 14,
                border: "1px solid var(--border)", background: "var(--bg-card)",
                cursor: "pointer", color: "var(--text-secondary)",
              }}>← Anterior</button>
            )}
            {activeCat < leakCategories.length - 1 ? (
              <button onClick={() => setActiveCat(activeCat + 1)} style={{
                flex: 1, padding: "10px 20px", borderRadius: 8, fontSize: 14,
                border: "none", background: "#10b981", color: "#fff",
                cursor: "pointer", fontWeight: 500,
              }}>Siguiente categoría →</button>
            ) : (
              <button onClick={() => setStep("results")} style={{
                flex: 1, padding: "10px 20px", borderRadius: 8, fontSize: 14,
                border: "none", background: "#10b981", color: "#fff",
                cursor: "pointer", fontWeight: 500,
              }}>Ver resultados →</button>
            )}
          </div>
          <button onClick={() => setStep("revenue")} style={{
            marginTop: 8, fontSize: 13, color: "var(--text-tertiary)",
            background: "none", border: "none", cursor: "pointer",
          }}>← Cambiar ingresos</button>
        </div>
      )}

      {/* Step 3: Results */}
      {step === "results" && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>Diagnóstico de fugas de ingreso</h2>

          {/* Total KPI */}
          <div style={{
            padding: 24, borderRadius: 12, marginBottom: 20,
            background: results.totalPct > 3 ? "#fef2f2" : results.totalPct > 1.5 ? "#fffbeb" : "#f0fdf4",
            border: `1px solid ${results.totalPct > 3 ? "#fecaca" : results.totalPct > 1.5 ? "#fde68a" : "#bbf7d0"}`,
          }}>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>Fuga estimada anual</div>
            <div style={{ fontSize: 32, fontWeight: 500, color: results.totalPct > 3 ? "#dc2626" : results.totalPct > 1.5 ? "#d97706" : "#16a34a" }}>
              {fmt(results.totalLeak)}
            </div>
            <div style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>
              {results.totalPct}% de {fmt(revenue)} en ingresos anuales
            </div>
          </div>

          {/* Breakdown by category */}
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Desglose por categoría</div>
          {results.results.map((r) => {
            const maxLeak = results.results[0]?.leakAmount || 1;
            const barW = Math.max(5, (r.leakAmount / maxLeak) * 100);
            return (
              <div key={r.categoryId} style={{
                padding: 16, borderRadius: 10, background: "var(--bg-card)",
                border: "1px solid var(--border)", marginBottom: 8,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{r.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{r.categoryName}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontSize: 11, padding: "2px 8px", borderRadius: 10,
                      background: `${sevColors[r.severity]}20`, color: sevColors[r.severity],
                    }}>{sevLabels[r.severity]}</span>
                    <span style={{ fontSize: 15, fontWeight: 500, color: sevColors[r.severity] }}>{fmt(r.leakAmount)}</span>
                  </div>
                </div>
                <div style={{ height: 6, background: "var(--bg)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${barW}%`, borderRadius: 3,
                    background: sevColors[r.severity], transition: "width 0.5s ease",
                  }} />
                </div>
                <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 4 }}>{r.leakPct}% del ingreso</div>
              </div>
            );
          })}

          {/* Benchmark */}
          <div style={{
            padding: 16, borderRadius: 12, background: "var(--bg-card)",
            border: "1px solid var(--border)", marginTop: 20, marginBottom: 20,
          }}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Benchmark industria retail</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
              La fuga promedio en retail es <strong>3.5-5.3%</strong> del ingreso anual (NRF 2024).
              Tu estimado de <strong>{results.totalPct}%</strong> está {results.totalPct < 3.5 ? "por debajo" : results.totalPct < 5.3 ? "dentro" : "por encima"} del rango típico.
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setStep("revenue"); setAnswers({}); setActiveCat(0); }} style={{
              padding: "10px 20px", borderRadius: 8, fontSize: 14,
              border: "1px solid var(--border)", background: "var(--bg-card)",
              cursor: "pointer", color: "var(--text-secondary)",
            }}>Nuevo diagnóstico</button>
            <button onClick={() => setStep("diagnostic")} style={{
              padding: "10px 20px", borderRadius: 8, fontSize: 14,
              border: "1px solid var(--border)", background: "var(--bg-card)",
              cursor: "pointer", color: "var(--text-secondary)",
            }}>Ajustar respuestas</button>
          </div>
        </div>
      )}
    </div>
  );
}
