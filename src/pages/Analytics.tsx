import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";

const data = [
  { day: "Mon", score: 62, minutes: 30 },
  { day: "Tue", score: 64, minutes: 32 },
  { day: "Wed", score: 68, minutes: 38 },
  { day: "Thu", score: 71, minutes: 44 },
  { day: "Fri", score: 75, minutes: 46 },
];

const topicBreakdown = [
  { topic: "Role prompting", mastery: 72 },
  { topic: "Constraints", mastery: 65 },
  { topic: "Examples", mastery: 78 },
  { topic: "Evaluation", mastery: 58 },
];

const activitySplit = [
  { name: "Theory", value: 40 },
  { name: "Practice", value: 35 },
  { name: "Chat", value: 25 },
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--muted-foreground))"];

export default function Analytics() {
  return (
    <div className="container py-10">
      <Helmet>
        <title>Learning Analytics & Insights – ProfAI</title>
        <meta name="description" content="Track mastery, time spent, topic breakdowns, and activity mix to guide your learning." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <h1 className="font-serif text-3xl font-semibold mb-6">Learning analytics & insights</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Mastery", value: "75%" },
          { label: "Weekly mins", value: data.reduce((a, b) => a + b.minutes, 0) + "m" },
          { label: "Active days", value: data.length },
          { label: "Streak", value: "5 days" },
        ].map((kpi) => (
          <Card key={kpi.label} className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">{kpi.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Mastery over time */}
        <Card className="md:col-span-2 animate-fade-in">
          <CardHeader>
            <CardTitle>Mastery over time</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={[50, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorPrimary)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity split */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Activity split</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={activitySplit} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>
                  {activitySplit.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        {/* Topic breakdown */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Topic breakdown</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicBreakdown} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="topic" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="mastery" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Time spent */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Time spent (min)</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Line type="monotone" dataKey="minutes" stroke="hsl(var(--secondary))" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
