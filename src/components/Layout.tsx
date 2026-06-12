import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-1 rounded transition-colors ${
    isActive ? "bg-marine text-white" : "text-marine hover:bg-marine/10"
  }`;

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-50 border-b border-ink/20 bg-parchment/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3">
          <Link to="/" className="font-display text-2xl font-bold text-rouge">
            Florine
          </Link>
          <span className="hidden text-sm text-ink/40 sm:inline">
            apprendre le français
          </span>
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
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 border-x border-ink/15 bg-parchment/90 px-4 py-8 shadow-[0_0_60px_rgba(23,18,12,0.22)]">
        {pathname !== "/" && (
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

      <footer className="py-4 text-center text-xs text-ink/55">
        Florine — open-source DELF & DALF practice ·{" "}
        <Link to="/almanac" className="underline decoration-ink/30 underline-offset-2 hover:text-marine">
          l'Almanach des Inconnus
        </Link>{" "}
        · Faces: Francisco Lemos (lemos.itch.io), CC BY 4.0
      </footer>
    </div>
  );
}
