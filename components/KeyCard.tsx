"use client";
import { useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { Button, Card, Dialog } from "@/components/ui";

export default function KeyCard({ preview }: { preview: string }) {
  const [current, setCurrent] = useState(preview);
  const [confirm, setConfirm] = useState(false);
  const [fresh, setFresh] = useState("");
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  async function regenerate() {
    setBusy(true);
    const j = await (await fetch("/api/dashboard/regenerate", { method: "POST" })).json();
    setBusy(false); setConfirm(false);
    if (j.success) { setFresh(j.data.api_key); setCurrent(j.data.api_key_preview); setCopied(false); }
  }

  return (
    <Card className="space-y-4">
      <h2 className="font-heading text-xl">API Key</h2>
      <div className="flex items-center justify-between gap-2 rounded-m3 bg-surface-variant p-3">
        <code className="truncate text-sm">{current}</code>
        <Button variant="outlined" onClick={() => setConfirm(true)}><RefreshCw size={16} />Regenerate</Button>
      </div>
      <p className="text-xs text-outline">Key lengkap tidak bisa ditampilkan ulang. Regenerate jika hilang.</p>

      <Dialog open={confirm} title="Regenerate API key?" actions={<><Button variant="text" onClick={() => setConfirm(false)}>Batal</Button><Button variant="danger" disabled={busy} onClick={regenerate}>Ya, buat baru</Button></>}>
        Key lama langsung tidak berlaku.
      </Dialog>
      <Dialog open={!!fresh} title="Key baru" actions={<Button onClick={() => setFresh("")}>Selesai</Button>}>
        <p className="mb-3">Simpan sekarang, hanya tampil sekali.</p>
        <div className="flex items-center gap-2 rounded-m3 bg-surface p-3">
          <code className="min-w-0 flex-1 break-all text-xs">{fresh}</code>
          <button aria-label="Salin" onClick={() => { navigator.clipboard.writeText(fresh); setCopied(true); }}>{copied ? <Check size={18} /> : <Copy size={18} />}</button>
        </div>
      </Dialog>
    </Card>
  );
}
