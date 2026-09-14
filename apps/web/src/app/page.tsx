export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">GLC</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-100">Global Life Change</h1>
        <p className="mt-3 text-slate-400">
          Una sola plataforma · Perfiles Commercial, Institutional y Sovereign
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
        {["Next.js", "NestJS", "Turborepo", "TypeScript", "PostgreSQL + pgvector", "NATS", "Keycloak"].map(
          (item) => (
            <span
              key={item}
              className="rounded-full border border-slate-700 px-3 py-1 text-slate-300"
            >
              {item}
            </span>
          )
        )}
      </div>
    </main>
  );
}