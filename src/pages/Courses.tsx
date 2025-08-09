import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courses } from "@/data/courses";

export default function Courses() {
  return (
    <div className="container py-10">
      <Helmet>
        <title>Courses – ProfAI</title>
        <meta name="description" content="Browse all ProfAI courses across AI, ML, algorithms, data structures, and systems." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <h1 className="font-serif text-3xl font-semibold mb-6">All Courses</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <Card key={c.slug} className="animate-fade-in hover-scale shadow-sm transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle>{c.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/70 mb-3">{c.description}</p>
              <Link to={`/courses/${c.slug}`} className="story-link">View course</Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
