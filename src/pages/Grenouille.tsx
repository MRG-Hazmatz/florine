import { useEffect } from "react";
import { useFrogLore } from "../lib/frogLore";
import Home from "./Home";

/**
 * Hidden, shareable route for the frog comic: /grenouille opens the tale over
 * the home page. Visiting it also counts as discovering the secret, so the
 * replay control appears afterwards even if you arrived here by link.
 */
export default function Grenouille() {
  const openComic = useFrogLore((s) => s.openComic);
  useEffect(() => {
    useFrogLore.setState((s) => ({ unlocked: true, open: true, seen: s.seen }));
    openComic();
  }, [openComic]);
  return <Home />;
}
