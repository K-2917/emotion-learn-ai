import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Onboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState("");
  const [goal, setGoal] = useState("");
  const [experience, setExperience] = useState("beginner");
  const [pace, setPace] = useState("standard");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // No async calls here per best practices
      if (!session?.user) navigate("/login", { replace: true });
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) {
        navigate("/login", { replace: true });
        return;
      }
      // Try to prefill from auth metadata
      const metaName = (session.user.user_metadata as any)?.display_name as string | undefined;
      if (metaName) setDisplayName(metaName);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) {
      setLoading(false);
      toast({ title: "You're not signed in", description: "Please log in to continue.", variant: "destructive" });
      navigate("/login");
      return;
    }

    const { error } = await supabase.from("profiles").upsert(
      {
        id: userId,
        display_name: displayName,
        goal,
        experience_level: experience,
        preferred_pace: pace,
      },
      { onConflict: "id" }
    );

    setLoading(false);

    if (error) {
      toast({ title: "Could not save profile", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Welcome to ProfAI!", description: "Your learning preferences are saved." });
    navigate("/dashboard");
  };

  return (
    <div className="container py-12">
      <Helmet>
        <title>Onboarding – ProfAI</title>
        <meta name="description" content="Set up your ProfAI profile and learning preferences." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <div className="mx-auto max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Tell us about your learning style</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="display_name">Display name</Label>
                  <Input id="display_name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g., Alex" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="experience">Experience level</Label>
                  <select id="experience" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={experience} onChange={(e) => setExperience(e.target.value)}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="goal">Primary goal</Label>
                <Input id="goal" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g., Master prompt engineering for work" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="pace">Preferred pace</Label>
                <select id="pace" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={pace} onChange={(e) => setPace(e.target.value)}>
                  <option value="slow">Slow and steady</option>
                  <option value="standard">Standard</option>
                  <option value="fast">Fast-tracked</option>
                </select>
              </div>

              <Button type="submit" disabled={loading} className="w-full">{loading ? "Saving..." : "Save and continue"}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
