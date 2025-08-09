import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  return (
    <div className="container py-10">
      <Helmet>
        <title>Dashboard – ProfAI</title>
        <meta name="description" content="Track your learning progress, see recommended lessons, and celebrate achievements." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <h1 className="font-serif text-3xl font-semibold mb-6">Your learning journey</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={45} />
            <p className="mt-2 text-sm text-foreground/70">45% course completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Next</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">Structuring for Reliability</p>
            <p className="text-sm text-foreground/70">Estimated 15 minutes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2 flex-wrap">
            <Badge>First Prompt</Badge>
            <Badge>Consistency Star</Badge>
            <Badge>Curious Mind</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
