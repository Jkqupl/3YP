import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PhishingModule from "./pages/PhishingModule";
import TailgatingModule from "./pages/TailgatingModule";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/module/phishing" element={<PhishingModule />} />
        <Route path="/module/tailgating" element={<TailgatingModule />} />
      </Routes>
    </Router>
  );
}
