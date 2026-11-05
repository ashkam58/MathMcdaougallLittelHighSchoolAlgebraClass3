import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, Eye, RotateCcw } from 'lucide-react';
import { WORKED_EXAMPLES } from '../data/practiceData';
import { CharacterAvatar, CHARACTER_META } from './ComicCharacters';
import { checkMathAnswer } from '../math/parser';

interface WorkedExamplesProps {
  globalRevealAnswers: boolean;
  onLaunchPractice: () => void;
}

export const WorkedExamples: React.FC<WorkedExamplesProps> = ({
  globalRevealAnswers,
  onLaunchPractice
}) => {
  const [selectedExampleId, setSelectedExampleId] = useState<string>(WORKED_EXAMPLES[0].id);
  const [unlockedStep, setUnlockedStep] = useState<number>(1);
  const [stepInputs, setStepInputs] = useState<Record<number, string>>({});
  const [stepVerified, setStepVerified] = useState<Record<number, boolean>>({});

  const activeExample =
    WORKED_EXAMPLES.find((ex) => ex.id === selectedExampleId) || WORKED_EXAMPLES[0];

  const handleSelectExample = (id: string) => {
    setSelectedExampleId(id);
    setUnlockedStep(1);
    setStepInputs({});
    setStepVerified({});
  };

  const handleVerifyStep = (stepNumber: number, expected: string[]) => {
    const val = stepInputs[stepNumber] || '';
    if (checkMathAnswer(val, expected)) {
      setStepVerified((prev) => ({ ...prev, [stepNumber]: true }));
      if (unlockedStep <= stepNumber) {
        setUnlockedStep(stepNumber + 1);
      }
    }
  };

  const handleRevealAll = () => {
    setUnlockedStep(activeExample.steps.length + 1);
    const allVerified: Record<number, boolean> = {};
    const allInputs: Record<number, string> = {};
    activeExample.steps.forEach((s) => {
      allVerified[s.stepNumber] = true;
      allInputs[s.stepNumber] = s.interactiveExpected[0];
    });
    setStepVerified(allVerified);
    setStepInputs(allInputs);
  };

  const charMeta = CHARACTER_META[activeExample.character];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="comic-panel bg-amber-300 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs sm:text-sm font-extrabold text-slate-900">
            GUIDED WORKED EXAMPLES · INTERACTIVE STEP-BY-STEP MASTERCLASS
          </div>
          <h1 className="font-comic-title text-4xl sm:text-5xl text-slate-950 tracking-wide">
            WORKED EXAMPLES DOJO
          </h1>
          <p className="text-sm sm:text-base font-semibold text-slate-800 max-w-2xl">
            Complete each step interactively with your Superhero Squad to see how full-mark solutions are written on Algebra 1 exams.
          </p>
        </div>

        <button
          type="button"
          onClick={onLaunchPractice}
          className="comic-btn bg-rose-600 hover:bg-rose-500 text-white font-display font-extrabold text-sm sm:text-base px-6 py-3.5 rounded-xl flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>Enter Practice Arena</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Example Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {WORKED_EXAMPLES.map((ex, i) => {
          const isSelected = ex.id === selectedExampleId;
          return (
            <button
              key={ex.id}
              type="button"
              onClick={() => handleSelectExample(ex.id)}
              className={`comic-panel-sm p-4 rounded-xl text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white -translate-y-1 shadow-[5px_5px_0px_#FACC15]'
                  : 'bg-white hover:bg-amber-50 text-slate-900'
              }`}
            >
              <div className={`text-xs font-extrabold ${isSelected ? 'text-amber-300' : 'text-rose-700'}`}>
                EXAMPLE 0{i + 1} · {ex.category}
              </div>
              <div className="font-display font-extrabold text-sm sm:text-base mt-1">
                {ex.givenEquation} → {ex.goalText}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Worked Example Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 5 Columns: Problem Statement & Superhero Coach */}
        <div className="lg:col-span-5 comic-panel bg-sky-100 p-6 rounded-2xl space-y-5">
          <div className="flex items-center gap-4">
            <CharacterAvatar character={activeExample.character} size="lg" />
            <div>
              <span className="text-xs font-extrabold text-slate-700 uppercase">
                {charMeta.name}
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-950">
                {activeExample.title}
              </h2>
            </div>
          </div>

          <div className="comic-panel-sm bg-white p-4 rounded-xl">
            <p className="text-sm font-bold text-slate-900">
              “{activeExample.characterTip}”
            </p>
          </div>

          <div className="comic-panel-sm bg-slate-900 p-5 rounded-xl text-center space-y-2">
            <div className="text-xs font-extrabold text-slate-300">GIVEN FUNCTION RULE:</div>
            <div className="font-math text-2xl sm:text-3xl font-extrabold text-amber-300">
              {activeExample.givenEquation}
            </div>
            <div className="text-sm font-extrabold text-emerald-400 pt-1">
              MISSION: {activeExample.goalText}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRevealAll}
              className="comic-btn flex-1 bg-amber-300 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Reveal All Steps</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectExample(activeExample.id)}
              className="comic-btn bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Right 7 Columns: Progressive Step-by-Step Ladder */}
        <div className="lg:col-span-7 space-y-4">
          {activeExample.steps.map((step) => {
            const isUnlocked =
              globalRevealAnswers ||
              unlockedStep >= step.stepNumber ||
              stepVerified[step.stepNumber];
            const isDone = globalRevealAnswers || stepVerified[step.stepNumber];

            return (
              <div
                key={step.stepNumber}
                className={`comic-panel p-6 rounded-2xl transition-all ${
                  isDone
                    ? 'bg-emerald-50'
                    : isUnlocked
                    ? 'bg-white'
                    : 'bg-slate-100 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2 mb-4">
                  <span className="font-display font-extrabold text-base text-slate-950">
                    STEP {step.stepNumber}: {step.title}
                  </span>
                  {isDone && (
                    <span className="text-xs font-extrabold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed</span>
                    </span>
                  )}
                </div>

                {isUnlocked ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 text-white p-4 rounded-xl">
                      <span className="font-math text-lg sm:text-xl font-extrabold text-amber-300">
                        {step.algebra}
                      </span>
                      <span className="text-xs font-semibold text-slate-300 max-w-xs">
                        {step.reason}
                      </span>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleVerifyStep(step.stepNumber, step.interactiveExpected);
                      }}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1"
                    >
                      <label className="text-xs sm:text-sm font-bold text-slate-800 flex-1">
                        {step.interactivePrompt}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={
                            globalRevealAnswers
                              ? step.interactiveExpected[0]
                              : stepInputs[step.stepNumber] || ''
                          }
                          onChange={(e) =>
                            setStepInputs((prev) => ({
                              ...prev,
                              [step.stepNumber]: e.target.value
                            }))
                          }
                          placeholder="Type step answer..."
                          className="w-36 px-3 py-2 rounded-xl border-2 border-slate-900 font-math font-bold text-sm bg-white"
                        />
                        <button
                          type="submit"
                          className="comic-btn bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl cursor-pointer whitespace-nowrap"
                        >
                          Verify Step
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm font-bold text-slate-500">
                    Complete Step {step.stepNumber - 1} above (or click “Reveal All Steps”) to unlock this step!
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
