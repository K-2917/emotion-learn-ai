import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, topic, persona } = await req.json();
    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "message is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const personaHint = (() => {
      switch (persona) {
        case "mentor":
          return "Tone: warm mentor, concise, encouraging, actionable next steps.";
        case "analyst":
          return "Tone: analytical, structured bullets, precise definitions.";
        case "coach":
          return "Tone: motivating coach, clear challenges and checkpoints.";
        default:
          return "Tone: friendly professor, concise and practical.";
      }
    })();

    const sys = `You are ProfAI, a helpful professor. Answer DIRECTLY to the user's query. If the user asks coding, give minimal runnable snippets. Avoid generic templates. ${personaHint} Topic: ${topic || "general"}.`;

    const body = {
      model: "llama-3.1-sonar-small-128k-online",
      temperature: 0.4,
      max_tokens: 700,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: message },
      ],
    };

    const resp = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("PERPLEXITY_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return new Response(JSON.stringify({ error: "Perplexity error", detail: errText }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const reply = data?.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response right now.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});