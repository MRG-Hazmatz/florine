import { Link, NavLink, Outlet } from "react-router-dom";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-1 rounded transition-colors ${
    isActive ? "bg-marine text-white" : "text-marine hover:bg-marine/10"
  }`;

export default function Layout() {
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
        <Outlet />
      </main>

      <footer className="border-t border-ink/10 py-4 text-center text-xs text-ink/55">
        Florine — open-source DELF practice · Faces: Francisco Lemos (lemos.itch.io), CC BY 4.0
      </footer>
    </div>
  );
}
