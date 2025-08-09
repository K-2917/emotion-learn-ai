import { useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

function deepEqual(a: any, b: any): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object" || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    if (a.length !== (b as any[]).length) return false;
    for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], (b as any[])[i])) return false;
    return true;
  }
  const ak = Object.keys(a);
  const bk = Object.keys(b as Record<string, any>);
  if (ak.length !== bk.length) return false;
  for (const k of ak) if (!deepEqual(a[k], (b as Record<string, any>)[k])) return false;
  return true;
}

type JsTestCase = { args: any[]; expected: any };

interface AssignmentRunnerProps {
  title?: string;
  description?: string;
  starterCode: string;
  functionName: string;
  tests: JsTestCase[];
  height?: number | string;
}

export default function AssignmentRunner({
  title = "Assignment",
  description,
  starterCode,
  functionName,
  tests,
  height = 360,
}: AssignmentRunnerProps) {
  const [code, setCode] = useState<string>(starterCode);
  const [resetKey, setResetKey] = useState<number>(0);
  const [results, setResults] = useState<{ pass: boolean; got: any; expected: any }[] | null>(null);

  const runTests = () => {
    try {
      const sandboxConsole: string[] = [];
      const fn = new Function(
        "console",
        `${code}\nreturn ${functionName};`
      )({
        log: (...args: any[]) => sandboxConsole.push(args.join(" ")),
      });

      const out: { pass: boolean; got: any; expected: any }[] = [];
      for (const t of tests) {
        let got: any;
        try {
          got = fn(...t.args);
        } catch (err) {
          got = String(err);
        }
        const pass = deepEqual(got, t.expected);
        out.push({ pass, got, expected: t.expected });
      }
      setResults(out);
      const passed = out.filter((r) => r.pass).length;
      if (passed === tests.length) {
        toast({ title: "All tests passed!", description: `${passed}/${tests.length} ✅` });
      } else {
        toast({ title: "Some tests failed", description: `${passed}/${tests.length} passed`, variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Could not run tests", description: e?.message || "Check your code", variant: "destructive" });
    }
  };

  const summary = useMemo(() => {
    if (!results) return null;
    const passed = results.filter((r) => r.pass).length;
    return `${passed}/${results.length} tests passed`;
  }, [results]);

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setCode(starterCode); setResetKey((k) => k + 1); }}>Reset</Button>
          <Button onClick={runTests}>Run Tests</Button>
        </div>
      </CardHeader>
      <CardContent>
        {description && (
          <p className="text-sm text-foreground/70 mb-3">{description}</p>
        )}
        <div className="border rounded-md overflow-hidden">
          <Editor
            key={resetKey}
            height={height}
            language="javascript"
            theme="vs-dark"
            value={code}
            options={{ fontSize: 14, minimap: { enabled: false } }}
            onChange={(val) => setCode(val ?? "")}
          />
        </div>
        {summary && (
          <div className="mt-3 text-sm font-medium">{summary}</div>
        )}
        {results && (
          <ul className="mt-2 text-sm space-y-1">
            {results.map((r, i) => (
              <li key={i} className={r.pass ? "text-green-600" : "text-red-600"}>
                Case {i + 1}: {r.pass ? "Pass" : "Fail"} — got {JSON.stringify(r.got)} expected {JSON.stringify(r.expected)}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
