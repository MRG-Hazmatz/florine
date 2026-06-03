import { Link } from "react-router-dom";
import { getLevelSummaries } from "../lib/content/load";

export default function Home() {
  const summaries = getLevelSummaries();
  const totalUnits = summaries.reduce((n, s) => n + s.unitCount, 0);

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-display text-4xl font-bold text-ink">Bonjour 👋</h1>
        <p className="max-w-prose text-lg text-ink/70">
          Florine is structured, DELF-aligned French practice — explicit grammar in
          English, drills in French, and every exercise shaped like a real exam
          question. It's the practice layer, not a replacement for your textbook.
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          to="/levels"
          className="rounded bg-marine px-5 py-2.5 font-medium text-white hover:bg-marine/90"
        >
          Start learning →
        </Link>
      </div>

      <p className="text-sm text-ink/50">
        {totalUnits} unit{totalUnits === 1 ? "" : "s"} of content loaded · Phase 1
        foundation
      </p>
    </section>
  );
}
