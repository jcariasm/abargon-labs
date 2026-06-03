import Link from "next/link";

const tools: { name: string; description: string; href: string; status: "live" | "soon"; icon: string; accent: string }[] = [
  {
    name: "AI ROI Calculator",
    description: "Calcula el retorno de inversión de implementar IA en tu operación. Selecciona industria, proceso y métricas.",
    href: "/roi",
    status: "live" ,
    icon: "M9 7h-3a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-3M9 15L20 4M15 4h5v5",
    accent: "#6366f1",
  },
  {
    name: "Revenue Leak Calculator",
    description: "Identifica fugas de ingreso en tu operación retail. Diagnóstico rápido con recomendaciones.",
    href: "/revenue-leak",
    status: "live" ,
    icon: "M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
    accent: "#10b981",
  },
  {
    name: "Mapa Fintech México",
    description: "Directorio interactivo de fintechs mexicanas. Clasificadas por categoría, regulación y tech stack.",
    href: "/fintech-map",
    status: "live" ,
    icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 7v0",
    accent: "#f59e0b",
  },
  {
    name: "AI Scoring Simulator",
    description: "Demo interactivo de scoring crediticio con IA. Visualiza cómo un motor de decisión evalúa riesgo.",
    href: "/ai-scoring",
    status: "live" ,
    icon: "M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z",
    accent: "#ef4444",
  },
];

export default function Dashboard() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ marginBottom: 48 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "4px 12px", borderRadius: 20,
          background: "var(--accent-light)", border: "1px solid var(--border)",
          fontSize: 12, fontWeight: 500, color: "var(--accent)",
          marginBottom: 16,
        }}>
          Acceso privado
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 500, marginBottom: 8 }}>Labs</h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", maxWidth: 480, lineHeight: 1.6 }}>
          Herramientas de diagnóstico y análisis para empresas. Cada herramienta genera un reporte personalizado.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
        gap: 16,
      }}>
        {tools.map((tool) => (
          <Link
            key={tool.name}
            href={tool.href}
            style={{
              display: "block", textDecoration: "none", color: "inherit",
              padding: 20, borderRadius: 12,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              opacity: tool.status === "soon" ? 0.6 : 1,
              pointerEvents: tool.status === "soon" ? "none" : "auto",
              transition: "border-color 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: `${tool.accent}18`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke={tool.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={tool.icon} />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 500 }}>{tool.name}</span>
                  {tool.status === "soon" && (
                    <span style={{
                      fontSize: 11, padding: "2px 8px", borderRadius: 10,
                      background: "var(--border)", color: "var(--text-tertiary)",
                    }}>Próximamente</span>
                  )}
                  {tool.status === "live" && (
                    <span style={{
                      fontSize: 11, padding: "2px 8px", borderRadius: 10,
                      background: "#dcfce7", color: "#166534",
                    }}>Activo</span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {tool.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
