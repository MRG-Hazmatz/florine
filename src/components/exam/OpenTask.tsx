import { useRef, useState } from "react";
import type { OpenTask } from "../../lib/exams/schema";

/** Count words the way a DELF examiner roughly would (whitespace-separated). */
export function countWords(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

/**
 * A production task during the live exam: writing tasks get a textarea with a
 * live word count; speaking tasks get a recorder so the candidate can speak to
 * the clock and play themselves back. No scoring here — production is judged in
 * the correction screen against the official-style rubric, by self-assessment.
 */
export default function OpenTaskBlock({
  task,
  writing,
  onWriting,
  recorded,
  onRecorded,
  locked,
}: {
  task: OpenTask;
  writing: string;
  onWriting: (taskId: string, text: string) => void;
  recorded: boolean;
  onRecorded: (taskId: string, done: boolean) => void;
  locked: boolean;
}) {
  const isSpeaking = task.kind === "speaking";
  const isEnsemble = task.kind === "ensemble"; // whole-épreuve language criteria, graded later
  const words = countWords(writing);
  const meetsFloor = !task.minWords || words >= task.minWords;

  const [recUrl, setRecUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" });
        if (recUrl) URL.revokeObjectURL(recUrl);
        setRecUrl(URL.createObjectURL(blob));
        setRecording(false);
        onRecorded(task.id, true);
      };
      recorderRef.current = mr;
      mr.start();
      setRecording(true);
    } catch {
      onRecorded(task.id, false);
    }
  };

  return (
    <section className="space-y-3 rounded-lg border border-ink/15 bg-parchment/60 p-4">
      <h3 className="font-display text-lg font-semibold">{task.title}</h3>
      {task.consigne && <p className="whitespace-pre-line text-sm text-ink/80">{task.consigne}</p>}
      {task.documentFr && (
        <blockquote className="whitespace-pre-line rounded border-l-4 border-marine/30 bg-card p-3 text-sm italic text-ink/75">
          {task.documentFr}
        </blockquote>
      )}

      {isEnsemble ? (
        <p className="text-xs text-ink/45">
          These criteria assess your whole oral performance. They're scored after the exam, in the
          correction screen.
        </p>
      ) : isSpeaking ? (
        <div className="space-y-2">
          {!locked && !recording && (
            <button
              type="button"
              onClick={startRec}
              className="rounded-lg bg-rouge px-4 py-2.5 font-medium text-white hover:bg-rouge/90"
            >
              ● {recorded ? "Re-record" : "Record your answer"}
            </button>
          )}
          {recording && (
            <button
              type="button"
              onClick={() => recorderRef.current?.stop()}
              className="animate-pulse rounded-lg border-2 border-rouge bg-rouge/10 px-4 py-2.5 font-medium text-rouge"
            >
              ■ Stop recording
            </button>
          )}
          {recUrl && (
            <div className="flex items-center gap-2 text-sm text-ink/60">
              <span>Your answer:</span>
              <audio src={recUrl} controls className="h-8" />
            </div>
          )}
          <p className="text-xs text-ink/45">
            Speak to the clock as in the real oral. You'll grade yourself against the model points
            after the exam.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          <textarea
            value={writing}
            disabled={locked}
            onChange={(e) => onWriting(task.id, e.target.value)}
            rows={10}
            placeholder="Rédigez votre réponse ici…"
            className="w-full resize-y rounded border border-ink/20 bg-card p-3 text-sm leading-relaxed focus:border-marine focus:outline-none"
          />
          {task.minWords && (
            <p className={`text-right text-xs ${meetsFloor ? "text-emerald-700" : "text-ink/45"}`}>
              {words} / {task.minWords} mots {meetsFloor ? "✓" : ""}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
