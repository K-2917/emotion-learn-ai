import { Helmet } from "react-helmet-async";
import ChatBox from "@/components/AIChat/ChatBox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CodePlayground from "@/components/CodePlayground";

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
          <Card className="animate-fade-in">
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

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>How to use the playground with ProfAI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <ol className="list-decimal pl-5 space-y-1">
                <li>Type or edit the prompt in the editor below.</li>
                <li>Click “Ask ProfAI” to send it straight to the chat on the right.</li>
                <li>Review ProfAI’s feedback and iterate in the editor—repeat quickly.</li>
              </ol>
              <p>
                Tip: You can also copy your prompt and paste it into the chat. Jump to chat:
                <a href="#profai-chat" className="story-link ml-1">Go to ProfAI</a>
              </p>
            </CardContent>
          </Card>

          <CodePlayground
            title="Hands-on: Improve this prompt"
            language="markdown"
            initialValue={`Role: You are an expert tutor.\nTask: Rewrite the prompt to be clearer and more constrained.\nConstraints: Tone: friendly, Length: 5-7 sentences, Audience: beginners.\nExample:\n- Before: "Explain prompt engineering."\n- After: "As a mentor, outline Role+Task+Constraints+Examples for prompt engineering with a short example."`}
          />
        </section>
        <aside className="md:col-span-1">
          <ChatBox />
        </aside>
      </article>
    </div>
  );
}
