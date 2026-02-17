import React, { useState } from "react";
import { Link } from "react-router-dom";
import TailgatingSimulation from "../game/TailgatingSimulation";
import { useTailgatingStore } from "../state/useTailgatingStore";

export default function TailgatingModule() {
  const [started, setStarted] = useState(false);
  const ending = useTailgatingStore((s) => s.ending);

  const onStart = () => {
    useTailgatingStore.getState().resetGame();
    setStarted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-slate-950 shadow-xl rounded-xl overflow-hidden">
        {/* Breadcrumb only when NOT in simulation */}
        {!started && (
          <div className="text-sm text-slate-400 px-10 pt-6">
            <Link to="/" className="text-cyan-400 hover:text-cyan-300">
              Home
            </Link>
            <span className="mx-1">/</span>
            <span>Tailgaiting Module</span>
          </div>
        )}

        {!started ? (
          <div className="p-10 space-y-10">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-cyan-300">
                  What is Tailgating?
                </h1>
                <p className="text-slate-300">
                  {/* You've probably heard of tailgating in the context of a car
                  following too close behind another and the tailgating we’re
                  talking about here isn’t too different. Ever held the door for
                  someone when entering work or going home because it was the
                  kind thing to do?
                  <br />
                  In most cases it would be but what happens when that person
                  had no official way to access the building and you just handed
                  it to them on a silver plate.
                  <br />
                  This is exactly what tailgating attack relies on and we’ll be
                  going over it in more detail in this module. */}
                  Tailgating is a social engineering attack that takes advantage
                  of normal human behaviour, such as politeness, trust, and the
                  desire to avoid awkward situations. It occurs when an attacker
                  gains access to a restricted area by following closely behind
                  an authorised person, rather than using their own access
                  credentials. Instead of hacking a system, tailgating targets
                  people. Attackers may pretend to be employees, delivery
                  drivers, contractors, or visitors who simply forgot their
                  access card.
                  <br />
                  <br />
                  By blending in and appearing legitimate, they rely on others
                  to hold doors open or bypass security checks on their behalf.
                  Because tailgating often feels harmless or polite, it can
                  easily go unnoticed. However, once inside a restricted area,
                  an attacker may be able to steal equipment, access
                  confidential information, or cause physical or digital damage.
                </p>
              </div>
            </div>

            {/* Learning objectives */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-cyan-300">
                Learning Objectives
              </h2>
              <section className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-900/80 border border-cyan-800 rounded-lg p-4">
                  <h2 className="text-sm font-semibold text-cyan-300 mb-2">
                    Understand the concept of tailgating
                  </h2>
                  <p className="text-xs text-slate-300">
                    Learn to spot subtle signals in email content such as
                    urgency, weird requests, and mismatched sender details.
                  </p>
                </div>
                <div className="bg-slate-900/80 border border-cyan-800 rounded-lg p-4">
                  <h2 className="text-sm font-semibold text-cyan-300 mb-2">
                    Identify tailgating attempts
                  </h2>
                  <p className="text-xs text-slate-300">
                    Understand how attackers replicate login portals and how to
                    verify URLs and security indicators before entering
                    passwords.
                  </p>
                </div>
                <div className="bg-slate-900/80 border border-cyan-800 rounded-lg p-4">
                  <h2 className="text-sm font-semibold text-cyan-300 mb-2">
                    Respond correctly to tailgating attempts
                  </h2>
                  <p className="text-xs text-slate-300">
                    Practice safe responses such as closing suspicious pages,
                    deleting emails, and using official channels to verify
                    activity.
                  </p>
                </div>
              </section>
            </section>

            {/* Tailgating examples */}
            {/* <section className="space-y-3">
              <h2 className="text-xl font-semibold text-cyan-300">
                Examples in real life
              </h2>
              <p className="text-sm text-slate-300">
                A common example is someone following an employee into an office
                building by carrying boxes or pretending to be on a phone call.
                The employee may feel uncomfortable questioning them and holds
                the door open.
                <br />
                <br />
                Another example is in residential buildings, where someone
                claims they live there but forgot their key fob. They may wait
                near the entrance and ask residents to let them in, relying on
                social pressure to avoid suspicion.
                <br />
                <br />
                Tailgating also happens in workplaces with badge controlled
                doors. An attacker may wear similar clothing to staff or use
                branded lanyards to appear official, making it less likely they
                will be challenged.
                <br />
                <br />
                According to the UK National Cyber Security Centre, physical
                access attacks like tailgating are a common way for attackers to
                bypass security controls without needing technical skills.
              </p>
            </section> */}

            {/* How to defend yourself */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-cyan-300">
                What to do
              </h2>
              <p className="text-sm text-slate-300">
                If you are entering a secured area, only allow access to people
                who can verify their authorisation. Even if someone looks
                legitimate, they should use their own access card or follow the
                proper sign in process. If you are unsure, it is okay to
                politely challenge someone or direct them to reception or
                security.
                <br />
                <br />
                This is not being rude.
                <br />
                <br />
                It is part of keeping yourself and others safe. Avoid feeling
                pressured by urgency, politeness, or authority. Attackers often
                rely on these feelings to succeed. Taking a moment to stop and
                think can prevent a serious security incident.
                <br />
                Organisations are encouraged to promote a culture where security
                comes before convenience. The UK National Cyber Security Centre
                recommends clear access policies and staff training to reduce
                the risk of tailgating.
              </p>
            </section>

            <div className="grid md:grid-cols-2 gap-8">
              {/* <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-100">
                  How to avoid it
                </h2>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>Do not hold secure doors open for strangers.</li>
                  <li>
                    Redirect people to authenticate using their own key fob.
                  </li>
                  <li>
                    Use the intercom or building process when someone forgot
                    access.
                  </li>
                  <li>Treat urgency and frustration as warning signs.</li>
                  <li>Be consistent, small exceptions add up.</li>
                </ul>
              </div> */}

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-cyan-300">
                  What you will practice
                </h2>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>Recognising tailgating attempts</li>
                  <li>Managing social pressure</li>
                  <li>Asking quick questions</li>
                  <li>Making safe decisions consistently</li>
                </ul>

                <div className="pt-2">
                  <button
                    onClick={onStart}
                    className="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold"
                  >
                    Play simulation
                  </button>
                  <p className="text-slate-400 text-sm mt-2">
                    You will face 5 encounters. Pressure and risk persist.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[78vh] w-full">
            <TailgatingSimulation />

            {ending ? (
              <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
                <div className="text-slate-300">
                  Result:{" "}
                  <span className="font-semibold text-cyan-200">{ending}</span>
                </div>
                <button
                  onClick={() => {
                    useTailgatingStore.getState().resetGame();
                    setStarted(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100"
                >
                  Exit simulation
                </button>
              </div>
            ) : (
              <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
                <div className="text-slate-400 text-sm">
                  Tip: If you feel rushed, slow down and redirect to the key fob
                  or intercom process.
                </div>
                <button
                  onClick={() => {
                    useTailgatingStore.getState().resetGame();
                    setStarted(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100"
                >
                  Exit simulation
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
