import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analytics" element={<Home />} />
        <Route path="/revenue" element={<Home />} />
        <Route path="/crm" element={<Home />} />
        <Route path="/apps" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
