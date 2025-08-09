import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { courses } from "@/data/courses";
import { lessonsByCourse } from "@/data/lessons";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [resume, setResume] = useState<{ slug: string; lessonSlug: string; courseTitle: string; lessonTitle: string } | null>(null);

  useEffect(() => {
    try {
      let latest: { slug: string; lessonSlug: string; t: number } | null = null;
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k || !k.startsWith("progress:")) continue;
        const parts = k.split(":");
        if (parts.length < 3) continue;
        const slug = parts[1];
        const lessonSlug = parts[2];
        const raw = localStorage.getItem(k);
        if (!raw) continue;
        try {
          const data = JSON.parse(raw);
          const t = typeof data?.t === "number" ? data.t : 0;
          if (!latest || t > latest.t) latest = { slug, lessonSlug, t };
        } catch {}
      }
      if (latest) {
        const course = courses.find((c) => c.slug === latest!.slug);
        const lesson = (lessonsByCourse[latest.slug] || []).find((l) => l.slug === latest!.lessonSlug);
        setResume({
          slug: latest.slug,
          lessonSlug: latest.lessonSlug,
          courseTitle: course?.title || latest.slug,
          lessonTitle: lesson?.title || latest.lessonSlug,
        });
      }
    } catch {}
  }, []);

  return (
    <div className="container py-10">
      <Helmet>
        <title>Dashboard – ProfAI</title>
        <meta name="description" content="Track progress, jump back into courses, and see recent activity." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <h1 className="font-serif text-3xl font-semibold mb-6">Your learning journey</h1>

      {resume && (
        <Card className="mb-6 animate-fade-in shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg">Resume your last lesson</CardTitle>
            <Button asChild>
              <Link to={`/courses/${resume.slug}/lessons/${resume.lessonSlug}`}>Resume now</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/70">
              {resume.courseTitle} — {resume.lessonTitle}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={45} />
            <p className="mt-2 text-sm text-foreground/70">45% course completion</p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Recommended Next</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">Structuring for Reliability</p>
            <p className="text-sm text-foreground/70">Estimated 15 minutes</p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2 flex-wrap">
            <Badge>First Prompt</Badge>
            <Badge>Consistency Star</Badge>
            <Badge>Curious Mind</Badge>
          </CardContent>
        </Card>
      </div>

      <h2 className="mt-10 text-xl font-semibold">Your Courses</h2>
      <div className="grid gap-4 mt-4 md:grid-cols-3">
        {courses.slice(0, 3).map((c) => (
          <Card key={c.slug} className="hover-scale">
            <CardHeader>
              <CardTitle className="text-base">{c.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/70 mb-2 line-clamp-2">{c.description}</p>
              <Link to={`/courses/${c.slug}`} className="story-link">Continue</Link>
            </CardContent>
          </Card>
        ))}
        <Card className="hover-scale">
          <CardHeader>
            <CardTitle className="text-base">Explore more</CardTitle>
          </CardHeader>
          <CardContent>
            <Link to="/courses" className="story-link">Browse all courses</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
