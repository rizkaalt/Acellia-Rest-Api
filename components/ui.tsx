import Link from "next/link";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { WitchHat } from "./Decor";

const btn = "inline-flex items-center justify-center gap-2 h-10 px-6 rounded-full text-sm font-medium transition disabled:opacity-50";

export function Button({ variant = "filled", className = "", ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "filled" | "outlined" | "text" | "danger" }) {
  const v = {
    filled: "bg-primary text-on-primary shadow-m3 hover:shadow-m3-2",
    outlined: "border border-outline text-primary hover:bg-primary/10",
    text: "text-primary hover:bg-primary/10 px-3",
    danger: "bg-error text-white",
  }[variant];
  return <button className={`${btn} ${v} ${className}`} {...p} />;
}

export function LinkButton({ href, variant = "filled", children }: { href: string; variant?: "filled" | "outlined"; children: ReactNode }) {
  const v = variant === "filled" ? "bg-primary text-on-primary shadow-m3" : "border border-outline text-primary hover:bg-primary/10";
  return <Link href={href} className={`${btn} ${v}`}>{children}</Link>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-m3-xl border border-outline/40 bg-surface p-6 ${className}`}>{children}</div>;
}

export function Chip({ children }: { children: ReactNode }) {
  return <span className="inline-flex h-8 items-center rounded-m3 bg-primary-container px-3 text-xs font-semibold uppercase tracking-wide text-on-primary-container">{children}</span>;
}

export function Field({ label, ...p }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="relative block">
      <input
        {...p}
        placeholder=" "
        className="peer h-14 w-full rounded-m3 border border-outline bg-transparent px-4 pt-3 text-on-surface outline-none focus:border-2 focus:border-primary"
      />
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 bg-surface px-1 text-sm text-outline transition-all peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs">
        {label}
      </span>
    </label>
  );
}

export function Progress({ value, max }: { value: number; max: number }) {
  const pct = max < 0 ? 100 : Math.min(100, (value / Math.max(1, max)) * 100);
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-variant">
      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Dialog({ open, title, children, actions }: { open: boolean; title: string; children: ReactNode; actions: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-m3-xl bg-surface-variant p-6 shadow-m3-2">
        <h2 className="mb-3 font-heading text-xl">{title}</h2>
        <div className="text-sm">{children}</div>
        <div className="mt-6 flex justify-end gap-2">{actions}</div>
      </div>
    </div>
  );
}

export function TopBar({ authed }: { authed: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-outline/30 bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold text-primary">
          <WitchHat className="h-8 w-8" /> Acellia
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {authed ? (
            <>
              <Link className="rounded-full px-3 py-2 hover:bg-primary/10" href="/dashboard">Dashboard</Link>
              <Link className="rounded-full px-3 py-2 hover:bg-primary/10" href="/docs">Docs</Link>
              <Link className="rounded-full px-3 py-2 hover:bg-primary/10" href="/pricing">Pricing</Link>
              <form action="/api/auth/logout" method="post"><button className="rounded-full px-3 py-2 text-primary hover:bg-primary/10">Keluar</button></form>
            </>
          ) : (
            <>
              <Link className="rounded-full px-3 py-2 hover:bg-primary/10" href="/login">Masuk</Link>
              <Link className="rounded-full bg-primary px-4 py-2 text-on-primary" href="/register">Daftar</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
