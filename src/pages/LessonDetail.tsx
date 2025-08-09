import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import CodeViewer from "@/components/CodeViewer";
import AssignmentRunner from "@/components/AssignmentRunner";
import { lessonsByCourse } from "@/data/lessons";
import { courses } from "@/data/courses";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

function extractFirstCodeBlock(text: string): { language: string; code: string; theory: string } {
  const regex = /```(\w+)?\n([\s\S]*?)```/m;
  const match = text.match(regex);
  if (!match) return { language: "javascript", code: "", theory: text.trim() };
  const language = (match[1] || "javascript").toLowerCase();
  const code = match[2].trim();
  const theory = (text.slice(0, match.index) + text.slice((match.index || 0) + match[0].length)).trim();
  return { language, code, theory };
}

export default function LessonDetail() {
  const { slug, lessonSlug } = useParams();
  const course = courses.find((c) => c.slug === slug);
  const lesson = useMemo(() => (slug ? (lessonsByCourse[slug] || []).find((l) => l.slug === lessonSlug) : undefined), [slug, lessonSlug]);

  const [prompt, setPrompt] = useState<string>(`Teach me ${lesson?.title || "this topic"} with a beginner-friendly explanation and a JS example.`);
  const [loading, setLoading] = useState(false);
  const [theory, setTheory] = useState<string>("");
  const [code, setCode] = useState<string>(lesson?.sampleCode || "");
  const [language, setLanguage] = useState<string>(lesson?.sampleLanguage || "javascript");

  const pageTitle = lesson && course ? `${lesson.title} – ${course.title} | ProfAI` : `Lesson – ProfAI`;
  const description = lesson ? lesson.description : `Interactive lesson with theory, code, and assignment.`;

  const generate = async () => {
    try {
      setLoading(true);
      const guide = `You are ProfAI, an expert tutor.\n1) Provide a concise, accurate theory explanation (6-12 bullets).\n2) Then include exactly ONE JavaScript code block that demonstrates the concept.\nUse a triple backtick block with the language set to javascript. Do not include any other code blocks.`;
      const message = `${guide}\n\nPrompt: ${prompt}`;
      const { data, error } = await supabase.functions.invoke("profai-chat", { body: { message } });
      if (error) throw error;
      const reply = (data as any)?.reply || "";
      const { language: lang, code, theory } = extractFirstCodeBlock(reply);
      setLanguage(lang || "javascript");
      setCode(code);
      setTheory(theory);
    } catch (e: any) {
      toast({ title: "Could not generate content", description: e?.message || "Try again", variant: "destructive" });
    } finally { setLoading(false); }
  };

  if (!course || !lesson) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-semibold mb-4">Lesson not found</h1>
        <Link to={`/courses/${slug || ""}/lessons`} className="story-link">Back to lessons</Link>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <article className="grid gap-6 md:grid-cols-3">
        <section className="md:col-span-2 space-y-4">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>{lesson.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/70 mb-4">{lesson.description}</p>
              <div className="space-y-3">
                <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ask ProfAI about this lesson (e.g., 'Teach me binary search')" />
                <Button onClick={generate} disabled={loading}>{loading ? "Generating…" : "Generate theory + code"}</Button>
              </div>
            </CardContent>
          </Card>

          {theory && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Theory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm">{theory}</div>
              </CardContent>
            </Card>
          )}

          <AssignmentRunner
            title={lesson.assignment.title}
            description={lesson.assignment.description}
            starterCode={lesson.assignment.starterCode}
            functionName={lesson.assignment.functionName}
            tests={lesson.assignment.tests}
          />
        </section>
        <aside className="md:col-span-1 space-y-4">
          <CodeViewer title="Code Window" language={language} code={code || (lesson.sampleCode || "")} />
        </aside>
      </article>
    </div>
  );
}
