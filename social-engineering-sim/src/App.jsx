import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ModuleRunner from "./pages/ModuleRunner";
import "./styles/global.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Single unified route — surveys + simulation live here, no page change */}
        <Route path="/module/:moduleId" element={<ModuleRunner />} />
      </Routes>
    </Router>
  );
}
