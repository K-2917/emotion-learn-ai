import Hero from "@/components/Hero";
import ChatBox from "@/components/AIChat/ChatBox";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const [isAuthed, setIsAuthed] = useState(false);
  useEffect(() => { supabase.auth.getSession().then(({ data: { session } }) => setIsAuthed(!!session?.user)); }, []);
  return (
    <>
      <Helmet>
        <title>ProfAI – Learn Prompt Engineering</title>
        <meta name="description" content="Course overview, demo lesson, and sign up for ProfAI—your emotionally intelligent AI professor." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <Hero />

      <section className="container py-12">
        <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-6">Course Preview</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {["Prompt Basics", "Structuring for Reliability", "Advanced Role Prompts"].map((title, i) => (
            <Card key={title} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <h3 className="font-medium">{title}</h3>
                <p className="text-sm text-foreground/70 mt-2">
                  {i === 0 && "Learn clarity, context, and constraints."}
                  {i === 1 && "Role + Task + Constraints + Examples framework."}
                  {i === 2 && "Design nuanced personas and constraints."}
                </p>
                <div className="mt-4">
                  <Progress value={i === 0 ? 40 : 0} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {!isAuthed && (
        <section className="container py-12">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">Try a Demo Lesson</h2>
          <p className="text-foreground/80 mb-6 max-w-2xl">
            Ask ProfAI a question and experience the hybrid teaching style—explanations plus immediate practice. You have 5 free prompts.
          </p>
          <ChatBox demo maxUserMessages={5} />
        </section>
      )}
    </>
  );
}
