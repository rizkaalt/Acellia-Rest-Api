"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Copy, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button, Card, Dialog, Field } from "@/components/ui";
import { WitchHat } from "@/components/Decor";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [newKey, setNewKey] = useState("");
  const [copied, setCopied] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setErr("");
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    if (mode === "register") {
      const res = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: f.get("username"), email, password }),
      });
      const j = await res.json();
      setBusy(false);
      if (!j.success) return setErr(j.message);
      setNewKey(j.data.api_key);
    } else {
      const { error } = await createClient().auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setErr("Email atau password salah.");
      router.push("/dashboard"); router.refresh();
    }
  }

  return (
    <main className="mx-auto grid min-h-screen max-w-md place-items-center px-4">
      <Card className="w-full space-y-5">
        <div className="flex items-center gap-2 font-heading text-2xl text-primary"><WitchHat className="h-9 w-9" />{mode === "login" ? "Masuk" : "Daftar"}</div>
        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "register" && <Field label="Username" name="username" required minLength={3} maxLength={24} />}
          <Field label="Email" name="email" type="email" required />
          <Field label="Password" name="password" type="password" required minLength={8} />
          {err && <p className="text-sm text-error" role="alert">{err}</p>}
          <Button type="submit" disabled={busy} className="w-full">{busy ? "Memproses..." : mode === "login" ? "Masuk" : "Buat akun"}</Button>
        </form>
        <p className="text-center text-sm text-outline">
          {mode === "login" ? <>Belum punya akun? <Link className="text-primary" href="/register">Daftar</Link></> : <>Sudah punya akun? <Link className="text-primary" href="/login">Masuk</Link></>}
        </p>
      </Card>
      <Dialog
        open={!!newKey}
        title="Akun berhasil dibuat ✨"
        actions={<Button onClick={() => router.push("/login")}>Lanjut ke login</Button>}
      >
        <p className="mb-3">Ini API key kamu. Key hanya ditampilkan <b>sekali</b>, simpan sekarang.</p>
        <div className="flex items-center gap-2 rounded-m3 bg-surface p-3">
          <code className="min-w-0 flex-1 break-all text-xs">{newKey}</code>
          <button aria-label="Salin" onClick={() => { navigator.clipboard.writeText(newKey); setCopied(true); }}>
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
      </Dialog>
    </main>
  );
}
