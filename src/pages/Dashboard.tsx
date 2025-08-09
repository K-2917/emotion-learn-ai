import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { courses } from "@/data/courses";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function Dashboard() {
  return (
    <div className="container py-10">
      <Helmet>
        <title>Dashboard – ProfAI</title>
        <meta name="description" content="Track progress, jump back into courses, and see recent activity." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <h1 className="font-serif text-3xl font-semibold mb-6">Your learning journey</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={45} />
            <p className="mt-2 text-sm text-foreground/70">45% course completion</p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Recommended Next</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">Structuring for Reliability</p>
            <p className="text-sm text-foreground/70">Estimated 15 minutes</p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
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

      <h2 className="mt-10 text-xl font-semibold">Your Courses</h2>
      <div className="grid gap-4 mt-4 md:grid-cols-3">
        {courses.slice(0, 3).map((c) => (
          <Card key={c.slug} className="hover-scale">
            <CardHeader>
              <CardTitle className="text-base">{c.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/70 mb-2 line-clamp-2">{c.description}</p>
              <Link to={`/courses/${c.slug}`} className="story-link">Continue</Link>
            </CardContent>
          </Card>
        ))}
        <Card className="hover-scale">
          <CardHeader>
            <CardTitle className="text-base">Explore more</CardTitle>
          </CardHeader>
          <CardContent>
            <Link to="/courses" className="story-link">Browse all courses</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
