import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    </div>
  );
}
