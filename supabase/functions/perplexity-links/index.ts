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
    const { topic } = await req.json().catch(() => ({ topic: "" }));
    const q = typeof topic === "string" && topic.trim().length > 0 ? topic : "computer science";

    const prompt = `Return strictly a JSON object with a "links" array of 5 objects: { "title": string, "url": string }.
The links should be beginner-friendly, reputable, and useful to study ${q}. No commentary, only JSON.`;

    const resp = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("PERPLEXITY_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        temperature: 0.2,
        messages: [
          { role: "system", content: "Be precise. Return only valid JSON per instructions." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return new Response(
        JSON.stringify({ error: "Perplexity API error", detail: errText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await resp.json();
    let content: string = data?.choices?.[0]?.message?.content || "";

    let parsed: any = null;
    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        try { parsed = JSON.parse(match[0]); } catch {}
      }
    }

    if (!parsed?.links || !Array.isArray(parsed.links)) {
      return new Response(
        JSON.stringify({ error: "Unexpected response format", raw: content }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ links: parsed.links.slice(0, 5) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e?.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});