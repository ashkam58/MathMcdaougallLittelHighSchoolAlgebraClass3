import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Lightbulb, Eye, Printer } from 'lucide-react';
import { HOMEWORK_PROBLEMS } from '../data/errorDetectiveData';
import { checkMathAnswer } from '../math/parser';

interface HomeworkViewProps {
  completedIds: string[];
  globalRevealAnswers: boolean;
  onRecordAttempt: (
    id: string,
    correct: boolean,
    skill: 'notation' | 'linear' | 'quadratic' | 'combined' | 'reverse' | 'realworld',
    label: string,
    equation: string
  ) => void;
}

export const HomeworkView: React.FC<HomeworkViewProps> = ({
  completedIds,
  globalRevealAnswers,
  onRecordAttempt
}) => {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [statusMap, setStatusMap] = useState<Record<string, 'correct' | 'wrong'>>({});
  const [hintsShown, setHintsShown] = useState<Record<string, boolean>>({});
  const [solutionsShown, setSolutionsShown] = useState<Record<string, boolean>>({});

  const handleCheck = (probId: string, accepted: string[], num: number, eq: string) => {
    const val = inputs[probId] || '';
    if (!val.trim()) return;
    const isRight = checkMathAnswer(val, accepted);
    setStatusMap((prev) => ({ ...prev, [probId]: isRight ? 'correct' : 'wrong' }));
    onRecordAttempt(probId, isRight, 'linear', `Homework #${num}`, eq);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <div className="comic-panel bg-sky-300 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs sm:text-sm font-extrabold text-slate-900">
            TAKE-HOME MISSION · MCDOUGAL LITTELL ALGEBRA 1 ALIGNED
          </div>
          <h1 className="font-comic-title text-4xl sm:text-5xl text-slate-950 tracking-wide">
            CLASS 03 HOMEWORK ASSIGNMENT
          </h1>
          <p className="text-sm sm:text-base font-semibold text-slate-800 max-w-2xl">
            Complete all 8 structured homework missions to reinforce Function Notation and Evaluating Functions before Class 04!
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="comic-btn bg-white hover:bg-slate-100 text-slate-950 font-display font-extrabold text-sm px-5 py-3 rounded-xl flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Print Homework Sheet</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {HOMEWORK_PROBLEMS.map((prob) => {
          const isDone = completedIds.includes(prob.id) || statusMap[prob.id] === 'correct';
          const showSol = globalRevealAnswers || solutionsShown[prob.id];

          return (
            <div
              key={prob.id}
              className={`comic-panel p-6 rounded-2xl flex flex-col justify-between space-y-4 ${
                isDone ? 'bg-emerald-50' : 'bg-white'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                  <span className="font-math font-extrabold text-xs bg-slate-900 text-amber-300 px-2.5 py-1 rounded">
                    PROBLEM #{prob.number}
                  </span>
                  <span className="text-xs font-extrabold text-slate-600">
                    {prob.section}
                  </span>
                </div>

                <div className="bg-slate-900 text-amber-300 font-math font-extrabold text-base sm:text-lg px-4 py-2.5 rounded-xl">
                  {prob.equation}
                </div>

                <p className="font-display font-extrabold text-base sm:text-lg text-slate-950">
                  {prob.prompt}
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCheck(prob.id, prob.acceptedAnswers, prob.number, prob.equation);
                  }}
                  className="flex items-center gap-2"
                >
                  <label className="sr-only" htmlFor={`hw-input-${prob.id}`}>
                    Homework Problem {prob.number} Answer
                  </label>
                  <input
                    id={`hw-input-${prob.id}`}
                    type="text"
                    value={inputs[prob.id] || ''}
                    onChange={(e) =>
                      setInputs((prev) => ({ ...prev, [prob.id]: e.target.value }))
                    }
                    placeholder="Type your answer..."
                    className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-900 font-math font-bold text-base bg-white"
                  />
                  <button
                    type="submit"
                    className="comic-btn bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-display font-extrabold text-sm px-5 py-2.5 rounded-xl cursor-pointer whitespace-nowrap"
                  >
                    Verify
                  </button>
                </form>

                {hintsShown[prob.id] && (
                  <div className="bg-amber-100 p-3 rounded-xl border-2 border-slate-900 text-xs font-bold text-slate-800">
                    <strong>Hint:</strong> {prob.hint}
                  </div>
                )}

                {statusMap[prob.id] === 'correct' && (
                  <div className="bg-emerald-200 p-3 rounded-xl border-2 border-slate-900 text-xs sm:text-sm font-extrabold text-slate-950 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-900 shrink-0" />
                    <span>Correct! {prob.solution}</span>
                  </div>
                )}

                {statusMap[prob.id] === 'wrong' && (
                  <div className="bg-rose-200 p-3 rounded-xl border-2 border-slate-900 text-xs sm:text-sm font-bold text-rose-950 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-900 shrink-0" />
                    <span>Not quite! Check the hint below and try again.</span>
                  </div>
                )}

                {showSol && (
                  <div className="bg-sky-100 p-3 rounded-xl border-2 border-slate-900 text-xs font-bold text-slate-900">
                    <strong>Worked Solution:</strong> {prob.solution}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-extrabold">
                <button
                  type="button"
                  onClick={() =>
                    setHintsShown((prev) => ({ ...prev, [prob.id]: !prev[prob.id] }))
                  }
                  className="text-amber-800 flex items-center gap-1 cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{hintsShown[prob.id] ? 'Hide Hint' : 'Show Hint'}</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSolutionsShown((prev) => ({ ...prev, [prob.id]: !prev[prob.id] }))
                  }
                  className="text-sky-800 flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showSol ? 'Hide Solution' : 'Reveal Solution'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
