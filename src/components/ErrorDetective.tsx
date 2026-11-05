import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, Lightbulb, Sparkles, Bug } from 'lucide-react';
import { ERROR_CHALLENGES, ErrorChallenge } from '../data/errorDetectiveData';
import { CharacterAvatar } from './ComicCharacters';
import { checkMathAnswer } from '../math/parser';

interface ErrorDetectiveProps {
  caughtIds: string[];
  globalRevealAnswers: boolean;
  onBugCaught: (challengeId: string) => void;
  onRecordHint: () => void;
}

export const ErrorDetective: React.FC<ErrorDetectiveProps> = ({
  caughtIds,
  globalRevealAnswers,
  onBugCaught,
  onRecordHint
}) => {
  const [activeId, setActiveId] = useState<string>(ERROR_CHALLENGES[0].id);
  const [selectedPart1, setSelectedPart1] = useState<Record<string, string>>({});
  const [part2Inputs, setPart2Inputs] = useState<Record<string, string>>({});
  const [clueLevels, setClueLevels] = useState<Record<string, number>>({});
  const [statusMessage, setStatusMessage] = useState<
    Record<string, { state: 'idle' | 'clue' | 'defeated'; text: string }>
  >({});

  const activeChallenge: ErrorChallenge =
    ERROR_CHALLENGES.find((c) => c.id === activeId) || ERROR_CHALLENGES[0];

  const isDefeated =
    caughtIds.includes(activeChallenge.id) ||
    statusMessage[activeChallenge.id]?.state === 'defeated';

  const handleInvestigateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p1 = selectedPart1[activeChallenge.id] || '';
    const p2 = part2Inputs[activeChallenge.id] || '';

    const p1Right = p1 === activeChallenge.part1Correct;
    const p2Right = checkMathAnswer(p2, activeChallenge.part2Accepted);

    if (p1Right && p2Right) {
      setStatusMessage((prev) => ({
        ...prev,
        [activeChallenge.id]: {
          state: 'defeated',
          text: activeChallenge.victoryExplanation
        }
      }));
      onBugCaught(activeChallenge.id);
    } else {
      const nextClue = Math.min(
        activeChallenge.clues.length,
        (clueLevels[activeChallenge.id] || 0) + 1
      );
      setClueLevels((prev) => ({ ...prev, [activeChallenge.id]: nextClue }));
      onRecordHint();

      const specificHelp = !p1Right
        ? 'Check Step 1 (Identifying the mathematical error).'
        : 'Step 1 is right! Now check your calculation in Step 2.';

      setStatusMessage((prev) => ({
        ...prev,
        [activeChallenge.id]: {
          state: 'clue',
          text: `${specificHelp} Clue unlocked below—try again to defeat the Error Monster!`
        }
      }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="comic-panel bg-rose-300 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs sm:text-sm font-extrabold text-slate-900">
            SECTION 5 · ERROR DETECTIVE: FIND THE MATHEMATICAL BUG
          </div>
          <h1 className="font-comic-title text-4xl sm:text-5xl text-slate-950 tracking-wide">
            ERROR DETECTIVE HQ
          </h1>
          <p className="text-sm sm:text-base font-semibold text-slate-900 max-w-2xl">
            The Error Monster has planted 4 classic algebra bugs! Diagnose each mistake and compute the true value to squash the bug!
          </p>
        </div>

        <div className="comic-panel-sm bg-white px-5 py-3 rounded-xl flex items-center gap-3 shrink-0">
          <Bug className="w-6 h-6 text-rose-600" />
          <div>
            <div className="text-xs font-extrabold text-slate-600">BUGS SQUASHED</div>
            <div className="font-math font-extrabold text-lg text-slate-950">
              {caughtIds.length} / {ERROR_CHALLENGES.length} Defeated
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Selector Tabs (Challenge A, B, C, D) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ERROR_CHALLENGES.map((ch) => {
          const solved = caughtIds.includes(ch.id);
          const isCurrent = ch.id === activeChallenge.id;
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => setActiveId(ch.id)}
              className={`comic-panel-sm p-4 rounded-xl text-left transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-slate-900 text-white -translate-y-1 shadow-[4px_4px_0px_#F43F5E]'
                  : solved
                  ? 'bg-emerald-100 text-slate-950'
                  : 'bg-white hover:bg-rose-50 text-slate-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-math font-extrabold text-xs ${isCurrent ? 'text-amber-300' : 'text-rose-700'}`}>
                  {ch.code}
                </span>
                {solved && (
                  <span className="text-xs font-extrabold text-emerald-700">✓ FIXED</span>
                )}
              </div>
              <div className="font-display font-extrabold text-sm sm:text-base mt-1">
                {ch.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Investigation Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left 5 Columns: Error Monster Crime Scene */}
        <div
          className={`lg:col-span-5 comic-panel p-6 rounded-2xl flex flex-col justify-between space-y-6 transition-colors ${
            isDefeated ? 'bg-emerald-100' : 'bg-rose-100'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <span className="font-display font-extrabold text-sm text-slate-950">
                {activeChallenge.code}: CRIME SCENE FILE
              </span>
              <span className="font-math font-extrabold text-xs px-2.5 py-1 rounded bg-slate-900 text-amber-300">
                {isDefeated ? 'MONSTER DEFEATED!' : 'ACTIVE GLITCH'}
              </span>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 py-2">
              <CharacterAvatar
                character="monster"
                mood={isDefeated ? 'defeated' : 'idle'}
                size="xl"
              />
              <div className="comic-panel-sm bg-white p-4 rounded-xl w-full">
                <p className="text-sm font-bold text-slate-900">
                  {isDefeated
                    ? '“NOOO! Sajeev exposed my algebra trick and fixed the Function Machine!”'
                    : `“${activeChallenge.monsterTaunt}”`}
                </p>
              </div>
            </div>

            {/* Suspicious Work Evidence Box */}
            <div className="comic-panel-sm bg-slate-900 p-5 rounded-xl space-y-3">
              <div className="text-xs font-extrabold text-amber-300 uppercase">
                GIVEN FUNCTION RULE:
              </div>
              <div className="font-math text-xl font-extrabold text-white">
                {activeChallenge.functionRule}
              </div>
              <div className="pt-2 border-t border-slate-700">
                <div className="text-xs font-extrabold text-rose-400 uppercase">
                  SUSPICIOUS CLAIM TO INVESTIGATE:
                </div>
                <div className="font-math text-lg font-extrabold text-rose-300 mt-1">
                  {activeChallenge.monsterClaim}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/80 p-3.5 rounded-xl border-2 border-slate-900">
            <CharacterAvatar character="fox" size="sm" />
            <p className="text-xs font-bold text-slate-800">
              <strong>Function Fox Tip:</strong> Complete both Step 1 and Step 2 on the right to zap the Error Monster!
            </p>
          </div>
        </div>

        {/* Right 7 Columns: Detective Investigation Form */}
        <form
          onSubmit={handleInvestigateSubmit}
          className="lg:col-span-7 comic-panel bg-white p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6"
        >
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-extrabold text-slate-950 border-b-2 border-slate-900 pb-3">
              SAJEEV’S DETECTIVE REPORT — {activeChallenge.title}
            </h2>

            {/* Step 1: Diagnose the Error */}
            <div className="space-y-3">
              <label className="block font-display font-extrabold text-base text-slate-950">
                {activeChallenge.part1Prompt}
              </label>
              <div className="space-y-2">
                {activeChallenge.part1Options.map((opt) => {
                  const chosen =
                    (globalRevealAnswers
                      ? activeChallenge.part1Correct
                      : selectedPart1[activeChallenge.id]) === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        setSelectedPart1((prev) => ({
                          ...prev,
                          [activeChallenge.id]: opt
                        }))
                      }
                      className={`w-full text-left p-3.5 rounded-xl border-2 border-slate-900 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        chosen
                          ? 'bg-slate-900 text-white shadow-[3px_3px_0px_#FACC15]'
                          : 'bg-slate-50 hover:bg-amber-50 text-slate-900'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Calculate the True Value */}
            <div className="space-y-2">
              <label
                htmlFor={`detective-p2-${activeChallenge.id}`}
                className="block font-display font-extrabold text-base text-slate-950"
              >
                {activeChallenge.part2Prompt}
              </label>
              <input
                id={`detective-p2-${activeChallenge.id}`}
                type="text"
                value={
                  globalRevealAnswers
                    ? activeChallenge.part2Accepted[0]
                    : part2Inputs[activeChallenge.id] || ''
                }
                onChange={(e) =>
                  setPart2Inputs((prev) => ({
                    ...prev,
                    [activeChallenge.id]: e.target.value
                  }))
                }
                placeholder="Enter the correct numerical answer..."
                className="w-full px-4 py-3 rounded-xl border-3 border-slate-900 font-math font-extrabold text-lg bg-amber-50 text-slate-950"
              />
            </div>

            {/* Clues Panel */}
            {(clueLevels[activeChallenge.id] || 0) > 0 && (
              <div className="comic-panel-sm bg-amber-100 p-4 rounded-xl space-y-1.5">
                <div className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" />
                  <span>DETECTIVE CLUES:</span>
                </div>
                <ul className="list-disc pl-4 text-xs sm:text-sm font-bold text-slate-800 space-y-1">
                  {activeChallenge.clues
                    .slice(0, clueLevels[activeChallenge.id] || 0)
                    .map((clue, idx) => (
                      <li key={idx}>{clue}</li>
                    ))}
                </ul>
              </div>
            )}

            {/* Status / Defeat Animation Banner */}
            {statusMessage[activeChallenge.id] && (
              <div
                className={`comic-panel-sm p-4 rounded-xl flex items-start gap-3 ${
                  statusMessage[activeChallenge.id].state === 'defeated'
                    ? 'bg-emerald-300 text-slate-950'
                    : 'bg-rose-200 text-slate-950'
                }`}
              >
                {statusMessage[activeChallenge.id].state === 'defeated' ? (
                  <Sparkles className="w-6 h-6 text-emerald-950 shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-6 h-6 text-rose-900 shrink-0 mt-0.5" />
                )}
                <div className="text-xs sm:text-sm font-extrabold leading-relaxed">
                  {statusMessage[activeChallenge.id].text}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t-2 border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                const next = Math.min(
                  activeChallenge.clues.length,
                  (clueLevels[activeChallenge.id] || 0) + 1
                );
                setClueLevels((prev) => ({ ...prev, [activeChallenge.id]: next }));
                onRecordHint();
              }}
              className="px-4 py-2.5 rounded-xl border-2 border-slate-900 bg-amber-200 hover:bg-amber-300 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Reveal Detective Clue</span>
            </button>

            <button
              type="submit"
              className="comic-btn bg-rose-600 hover:bg-rose-500 text-white font-display font-extrabold text-base px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Submit Investigation &amp; Zap Bug!</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
