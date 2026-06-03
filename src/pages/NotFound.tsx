import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="space-y-3 py-16 text-center">
      <h1 className="font-display text-4xl font-bold">404</h1>
      <p className="text-ink/60">Cette page n'existe pas.</p>
      <Link to="/" className="text-marine underline">
        Return home
      </Link>
    </section>
  );
}
