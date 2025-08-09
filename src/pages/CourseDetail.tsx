import { Helmet } from "react-helmet-async";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CodePlayground from "@/components/CodePlayground";
import ChatBox from "@/components/AIChat/ChatBox";
import { courses } from "@/data/courses";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const course = courses.find((c) => c.slug === slug);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const u = session?.user;
      if (u && course) {
        const { data } = await supabase
          .from("enrollments")
          .select("id")
          .eq("user_id", u.id)
          .eq("course_slug", course.slug)
          .maybeSingle();
        if (data) setEnrolled(true);
      }
    })();
  }, [slug]);

  if (!course) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-semibold mb-4">Course not found</h1>
        <Link to="/courses" className="story-link">Back to courses</Link>
      </div>
    );
  }

  const title = `${course.title} – ProfAI`;
  const description = course.description;

  const handleEnroll = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const u = session?.user;
    if (!u) {
      navigate("/login");
      setLoading(false);
      return;
    }
    const { error: enrollErr } = await supabase.from("enrollments").insert({ user_id: u.id, course_slug: course.slug });
    if (enrollErr && enrollErr.code !== "23505") {
      toast({ title: "Could not enroll", description: enrollErr.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    setEnrolled(true);

    // Award starter badge
    const { data: badge } = await supabase.from("badges").select("id, name").eq("slug", "first_enrollment").maybeSingle();
    if (badge?.id) {
      await supabase.from("user_badges").upsert({ user_id: u.id, badge_id: badge.id }, { onConflict: "user_id,badge_id" });
      const shareText = `I just enrolled in ${course.title} on ProfAI and earned the '${badge.name}' badge! 🎉`;
      if (navigator.share) {
        try { await navigator.share({ title: "ProfAI", text: shareText }); } catch {}
      } else {
        try { await navigator.clipboard.writeText(shareText); toast({ title: "Copied share text", description: "Share it on your socials!" }); } catch {}
      }
    }

    toast({ title: "Enrolled!", description: "Redirecting to lesson…" });
    navigate(`/lesson/${course.slug}`);
    setLoading(false);
  };

  return (
    <div className="container py-10">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <article className="grid gap-6 md:grid-cols-3">
        <section className="md:col-span-2 space-y-4">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/70 mb-4">{course.description}</p>
              <Button onClick={handleEnroll} disabled={loading || enrolled}>
                {enrolled ? "Enrolled" : loading ? "Enrolling…" : "Enroll & Start Lesson"}
              </Button>
            </CardContent>
          </Card>

          <CodePlayground
            title={`Playground: ${course.title}`}
            language={course.language}
            initialValue={course.initialValue}
          />
        </section>
        <aside className="md:col-span-1">
          <ChatBox courseTopic={course.topic} />
        </aside>
      </article>
    </div>
  );
}
