"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { fintechs, categories, type Fintech } from "@/lib/fintech-data";

const regColors: Record<string, { bg: string; text: string }> = {
  Regulada: { bg: "#dcfce7", text: "#166534" },
  "En proceso": { bg: "#fef3c7", text: "#92400e" },
  "No regulada": { bg: "#fee2e2", text: "#991b1b" },
};

export default function FintechMap() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [regFilter, setRegFilter] = useState("Todos");

  const filtered = useMemo(() => {
    return fintechs.filter((f) => {
      if (category !== "Todos" && f.category !== category) return false;
      if (regFilter !== "Todos" && f.regulation !== regFilter) return false;
      if (search && !f.name.toLowerCase().includes(search.toLowerCase()) &&
          !f.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, category, regFilter]);

  const stats = useMemo(() => ({
    total: fintechs.length,
    regulated: fintechs.filter(f => f.regulation === "Regulada").length,
    categories: new Set(fintechs.map(f => f.category)).size,
  }), []);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px 64px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <Link href="/" style={{
          width: 32, height: 32, borderRadius: 8, display: "flex",
          alignItems: "center", justifyContent: "center",
          border: "1px solid var(--border)", background: "var(--bg-card)",
          textDecoration: "none", color: "var(--text-secondary)", fontSize: 14,
        }}>←</Link>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 500 }}>Mapa Fintech México</h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Directorio de fintechs mexicanas</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div style={{ padding: 14, borderRadius: 10, background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Total fintechs</div>
          <div style={{ fontSize: 22, fontWeight: 500 }}>{stats.total}</div>
        </div>
        <div style={{ padding: 14, borderRadius: 10, background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Reguladas</div>
          <div style={{ fontSize: 22, fontWeight: 500, color: "#10b981" }}>{stats.regulated}</div>
        </div>
        <div style={{ padding: 14, borderRadius: 10, background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Categorías</div>
          <div style={{ fontSize: 22, fontWeight: 500 }}>{stats.categories}</div>
        </div>
      </div>

      {/* Search */}
      <input
        type="text" placeholder="Buscar fintech..." value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%", padding: "10px 14px", borderRadius: 8,
          border: "1px solid var(--border)", background: "var(--bg-card)",
          color: "var(--text)", fontSize: 14, marginBottom: 12, outline: "none",
        }}
      />

      {/* Filters */}
      <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
        {categories.map((c) => (
          <button key={c} onClick={() => setCategory(c)} style={{
            padding: "6px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer",
            border: c === category ? "1px solid var(--accent)" : "1px solid var(--border)",
            background: c === category ? "var(--accent-light)" : "transparent",
            color: c === category ? "var(--accent)" : "var(--text-secondary)",
          }}>{c}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {["Todos", "Regulada", "En proceso", "No regulada"].map((r) => (
          <button key={r} onClick={() => setRegFilter(r)} style={{
            padding: "6px 12px", borderRadius: 6, fontSize: 11, cursor: "pointer",
            border: r === regFilter ? "1px solid #f59e0b" : "1px solid var(--border)",
            background: r === regFilter ? "#fef3c7" : "transparent",
            color: r === regFilter ? "#92400e" : "var(--text-tertiary)",
          }}>{r}</button>
        ))}
      </div>

      {/* Results count */}
      <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 12 }}>
        {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((f) => (
          <div key={f.name} style={{
            padding: 16, borderRadius: 10,
            background: "var(--bg-card)", border: "1px solid var(--border)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{f.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{f.description}</div>
              </div>
              <span style={{
                fontSize: 10, padding: "3px 8px", borderRadius: 10, whiteSpace: "nowrap",
                background: regColors[f.regulation]?.bg, color: regColors[f.regulation]?.text,
              }}>{f.regulation}</span>
            </div>
            <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--text-tertiary)", flexWrap: "wrap" }}>
              <span style={{
                padding: "2px 8px", borderRadius: 8,
                background: "var(--accent-light)", color: "var(--accent)", fontSize: 11,
              }}>{f.category}</span>
              <span>📍 {f.hq}</span>
              <span>📅 {f.founded}</span>
              <span>💰 {f.funding}</span>
              {f.techStack && <span>⚙️ {f.techStack}</span>}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: "var(--text-tertiary)" }}>
          No se encontraron fintechs con esos filtros
        </div>
      )}
    </div>
  );
}
