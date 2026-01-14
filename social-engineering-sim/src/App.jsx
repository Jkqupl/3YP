import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PhishingModule from "./pages/PhishingModule";
import TailgatingModule from "./pages/TailgatingModule";
import PretextingModule from "./pages/PretextingModule";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/module/phishing" element={<PhishingModule />} />
        <Route path="/module/tailgating" element={<TailgatingModule />} />
        <Route path="/module/pretexting" element={<PretextingModule />} />
      </Routes>
    </Router>
  );
}
