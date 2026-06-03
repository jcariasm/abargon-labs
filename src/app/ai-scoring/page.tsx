"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { scoringFactors, calculateScore } from "@/lib/scoring-data";

export default function AIScoringSimulator() {
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  function select(factorId: string, idx: number) {
    setSelections((prev) => ({ ...prev, [factorId]: idx }));
  }

  const allSelected = scoringFactors.every((f) => selections[f.id] !== undefined);
  const result = useMemo(() => calculateScore(selections), [selections]);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 64px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <Link href="/" style={{
          width: 32, height: 32, borderRadius: 8, display: "flex",
          alignItems: "center", justifyContent: "center",
          border: "1px solid var(--border)", background: "var(--bg-card)",
          textDecoration: "none", color: "var(--text-secondary)", fontSize: 14,
        }}>←</Link>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 500 }}>AI Scoring Simulator</h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Simula una decisión crediticia con IA</p>
        </div>
      </div>

      {!showResults ? (
        <>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.6 }}>
            Selecciona el perfil del solicitante en cada factor. El motor de IA evaluará los pesos y generará una decisión automatizada.
          </p>

          {scoringFactors.map((factor) => (
            <div key={factor.id} style={{
              padding: 16, borderRadius: 12, background: "var(--bg-card)",
              border: "1px solid var(--border)", marginBottom: 12,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{factor.name}</span>
                <span style={{
                  fontSize: 11, padding: "2px 8px", borderRadius: 10,
                  background: "var(--accent-light)", color: "var(--accent)",
                }}>Peso: {Math.round(factor.weight * 100)}%</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 10 }}>{factor.description}</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {factor.options.map((opt, i) => (
                  <button key={i} onClick={() => select(factor.id, i)} style={{
                    flex: "1 1 0", minWidth: 80, padding: "8px 6px", borderRadius: 6,
                    fontSize: 11, cursor: "pointer", textAlign: "center",
                    border: selections[factor.id] === i ? "1px solid var(--accent)" : "1px solid var(--border)",
                    background: selections[factor.id] === i ? "var(--accent-light)" : "transparent",
                    color: selections[factor.id] === i ? "var(--accent)" : "var(--text-secondary)",
                    fontWeight: selections[factor.id] === i ? 500 : 400,
                  }}>{opt.label}</button>
                ))}
              </div>
              {selections[factor.id] !== undefined && (
                <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 6, fontStyle: "italic" }}>
                  → {factor.options[selections[factor.id]].detail}
                </div>
              )}
            </div>
          ))}

          <button onClick={() => setShowResults(true)} disabled={!allSelected} style={{
            width: "100%", padding: "12px 0", borderRadius: 8, fontSize: 14,
            border: "none", background: "var(--accent)", color: "#fff",
            cursor: allSelected ? "pointer" : "default", fontWeight: 500, marginTop: 8,
            opacity: allSelected ? 1 : 0.4,
          }}>Ejecutar scoring →</button>
        </>
      ) : (
        <>
          {/* Decision banner */}
          <div style={{
            padding: 24, borderRadius: 12, marginBottom: 20, textAlign: "center",
            background: `${result.decisionColor}10`, border: `2px solid ${result.decisionColor}40`,
          }}>
            <div style={{ fontSize: 48, fontWeight: 500, color: result.decisionColor }}>{result.totalScore}</div>
            <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 8 }}>Score / 100</div>
            <div style={{
              display: "inline-block", padding: "6px 20px", borderRadius: 20,
              background: result.decisionColor, color: "#fff", fontSize: 16, fontWeight: 500,
            }}>{result.decision}</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8 }}>
              Riesgo: {result.riskLevel}
              {result.suggestedRate > 0 && ` · Tasa sugerida: ${result.suggestedRate}% anual`}
              {result.maxLoanPct > 0 && ` · Hasta ${result.maxLoanPct}% del monto solicitado`}
            </div>
          </div>

          {/* Factor breakdown */}
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Desglose por factor</div>
          {result.factors.sort((a, b) => b.weightedScore - a.weightedScore).map((f) => {
            const barColor = f.rawScore >= 70 ? "#10b981" : f.rawScore >= 45 ? "#f59e0b" : "#ef4444";
            return (
              <div key={f.id} style={{
                padding: 12, borderRadius: 8, background: "var(--bg-card)",
                border: "1px solid var(--border)", marginBottom: 6,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{f.name}</span>
                    <span style={{ fontSize: 11, color: "var(--text-tertiary)", marginLeft: 8 }}>
                      ({Math.round(f.weight * 100)}%)
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>
                    <span style={{ color: barColor }}>{f.rawScore}</span>
                    <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}> → {f.weightedScore.toFixed(1)} pts</span>
                  </div>
                </div>
                <div style={{ height: 6, background: "var(--bg)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${f.rawScore}%`, borderRadius: 3,
                    background: barColor, transition: "width 0.5s ease",
                  }} />
                </div>
                <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 4 }}>{f.detail}</div>
              </div>
            );
          })}

          {/* How it works */}
          <div style={{
            padding: 16, borderRadius: 12, background: "var(--bg-card)",
            border: "1px solid var(--border)", marginTop: 20, marginBottom: 20,
          }}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Cómo funciona el motor</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Cada factor tiene un peso asignado que refleja su importancia predictiva.
              El score final es la suma ponderada: <strong>Σ (score × peso)</strong>.
              Umbrales: ≥70 = aprobado automático, 50-69 = revisión manual, &lt;50 = rechazo.
              En producción, los pesos se recalibran con machine learning cada trimestre usando datos de cartera real.
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setShowResults(false); setSelections({}); }} style={{
              padding: "10px 20px", borderRadius: 8, fontSize: 14,
              border: "1px solid var(--border)", background: "var(--bg-card)",
              cursor: "pointer", color: "var(--text-secondary)",
            }}>Nuevo perfil</button>
            <button onClick={() => setShowResults(false)} style={{
              padding: "10px 20px", borderRadius: 8, fontSize: 14,
              border: "1px solid var(--border)", background: "var(--bg-card)",
              cursor: "pointer", color: "var(--text-secondary)",
            }}>Ajustar factores</button>
          </div>
        </>
      )}
    </div>
  );
}
