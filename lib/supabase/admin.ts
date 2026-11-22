import "server-only";
import { createClient } from "@supabase/supabase-js";

// Hanya dipakai di server (route handler / server action). Jangan di-import dari client component.
export function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
