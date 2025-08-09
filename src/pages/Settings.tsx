import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

export default function Settings() {
  const [tts, setTts] = useState(true);
  const [dark, setDark] = useState(false);

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

  return (
    <div className="container py-10">
      <Helmet>
        <title>Settings – ProfAI</title>
        <meta name="description" content="Set your learning preferences for ProfAI, including dark mode and text-to-speech." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <h1 className="font-serif text-3xl font-semibold mb-6">Settings</h1>

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
  );
}
