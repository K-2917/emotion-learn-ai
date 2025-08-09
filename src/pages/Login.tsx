import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  return (
    <div className="container py-12">
      <Helmet>
        <title>Login – ProfAI</title>
        <meta name="description" content="Log in to your ProfAI account to track progress and continue lessons." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
            <Button className="w-full">Log in</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
