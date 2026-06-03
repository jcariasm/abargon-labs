"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { industries, calculateROI, type Industry, type Process } from "@/lib/roi-data";

type Step = "industry" | "process" | "scale" | "results";

function fmt(n: number): string {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
}

function MetricCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{
      padding: "16px 20px", borderRadius: 12,
      background: "var(--bg)", border: "1px solid var(--border)",
    }}>
      <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500, color: color || "var(--text)" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function Bar({ label, current, ai, max }: { label: string; current: number; ai: number; max: number }) {
  const cw = Math.max((current / max) * 100, 2);
  const aw = Math.max((ai / max) * 100, 2);
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "var(--text-tertiary)", minWidth: 50 }}>Actual</span>
          <div style={{ flex: 1, height: 24, background: "var(--bg)", borderRadius: 6, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${cw}%`, borderRadius: 6,
              background: "#ef4444", transition: "width 0.6s ease",
              display: "flex", alignItems: "center", paddingLeft: 8,
              fontSize: 11, color: "#fff", fontWeight: 500,
            }}>{fmt(current)}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "var(--text-tertiary)", minWidth: 50 }}>Con IA</span>
          <div style={{ flex: 1, height: 24, background: "var(--bg)", borderRadius: 6, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${aw}%`, borderRadius: 6,
              background: "#10b981", transition: "width 0.6s ease",
              display: "flex", alignItems: "center", paddingLeft: 8,
              fontSize: 11, color: "#fff", fontWeight: 500,
            }}>{fmt(ai)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ROICalculator() {
  const [step, setStep] = useState<Step>("industry");
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [scale, setScale] = useState(1);

  const results = useMemo(() => {
    if (!selectedProcess) return null;
    return calculateROI(selectedProcess, scale);
  }, [selectedProcess, scale]);

  function selectIndustry(ind: Industry) {
    setSelectedIndustry(ind);
    setSelectedProcess(null);
    setStep("process");
  }

  function selectProcess(proc: Process) {
    setSelectedProcess(proc);
    setStep("scale");
  }

  function goToResults() {
    setStep("results");
  }

  function reset() {
    setStep("industry");
    setSelectedIndustry(null);
    setSelectedProcess(null);
    setScale(1);
  }

  const steps: { key: Step; label: string }[] = [
    { key: "industry", label: "Industria" },
    { key: "process", label: "Proceso" },
    { key: "scale", label: "Escala" },
    { key: "results", label: "Resultados" },
  ];
  const currentIdx = steps.findIndex(s => s.key === step);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 64px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <Link href="/" style={{
          width: 32, height: 32, borderRadius: 8, display: "flex",
          alignItems: "center", justifyContent: "center",
          border: "1px solid var(--border)", background: "var(--bg-card)",
          textDecoration: "none", color: "var(--text-secondary)", fontSize: 14,
        }}>←</Link>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 500 }}>AI ROI Calculator</h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Calcula el retorno de inversión de implementar IA
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div style={{ display: "flex", gap: 4, marginBottom: 32 }}>
        {steps.map((s, i) => (
          <div key={s.key} style={{ flex: 1 }}>
            <div style={{
              height: 3, borderRadius: 2,
              background: i <= currentIdx ? "var(--accent)" : "var(--border)",
              transition: "background 0.3s",
            }} />
            <div style={{
              fontSize: 11, marginTop: 4,
              color: i <= currentIdx ? "var(--accent)" : "var(--text-tertiary)",
              fontWeight: i === currentIdx ? 500 : 400,
            }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Step 1: Industry */}
      {step === "industry" && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>
            Selecciona tu industria
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {industries.map(ind => (
              <button key={ind.id} onClick={() => selectIndustry(ind)} style={{
                padding: 20, borderRadius: 12, border: "1px solid var(--border)",
                background: "var(--bg-card)", cursor: "pointer", textAlign: "center",
                transition: "border-color 0.2s, transform 0.1s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = ind.color; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{ind.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{ind.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Process */}
      {step === "process" && selectedIndustry && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>
            {selectedIndustry.icon} {selectedIndustry.name}
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
            ¿Qué proceso quieres automatizar con IA?
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {selectedIndustry.processes.map(proc => (
              <button key={proc.id} onClick={() => selectProcess(proc)} style={{
                padding: 16, borderRadius: 10, border: "1px solid var(--border)",
                background: "var(--bg-card)", cursor: "pointer", textAlign: "left",
                display: "flex", alignItems: "center", gap: 14,
                transition: "border-color 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = selectedIndustry.color; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: `${selectedIndustry.color}18`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 600, color: selectedIndustry.color,
                }}>AI</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{proc.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                    {proc.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <button onClick={() => setStep("industry")} style={{
            marginTop: 16, fontSize: 13, color: "var(--text-secondary)",
            background: "none", border: "none", cursor: "pointer",
          }}>← Cambiar industria</button>
        </div>
      )}

      {/* Step 3: Scale */}
      {step === "scale" && selectedProcess && selectedIndustry && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>
            Ajusta la escala de operación
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 24 }}>
            {selectedProcess.name} — {selectedIndustry.name}
          </p>

          <div style={{
            padding: 20, borderRadius: 12, background: "var(--bg-card)",
            border: "1px solid var(--border)", marginBottom: 20,
          }}>
            <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 12 }}>
              Multiplicador de volumen: <strong style={{ color: "var(--text)", fontSize: 18 }}>{scale}x</strong>
            </label>
            <input
              type="range" min="0.5" max="5" step="0.5" value={scale}
              onChange={e => setScale(parseFloat(e.target.value))}
              style={{ width: "100%", accentColor: "var(--accent)" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-tertiary)", marginTop: 4 }}>
              <span>Pequeño (0.5x)</span>
              <span>Estándar (1x)</span>
              <span>Grande (5x)</span>
            </div>
          </div>

          {results && (
            <div style={{
              padding: 16, borderRadius: 10, background: "var(--accent-light)",
              border: "1px solid var(--border)",
            }}>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Vista previa del ahorro mensual</div>
              <div style={{ fontSize: 24, fontWeight: 500, color: "var(--accent)" }}>
                {fmt(results.monthlySavings)}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            <button onClick={() => setStep("process")} style={{
              padding: "10px 20px", borderRadius: 8, fontSize: 14,
              border: "1px solid var(--border)", background: "var(--bg-card)",
              cursor: "pointer", color: "var(--text-secondary)",
            }}>← Atrás</button>
            <button onClick={goToResults} style={{
              flex: 1, padding: "10px 20px", borderRadius: 8, fontSize: 14,
              border: "none", background: "var(--accent)", color: "#fff",
              cursor: "pointer", fontWeight: 500,
            }}>Calcular ROI →</button>
          </div>
        </div>
      )}

      {/* Step 4: Results */}
      {step === "results" && results && selectedProcess && selectedIndustry && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>
            Resultado: {selectedProcess.name}
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 24 }}>
            {selectedIndustry.name} — Escala {scale}x
          </p>

          {/* KPI Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
            <MetricCard label="Ahorro anual" value={fmt(results.annualSavings)} color="var(--success)" />
            <MetricCard label="ROI a 3 años" value={`${results.roi3yr}%`} color="var(--accent)" />
            <MetricCard
              label="Payback"
              value={results.paybackMonths < 99 ? `${results.paybackMonths} meses` : "N/A"}
              color="var(--warning)"
            />
          </div>

          {/* Cost comparison bar */}
          <div style={{
            padding: 20, borderRadius: 12, background: "var(--bg-card)",
            border: "1px solid var(--border)", marginBottom: 20,
          }}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 16 }}>Comparación de costos mensuales</div>
            <Bar
              label="Costo operativo"
              current={results.currentMonthlyCost}
              ai={results.aiMonthlyCost}
              max={results.currentMonthlyCost}
            />
          </div>

          {/* Details */}
          <div style={{
            padding: 20, borderRadius: 12, background: "var(--bg-card)",
            border: "1px solid var(--border)", marginBottom: 20,
          }}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Desglose</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <MetricCard label="Costo mensual actual" value={fmt(results.currentMonthlyCost)} />
              <MetricCard label="Costo mensual con IA" value={fmt(results.aiMonthlyCost)} color="var(--success)" />
              <MetricCard label="Inversión inicial (setup)" value={fmt(results.setupCost)} />
              <MetricCard label="Ahorro mensual" value={fmt(results.monthlySavings)} color="var(--success)" />
              <MetricCard label="Reducción de tiempo" value={`${results.reductionPct}%`} sub="menos horas humanas" />
              <MetricCard label="Mejora en precisión" value={`+${results.accuracyGain}%`} sub="menos errores" />
            </div>
          </div>

          {/* Projection */}
          <div style={{
            padding: 20, borderRadius: 12, background: "var(--bg-card)",
            border: "1px solid var(--border)", marginBottom: 24,
          }}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Proyección a 36 meses</div>
            <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 120 }}>
              {Array.from({ length: 36 }, (_, i) => {
                const cumSavings = results.monthlySavings * (i + 1) - results.setupCost;
                const maxVal = results.monthlySavings * 36 - results.setupCost;
                const h = Math.max(2, ((cumSavings + results.setupCost) / (maxVal + results.setupCost)) * 100);
                const positive = cumSavings >= 0;
                return (
                  <div key={i} style={{
                    flex: 1, height: `${h}%`, borderRadius: 2,
                    background: positive ? "#10b981" : "#ef4444",
                    opacity: positive ? 1 : 0.4,
                    transition: "height 0.4s ease",
                  }} title={`Mes ${i + 1}: ${fmt(cumSavings)}`} />
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-tertiary)", marginTop: 8 }}>
              <span>Mes 1</span>
              <span style={{ color: "var(--success)" }}>
                Breakeven: mes {results.paybackMonths}
              </span>
              <span>Mes 36</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={reset} style={{
              padding: "10px 20px", borderRadius: 8, fontSize: 14,
              border: "1px solid var(--border)", background: "var(--bg-card)",
              cursor: "pointer", color: "var(--text-secondary)",
            }}>Nuevo cálculo</button>
            <button onClick={() => setStep("scale")} style={{
              padding: "10px 20px", borderRadius: 8, fontSize: 14,
              border: "1px solid var(--border)", background: "var(--bg-card)",
              cursor: "pointer", color: "var(--text-secondary)",
            }}>Ajustar escala</button>
          </div>
        </div>
      )}
    </div>
  );
}
