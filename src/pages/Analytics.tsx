import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { day: "Mon", score: 62 },
  { day: "Tue", score: 64 },
  { day: "Wed", score: 68 },
  { day: "Thu", score: 71 },
  { day: "Fri", score: 75 },
];

export default function Analytics() {
  return (
    <div className="container py-10">
      <Helmet>
        <title>Progress Analytics – ProfAI</title>
        <meta name="description" content="Visualize your progress with charts and insights from your learning activity." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <h1 className="font-serif text-3xl font-semibold mb-6">Progress analytics</h1>

      <Card>
        <CardHeader>
          <CardTitle>Mastery over time</CardTitle>
        </CardHeader>
        <CardContent style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" domain={[50, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
