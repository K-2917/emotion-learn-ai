import { Helmet } from "react-helmet-async";
import ChatBox from "@/components/AIChat/ChatBox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CodePlayground from "@/components/CodePlayground";
import CodeViewer from "@/components/CodeViewer";
import { useParams } from "react-router-dom";
import { courses } from "@/data/courses";

export default function Lesson() {
  const { id } = useParams();
  const course = courses.find((c) => c.slug === id);
  const pageTitle = course ? `${course.title} – Lesson | ProfAI` : `Lesson – ProfAI`;

  const { exampleCode, exampleLang } = (() => {
    const slug = (course?.slug || "").toLowerCase();
    if (slug.includes("algorithm") || slug.includes("complex")) {
      return {
        exampleLang: "typescript",
        exampleCode: `// Binary Search (TypeScript)\nfunction binarySearch(arr: number[], target: number): number {\n  let lo = 0, hi = arr.length - 1;\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;\n  }\n  return -1;\n}\n\nconsole.log(binarySearch([1,3,4,7,9,12], 7)); // 3`
      };
    }
    if (slug.includes("machine") || slug.includes("ml")) {
      return {
        exampleLang: "python",
        exampleCode: `# Simple train/validation split (Python)\nfrom sklearn.model_selection import train_test_split\nX_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)\n\n# Fit a model\nfrom sklearn.linear_model import LogisticRegression\nmodel = LogisticRegression()\nmodel.fit(X_train, y_train)\nprint(model.score(X_val, y_val))`
      };
    }
    return {
      exampleLang: course?.language || "markdown",
      exampleCode: (course?.initialValue as string) || "// Explore and practice here!"
    };
  })();

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
          <CodeViewer title="Lesson Code Window" language={exampleLang as any} code={exampleCode} />
        </aside>
      </article>
    </div>
  );
}
