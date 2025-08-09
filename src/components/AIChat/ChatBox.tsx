import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Volume2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import avatarMentor from "@/assets/profai-avatar-mentor.png";
import avatarAnalyst from "@/assets/profai-avatar-analyst.png";
import avatarCoach from "@/assets/profai-avatar-coach.png";

const PROFESSOR_SYSTEM_PROMPT = `
You are ProfAI, a friendly, relatable professor who teaches AI fundamentals, algorithms, ML concepts, data structures, systems, and practical prompt engineering.

PERSONALITY:
- Warm, upbeat, and practical; talk like a helpful mentor
- Use real-life analogies (maps, recipes, checklists) and keep it concise
- Give direct, actionable next steps and celebrate small wins

TEACHING STYLE:
- Mix short explanations with tiny, concrete examples
- Ask 1 quick check-for-understanding question
- Offer a next action the student can take immediately

EMOTION AWARENESS:
- If confused → simplify, give a 1–2 line example
- If confident → add a small challenge or variation
- Always end with encouragement + one next step
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

// Simple topic detection
function topicFromText(text: string) {
  const t = text.toLowerCase();
  if (t.includes("machine learning") || t.includes("ml")) return "ml" as const;
  if (t.includes("data structure") || t.includes("linked list") || t.includes("tree") || t.includes("hash")) return "ds" as const;
  if (t.includes("algorithm") || t.includes("big-o") || t.includes("complexity") || t.includes("sorting") || t.includes("search")) return "algorithms" as const;
  if (t.includes("system design") || t.includes("scalability") || t.includes("architecture")) return "systems" as const;
  if (t.includes("ai fundamentals") || t.includes("ai") || t.includes("artificial intelligence")) return "ai" as const;
  return "general" as const;
}

const topicSnippets: Record<string, string> = {
  ai: "Example: 'Contrast narrow vs general AI in 2 lines and list one real-world risk.'",
  algorithms: "Example: 'Explain Big-O for binary search and include 5-line pseudocode.'",
  ml: "Example: 'Split data into train/val/test, choose a metric, and explain why in 3 bullets.'",
  ds: "Example: 'Choose between array vs linked list for many inserts; justify in 2 bullets.'",
  systems: "Example: 'Sketch a URL shortener API: endpoints, data model, and scaling constraints.'",
  general: "Example: 'State Role + Task + Constraints + Example for your tech topic in 4-6 lines.'",
};

const topicResources: Record<string, { title: string; url: string }[]> = {
  ai: [
    { title: "Stanford CS221: AI Principles", url: "https://stanford-cs221.github.io/spring2024/" },
    { title: "Wikipedia: Artificial intelligence", url: "https://en.wikipedia.org/wiki/Artificial_intelligence" },
    { title: "DeepLearning.AI AI For Everyone", url: "https://www.deeplearning.ai/courses/ai-for-everyone/" },
  ],
  algorithms: [
    { title: "CLRS book companion", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
    { title: "VisuAlgo: Visualize Algorithms", url: "https://visualgo.net/en" },
    { title: "Big-O Cheat Sheet", url: "https://www.bigocheatsheet.com/" },
  ],
  ml: [
    { title: "Scikit-learn Tutorials", url: "https://scikit-learn.org/stable/tutorial/index.html" },
    { title: "Andrew Ng ML Course", url: "https://www.coursera.org/learn/machine-learning" },
    { title: "Hands-On ML (O’Reilly)", url: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/" },
  ],
  ds: [
    { title: "UCSD Data Structures", url: "https://www.coursera.org/specializations/data-structures-algorithms" },
    { title: "CP-Algorithms (Data Structures)", url: "https://cp-algorithms.com/" },
    { title: "GeeksforGeeks Data Structures", url: "https://www.geeksforgeeks.org/data-structures/" },
  ],
  systems: [
    { title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" },
    { title: "High Scalability Blog", url: "http://highscalability.com/" },
    { title: "ByteByteGo Articles", url: "https://blog.bytebytego.com/" },
  ],
  general: [
    { title: "MIT OpenCourseWare", url: "https://ocw.mit.edu/" },
    { title: "Khan Academy Computer Science", url: "https://www.khanacademy.org/computing/computer-science" },
    { title: "CS50 2024", url: "https://cs50.harvard.edu/x/2024/" },
  ],
};

function speakLesson(text: string, voicePref?: "female" | "male" | "neutral") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.9;
  const voices = window.speechSynthesis.getVoices();
  let preferred: SpeechSynthesisVoice | undefined;
  if (voicePref === "female") preferred = voices.find((v) => /(samantha|victoria|female|zira|lucy)/i.test(v.name));
  if (voicePref === "male") preferred = voices.find((v) => /(alex|daniel|male|fred|george|david)/i.test(v.name));
  preferred = preferred || voices[0];
  if (preferred) utter.voice = preferred;
  window.speechSynthesis.speak(utter);
}

interface Message { role: "user" | "assistant"; content: string }

type TopicKey = "ai" | "algorithms" | "ml" | "ds" | "systems" | "general";

type PersonaKey = "mentor" | "analyst" | "coach";

const personas: Record<PersonaKey, { name: string; avatar: string; voice: "female" | "male" | "neutral" }> = {
  mentor: { name: "Dr. Mentor", avatar: avatarMentor, voice: "female" },
  analyst: { name: "Alex Analyst", avatar: avatarAnalyst, voice: "male" },
  coach: { name: "Coach Riley", avatar: avatarCoach, voice: "neutral" },
};

export default function ChatBox({ demo = false, courseTopic }: { demo?: boolean; courseTopic?: TopicKey }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey, I'm ProfAI — your friendly professor for prompts and tech. I can teach AI fundamentals, algorithms, ML concepts, data structures, and more. Pick a topic below or paste your prompt and I'll tighten it up with a quick example.",
    },
  ]);
  const [input, setInput] = useState("");
  const [speaking, setSpeaking] = useState(true);
  const [webRefs, setWebRefs] = useState<{ title: string; url: string }[] | null>(null);
  const [loadingRefs, setLoadingRefs] = useState(false);
  const [persona, setPersona] = useState<PersonaKey>("mentor");
  const [generating, setGenerating] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Accept prompts sent from the playground and reply immediately
  useEffect(() => {
    const handler = async (e: Event) => {
      const ce = e as CustomEvent<{ content?: string }>;
      const text = ce.detail?.content?.trim();
      if (!text) return;
      setMessages((prev) => [...prev, { role: "user", content: text }]);
      const reply = generateAssistantReply(text);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      if (speaking) speakLesson(reply, personas[persona].voice);
      toast({ title: "Sent from playground", description: "ProfAI replied in the chat." });
    };
    window.addEventListener("profai:playground-send", handler as EventListener);
    return () => window.removeEventListener("profai:playground-send", handler as EventListener);
  }, [speaking, persona]);

  const emotionPrompt = useMemo(() => {
    const interactions = messages.filter((m) => m.role === "user").length;
    return interactions > 0 && interactions % 3 === 0;
  }, [messages]);

  const currentTopic = useMemo<TopicKey>(() => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    return lastUser ? topicFromText(lastUser.content) : (courseTopic || "general");
  }, [messages, courseTopic]);

  const generateAssistantReply = (userText: string) => {
    const mood = detectConfusionLevel(userText);
    const topic = topicFromText(userText);
    const baseIntro =
      mood === "confused"
        ? "I hear this feels tricky—let’s slow down and try a simpler angle."
        : mood === "confident"
        ? "Nice! Since you're comfortable, let's push a bit further."
        : "Great question—let’s build this step-by-step.";

    const example = topicSnippets[topic];

    const content = `\n${baseIntro}\n\n1) ${lessonStructure.introduction}: A good prompt is like directions to a friend—clear, specific, and with context.\n\n2) ${lessonStructure.explanation}: Use Role + Task + Constraints + Example. ${example}\n\n3) ${lessonStructure.checkUnderstanding}: In 1–2 lines, how would you structure a prompt for this topic?\n\n4) ${lessonStructure.practice}: Write your prompt now using Role + Task + Constraints.\n\n5) ${lessonStructure.summary}: Structure + concrete constraints = reliable outputs. You're doing great—want to try another example?`;

    return content + "\n\n" + (mood === "confused" ? "Does this simpler framing help?" : "Does this make sense so far?");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setGenerating(true);
    const reply = generateAssistantReply(text);
    setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    if (speaking) speakLesson(reply, personas[persona].voice);
    setGenerating(false);
  };

  const loadWebRefs = async () => {
    try {
      setLoadingRefs(true);
      setWebRefs(null);
      const { data, error } = await supabase.functions.invoke("perplexity-links", {
        body: { topic: currentTopic },
      });
      if (error) throw error;
      const links = (data as any)?.links as { title: string; url: string }[] | undefined;
      if (links && Array.isArray(links)) setWebRefs(links);
      else throw new Error("No links returned");
    } catch (err: any) {
      toast({ title: "Couldn’t fetch web refs", description: err.message || "Try again later", variant: "destructive" });
    } finally {
      setLoadingRefs(false);
    }
  };

  return (
    <Card id="profai-chat" className="border-border animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <img src={personas[persona].avatar} alt={`${personas[persona].name} avatar`} className="h-6 w-6 rounded-full" />
            {personas[persona].name}
          </CardTitle>
          <div className="flex items-center gap-2">
            {(["mentor","analyst","coach"] as PersonaKey[]).map((key) => (
              <button
                key={key}
                aria-label={`Switch to ${personas[key].name}`}
                className={`rounded-full border p-[2px] ${persona === key ? "ring-2 ring-primary" : "opacity-80 hover:opacity-100"}`}
                onClick={() => setPersona(key)}
              >
                <img src={personas[key].avatar} alt={`Avatar ${key}`} className="h-7 w-7 rounded-full" />
              </button>
            ))}
          </div>
        </div>
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
                    if (speaking) speakLesson(reply, personas[persona].voice);
                  }}
                >
                  {mood}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        <div className="rounded-md border p-3">
          <p className="text-sm mb-2">Quick topics</p>
          <div className="flex flex-wrap gap-2">
            {["AI fundamentals", "Algorithms", "Machine Learning", "Data Structures", "System Design"].map((label) => (
              <Button
                key={label}
                variant="secondary"
                onClick={async () => {
                  const text = `Teach me ${label.toLowerCase()}.`;
                  setMessages((prev) => [...prev, { role: "user", content: text }]);
                  const reply = generateAssistantReply(text);
                  setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
                  if (speaking) speakLesson(reply, personas[persona].voice);
                }}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        <section className="rounded-md border p-3 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm">Resources to explore</p>
            <Button size="sm" variant="secondary" className="hover-scale" onClick={loadWebRefs} disabled={loadingRefs}>
              {loadingRefs ? "Loading…" : "Get web refs"}
            </Button>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            {(topicResources[currentTopic] || topicResources.general).map((r) => (
              <li key={r.url}>
                <a href={r.url} target="_blank" rel="noreferrer" className="story-link">{r.title}</a>
              </li>
            ))}
          </ul>
          {webRefs && webRefs.length > 0 && (
            <div className="mt-3 animate-fade-in">
              <p className="text-xs text-muted-foreground mb-1">More from the web</p>
              <ul className="list-disc pl-5 space-y-1">
                {webRefs.map((r) => (
                  <li key={r.url}>
                    <a href={r.url} target="_blank" rel="noreferrer" className="story-link">{r.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask ProfAI anything across AI, ML, algorithms, data structures, or systems…"
            aria-label="Your message to ProfAI"
          />
          <Button type="submit" aria-label="Send message" className="hover-scale">
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
