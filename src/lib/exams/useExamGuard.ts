/**
 * Exam invigilation hook — the "exam hall" enforcement layer.
 *
 * While an exam is live it:
 *   - keeps the document in fullscreen (re-prompts if the candidate exits),
 *   - logs anti-cheat events: leaving the tab/window, exiting fullscreen, and
 *     attempted copy / paste / cut / context-menu,
 *   - blocks copy/paste/cut/contextmenu outright (real exam: no notes).
 *
 * It is deliberately honest about its limits — a browser cannot truly lock a
 * machine, so this raises friction and records incidents rather than claiming
 * to make cheating impossible. Incidents surface on the score sheet.
 */
import { useCallback, useEffect, useRef, useState } from "react";

export interface ProctorEvent {
  kind: "tab-blur" | "fullscreen-exit" | "copy-paste" | "context-menu";
  atISO: string;
}

interface FullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
}
interface FullscreenDocument extends Document {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
}

export function requestExamFullscreen(): void {
  const el = document.documentElement as FullscreenElement;
  const fn = el.requestFullscreen ?? el.webkitRequestFullscreen;
  fn?.call(el).catch(() => {
    /* user gesture required / unsupported — guard still logs exits */
  });
}

export function exitExamFullscreen(): void {
  const doc = document as FullscreenDocument;
  if (doc.fullscreenElement ?? doc.webkitFullscreenElement) {
    (doc.exitFullscreen ?? doc.webkitExitFullscreen)?.call(doc).catch(() => {});
  }
}

function isFullscreen(): boolean {
  const doc = document as FullscreenDocument;
  return Boolean(doc.fullscreenElement ?? doc.webkitFullscreenElement);
}

export function useExamGuard(active: boolean) {
  const [events, setEvents] = useState<ProctorEvent[]>([]);
  const [fullscreen, setFullscreen] = useState(false);
  const activeRef = useRef(active);
  activeRef.current = active;

  const log = useCallback((kind: ProctorEvent["kind"]) => {
    if (!activeRef.current) return;
    setEvents((prev) => [...prev, { kind, atISO: new Date().toISOString() }]);
  }, []);

  useEffect(() => {
    if (!active) return;

    const onVisibility = () => {
      if (document.visibilityState === "hidden") log("tab-blur");
    };
    const onBlur = () => log("tab-blur");
    const onFullscreenChange = () => {
      const fs = isFullscreen();
      setFullscreen(fs);
      if (!fs) log("fullscreen-exit");
    };
    const block = (kind: ProctorEvent["kind"]) => (e: Event) => {
      e.preventDefault();
      log(kind);
    };
    const onCopy = block("copy-paste");
    const onContext = block("context-menu");

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);
    document.addEventListener("copy", onCopy);
    document.addEventListener("cut", onCopy);
    document.addEventListener("paste", onCopy);
    document.addEventListener("contextmenu", onContext);

    setFullscreen(isFullscreen());

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullscreenChange);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("cut", onCopy);
      document.removeEventListener("paste", onCopy);
      document.removeEventListener("contextmenu", onContext);
    };
  }, [active, log]);

  return { events, fullscreen, reFullscreen: requestExamFullscreen };
}

/**
 * Countdown timer for one section. Calls onExpire once when it hits zero.
 * Returns remaining seconds. Pass `running=false` to pause (e.g. on intro
 * screens). Re-arms whenever `seconds` changes (new section).
 */
export function useCountdown(seconds: number, running: boolean, onExpire: () => void) {
  const [remaining, setRemaining] = useState(seconds);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setRemaining(seconds);
    expiredRef.current = false;
  }, [seconds]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(id);
          if (!expiredRef.current) {
            expiredRef.current = true;
            onExpireRef.current();
          }
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, seconds]);

  return remaining;
}

export function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
