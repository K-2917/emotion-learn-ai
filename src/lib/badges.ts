import { supabase } from "@/integrations/supabase/client";

export type BadgeSeed = {
  slug: string;
  name: string;
  description?: string;
  icon?: string;
};

// Ensures a badge exists, returns its id
export async function ensureBadge(b: BadgeSeed): Promise<string | null> {
  const { data: existing, error: selErr } = await supabase
    .from("badges")
    .select("id")
    .eq("slug", b.slug)
    .maybeSingle();
  if (selErr) {
    console.warn("ensureBadge select error", selErr);
  }
  if (existing?.id) return existing.id;

  const { data: inserted, error: insErr } = await supabase
    .from("badges")
    .insert({ slug: b.slug, name: b.name, description: b.description || null, icon: b.icon || null })
    .select("id")
    .maybeSingle();

  if (insErr) {
    console.warn("ensureBadge insert error", insErr);
    return null;
  }
  return inserted?.id || null;
}

// Awards a badge to current user if not already awarded.
export async function awardBadgeIfNew(b: BadgeSeed): Promise<{ awarded: boolean; reason?: string }>
{
  const { data: session } = await supabase.auth.getSession();
  const uid = session.session?.user?.id;
  if (!uid) return { awarded: false, reason: "not-authenticated" };

  const badgeId = await ensureBadge(b);
  if (!badgeId) return { awarded: false, reason: "badge-unavailable" };

  const { data: existing, error: ubErr } = await supabase
    .from("user_badges")
    .select("id")
    .eq("user_id", uid)
    .eq("badge_id", badgeId)
    .maybeSingle();
  if (ubErr) {
    console.warn("awardBadgeIfNew check error", ubErr);
  }
  if (existing?.id) return { awarded: false, reason: "already-earned" };

  const { error: insertErr } = await supabase
    .from("user_badges")
    .insert({ user_id: uid, badge_id: badgeId });
  if (insertErr) {
    console.warn("awardBadgeIfNew insert error", insertErr);
    return { awarded: false, reason: "insert-failed" };
  }
  return { awarded: true };
}
