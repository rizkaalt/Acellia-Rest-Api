import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateApiKey } from "@/lib/apikey";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  username: z.string().trim().regex(/^[a-zA-Z0-9_]{3,24}$/, "Username 3-24 karakter (huruf, angka, _)"),
  email: z.string().trim().toLowerCase().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter").max(72),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "VALIDATION_ERROR", message: parsed.error.issues[0].message }, { status: 400 });
  }
  const { username, email, password } = parsed.data;
  const admin = createAdminClient();

  const { data: taken } = await admin.from("profiles").select("id").or(`username.eq.${username},email.eq.${email}`).limit(1);
  if (taken?.length) {
    return NextResponse.json({ success: false, error: "ALREADY_EXISTS", message: "Username atau email sudah dipakai." }, { status: 409 });
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error || !data.user) {
    return NextResponse.json({ success: false, error: "SIGNUP_FAILED", message: error?.message ?? "Gagal mendaftar." }, { status: 400 });
  }

  const { key, hash, preview } = generateApiKey();
  const { error: pErr } = await admin.from("profiles").insert({
    id: data.user.id, username, email, api_key_hash: hash, api_key_preview: preview, tier: "free",
  });  
  if (pErr) {
    console.error("PROFILE_INSERT_ERROR:", pErr.code, pErr.message, pErr.details, pErr.hint);
    await admin.auth.admin.deleteUser(data.user.id);
    return NextResponse.json({ success: false, error: "PROFILE_FAILED", message: "Gagal membuat profil." }, { status: 500 });
  }
  // Key mentah hanya dikembalikan sekali ini.
  return NextResponse.json({ success: true, data: { api_key: key, api_key_preview: preview }, message: "Registrasi berhasil." });
}
