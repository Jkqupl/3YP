import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PhishingModule from "./pages/PhishingModule";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/module/phishing" element={<PhishingModule />} />
      </Routes>
    </Router>
  );
}
