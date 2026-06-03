"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VaultPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/vault", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError("Código incorrecto");
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
    }}>
      <form onSubmit={handleSubmit} style={{
        width: "100%",
        maxWidth: 380,
        padding: "0 24px",
        textAlign: "center",
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: "var(--accent-light)", border: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px", fontSize: 20,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 8, color: "var(--text)" }}>
          Labs
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 32 }}>
          Ingresa el código de acceso
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Código"
          autoFocus
          style={{
            width: "100%", padding: "12px 16px",
            border: `1px solid ${error ? "var(--danger)" : "var(--border)"}`,
            borderRadius: 10, fontSize: 15,
            background: "var(--bg-card)", color: "var(--text)",
            outline: "none", textAlign: "center",
            letterSpacing: 4, fontFamily: "monospace",
          }}
        />

        {error && (
          <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 8 }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          style={{
            width: "100%", padding: "12px 0",
            background: "var(--accent)", color: "#fff",
            border: "none", borderRadius: 10, fontSize: 15,
            fontWeight: 500, cursor: "pointer", marginTop: 16,
            opacity: loading || !password ? 0.5 : 1,
            transition: "opacity 0.2s",
          }}
        >
          {loading ? "Verificando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
