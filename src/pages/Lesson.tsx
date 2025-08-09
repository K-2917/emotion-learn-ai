import { Helmet } from "react-helmet-async";
import ChatBox from "@/components/AIChat/ChatBox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CodePlayground from "@/components/CodePlayground";
import { useParams } from "react-router-dom";
import { courses } from "@/data/courses";

export default function Lesson() {
  const { id } = useParams();
  const course = courses.find((c) => c.slug === id);
  const pageTitle = course ? `${course.title} – Lesson | ProfAI` : `Lesson – ProfAI`;

  return (
    <div className="container py-10">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={course ? course.description : "Study the lesson then practice immediately with ProfAI in the integrated chat."} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <article className="grid gap-6 md:grid-cols-3">
        <section className="md:col-span-2 space-y-4">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>{course ? course.title : "Prompt Clarity and Structure"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {course ? (
                <p className="text-sm text-foreground/80">{course.description}</p>
              ) : (
                <>
                  <p>
                    In this lesson, we explore how to structure prompts using Role + Task + Constraints + Examples.
                    Clear constraints improve reliability and reduce ambiguity.
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Provide role and domain context</li>
                    <li>Specify the task and format</li>
                    <li>Add constraints (tone, length, audience)</li>
                    <li>Include examples when helpful</li>
                  </ul>
                </>
              )}
            </CardContent>
          </Card>

          <CodePlayground
            title={course ? `Playground: ${course.title}` : "Hands-on: Improve this prompt"}
            language={course?.language || "markdown"}
            initialValue={course?.initialValue || `Role: You are an expert tutor.\nTask: Rewrite the prompt to be clearer and more constrained.\nConstraints: Tone: friendly, Length: 5-7 sentences, Audience: beginners.\nExample:\n- Before: "Explain prompt engineering."\n- After: "As a mentor, outline Role+Task+Constraints+Examples for prompt engineering with a short example."`}
          />
        </section>
        <aside className="md:col-span-1">
          <ChatBox courseTopic={course?.topic} />
        </aside>
      </article>
    </div>
  );
}
