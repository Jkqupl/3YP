import React from "react";
import { Link } from "react-router-dom";

export default function ModuleCard({ title, description, link }) {
  return (
    <Link
      to={link}
      className="p-6 rounded-full border border-slate-700 hover:bg-slate-800 transition flex flex-col items-center justify-center text-center space-y-3"
    >
      <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold">
        {title.charAt(0)}
      </div>
      <h2 className="text-xl font-semibold text-cyan-300">{title}</h2>
      <p className="text-sm text-slate-400">{description}</p>
    </Link>
  );
}
