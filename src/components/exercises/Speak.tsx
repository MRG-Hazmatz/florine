import { useRef, useState } from "react";
import type { Exercise } from "../../lib/content/schema";
import type { GradeResult } from "../../lib/exercises/grade";
import AudioButton from "../AudioButton";

type SP = Extract<Exercise, { type: "speak" }>;

type Phase = "idle" | "recording" | "recorded" | "scoring" | "done";

interface Feedback {
  transcript?: string;
  score?: number | null;
  feedback?: string;
  error?: string;
  status?: number;
}

/** Pass mark for a spoken attempt (0-100). */
const PASS = 50;

/** Encode an AudioBuffer's first channel as 16-bit PCM mono WAV, base64 (no prefix). */
function audioBufferToWavBase64(buf: AudioBuffer): string {
  const ch = buf.getChannelData(0);
  const sampleRate = buf.sampleRate;
  const n = ch.length;
  const dataSize = n * 2;
  const ab = new ArrayBuffer(44 + dataSize);
  const view = new DataView(ab);
  const writeStr = (off: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, dataSize, true);
  let off = 44;
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, ch[i]));
    view.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    off += 2;
  }
  const bytes = new Uint8Array(ab);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export default function Speak({
  exercise,
  graded,
  onGrade,
}: {
  exercise: SP;
  graded: boolean;
  onGrade: (r: GradeResult) => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [recUrl, setRecUrl] = useState<string | null>(null);
  const [fb, setFb] = useState<Feedback | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const blobRef = useRef<Blob | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" });
        blobRef.current = blob;
        if (recUrl) URL.revokeObjectURL(recUrl);
        setRecUrl(URL.createObjectURL(blob));
        setPhase("recorded");
      };
      recorderRef.current = mr;
      mr.start();
      setPhase("recording");
    } catch {
      setFb({ error: "mic" });
      setPhase("done");
      onGrade({ earned: 0, max: 0, correct: false, ungraded: true });
    }
  };

  const stopRecording = () => recorderRef.current?.stop();

  const reRecord = () => {
    blobRef.current = null;
    if (recUrl) URL.revokeObjectURL(recUrl);
    setRecUrl(null);
    setFb(null);
    setPhase("idle");
  };

  const submit = async () => {
    const blob = blobRef.current;
    if (!blob) return;
    setPhase("scoring");
    let result: Feedback;
    try {
      const arr = await blob.arrayBuffer();
      const ctx = new AudioContext();
      const decoded = await ctx.decodeAudioData(arr);
      void ctx.close();
      const audioBase64 = audioBufferToWavBase64(decoded);
      const res = await fetch("/api/speak", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ audioBase64, mimeType: "audio/wav", reference: exercise.targetFr }),
      });
      result = (await res.json()) as Feedback;
    } catch {
      result = { error: "network" };
    }
    setFb(result);
    setPhase("done");

    const score = typeof result.score === "number" ? result.score : null;
    if (score != null) {
      const passed = score >= PASS;
      onGrade({ earned: passed ? exercise.points : 0, max: exercise.points, correct: passed });
    } else {
      // No usable score (coach offline / error): log as practice, don't score it.
      onGrade({ earned: 0, max: 0, correct: false, ungraded: true });
    }
  };

  const hasScore = fb != null && typeof fb.score === "number";
  const offlineReason = fb?.status ? `${fb.error} ${fb.status}` : fb?.error;

  return (
    <div className="space-y-4">
      {/* The line to say + native reference */}
      <div className="rounded-lg border border-ink/15 bg-card p-4 text-center">
        <p className="font-display text-2xl text-marine">{exercise.targetFr}</p>
        {exercise.targetEn && <p className="mt-1 text-sm text-ink/50">{exercise.targetEn}</p>}
        <div className="mt-3 flex items-center justify-center gap-2">
          <AudioButton src={exercise.audio} label="Hear a native speaker" />
          <span className="text-xs text-ink/50">Listen first, then record yourself.</span>
        </div>
      </div>

      {/* Your recording (preview) */}
      {recUrl && (
        <div className="flex items-center justify-center gap-2 text-sm text-ink/60">
          <span>Your recording:</span>
          <audio src={recUrl} controls className="h-8" />
        </div>
      )}

      {/* Controls by phase */}
      {!graded && phase === "idle" && (
        <button
          type="button"
          onClick={startRecording}
          className="w-full rounded-lg bg-rouge px-4 py-3 font-medium text-white hover:bg-rouge/90"
        >
          ● Record
        </button>
      )}
      {phase === "recording" && (
        <button
          type="button"
          onClick={stopRecording}
          className="w-full animate-pulse rounded-lg border-2 border-rouge bg-rouge/10 px-4 py-3 font-medium text-rouge"
        >
          ■ Stop recording
        </button>
      )}
      {phase === "recorded" && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={reRecord}
            className="flex-1 rounded-lg border border-marine/30 px-4 py-2.5 font-medium text-marine hover:bg-marine/10"
          >
            ↺ Re-record
          </button>
          <button
            type="button"
            onClick={submit}
            className="flex-1 rounded-lg bg-marine px-4 py-2.5 font-medium text-white hover:bg-marine/90"
          >
            Submit attempt
          </button>
        </div>
      )}
      {phase === "scoring" && (
        <p className="text-center text-sm text-ink/60">Listening to your recording…</p>
      )}

      {/* Result */}
      {phase === "done" && fb?.error === "mic" && (
        <p className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-ink/70">
          I couldn't reach your microphone. Check the browser's mic permission and try the exercise
          again.
        </p>
      )}
      {phase === "done" && hasScore && (
        <div className="space-y-1 rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm">
          <p className="font-semibold text-emerald-800">Pronunciation: {fb?.score}/100</p>
          {fb?.transcript && (
            <p className="text-ink/70">
              We heard: <span className="italic text-marine">“{fb.transcript}”</span>
            </p>
          )}
          {fb?.feedback && <p className="text-ink/70">{fb.feedback}</p>}
        </div>
      )}
      {phase === "done" && !hasScore && fb?.error !== "mic" && (
        <div className="space-y-1 rounded-lg border border-ink/15 bg-parchment p-3 text-sm text-ink/70">
          <p>
            The pronunciation coach didn't respond, so this attempt wasn't scored (it won't count
            against you). Replay your recording above and compare it with the native speaker.
          </p>
          {offlineReason && <p className="text-xs text-ink/40">coach status: {offlineReason}</p>}
        </div>
      )}
    </div>
  );
}
