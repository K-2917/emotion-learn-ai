import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courses } from "@/data/courses";
import { lessonsByCourse } from "@/data/lessons";

export default function CourseLessons() {
  const { slug } = useParams();
  const course = courses.find((c) => c.slug === slug);
  const lessons = slug ? lessonsByCourse[slug] || [] : [];
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
        <h1 className="font-serif text-3xl font-semibold">{course ? course.title : "Course Lessons"}</h1>
        {course && (
          <p className="text-sm text-foreground/70 mt-2">{course.description}</p>
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
