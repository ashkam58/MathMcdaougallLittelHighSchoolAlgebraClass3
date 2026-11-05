import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldAlert, Zap } from 'lucide-react';
import { CharacterAvatar, CHARACTER_META } from './ComicCharacters';
import { CharacterId } from '../data/slidesData';

interface MissionBriefingProps {
  onLaunchSlides: () => void;
  onLaunchLab: () => void;
}

const STORY_PANELS: {
  panelNum: string;
  character: CharacterId;
  title: string;
  quote: string;
  mathCallout: string;
  bgClass: string;
}[] = [
  {
    panelNum: 'PANEL 01',
    character: 'fox',
    title: 'THE SIGNAL OVER MONTGOMERY CITY',
    quote: 'Sajeev! Strange algebraic signals are beaming from the Montgomery Power Grid. Every machine runs on a secret Function Rule!',
    mathCallout: 'f(x) = 3x + 2',
    bgClass: 'bg-amber-100'
  },
  {
    panelNum: 'PANEL 02',
    character: 'captain',
    title: 'CAPTAIN INPUT LOADS THE HOPPER',
    quote: 'My job is feeding the INPUT variable (x) into the machine! Whether x is 4, 0, −3, or even (a + 2), it drops straight into the rule!',
    mathCallout: 'Input = x   ──►   Replace every x in the rule!',
    bgClass: 'bg-indigo-100'
  },
  {
    panelNum: 'PANEL 03',
    character: 'professor',
    title: 'PROFESSOR ALGEBRA’S GOLDEN LAW',
    quote: 'Inside the chamber, Order of Operations (PEMDAS) rules supreme! Exponents first, multiplication second, addition and subtraction last!',
    mathCallout: 'g(x) = 2x² − 3x + 1',
    bgClass: 'bg-sky-100'
  },
  {
    panelNum: 'PANEL 04',
    character: 'bot',
    title: 'OUTPUT BOT REVEALS THE RESULT',
    quote: 'BEEP-BOOP! When the calculation finishes, I announce f(x)—the single predictable OUTPUT value for that input!',
    mathCallout: 'f(4) = 14   means   Input = 4, Output = 14',
    bgClass: 'bg-emerald-100'
  },
  {
    panelNum: 'PANEL 05',
    character: 'monster',
    title: 'BEWARE THE ERROR MONSTER!',
    quote: 'GRAAAH! I try to make students think f(3) means "f times 3" or forget to square before multiplying! Only Sajeev can stop me!',
    mathCallout: 'TRAP ALERT: f(3) ≠ f × 3',
    bgClass: 'bg-rose-100'
  }
];

export const MissionBriefing: React.FC<MissionBriefingProps> = ({
  onLaunchSlides,
  onLaunchLab
}) => {
  const [pledgeChecked, setPledgeChecked] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="comic-panel bg-amber-300 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="text-xs sm:text-sm font-extrabold text-slate-900">
            CHAPTER 01 · MISSION BRIEFING · MONTGOMERY TOWNSHIP ALGEBRA 1
          </div>
          <h1 className="font-comic-title text-4xl sm:text-5xl text-slate-950 tracking-wide">
            THE STORY OF THE FUNCTION HEROES
          </h1>
          <p className="text-sm sm:text-base font-semibold text-slate-800 max-w-2xl">
            Read the 5-panel graphic novel briefing below to meet your team, review the curriculum roadmap, and launch into the 14 interactive lesson slides.
          </p>
        </div>

        <button
          type="button"
          onClick={onLaunchSlides}
          className="comic-btn bg-rose-600 hover:bg-rose-500 text-white font-display font-extrabold text-base sm:text-lg px-6 py-3.5 rounded-xl flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>Enter Interactive Lesson Slides</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* 5-Panel Comic Strip Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STORY_PANELS.map((panel, idx) => {
          const meta = CHARACTER_META[panel.character];
          return (
            <div
              key={panel.panelNum}
              className={`comic-panel ${panel.bgClass} p-6 rounded-2xl flex flex-col justify-between space-y-4 ${
                idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                  <span className="font-math font-extrabold text-xs text-slate-900">
                    {panel.panelNum}
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {meta.name} · {meta.role}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <CharacterAvatar character={panel.character} size="md" />
                  <h2 className="font-display font-extrabold text-lg text-slate-950 leading-snug">
                    {panel.title}
                  </h2>
                </div>

                {/* Speech Bubble */}
                <div className="comic-panel-sm bg-white p-4 rounded-xl">
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                    “{panel.quote}”
                  </p>
                </div>
              </div>

              {/* Math Callout Box */}
              <div className="bg-slate-900 text-amber-300 font-math font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border-2 border-slate-950 text-center">
                {panel.mathCallout}
              </div>
            </div>
          );
        })}

        {/* Panel 6: Interactive Cadet Readiness Pledge */}
        <div className="comic-panel bg-white p-6 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <span className="font-math font-extrabold text-xs text-rose-600">
                PANEL 06 · CADET CHECK-IN
              </span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>

            <h2 className="font-display font-extrabold text-xl text-slate-950">
              Sajeev’s 3 Golden Rules for Today
            </h2>

            <ul className="space-y-2 text-xs sm:text-sm font-semibold text-slate-700">
              <li className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>Never treat <strong className="font-math">f(x)</strong> as multiplication <strong className="font-math">f × x</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Always wrap substituted numbers or expressions in parentheses <strong className="font-math">( )</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span>Check whether the question gives you the <strong>INPUT x</strong> or the <strong>OUTPUT f(x)</strong>!</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => setPledgeChecked(!pledgeChecked)}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm border-2 border-slate-900 flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                pledgeChecked
                  ? 'bg-emerald-400 text-slate-950'
                  : 'bg-amber-200 hover:bg-amber-300 text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {pledgeChecked
                  ? 'Mission Code Accepted! Ready for Action!'
                  : 'Click to Accept Sajeev’s Hero Mission Code'}
              </span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onLaunchSlides}
                className="comic-btn bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-2.5 px-3 rounded-xl cursor-pointer whitespace-nowrap"
              >
                Start Lesson Slides
              </button>
              <button
                type="button"
                onClick={onLaunchLab}
                className="comic-btn bg-sky-300 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm py-2.5 px-3 rounded-xl cursor-pointer whitespace-nowrap"
              >
                Open Machine Lab
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
