import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useExamSession } from "../lib/exams/session";
import { useFrogLore } from "../lib/frogLore";
import FrogComic from "./FrogComic";
import Frog from "./frog/Frog";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-1 rounded transition-colors ${
    isActive ? "bg-marine text-white" : "text-marine hover:bg-marine/10"
  }`;

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // While a section's clock is live, the exam hall is sealed: no nav, no back.
  const examLive = useExamSession((s) => s.live);
  const frogUnlocked = useFrogLore((s) => s.unlocked);
  const openComic = useFrogLore((s) => s.openComic);

  // Keep the frog hunt alive: revive (relocate) popped frogs on a light tick
  // and whenever the route changes.
  useEffect(() => {
    useFrogLore.getState().reviveDue();
    const id = window.setInterval(() => useFrogLore.getState().reviveDue(), 20_000);
    return () => window.clearInterval(id);
  }, [pathname]);

  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-50 border-b border-ink/20 bg-parchment/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3">
          {examLive ? (
            <span className="font-display text-2xl font-bold text-rouge">Florine</span>
          ) : (
            <Link to="/" className="font-display text-2xl font-bold text-rouge">
              Florine
            </Link>
          )}
          <span className="hidden text-sm text-ink/40 sm:inline">
            {examLive ? "examen en cours — salle fermée" : "apprendre le français"}
          </span>
          {!examLive && (
            <nav className="ml-auto flex gap-2 text-sm">
              <NavLink to="/" end className={navClass}>
                Home
              </NavLink>
              <NavLink to="/levels" className={navClass}>
                Levels
              </NavLink>
              <NavLink to="/review" className={navClass}>
                Review
              </NavLink>
              <NavLink to="/exams" className={navClass}>
                Exams
              </NavLink>
            </nav>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 border-x border-ink/15 bg-parchment/90 px-4 py-8 shadow-[0_0_60px_rgba(23,18,12,0.22)]">
        {pathname !== "/" && !examLive && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            title="Back"
            aria-label="Go back to the previous page"
            className="-mt-7 mb-2 inline-flex h-8 w-8 items-center justify-center rounded border border-ink/15 text-ink/60 transition-colors hover:border-marine/40 hover:text-marine"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="M11 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        <Outlet />
      </main>

      <footer className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 py-4 text-center text-xs text-ink/55">
        <span>Florine — open-source DELF & DALF practice</span>
        <span aria-hidden>·</span>
        <Link to="/almanac" className="underline decoration-ink/30 underline-offset-2 hover:text-marine">
          l'Almanach des Inconnus
        </Link>
        {frogUnlocked && (
          <>
            <span aria-hidden>·</span>
            <button
              type="button"
              onClick={openComic}
              title="La Complainte de la Grenouille"
              className="inline-flex items-center gap-1 text-bleu/70 underline decoration-ink/20 underline-offset-2 hover:text-bleu"
            >
              <Frog className="h-3.5 w-3.5" />
              la grenouille
            </button>
          </>
        )}
        <span aria-hidden>·</span>
        <span>Faces: Francisco Lemos (lemos.itch.io), CC BY 4.0</span>
      </footer>

      <FrogComic />
    </div>
  );
}
