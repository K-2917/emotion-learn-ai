import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Volume2, Send } from "lucide-react";

const PROFESSOR_SYSTEM_PROMPT = `
You are ProfAI, an encouraging MIT-style AI professor specializing in prompt engineering.

PERSONALITY:
- Encouraging and patient, like a favorite teacher
- Breaks down complex concepts into simple analogies
- Celebrates small wins and progress
- Adapts explanations when sensing confusion

TEACHING STYLE:
- Use the Socratic method - ask guiding questions
- Provide concrete examples and real-world applications  
- Check understanding frequently ("Does this make sense so far?")
- Offer multiple explanation approaches if needed

EMOTION AWARENESS:
- Watch for signs of confusion in user responses
- If user says "I don't understand" → simplify and use different approach
- If user seems confident → add more challenging questions
- Always end with encouragement and next steps
`;

function detectConfusionLevel(userMessage: string) {
  const confusionKeywords = ["confused", "don't understand", "lost", "difficult", "hard"];
  const confidenceKeywords = ["got it", "understand", "clear", "easy", "makes sense"];

  const msg = userMessage.toLowerCase();
  if (confusionKeywords.some((w) => msg.includes(w))) return "confused" as const;
  if (confidenceKeywords.some((w) => msg.includes(w))) return "confident" as const;
  return "neutral" as const;
}

const lessonStructure = {
  introduction: "Brief concept overview",
  explanation: "Main teaching content",
  checkUnderstanding: "Ask student to explain back",
  practice: "Quick interactive exercise",
  summary: "Key takeaways and next steps",
};

function speakLesson(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.9;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find((v) => v.name.toLowerCase().includes("female")) || voices[0];
  if (preferred) utter.voice = preferred;
  window.speechSynthesis.speak(utter);
}

interface Message { role: "user" | "assistant"; content: string }

export default function ChatBox({ demo = false }: { demo?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "I'm ProfAI. What aspect of prompt engineering are you curious about today? We can start with clarity, constraints, or role prompting.",
    },
  ]);
  const [input, setInput] = useState("");
  const [speaking, setSpeaking] = useState(true);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const emotionPrompt = useMemo(() => {
    const interactions = messages.filter((m) => m.role === "user").length;
    return interactions > 0 && interactions % 3 === 0;
  }, [messages]);

  const generateAssistantReply = (userText: string) => {
    const mood = detectConfusionLevel(userText);
    const baseIntro = mood === "confused"
      ? "I hear that this feels tricky. Let's slow down and try a simpler angle."
      : mood === "confident"
      ? "Great! Since you're comfortable, let's push a bit further."
      : "Great question. We'll build this up step-by-step.";

    const content = `\n${baseIntro}\n\n1) ${lessonStructure.introduction}: Think of a prompt like giving directions to a friend—clear, specific, and with context.\n\n2) ${lessonStructure.explanation}: Try using Role + Task + Constraints + Examples. For instance: \\"You are a meticulous editor. Improve clarity of the paragraph below using bullet points, keeping the original meaning.\\"\n\n3) ${lessonStructure.checkUnderstanding}: How would you structure a prompt for summarizing a long article for a beginner?\n\n4) ${lessonStructure.practice}: Write a prompt using Role + Task + Constraints for a topic you care about.\n\n5) ${lessonStructure.summary}: Clear structure + concrete constraints = reliable outputs. You're doing great—want to try another example?`;

    return content + "\n\n" + (mood === "confused" ? "Does this simpler framing help?" : "Does this make sense so far?");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const next = [...messages, { role: "user", content: text } as Message];
    const reply = generateAssistantReply(text);
    const withReply = [...next, { role: "assistant", content: reply } as Message];
    setMessages(withReply);
    setInput("");
    if (speaking) speakLesson(reply);
  };

  return (
    <Card id="demo" className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-primary" aria-hidden /> ProfAI Demo Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          ref={listRef}
          className="max-h-[360px] overflow-y-auto rounded-md border p-4 bg-card/70"
          aria-live="polite"
        >
          {messages.map((m, i) => (
            <div key={i} className={`mb-3 ${m.role === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`inline-block rounded-lg px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {emotionPrompt && (
          <div className="rounded-md border p-3">
            <p className="text-sm mb-2">How are you feeling about this concept?</p>
            <div className="flex flex-wrap gap-2">
              {["confused", "okay", "confident"].map((mood) => (
                <Button
                  key={mood}
                  variant={mood === "confident" ? "default" : "secondary"}
                  onClick={() => {
                    const tag = `I'm feeling ${mood}.`;
                    setMessages((prev) => [...prev, { role: "user", content: tag }]);
                    const reply = generateAssistantReply(tag);
                    setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
                    if (speaking) speakLesson(reply);
                  }}
                >
                  {mood}
                </Button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask ProfAI anything about prompts..."
            aria-label="Your message to ProfAI"
          />
          <Button type="submit" aria-label="Send message">
            <Send className="h-4 w-4" />
          </Button>
        </form>

        <div className="flex items-center gap-3">
          <Switch id="speak" checked={speaking} onCheckedChange={setSpeaking} />
          <Label htmlFor="speak">Speak responses</Label>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              toast({ title: "Reset chat", description: "Starting a fresh conversation." });
              setMessages(messages.slice(0, 1));
            }}
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
