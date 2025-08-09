import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CodePlayground from "@/components/CodePlayground";
import ChatBox from "@/components/AIChat/ChatBox";
import { courses } from "@/data/courses";

export default function CourseDetail() {
  const { slug } = useParams();
  const course = courses.find((c) => c.slug === slug);

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
              <p className="text-sm text-foreground/70">{course.description}</p>
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
