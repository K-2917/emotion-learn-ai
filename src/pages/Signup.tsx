import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Signup() {
  return (
    <div className="container py-12">
      <Helmet>
        <title>Sign up – ProfAI</title>
        <meta name="description" content="Create your ProfAI account to learn prompt engineering with an AI professor." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
            <Button className="w-full">Create account</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
