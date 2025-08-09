import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/courses";
import { lessonsByCourse } from "@/data/lessons";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function CourseLessons() {
  const { slug } = useParams();
  const course = courses.find((c) => c.slug === slug);
  const lessons = slug ? lessonsByCourse[slug] || [] : [];
  const [lastLesson, setLastLesson] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (slug) {
      try {
        const saved = localStorage.getItem(`lastLesson:${slug}`);
        if (saved) setLastLesson(saved);
      } catch {}
    }
  }, [slug]);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const u = session?.user;
      if (u && slug) {
        const { data } = await supabase
          .from("enrollments")
          .select("id")
          .eq("user_id", u.id)
          .eq("course_slug", slug)
          .maybeSingle();
        if (data) setIsEnrolled(true);
      }
    })();
  }, [slug]);

  const handleUnenroll = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const u = session?.user;
    if (!u || !slug) { toast({ title: "Log in required", description: "Please log in to manage enrollment.", variant: "destructive" }); return; }
    await supabase.from("enrollments").delete().eq("user_id", u.id).eq("course_slug", slug);
    setIsEnrolled(false);
    toast({ title: "Unenrolled", description: "You can enroll again anytime." });
  };

  const title = course ? `${course.title} – Lessons | ProfAI` : "Lessons – ProfAI";
  const description = course ? `Lessons for ${course.title} with theory, code, and assignments.` : "Browse lessons.";

  return (
    <div className="container py-10">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <header className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-serif text-3xl font-semibold">{course ? course.title : "Course Lessons"}</h1>
          {isEnrolled && <Button variant="outline" onClick={handleUnenroll}>Unenroll</Button>}
        </div>
        {course && (
          <p className="text-sm text-foreground/70 mt-2">{course.description}</p>
        )}
        {lastLesson && (
          <div className="mt-3">
            <Button asChild>
              <Link to={`/courses/${slug}/lessons/${lastLesson}`}>Resume last lesson</Link>
            </Button>
          </div>
        )}
      </header>

      <main>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((l) => (
            <Card key={l.slug} className="animate-fade-in hover-scale">
              <CardHeader>
                <CardTitle>{l.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/70 mb-3">{l.description}</p>
                <Link to={`/courses/${slug}/lessons/${l.slug}`} className="story-link">Start lesson</Link>
              </CardContent>
            </Card>
          ))}
          {lessons.length === 0 && (
            <p className="text-sm text-foreground/70">No lessons defined yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
