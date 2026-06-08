import { useRef, useState } from "react";
import type { Exercise } from "../../lib/content/schema";
import { allOrNothing, type GradeResult } from "../../lib/exercises/grade";
import AudioButton from "../AudioButton";

type SP = Extract<Exercise, { type: "speak" }>;

type Phase = "idle" | "recording" | "scoring" | "done";

interface Feedback {
  transcript?: string;
  score?: number | null;
  feedback?: string;
  error?: string;
}

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

  const sendForScoring = async (blob: Blob) => {
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
    // Speaking is participation-based practice: a genuine attempt counts as done.
    onGrade(allOrNothing(exercise.points, true));
  };

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
        setRecUrl(URL.createObjectURL(blob));
        void sendForScoring(blob);
      };
      recorderRef.current = mr;
      mr.start();
      setPhase("recording");
    } catch {
      setFb({ error: "mic" });
      setPhase("done");
      onGrade(allOrNothing(exercise.points, true));
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setPhase("scoring");
  };

  const hasScore = fb != null && typeof fb.score === "number";
  const coachUnavailable = fb != null && (fb.error != null || fb.score == null) && fb.error !== "mic";

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

      {/* Record / stop control */}
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
          ■ Stop &amp; submit
        </button>
      )}
      {phase === "scoring" && (
        <p className="text-center text-sm text-ink/60">Listening to your recording…</p>
      )}

      {/* Playback of the learner's own recording */}
      {recUrl && (
        <div className="flex items-center justify-center gap-2 text-sm text-ink/60">
          <span>Your recording:</span>
          <audio src={recUrl} controls className="h-8" />
        </div>
      )}

      {/* Coach feedback (or graceful fallback) */}
      {phase === "done" && fb?.error === "mic" && (
        <p className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-ink/70">
          I couldn't reach your microphone. Check the browser's mic permission and try again — or
          just shadow the native audio aloud.
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
      {phase === "done" && coachUnavailable && (
        <p className="rounded-lg border border-ink/15 bg-parchment p-3 text-sm text-ink/70">
          The pronunciation coach is offline right now, but your practice still counts. Replay your
          recording above and compare it with the native speaker.
        </p>
      )}
    </div>
  );
}
