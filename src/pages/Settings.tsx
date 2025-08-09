import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge as BadgePill } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function Settings() {
  const [tts, setTts] = useState(true);
  const [dark, setDark] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Badges state
  const [badges, setBadges] = useState<{
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    earned_at: string;
  }[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(false);

  useEffect(() => {
    const storedTts = localStorage.getItem("pref_tts");
    const storedDark = localStorage.getItem("pref_dark");
    if (storedTts) setTts(storedTts === "1");
    if (storedDark) setDark(storedDark === "1");
  }, []);

  useEffect(() => {
    localStorage.setItem("pref_tts", tts ? "1" : "0");
  }, [tts]);
  useEffect(() => {
    localStorage.setItem("pref_dark", dark ? "1" : "0");
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    // Load session and profile
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const u = session?.user;
      if (u) {
        setUserId(u.id);
        const { data } = await supabase.from("profiles").select("display_name, avatar_url").eq("id", u.id).maybeSingle();
        setDisplayName(data?.display_name || u.email?.split("@")[0] || "");
        setAvatarUrl(data?.avatar_url || "");
      }
    })();
  }, []);

  // Load badges when we know the user
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        setLoadingBadges(true);
        const { data: ub, error: ubErr } = await supabase
          .from("user_badges")
          .select("badge_id, earned_at")
          .eq("user_id", userId)
          .order("earned_at", { ascending: false });
        if (ubErr) throw ubErr;
        const ids = (ub || []).map((r) => r.badge_id);
        if (ids.length === 0) { setBadges([]); return; }
        const { data: bd, error: bErr } = await supabase
          .from("badges")
          .select("id, name, description, icon")
          .in("id", ids);
        if (bErr) throw bErr;
        const merged = ids
          .map((id) => {
            const meta = bd?.find((b) => b.id === id);
            const earned = ub?.find((u) => u.badge_id === id)?.earned_at || new Date().toISOString();
            return meta ? { id, name: meta.name, description: meta.description || null, icon: meta.icon || null, earned_at: earned } : null;
          })
          .filter(Boolean) as any[];
        setBadges(merged);
      } catch (e: any) {
        console.warn("Load badges failed", e);
      } finally {
        setLoadingBadges(false);
      }
    })();
  }, [userId]);

  const saveAccount = async () => {
    if (!userId) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ display_name: displayName }).eq("id", userId);
    setSaving(false);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else toast({ title: "Saved", description: "Account updated" });
  };

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userId) return;
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${userId}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) {
      toast({ title: "Upload failed", description: upErr.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const publicUrl = data.publicUrl;
    const { error: profErr } = await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", userId);
    setUploading(false);
    if (profErr) toast({ title: "Update failed", description: profErr.message, variant: "destructive" });
    else {
      setAvatarUrl(publicUrl);
      toast({ title: "Avatar updated" });
    }
  };

  const shareBadge = async (b: { name: string }) => {
    const shareText = `I just earned the "${b.name}" badge on ProfAI!`;
    const shareUrl = window.location.origin;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My ProfAI Badge', text: shareText, url: shareUrl });
      } else {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&via=ProfAI`;
        window.open(url, '_blank');
      }
    } catch {
      /* no-op */
    }
  };

  return (
    <div className="container py-10">
      <Helmet>
        <title>Settings – ProfAI</title>
        <meta name="description" content="Manage your account, avatar, and learning preferences." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <h1 className="font-serif text-3xl font-semibold mb-6">Settings</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={avatarUrl || undefined} alt="Avatar" />
                <AvatarFallback>{(displayName || "U").charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="avatar">Update profile picture</Label>
                <Input id="avatar" type="file" accept="image/*" onChange={onAvatarChange} disabled={!userId || uploading} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_name">Display name</Label>
              <Input id="display_name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" />
            </div>

            <Button onClick={saveAccount} disabled={!userId || saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="tts">Speak chat responses</Label>
              <Switch id="tts" checked={tts} onCheckedChange={setTts} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark">Dark mode</Label>
              <Switch id="dark" checked={dark} onCheckedChange={setDark} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements / Badges */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingBadges ? (
              <p className="text-sm text-muted-foreground">Loading your badges…</p>
            ) : badges.length === 0 ? (
              <p className="text-sm text-muted-foreground">No badges yet — try sending your first prompt or request feedback to get started.</p>
            ) : (
              <ul className="space-y-3">
                {badges.map((b) => (
                  <li key={b.id} className="flex items-center justify-between gap-3 rounded-md border p-3 bg-card/70">
                    <div className="flex items-center gap-3">
                      <span aria-hidden>{b.icon || "🏅"}</span>
                      <div>
                        <div className="font-medium">{b.name}</div>
                        {b.description ? (
                          <div className="text-xs text-muted-foreground">{b.description}</div>
                        ) : null}
                        <div className="mt-1">
                          <BadgePill variant="secondary">Earned {new Date(b.earned_at).toLocaleDateString()}</BadgePill>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => shareBadge(b)}>Share</Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
