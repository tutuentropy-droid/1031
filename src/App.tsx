import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Game from "@/pages/Game";
import Unlock from "@/pages/Unlock";
import PeriodicTableGame from "@/pages/PeriodicTableGame";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/unlock" element={<Unlock />} />
        <Route path="/periodic-table" element={<PeriodicTableGame />} />
      </Routes>
    </Router>
  );
}
