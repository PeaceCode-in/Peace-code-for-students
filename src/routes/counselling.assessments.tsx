import { createFileRoute, Link } from "@tanstack/react-router";
import { palette } from "@/components/AppShell";
import { Card, Chip } from "./counselling";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/counselling/assessments")({
  component: Assessments,
});

const TESTS = [
  { id: "phq9", name: "PHQ-9", topic: "Depression", minutes: 4, blurb: "Screens depressive symptoms over the last 2 weeks." },
  { id: "gad7", name: "GAD-7", topic: "Anxiety", minutes: 3, blurb: "Screens generalised anxiety." },
  { id: "who5", name: "WHO-5", topic: "Wellbeing", minutes: 2, blurb: "A short measure of general wellbeing." },
  { id: "dass21", name: "DASS-21", topic: "Depression · Anxiety · Stress", minutes: 6, blurb: "Combined screener for D/A/S." },
];

function Assessments() {
  const { ink, muted, surface, surface2, border, soft } = palette;
  return (
    <>
      <div className="mb-6">
        <div className="text-[10.5px] uppercase tracking-[0.18em]" style={{ color: muted }}>Assessments</div>
        <h1 className="font-serif text-[26px]" style={{ color: ink }}>Validated screeners, five minutes each</h1>
        <p className="text-[13.5px] mt-1" style={{ color: muted }}>Take assessments before your session so your counsellor has a fuller picture.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {TESTS.map(t => (
          <Card key={t.id}>
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-serif text-[15px]" style={{ background: soft, color: ink }}>{t.name.replace("-", "")}</div>
              <div className="flex-1 min-w-0">
                <div className="font-serif text-[18px]" style={{ color: ink }}>{t.name}</div>
                <div className="text-[12px]" style={{ color: muted }}>{t.topic} · {t.minutes} min</div>
                <p className="mt-1 text-[13px]" style={{ color: muted }}>{t.blurb}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5 items-center justify-between">
              <div className="flex gap-1.5">
                <Chip>Not started</Chip>
                <Chip>Assigned</Chip>
              </div>
              <Link to="/screening" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px]" style={{ background: ink, color: "#fff" }}>
                Take now <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-4" style={{ background: `linear-gradient(180deg, ${soft} 0%, ${surface} 100%)` }}>
        <div className="font-serif text-[17px] mb-1" style={{ color: ink }}>Results & retakes</div>
        <p className="text-[13.5px]" style={{ color: muted }}>You'll find scored results, trend lines, and retake options inside the Screening module.</p>
        <Link to="/screening" className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px]" style={{ background: surface2, color: ink, border: `1px solid ${border}` }}>Open Screening <ArrowRight className="w-3.5 h-3.5" /></Link>
      </Card>
    </>
  );
}
