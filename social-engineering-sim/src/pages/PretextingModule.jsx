import React, { useState } from "react";
import { Link } from "react-router-dom";
import PretextingBuilder from "../components/pretexting/PretextingBuilder";
import { usePretextingStore } from "../state/usePretextingStore";

export default function PretextingModule() {
  const [started, setStarted] = useState(false);
  const computeEnding = usePretextingStore((s) => s.computeEnding);

  const onStart = () => {
    usePretextingStore.getState().resetGame();
    setStarted(true);
  };

  const onExit = () => {
    usePretextingStore.getState().resetGame();
    setStarted(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-slate-950 shadow-xl rounded-xl overflow-hidden">
        {!started && (
          <div className="text-sm text-slate-400 px-10 pt-6">
            <Link to="/" className="text-cyan-400 hover:text-cyan-300">
              Home
            </Link>
            <span className="mx-1">/</span>
            <span>Pretexting Module</span>
          </div>
        )}

        {!started ? (
          <div className="p-10 space-y-10">
            {/* Intro */}
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-cyan-300">Pretexting</h1>
                <p className="text-slate-300">
                  {/* Pretexting is a type of social engineering attack that people
                  often fall for without realising it. Instead of sending a
                  suspicious link, the attacker creates a believable situation
                  and uses it to gain your trust. You may have already
                  encountered this without knowing the name for it.
                  <br />
                  <br />
                  If you have ever received a call from someone claiming to be
                  from IT support, a bank, or a delivery company and asking you
                  to confirm some details, that could have been a pretexting
                  attempt.
                  <br />
                  <br />
                  These attacks work because the request often sounds reasonable
                  and fits into everyday situations. When the story feels
                  normal, people are less likely to question it. */}
                  Pretexting is a type of cyber attack where someone invents a
                  fake story or role in order to trick you into giving them
                  sensitive information.
                  <br />
                  <br />
                  This can include login details, personal information, security
                  answers, or access to systems or buildings. Unlike phishing,
                  which often relies on emails and fake websites, pretexting
                  usually involves direct interaction. This could be through
                  phone calls, messages, or face to face conversations.
                  <br />
                  <br />
                  Attackers often sound confident and prepared. They may already
                  know some basic information about you or your organisation,
                  which helps make the story feel real. By building trust first,
                  they lower your guard before making their request.
                  <br />
                  <br />
                  Pretexting works because it targets human behaviour rather
                  than technology. It relies on trust, authority, and the
                  natural instinct to be helpful.
                </p>
              </div>
            </div>

            {/* Learning objectives */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-cyan-300">
                Learning objectives
              </h2>
              <section className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-900/80 border border-cyan-800 rounded-lg p-4">
                  <h2 className="text-sm font-semibold text-cyan-300 mb-2">
                    Understand what pretexting is
                  </h2>
                  <p className="text-xs text-slate-300">
                    Learn how attackers use believable stories to get
                    information or access without needing to hack anything.
                  </p>
                </div>
                <div className="bg-slate-900/80 border border-cyan-800 rounded-lg p-4">
                  <h2 className="text-sm font-semibold text-cyan-300 mb-2">
                    Spot common pretexting scenarios
                  </h2>
                  <p className="text-xs text-slate-300">
                    Recognise common roles like IT support, delivery, HR, and
                    contractors, and the red flags that come with them.
                  </p>
                </div>
                <div className="bg-slate-900/80 border border-cyan-800 rounded-lg p-4">
                  <h2 className="text-sm font-semibold text-cyan-300 mb-2">
                    Respond safely and consistently
                  </h2>
                  <p className="text-xs text-slate-300">
                    Practice simple verification steps that stop most attempts
                    without getting dragged into the story.
                  </p>
                </div>
              </section>
            </section>

            {/* Concept explanation */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-cyan-300"></h2>
              <p className="text-sm text-slate-300"></p>
            </section>

            {/* Examples */}
            {/* <section className="space-y-3">
              <h2 className="text-xl font-semibold text-cyan-300">
                Examples in real life
              </h2>
              <p className="text-sm text-slate-300">
                A common example is a phone call from someone claiming to be
                from IT support. They might say there is a problem with your
                account and ask you to confirm your username or reset your
                password while they stay on the line.
                <br />
                <br />
                Another example is an email pretending to be from HR or finance,
                asking for personal details or payment information as part of an
                urgent task. Because the request sounds work related, it often
                does not raise suspicion.
                <br />
                <br />
                Pretexting can also happen in person. Someone may pretend to be
                a new employee, contractor, or visitor who needs help accessing
                a building or restricted area. By acting confused or stressed,
                they encourage others to help without checking credentials.
                <br />
                <br />
                According to the UK National Cyber Security Centre, social
                engineering attacks like pretexting are common because they are
                simple to carry out and highly effective.
              </p>
            </section> */}

            {/* What to do */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-cyan-300">
                What to do
              </h2>
              <p className="text-sm text-slate-300">
                When someone asks for sensitive information or access, take a
                moment to stop and think about whether the request makes sense.
                Even if the story sounds convincing, it is okay to question it.
                <br />
                <br />
                Do not share passwords, one time passcodes, or personal
                information just because someone asks for it. Legitimate
                organisations will not pressure you into giving this information
                without proper verification.
                <br />
                <br />
                If you are unsure, use a trusted method to check the request.
                This could mean contacting the organisation directly using
                official contact details, or checking with a colleague or
                supervisor.
                <br />
                <br />
                Action Fraud recommends reporting suspicious calls or messages
                so that patterns can be identified and others can be protected.
              </p>
            </section>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-cyan-300">
                What you will practice
              </h2>
              <p className="text-sm text-slate-300">
                To help you understand what makes pretexting effective, you will
                now try to be an attacker and build your own pretexts.
                <br />
                In each round, you will be given a situation and need to:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2">
                <li>Build a realistic pretext scenario</li>
                <li>Apply pressure using authority or urgency</li>
                <li>Learn why each decision succeeds or fails</li>
                <li>Choose the safest response</li>
              </ul>
              <p className="text-sm text-slate-300">
                Note : This is a training exercise. In real life, pretexting is
                illegal and unethical.
              </p>

              <div className="pt-2">
                <button
                  onClick={onStart}
                  className="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold"
                >
                  Start module
                </button>
                <p className="text-slate-400 text-sm mt-2">
                  5 short scenarios. Each round gives instant feedback.
                </p>
              </div>

              <div className="pt-6 text-xs text-slate-500 space-y-1">
                <div>Sources:</div>
                <div>
                  UK NCSC: Social engineering guidance (pretexting examples and
                  advice)
                </div>
                <div>Action Fraud: Social engineering and reporting advice</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[78vh] w-full flex flex-col">
            <div className="flex-1 overflow-auto">
              <PretextingBuilder
                onFinish={() => {
                  const ending = computeEnding();
                  alert(`Module complete: ${ending}`);
                  onExit();
                }}
              />
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <div className="text-slate-400 text-sm">
                Tip: If the request is high risk, slow down and verify using an
                official channel.
              </div>
              <button
                onClick={onExit}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100"
              >
                Exit module
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
