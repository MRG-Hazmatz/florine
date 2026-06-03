import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import LevelSelect from "./pages/LevelSelect";
import LevelUnits from "./pages/LevelUnits";
import UnitView from "./pages/UnitView";
import ExerciseView from "./pages/ExerciseView";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="levels" element={<LevelSelect />} />
          <Route path="levels/:level" element={<LevelUnits />} />
          <Route path="unit/:level/:slug" element={<UnitView />} />
          <Route path="unit/:level/:slug/exercises" element={<ExerciseView />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
