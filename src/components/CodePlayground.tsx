import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CodePlaygroundProps {
  title?: string;
  language?: string;
  initialValue?: string;
  height?: string | number;
}

const defaultMarkdown = `Role: You are a helpful AI professor.\nTask: Summarize the key parts of prompt engineering (Role, Task, Constraints, Examples).\nConstraints: Use bullet points, friendly tone, 5-7 lines.\nExample: Provide one before/after prompt.`;

export default function CodePlayground({
  title = "Practice Playground",
  language = "markdown",
  initialValue = defaultMarkdown,
  height = 420,
}: CodePlaygroundProps) {
  const [code, setCode] = useState<string>(initialValue);
  const [resetKey, setResetKey] = useState<number>(0);
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<string>("");
  const [loadingFeedback, setLoadingFeedback] = useState<boolean>(false);

  const handleReset = () => {
    setCode(initialValue);
    setResetKey((k) => k + 1);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  const handleSendToProfAI = async () => {
    try {
      window.dispatchEvent(
        new CustomEvent("profai:playground-send", { detail: { content: code } })
      );
      toast({ title: "Sent to ProfAI", description: "Your prompt was sent to the chat below." });
      await navigator.clipboard.writeText(code);
    } catch (e) {
      console.error("Send failed", e);
    }
  };

  const handleGetFeedback = async () => {
    try {
      setLoadingFeedback(true);
      const prompt = `Please review this ${language} snippet and provide concise, kind, actionable feedback (3-6 bullet points). If there are errors, show corrected code in a short block.\n\n[CODE]\n${code}`;
      const { data, error } = await supabase.functions.invoke("profai-chat", {
        body: { message: prompt },
      });
      if (error) throw error;
      const reply = (data as any)?.reply || "No feedback at the moment.";
      setFeedback(reply);
      toast({ title: "AI feedback ready", description: "Scroll below the editor." });
      try {
        const { awardBadgeIfNew } = await import("@/lib/badges");
        const res = await awardBadgeIfNew({ slug: "first_code_feedback", name: "First Feedback", description: "You requested AI feedback on your code.", icon: "🧠" });
        if (res.awarded) { toast({ title: "Badge earned!", description: "First Feedback badge unlocked." }); }
      } catch (_) {}
    } catch (e: any) {
      toast({ title: "Feedback failed", description: e?.message || "Try again later", variant: "destructive" });
    } finally { setLoadingFeedback(false); }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleReset} className="hover-scale">Reset</Button>
          <Button type="button" variant="secondary" onClick={handleGetFeedback} disabled={loadingFeedback} className="hover-scale">
            {loadingFeedback ? "Getting feedback…" : "Get Feedback"}
          </Button>
          <Button type="button" variant="secondary" onClick={handleSendToProfAI} className="hover-scale">Ask ProfAI</Button>
          <Button type="button" onClick={handleCopy} className="hover-scale">Copy</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md overflow-hidden">
          <Editor
            key={resetKey}
            height={height}
            language={language}
            theme="vs-dark"
            value={code}
            options={{ fontSize: 14, minimap: { enabled: false } }}
            onChange={(val) => setCode(val ?? "")}
          />
        </div>
        {feedback && (
          <div className="mt-4 rounded-md border p-3 animate-fade-in">
            <p className="text-sm font-medium mb-2">AI Feedback</p>
            <pre className="whitespace-pre-wrap text-sm">{feedback}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
