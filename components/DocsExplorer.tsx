"use client";
import { useMemo, useState } from "react";
import { Check, ChevronDown, Copy, Search } from "lucide-react";
import { CATEGORIES, DOC_ENDPOINTS, PLATFORM_COUNT, type DocCategory } from "@/lib/docs-data";
import { BASE_URL } from "@/lib/config";

function Method({ m }: { m: string }) {
  const c = m === "GET" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-secondary/20 text-secondary";
  return <span className={`rounded-m3 px-2.5 py-1 text-xs font-bold ${c}`}>{m}</span>;
}

function CodeBlock({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-m3 bg-tertiary p-4 pr-10 text-xs leading-relaxed text-white"><code>{text}</code></pre>
      <button
        aria-label="Salin"
        className="absolute right-2 top-2 rounded-full p-1.5 text-white/70 hover:bg-white/10"
        onClick={() => { navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1500); }}
      >
        {ok ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}

export default function DocsExplorer() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<DocCategory | "Semua">("Semua");
  const [open, setOpen] = useState<string | null>(null);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return DOC_ENDPOINTS.filter(
      (e) => (cat === "Semua" || e.category === cat) && (!s || `${e.path} ${e.group} ${e.title} ${e.category}`.toLowerCase().includes(s)),
    );
  }, [q, cat]);

  const stats = [
    { label: "Endpoints", value: DOC_ENDPOINTS.length },
    { label: "Platform", value: PLATFORM_COUNT },
    { label: "Auth", value: "API Key" },
    { label: "Format", value: "JSON" },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-m3-xl border border-outline/40 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><span className="h-2 w-2 rounded-full bg-emerald-500" />Ringkasan</div>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-m3-lg bg-surface-variant p-3">
              <div className="text-[11px] uppercase tracking-wide text-outline">{s.label}</div>
              <div className="font-heading text-xl">{s.value}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 break-all text-xs text-outline">Base URL: <code className="text-primary">{BASE_URL}</code></p>
        <p className="mt-1 text-xs text-outline">Kirim API key lewat header <code>x-api-key</code> atau <code>Authorization: Bearer</code>. Semua respons JSON: <code>{`{ success, data|error, message }`}</code>. Header: <code>X-RateLimit-*</code>.</p>
      </div>

      <div className="rounded-m3-xl border border-outline/40 p-4">
        <div className="mb-2 flex items-center gap-2 text-xs text-outline"><Search size={14} />terminal – search</div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="search endpoint path..."
          className="h-11 w-full rounded-m3 bg-surface-variant px-4 font-mono text-sm outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {(["Semua", ...CATEGORIES] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`h-8 shrink-0 rounded-m3 px-3 text-xs font-semibold ${cat === c ? "bg-primary text-on-primary" : "bg-primary-container text-on-primary-container"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-outline">{list.length} endpoint</p>
      </div>

      {list.map((e) => {
        const isOpen = open === e.id;
        return (
          <div key={e.id} className="rounded-m3-xl border border-outline/40 bg-surface">
            <button className="flex w-full items-center gap-3 p-4 text-left" onClick={() => setOpen(isOpen ? null : e.id)} aria-expanded={isOpen}>
              <div className="flex shrink-0 flex-col gap-1">{e.methods.map((m) => <Method key={m} m={m} />)}</div>
              <div className="min-w-0 flex-1">
                <div className="break-all font-mono text-sm font-semibold">{e.path.replace("/api/v1", "")}</div>
                <span className="mt-1 inline-block rounded-m3 bg-surface-variant px-2 py-0.5 text-[11px] font-semibold uppercase text-outline">{e.category} / {e.group}</span>
              </div>
              <ChevronDown size={18} className={`shrink-0 text-outline transition ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
              <div className="space-y-3 border-t border-outline/30 p-4">
                <p className="text-sm">{e.title}</p>
                {e.source && <p className="text-xs text-outline">Sumber: {e.source}</p>}
                <div className="space-y-1">
                  {e.params.map((p) => (
                    <div key={p.name} className="flex flex-wrap items-baseline gap-2 text-xs">
                      <code className="rounded bg-surface-variant px-1.5 py-0.5 font-semibold">{p.name}</code>
                      <span className="text-outline">{p.where}{p.required ? " · wajib" : ""}</span>
                      <span>{p.desc}</span>
                    </div>
                  ))}
                </div>
                <CodeBlock text={e.curl} />
                <CodeBlock text={e.response} />
              </div>
            )}
          </div>
        );
      })}
      {list.length === 0 && <p className="py-8 text-center text-sm text-outline">Tidak ada endpoint yang cocok.</p>}
    </div>
  );
}
