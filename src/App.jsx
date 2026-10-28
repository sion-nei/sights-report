import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Report from "./pages/Report.jsx";
import Stats from "./pages/Stats.jsx";
import Person from "./pages/Person.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/report" element={<Report />} />
      <Route path="/stats" element={<Stats />} />
      <Route path="/people/:id" element={<Person />} />
    </Routes>
  );
}
