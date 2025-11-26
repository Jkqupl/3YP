import React from "react"
import PhaserGame from "./game/PhaserGame"


export default function App() {
return (
<div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
<h1 className="text-3xl mb-6 font-bold">Social Engineering Simulator</h1>
<div className="w-[960px] h-[540px] border border-slate-700 rounded-lg overflow-hidden">
<PhaserGame />
</div>
</div>
)
}