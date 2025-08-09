import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CodePlaygroundProps {
  title?: string;
  language?: string;
  initialValue?: string;
  height?: string | number;
}

const defaultMarkdown = `Role: You are a helpful AI professor.\nTask: Summarize the key parts of prompt engineering (Role, Task, Constraints, Examples).\nConstraints: Use bullet points, friendly tone, 5-7 lines.\nExample: Provide one before/after prompt.`;

export default function CodePlayground({
  title = "Practice Playground",
  language = "markdown",
  initialValue = defaultMarkdown,
  height = 420,
}: CodePlaygroundProps) {
  const [code, setCode] = useState<string>(initialValue);
  const [resetKey, setResetKey] = useState<number>(0);

  const handleReset = () => {
    setCode(initialValue);
    setResetKey((k) => k + 1);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleReset}>Reset</Button>
          <Button type="button" onClick={handleCopy}>Copy</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md overflow-hidden">
          <Editor
            key={resetKey}
            height={height}
            language={language}
            theme="vs-dark"
            value={code}
            options={{ fontSize: 14, minimap: { enabled: false } }}
            onChange={(val) => setCode(val ?? "")}
          />
        </div>
      </CardContent>
    </Card>
  );
}
