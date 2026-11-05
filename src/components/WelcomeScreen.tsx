import React, { useState, useEffect } from 'react';
import { Play, Sparkles, BookOpen, FlaskConical, Award } from 'lucide-react';
import { CharacterAvatar, AnimatedFunctionMachineSVG } from './ComicCharacters';

interface WelcomeScreenProps {
  onStartMission: () => void;
  onJumpToSection: (section: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartMission,
  onJumpToSection
}) => {
  const [demoInput, setDemoInput] = useState<number>(4);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'button') {
          e.preventDefault();
          onStartMission();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartMission]);

  const demoOutput = 3 * demoInput + 2;

  return (
    <div className="halftone-bg py-5 px-4 sm:px-8 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full">
        {/* Main Comic Cover Split Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Issue Header, Title Lockup, Sajeev Mission Roster & CTA */}
          <div className="lg:col-span-7 comic-panel bg-amber-300 p-6 sm:p-7 rounded-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              {/* Top Issue Line */}
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-extrabold tracking-wide text-slate-900 border-b-2 border-slate-900 pb-2.5">
                <span>ISSUE #03</span>
                <span aria-hidden="true">·</span>
                <span>ALGEBRA 1</span>
                <span aria-hidden="true">·</span>
                <span>HERO CADET: SAJEEV</span>
                <span aria-hidden="true">·</span>
                <span>MONTGOMERY TOWNSHIP SD</span>
              </div>

              {/* Giant Comic Title */}
              <div className="space-y-1">
                <h1 className="font-comic-title text-5xl sm:text-6xl text-slate-950 tracking-wider leading-none drop-shadow-[3px_3px_0px_#FFFFFF]">
                  FUNCTION HEROES
                </h1>
                <p className="font-display text-lg sm:text-2xl font-extrabold text-rose-700">
                  THE MYSTERY OF THE FUNCTION MACHINE
                </p>
              </div>

              {/* Comic Speech Tagline Box */}
              <div className="comic-panel-sm bg-white p-3.5 rounded-xl">
                <p className="font-display text-base sm:text-lg font-bold text-slate-900 italic">
                  “Every number has a story. Every function has a secret!”
                </p>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">
                  McDougal Littell Algebra 1 · Standards HSF-IF.A.2 &amp; HSF-IF.A.1 · 75–90 Min Interactive Adventure
                </p>
              </div>

              {/* Today's Mission & Learning Objectives */}
              <div className="comic-panel-sm bg-sky-50 p-4 rounded-xl space-y-2">
                <h2 className="font-display text-sm sm:text-base font-extrabold text-slate-900">
                  Today’s Mission Briefing for Sajeev:
                </h2>
                <ul className="space-y-1.5 text-xs sm:text-sm font-medium text-slate-800">
                  <li className="flex items-start gap-2">
                    <span className="font-math font-bold text-rose-600 shrink-0">01.</span>
                    <span>Decode function notation <strong className="font-math">f(x)</strong> and distinguish inputs, rules, and outputs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-math font-bold text-sky-700 shrink-0">02.</span>
                    <span>Evaluate linear, quadratic, and combined functions step by step without falling for the <strong className="font-math">f(3) ≠ f × 3</strong> trap.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-math font-bold text-emerald-700 shrink-0">03.</span>
                    <span>Reverse the Function Machine to solve for missing inputs and conquer the <strong>20-Mark Final Boss Exam</strong>!</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Primary Start CTA & Quick Jump Links */}
            <div className="pt-4 mt-4 border-t-2 border-slate-900 flex flex-wrap items-center justify-between gap-3 relative z-10">
              <button
                type="button"
                data-start="true"
                onClick={onStartMission}
                className="comic-btn bg-rose-600 hover:bg-rose-500 text-white font-display font-extrabold text-base sm:text-lg px-7 py-3.5 rounded-xl flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>START MISSION</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onJumpToSection('slides')}
                  className="comic-btn bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>14 Lesson Slides</span>
                </button>
                <button
                  type="button"
                  onClick={() => onJumpToSection('lab')}
                  className="comic-btn bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <FlaskConical className="w-4 h-4" />
                  <span>Machine Lab</span>
                </button>
                <button
                  type="button"
                  onClick={() => onJumpToSection('exam')}
                  className="comic-btn bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Award className="w-4 h-4" />
                  <span>Boss Exam</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Cover Function Machine & Hero Squad */}
          <div className="lg:col-span-5 comic-panel bg-sky-200 p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-display font-extrabold text-base text-slate-900">
                  LIVE COVER PREVIEW: THE FUNCTION MACHINE
                </span>
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>

              <AnimatedFunctionMachineSVG
                inputValue={demoInput}
                ruleDisplay="3x + 2"
                outputValue={demoOutput}
                fnName="f"
              />

              {/* Live Cover Input Selector */}
              <div className="comic-panel-sm bg-white p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>TEST AN INPUT ORB (x):</span>
                  <span className="font-math text-sm text-emerald-700 font-extrabold">
                    f({demoInput}) = 3({demoInput}) + 2 = {demoOutput}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {[-2, 0, 4, 7, 10].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setDemoInput(val)}
                      className={`flex-1 py-2 rounded-lg font-math font-bold text-sm border-2 border-slate-900 transition-transform cursor-pointer ${
                        demoInput === val
                          ? 'bg-amber-400 text-slate-950 -translate-y-0.5 shadow-[2px_2px_0px_#0F172A]'
                          : 'bg-slate-100 text-slate-800 hover:bg-amber-100'
                      }`}
                    >
                      x = {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Meet the Comic Cast Strip */}
            <div className="comic-panel-sm bg-white p-4 rounded-xl space-y-3">
              <h3 className="font-display text-sm font-extrabold text-slate-900">
                YOUR SUPERHERO SQUAD &amp; ARCH-NEMESIS:
              </h3>
              <div className="grid grid-cols-5 gap-2 text-center">
                <div className="flex flex-col items-center">
                  <CharacterAvatar character="fox" size="sm" />
                  <span className="text-[11px] font-bold text-slate-900 mt-1 leading-tight">Function Fox</span>
                </div>
                <div className="flex flex-col items-center">
                  <CharacterAvatar character="professor" size="sm" />
                  <span className="text-[11px] font-bold text-slate-900 mt-1 leading-tight">Prof. Algebra</span>
                </div>
                <div className="flex flex-col items-center">
                  <CharacterAvatar character="captain" size="sm" />
                  <span className="text-[11px] font-bold text-slate-900 mt-1 leading-tight">Capt. Input</span>
                </div>
                <div className="flex flex-col items-center">
                  <CharacterAvatar character="bot" size="sm" />
                  <span className="text-[11px] font-bold text-slate-900 mt-1 leading-tight">Output Bot</span>
                </div>
                <div className="flex flex-col items-center">
                  <CharacterAvatar character="monster" size="sm" />
                  <span className="text-[11px] font-bold text-rose-700 mt-1 leading-tight">Error Monster</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
