import { Helmet } from "react-helmet-async";
import ChatBox from "@/components/AIChat/ChatBox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Lesson() {
  return (
    <div className="container py-10">
      <Helmet>
        <title>Lesson – ProfAI</title>
        <meta name="description" content="Study the lesson then practice immediately with ProfAI in the integrated chat." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <article className="grid gap-6 md:grid-cols-3">
        <section className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prompt Clarity and Structure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
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
            </CardContent>
          </Card>
        </section>
        <aside className="md:col-span-1">
          <ChatBox />
        </aside>
      </article>
    </div>
  );
}
