import { useState } from "react";
import { Link } from "react-router-dom";
import { getAllUnits, getLevelSummaries } from "../lib/content/load";
import { useProgress, vocabKey } from "../lib/storage/progress";
import { isDue, initialCard } from "../lib/srs/sm2";
import { SKILLS, type Skill } from "../lib/content/schema";
import GuideStranger from "../components/GuideStranger";

const SKILL_LABELS: Record<Skill, string> = {
  reading: "Reading",
  listening: "Listening",
  writing: "Writing",
  speaking: "Speaking",
};

const SKILL_ICON: Record<Skill, string> = {
  reading: "/icons/skill-reading.png",
  listening: "/icons/skill-listening.png",
  writing: "/icons/skill-writing.png",
  speaking: "/icons/skill-speaking.png",
};

function Stat({ label, value, icon }: { label: string; value: string; icon?: string }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-card p-3 text-center">
      {icon && (
        <img src={icon} alt="" className="mx-auto mb-1 h-7 w-7 object-contain mix-blend-multiply" />
      )}
      <p className="font-display text-2xl font-bold text-marine">{value}</p>
      <p className="text-xs uppercase tracking-wide text-ink/50">{label}</p>
    </div>
  );
}

export default function Home() {
  const summaries = getLevelSummaries();
  const totalUnits = summaries.reduce((n, s) => n + s.unitCount, 0);

  const unitProgress = useProgress((s) => s.unitProgress);
  const skillXp = useProgress((s) => s.skillXp);
  const streakDays = useProgress((s) => s.streakDays);
  const totalStudyMinutes = useProgress((s) => s.totalStudyMinutes);

  const completedCount = Object.values(unitProgress).filter((u) => u.status === "completed").length;
  const maxXp = Math.max(1, ...SKILLS.map((s) => skillXp[s]));

  // Snapshot due-review count at mount.
  const [dueCount] = useState(() => {
    const vocab = useProgress.getState().vocab;
    let n = 0;
    for (const u of getAllUnits()) {
      for (const v of u.lesson.vocabulary) {
        if (isDue(vocab[vocabKey(u.id, v.id)] ?? initialCard())) n++;
      }
    }
    return n;
  });

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="flex items-center gap-3 font-display text-4xl font-bold text-ink">
          Bonjour
          <img src="/icons/hand.png" alt="" className="h-12 w-auto object-contain" />
        </h1>
        <p className="max-w-prose text-lg text-ink/70">
          Florine is structured, DELF-aligned French practice — explicit grammar in
          English, drills in French, every exercise shaped like a real exam question.
        </p>
      </div>

      <GuideStranger seed="florine-home" caption="votre guide">
        Welcome back. Pick a level to keep going, or clear your due reviews first —
        a little every day beats cramming.
      </GuideStranger>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Streak" value={`${streakDays}`} icon="/icons/streak.png" />
        <Stat label="Units done" value={`${completedCount}/${totalUnits}`} />
        <Stat label="Study time" value={`${totalStudyMinutes}m`} />
        <Stat label="Due reviews" value={`${dueCount}`} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/levels"
          className="rounded bg-marine px-5 py-2.5 font-medium text-white hover:bg-marine/90"
        >
          Start learning →
        </Link>
        {dueCount > 0 && (
          <Link
            to="/review"
            className="rounded border border-marine/30 px-5 py-2.5 font-medium text-marine hover:bg-marine/10"
          >
            Review {dueCount} word{dueCount === 1 ? "" : "s"}
          </Link>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Skills</h2>
        <ul className="space-y-2">
          {SKILLS.map((s) => (
            <li key={s} className="flex items-center gap-3">
              <img
                src={SKILL_ICON[s]}
                alt=""
                className="h-8 w-8 shrink-0 object-contain mix-blend-multiply"
              />
              <span className="w-20 text-sm text-ink/70">{SKILL_LABELS[s]}</span>
              <div className="h-2 flex-1 overflow-hidden rounded bg-ink/10">
                <div
                  className="h-full bg-bleu transition-all"
                  style={{ width: `${(skillXp[s] / maxXp) * 100}%` }}
                />
              </div>
              <span className="w-10 text-right text-xs text-ink/40">{skillXp[s]}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm text-ink/50">
        {totalUnits} unit{totalUnits === 1 ? "" : "s"} of content loaded · Phase 2
      </p>
    </section>
  );
}
