import { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import * as htmlToImage from "html-to-image";

interface CertificateModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  badge: { name: string; icon?: string | null; earned_at?: string } | null;
  userName: string;
}

export default function CertificateModal({ open, onOpenChange, badge, userName }: CertificateModalProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const onDownload = async () => {
    if (!ref.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(ref.current, { pixelRatio: 2 });
      const link = document.createElement("a");
      const safeName = `${userName}-${badge?.name || "badge"}-certificate`.replace(/\s+/g, "-");
      link.download = `${safeName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (_) {}
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Shareable Certificate</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div
            ref={ref}
            className="rounded-lg border bg-gradient-to-br from-background to-muted p-6 text-center shadow-lg"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            <div className="text-sm text-muted-foreground">Certificate of Achievement</div>
            <div className="mt-2 text-3xl font-semibold">{badge?.icon || "🏅"} {badge?.name || "Badge"}</div>
            <div className="mt-4 text-base">Awarded to</div>
            <div className="text-2xl font-bold">{userName || "ProfAI Learner"}</div>
            <div className="mt-2 text-xs text-muted-foreground">on {badge?.earned_at ? new Date(badge.earned_at).toLocaleDateString() : new Date().toLocaleDateString()}</div>
            <div className="mt-6 text-sm">For demonstrating progress and dedication on ProfAI.</div>
            <div className="mt-6 mx-auto h-px w-2/3 bg-border" />
            <div className="mt-3 text-xs text-muted-foreground">profai.app</div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={onDownload}>Download PNG</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
