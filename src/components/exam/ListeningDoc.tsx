import { useRef, useState } from "react";
import type { ListeningDoc } from "../../lib/exams/schema";
import type { AnswerMap } from "../../lib/exams/grade";
import QuestionSheet from "./QuestionSheet";

/**
 * One listening document in CO: a play-limited audio player plus its questions.
 * Real DELF/DALF lets you hear each document a fixed number of times (2 at
 * A–B1, 1–2 at B2+). We enforce that play budget: once spent, the button
 * disables. The transcript is never shown here — only in the correction screen.
 */
export default function ListeningDocBlock({
  doc,
  answers,
  onAnswer,
  locked,
  correction,
  startNumber,
}: {
  doc: ListeningDoc;
  answers: AnswerMap;
  onAnswer: (qid: string, oid: string) => void;
  locked: boolean;
  correction: boolean;
  startNumber: number;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playsLeft, setPlaysLeft] = useState(doc.listens);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    if (playsLeft <= 0 || playing) return;
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = 0;
    el.play();
    setPlaying(true);
    setPlaysLeft((n) => n - 1);
  };

  return (
    <section className="space-y-3 rounded-lg border border-ink/15 bg-parchment/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-lg font-semibold">{doc.title}</h3>
        {!correction && (
          <span className="text-xs text-ink/50">
            {playsLeft} écoute{playsLeft > 1 ? "s" : ""} restante{playsLeft > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <audio
        ref={audioRef}
        src={`/${doc.audio}`}
        preload="auto"
        onEnded={() => setPlaying(false)}
      />

      {correction ? (
        <details className="rounded border border-ink/10 bg-card p-2 text-sm">
          <summary className="cursor-pointer text-ink/60">Transcription</summary>
          <p className="mt-2 whitespace-pre-line text-ink/80">{doc.transcript}</p>
        </details>
      ) : (
        <button
          type="button"
          onClick={play}
          disabled={playsLeft <= 0 || playing}
          className="inline-flex items-center gap-2 rounded bg-marine px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          <img src="/icons/audio.png" alt="" className="h-4 w-4 object-contain" />
          {playing ? "Lecture en cours…" : playsLeft > 0 ? "Écouter" : "Écoutes épuisées"}
        </button>
      )}

      <QuestionSheet
        questions={doc.questions}
        answers={answers}
        onAnswer={onAnswer}
        locked={locked}
        correction={correction}
        startNumber={startNumber}
      />
    </section>
  );
}
