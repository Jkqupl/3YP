import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PhishingModule from "./pages/PhishingModule";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-6xl min-h-[90vh] border-2 border-gray-800 rounded-xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/module/phishing" element={<PhishingModule />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
