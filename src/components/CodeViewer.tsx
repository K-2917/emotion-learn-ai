import Editor from "@monaco-editor/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CodeViewerProps {
  title?: string;
  language?: string;
  code: string;
  height?: number;
}

export default function CodeViewer({ title = "Code Examples", language = "typescript", code, height = 260 }: CodeViewerProps) {
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); } catch {}
  };
  const askProfAI = () => {
    try {
      window.dispatchEvent(new CustomEvent("profai:playground-send", { detail: { content: code } }));
    } catch {}
  };
  return (
    <Card className="mt-4">
      <CardHeader className="flex items-center justify-between flex-row space-y-0">
        <CardTitle className="text-base">{title}</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={copy}>Copy</Button>
          <Button size="sm" variant="outline" onClick={askProfAI}>Ask ProfAI</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md overflow-hidden">
          <Editor height={height} language={language} theme="vs-dark" value={code} options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }} />
        </div>
      </CardContent>
    </Card>
  );
}
