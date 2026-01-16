import React, { useState } from "react";
import { Link } from "react-router-dom";
import MonitorFrame from "../components/MonitorFrame";
import { useGameStore } from "../state/useGameStore";

export default function PhishingModule() {
  const [started, setStarted] = useState(false);
  const resetGame = useGameStore((state) => state.resetGame);

  const handleStart = () => {
    resetGame();
    setStarted(true);
    // optional: scroll to the simulator
    setTimeout(() => {
      const el = document.getElementById("phishing-simulator");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        {/* Breadcrumb / back link */}
        <div className="text-sm text-slate-400">
          <Link to="/" className="text-cyan-400 hover:text-cyan-300">
            Home
          </Link>
          <span className="mx-1">/</span>
          <span>Phishing module</span>
        </div>

        {/* Intro section */}
        <section className="space-y-4">
          <h1 className="text-3xl font-bold text-cyan-300">
            Phishing Attacks and Credential Funnels
          </h1>
          <p className="text-slate-300">
            Phishing is probably the most well known cyber attack people are
            aware of even if they don’t know the exact definition. If you’ve
            ever got a spam email asking you to click a link or a random email
            asking you to reconfirm an order you don’t remember placing , that
            was likely an attempted phishing scam.
            <br />
            Although email providers do a good job at filtering out the really
            obvious examples and you can tell when an email looks suspicious
            majority of the time, some of the phishing emails can be realistic
            and potentially catch you out. Roughly 1 in 10 adults in the UK have
            fallen for phishing scams [1] and over £620 million was lost to
            fraud in the first half of 2025 [2] with phishing being a common way
            for scammers to deliver these purchasing scams.
          </p>
        </section>

        {/* Learning objectives */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 border border-cyan-800 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-cyan-300 mb-2">
              Recognise phishing emails
            </h2>
            <p className="text-xs text-slate-300">
              Learn to spot subtle signals in email content such as urgency,
              weird requests, and mismatched sender details.
            </p>
          </div>
          <div className="bg-slate-900/80 border border-cyan-800 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-cyan-300 mb-2">
              Identify fake login pages
            </h2>
            <p className="text-xs text-slate-300">
              Understand how attackers replicate login portals and how to verify
              URLs and security indicators before entering passwords.
            </p>
          </div>
          <div className="bg-slate-900/80 border border-cyan-800 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-cyan-300 mb-2">
              Respond safely
            </h2>
            <p className="text-xs text-slate-300">
              Practice safe responses such as closing suspicious pages, deleting
              emails, and using official channels to verify activity.
            </p>
          </div>
        </section>

        {/* Phishing explanation */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-cyan-300">
            What is phishing?
          </h2>
          <p className="text-sm text-slate-300">
            Phishing is a type of cyber attack where someone pretends to be a
            trusted organisation or person in order to trick you into giving
            away sensitive information. This usually includes login details,
            bank information, or one time passcodes. Phishing attacks often try
            to create a sense of urgency or importance. For example, an email
            might claim that your account will be locked, a payment has failed,
            or suspicious activity has been detected.
            <br />
            <br />
            The goal is to pressure you into acting quickly before you have time
            to think. Most phishing attacks rely on fake links or fake login
            pages. These pages are designed to look almost identical to real
            websites, such as banks, delivery companies, or popular online
            services.
            <br />
            Once you enter your details, the attacker can use them to access
            your account or commit fraud. Phishing does not only happen through
            email. It can also occur through text messages, social media, phone
            calls, and even QR codes.
          </p>
        </section>

        {/* Phishing examples */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-cyan-300">
            Real life examples
          </h2>
          <p className="text-sm text-slate-300">
            A common example is a fake delivery email claiming that a parcel
            could not be delivered. The message includes a link asking you to
            confirm your address or pay a small fee. The link leads to a fake
            website designed to steal your card details.
            <br />
            <br />
            Another example is an email pretending to be from your bank or a
            well known service like a streaming platform. It may claim there has
            been suspicious login activity and ask you to reset your password.
            The reset link leads to a convincing fake login page.
            <br />
            <br />
            Phishing is also frequently used in workplace attacks. Employees may
            receive emails that appear to come from their manager or IT
            department, asking them to log in to a portal or download a file.
            <br />
            <br />
            These attacks are especially dangerous because they exploit trust
            and authority. According to the UK National Cyber Security Centre,
            phishing remains one of the most common ways attackers gain access
            to personal and organisational accounts. The Action Fraud reports
            that millions of phishing related reports are submitted each year in
            the UK alone.
          </p>
        </section>

        {/* How to defend yourself */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-cyan-300">What to do</h2>
          <p className="text-sm text-slate-300">
            While phishing scams can look convincing, there are several common
            warning signs that can help you spot them before any damage is done.
            <br />
            One of the most important things to check is the sender and the
            link. Phishing emails often come from addresses that look similar to
            real ones but include small spelling mistakes or extra characters.
            Hovering over a link before clicking can reveal the real
            destination, which may not match the organisation it claims to be
            from.
            <br />
            <br />
            Phishing messages often try to create urgency or fear. Messages that
            say your account will be locked, money will be lost, or action is
            required immediately are designed to rush you into making mistakes.
            Legitimate organisations rarely pressure users to act instantly via
            email or text.
            <br />
            <br />
            Another warning sign is being asked for sensitive information.
            Reputable companies will not ask you to provide passwords, full card
            details, or one time passcodes through links, emails, or messages.
            If you are unsure, it is safer to go directly to the organisation’s
            official website instead of clicking the link provided.
            <br />
            <br />
            Using security features can also reduce risk. Many services offer
            multi factor authentication, which can prevent attackers from
            accessing your account even if your password is stolen. Keeping your
            devices and browsers up to date also helps protect against known
            threats. The UK National Cyber Security Centre advises users to
            stop, think, and check before interacting with unexpected messages,
            while Action Fraud recommends reporting suspected phishing attempts
            to help protect others.
          </p>
        </section>

        {/* Explanation of scenario */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-cyan-300">
            Scenario overview
          </h2>
          <p className="text-sm text-slate-300">
            You will play as an employee using a corporate inbox. During the
            scenario you will receive a mix of legitimate and malicious emails:
            a real dance competition registration, a fake Gmail security alert,
            and a suspicious Amazon receipt. Your decisions determine whether
            your account stays secure or is compromised.
          </p>
          <ul className="text-sm text-slate-300 list-disc list-inside space-y-1">
            <li>Correctly handle the legitimate dance email.</li>
            <li>Avoid entering credentials on fake login pages.</li>
            <li>
              Check order numbers and details before downloading attachments.
            </li>
          </ul>
        </section>

        {/* Call to action */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-cyan-300">
            Ready to try the simulation?
          </h2>
          <p className="text-sm text-slate-300">
            When you start, a simulated terminal will appear below. Work through
            your inbox as you would in a real job. At the end you will receive a
            summary of your outcome.
          </p>

          <button
            onClick={handleStart}
            className="mt-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded"
          >
            {started ? "Restart simulation" : "Play simulation"}
          </button>
        </section>

        {/* Simulation mount point */}
        <section id="phishing-simulator" className="pt-6">
          {started && <MonitorFrame />}
          {!started && (
            <p className="text-xs text-slate-500">
              Simulation will appear here after you click Play simulation.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
