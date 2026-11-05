import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Eye,
  Zap,
  Layers,
  Target,
  Globe,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import {
  PracticeQuestion,
  LEVEL_1_QUESTIONS,
  LEVEL_2_QUESTIONS,
  LEVEL_3_QUESTIONS,
  LEVEL_4_SCENARIOS,
  QUICK_FIRE_QUESTIONS
} from '../data/practiceData';
import { SkillKey } from '../utils/progressStore';
import { checkMathAnswer } from '../math/parser';
import { CharacterAvatar } from './ComicCharacters';

interface PracticeArenaProps {
  completedIds: string[];
  globalRevealAnswers: boolean;
  globalShowHints: boolean;
  onRecordAttempt: (
    id: string,
    correct: boolean,
    skill: SkillKey,
    label: string,
    equation: string
  ) => void;
  onRecordHint: () => void;
}

type ArenaTab = 'level1' | 'level2' | 'level3' | 'level4' | 'arcade';

const MATCH_PAIRS = [
  { id: 'm1', eq: 'f(3) for f(x) = 2x + 5', out: '11' },
  { id: 'm2', eq: 'g(4) for g(x) = x² − 1', out: '15' },
  { id: 'm3', eq: 'h(−2) for h(x) = 3x + 10', out: '4' },
  { id: 'm4', eq: 'p(5) for p(x) = 4x − 20', out: '0' }
];

const SORT_ITEMS = [
  { id: 's1', expr: 'f(x) = 4x − 9', category: 'Linear' },
  { id: 's2', expr: 'g(x) = x² + 5x + 6', category: 'Quadratic' },
  { id: 's3', expr: 'C(n) = 12n + 5', category: 'Linear' },
  { id: 's4', expr: 'h(x) = 3x² − 1', category: 'Quadratic' }
];

export const PracticeArena: React.FC<PracticeArenaProps> = ({
  completedIds,
  globalRevealAnswers,
  globalShowHints,
  onRecordAttempt,
  onRecordHint
}) => {
  const [activeTab, setActiveTab] = useState<ArenaTab>('level1');
  const [activeScenarioId, setActiveScenarioId] = useState<string>(LEVEL_4_SCENARIOS[0].id);

  // Per-question user answers, feedback, hints, and reveals
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [feedbackMap, setFeedbackMap] = useState<
    Record<string, { status: 'correct' | 'wrong'; text: string }>
  >({});
  const [hintCounts, setHintCounts] = useState<Record<string, number>>({});
  const [revealedMap, setRevealedMap] = useState<Record<string, boolean>>({});

  // Arcade Quick-Fire & Matching states
  const [qfIndex, setQfIndex] = useState<number>(0);
  const [qfScore, setQfScore] = useState<number>(0);
  const [qfFeedback, setQfFeedback] = useState<string>('');
  const [selectedMatchEq, setSelectedMatchEq] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [sortChoices, setSortChoices] = useState<Record<string, string>>({});

  const handleAnswerSubmit = (q: PracticeQuestion, explicitChoice?: string) => {
    const raw = explicitChoice !== undefined ? explicitChoice : inputs[q.id] || '';
    if (!raw.trim()) return;

    const isCorrect =
      q.type === 'choice'
        ? q.acceptedAnswers.includes(raw)
        : checkMathAnswer(raw, q.acceptedAnswers);

    onRecordAttempt(q.id, isCorrect, q.skill, `Level ${q.level} ${q.numberLabel}`, q.equationDisplay);

    if (isCorrect) {
      setFeedbackMap((prev) => ({
        ...prev,
        [q.id]: {
          status: 'correct',
          text: `BOOM! Correct! ${q.explanation}`
        }
      }));
    } else {
      setFeedbackMap((prev) => ({
        ...prev,
        [q.id]: {
          status: 'wrong',
          text: `Careful! Check your substitution or click Hint for a step-by-step clue. Remember: in ${q.equationDisplay}, substitute carefully and follow Order of Operations.`
        }
      }));
    }
  };

  const handleShowHint = (q: PracticeQuestion) => {
    const current = hintCounts[q.id] || 0;
    if (current < q.hints.length) {
      setHintCounts((prev) => ({ ...prev, [q.id]: current + 1 }));
      onRecordHint();
    }
  };

  const handleResetQuestion = (qId: string) => {
    setInputs((prev) => ({ ...prev, [qId]: '' }));
    setFeedbackMap((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
    setHintCounts((prev) => ({ ...prev, [qId]: 0 }));
    setRevealedMap((prev) => ({ ...prev, [qId]: false }));
  };

  const renderQuestionCard = (q: PracticeQuestion) => {
    const isSolved = completedIds.includes(q.id) || feedbackMap[q.id]?.status === 'correct';
    const fb = feedbackMap[q.id];
    const hCount = globalShowHints ? q.hints.length : hintCounts[q.id] || 0;
    const isRevealed = globalRevealAnswers || revealedMap[q.id];

    return (
      <div
        key={q.id}
        className={`comic-panel p-5 sm:p-6 rounded-2xl flex flex-col justify-between space-y-4 transition-all ${
          isSolved ? 'bg-emerald-50' : 'bg-white'
        }`}
      >
        <div className="space-y-3">
          {/* Header Row */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-math font-extrabold text-xs sm:text-sm bg-slate-900 text-amber-300 px-2.5 py-1 rounded-md">
                {q.numberLabel}
              </span>
              {q.groupTitle && (
                <span className="text-xs font-extrabold text-rose-700 truncate max-w-xs sm:max-w-md">
                  {q.groupTitle}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isSolved && (
                <span className="text-xs font-extrabold text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Solved (+30 XP)</span>
                </span>
              )}
              <button
                type="button"
                onClick={() => handleResetQuestion(q.id)}
                title="Reset question"
                className="p-1 rounded-md hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Equation & Prompt */}
          <div className="bg-slate-900 text-amber-300 font-math font-extrabold text-base sm:text-lg px-4 py-2.5 rounded-xl">
            {q.equationDisplay}
          </div>

          <p className="font-display font-extrabold text-base sm:text-lg text-slate-950">
            {q.prompt}
          </p>

          {/* Input or Multiple Choice */}
          {q.type === 'choice' && q.options ? (
            <div className="space-y-2">
              {q.options.map((opt) => {
                const selected = inputs[q.id] === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setInputs((prev) => ({ ...prev, [q.id]: opt }));
                      handleAnswerSubmit(q, opt);
                    }}
                    className={`w-full text-left p-3 rounded-xl border-2 border-slate-900 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      selected
                        ? 'bg-slate-900 text-white shadow-[3px_3px_0px_#FACC15]'
                        : 'bg-slate-50 hover:bg-amber-50 text-slate-900'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAnswerSubmit(q);
              }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
            >
              <label className="sr-only" htmlFor={`input-${q.id}`}>
                Answer for {q.numberLabel}
              </label>
              <input
                id={`input-${q.id}`}
                type="text"
                value={inputs[q.id] || ''}
                onChange={(e) => setInputs((prev) => ({ ...prev, [q.id]: e.target.value }))}
                placeholder={q.inputPlaceholder}
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-900 font-math font-bold text-base bg-white text-slate-950"
              />
              <button
                type="submit"
                className="comic-btn bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-display font-extrabold text-sm px-5 py-2.5 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
              >
                Check Answer
              </button>
            </form>
          )}

          {/* Hints Display */}
          {hCount > 0 && (
            <div className="bg-amber-100 border-2 border-slate-900 p-3.5 rounded-xl space-y-1">
              <div className="text-xs font-extrabold text-amber-900 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>STEP-BY-STEP CLUES:</span>
              </div>
              <ul className="list-disc pl-4 text-xs font-bold text-slate-800 space-y-1">
                {q.hints.slice(0, hCount).map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Feedback Display */}
          {fb && (
            <div
              className={`p-3.5 rounded-xl border-2 border-slate-900 flex items-start gap-2.5 text-xs sm:text-sm font-bold ${
                fb.status === 'correct' ? 'bg-emerald-200 text-slate-950' : 'bg-rose-200 text-slate-950'
              }`}
            >
              {fb.status === 'correct' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-900 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-900 shrink-0 mt-0.5" />
              )}
              <span>{fb.text}</span>
            </div>
          )}

          {/* Revealed Solution Display */}
          {isRevealed && (
            <div className="bg-sky-100 border-2 border-slate-900 p-3.5 rounded-xl space-y-1 text-xs sm:text-sm">
              <div className="font-extrabold text-slate-900">
                Solution: <span className="font-math text-emerald-800">{q.acceptedAnswers[0]}</span>
              </div>
              <p className="font-semibold text-slate-700">{q.explanation}</p>
            </div>
          )}
        </div>

        {/* Footer Actions: Hint & Reveal */}
        <div className="pt-3 border-t-2 border-slate-200 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => handleShowHint(q)}
            disabled={hCount >= q.hints.length}
            className="text-xs font-extrabold text-amber-800 hover:text-amber-950 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Hint ({hCount}/{q.hints.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setRevealedMap((prev) => ({ ...prev, [q.id]: !prev[q.id] }))}
            className="text-xs font-extrabold text-sky-800 hover:text-sky-950 flex items-center gap-1 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isRevealed ? 'Hide Solution' : 'Show Solution'}</span>
          </button>
        </div>
      </div>
    );
  };

  const activeScenario =
    LEVEL_4_SCENARIOS.find((s) => s.id === activeScenarioId) || LEVEL_4_SCENARIOS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="comic-panel bg-amber-300 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs sm:text-sm font-extrabold text-slate-900">
            ACT 4 · INTERACTIVE PRACTICE ARENA &amp; CHALLENGE LEVELS
          </div>
          <h1 className="font-comic-title text-4xl sm:text-5xl text-slate-950 tracking-wide">
            THE PRACTICE ARENA
          </h1>
          <p className="text-sm sm:text-base font-semibold text-slate-800 max-w-2xl">
            Conquer all 4 progressive challenge levels—from Basic Substitution to Real-World Applications—plus Quick-Fire &amp; Matching mini-games!
          </p>
        </div>

        <div className="comic-panel-sm bg-white px-4 py-3 rounded-xl flex items-center gap-3 shrink-0">
          <CharacterAvatar character="captain" size="sm" />
          <div>
            <div className="text-xs font-extrabold text-slate-600">ARENA PROGRESS</div>
            <div className="font-math font-extrabold text-lg text-slate-950">
              {completedIds.filter((id) => id.startsWith('l')).length} / 45 Challenges Cleared
            </div>
          </div>
        </div>
      </div>

      {/* Level Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <button
          type="button"
          onClick={() => setActiveTab('level1')}
          className={`comic-btn p-3.5 rounded-xl text-left flex flex-col justify-between cursor-pointer ${
            activeTab === 'level1' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
          }`}
        >
          <span className="text-xs font-extrabold text-amber-500 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> LEVEL 1
          </span>
          <span className="font-display font-extrabold text-sm sm:text-base mt-1">
            Basic Substitution (10 Qs)
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('level2')}
          className={`comic-btn p-3.5 rounded-xl text-left flex flex-col justify-between cursor-pointer ${
            activeTab === 'level2' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
          }`}
        >
          <span className="text-xs font-extrabold text-sky-500 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> LEVEL 2
          </span>
          <span className="font-display font-extrabold text-sm sm:text-base mt-1">
            Exam-Style Evaluation
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('level3')}
          className={`comic-btn p-3.5 rounded-xl text-left flex flex-col justify-between cursor-pointer ${
            activeTab === 'level3' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
          }`}
        >
          <span className="text-xs font-extrabold text-rose-500 flex items-center gap-1">
            <Target className="w-3.5 h-3.5" /> LEVEL 3
          </span>
          <span className="font-display font-extrabold text-sm sm:text-base mt-1">
            Find Missing Input (5 Qs)
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('level4')}
          className={`comic-btn p-3.5 rounded-xl text-left flex flex-col justify-between cursor-pointer ${
            activeTab === 'level4' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
          }`}
        >
          <span className="text-xs font-extrabold text-emerald-500 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" /> LEVEL 4
          </span>
          <span className="font-display font-extrabold text-sm sm:text-base mt-1">
            Real-World Missions (4)
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('arcade')}
          className={`comic-btn p-3.5 rounded-xl text-left flex flex-col justify-between cursor-pointer col-span-2 sm:col-span-1 ${
            activeTab === 'arcade' ? 'bg-slate-900 text-white' : 'bg-amber-100 text-slate-900'
          }`}
        >
          <span className="text-xs font-extrabold text-purple-600 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> BONUS ARCADE
          </span>
          <span className="font-display font-extrabold text-sm sm:text-base mt-1">
            Quick-Fire &amp; Matching
          </span>
        </button>
      </div>

      {/* LEVEL 1 VIEW */}
      {activeTab === 'level1' && (
        <div className="space-y-6">
          <div className="comic-panel-sm bg-sky-100 p-4 rounded-xl flex items-center justify-between">
            <div>
              <h2 className="font-display font-extrabold text-lg text-slate-950">
                LEVEL 1: BASIC SUBSTITUTION (10 QUESTIONS)
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-700">
                Evaluate each linear or quadratic function by substituting the given input value into x, and interpret function notation statements.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LEVEL_1_QUESTIONS.map(renderQuestionCard)}
          </div>
        </div>
      )}

      {/* LEVEL 2 VIEW */}
      {activeTab === 'level2' && (
        <div className="space-y-6">
          <div className="comic-panel-sm bg-indigo-100 p-4 rounded-xl">
            <h2 className="font-display font-extrabold text-lg text-slate-950">
              LEVEL 2: EXAM-STYLE EVALUATION (ALGEBRAIC INPUTS, QUADRATICS &amp; COMBINED FUNCTIONS)
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-700">
              Master f(a), f(a + 2), multi-term quadratics, combined functions f(x) + g(x), and student error correction!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LEVEL_2_QUESTIONS.map(renderQuestionCard)}
          </div>
        </div>
      )}

      {/* LEVEL 3 VIEW */}
      {activeTab === 'level3' && (
        <div className="space-y-6">
          <div className="comic-panel-sm bg-rose-100 p-4 rounded-xl">
            <h2 className="font-display font-extrabold text-lg text-slate-950">
              LEVEL 3: REVERSE THE MACHINE — FIND THE MISSING INPUT (5 QUESTIONS)
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-700">
              You are given the OUTPUT value! Set the function rule equal to the output and solve the equation for x.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LEVEL_3_QUESTIONS.map(renderQuestionCard)}
          </div>
        </div>
      )}

      {/* LEVEL 4 VIEW: REAL-WORLD APPLICATIONS */}
      {activeTab === 'level4' && (
        <div className="space-y-6">
          {/* Scenario Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {LEVEL_4_SCENARIOS.map((scen) => {
              const active = scen.id === activeScenario.id;
              return (
                <button
                  key={scen.id}
                  type="button"
                  onClick={() => setActiveScenarioId(scen.id)}
                  className={`comic-panel-sm p-4 rounded-xl text-left transition-all cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white -translate-y-1 shadow-[4px_4px_0px_#10B981]'
                      : `${scen.accentColor} text-slate-950 hover:opacity-90`
                  }`}
                >
                  <div className={`text-xs font-extrabold ${active ? 'text-amber-300' : 'text-slate-700'}`}>
                    {scen.badgeText}
                  </div>
                  <div className="font-display font-extrabold text-base mt-1">
                    {scen.title}
                  </div>
                  <div className={`font-math font-bold text-xs mt-1 ${active ? 'text-emerald-300' : 'text-slate-800'}`}>
                    {scen.formula}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Scenario Briefing Header */}
          <div className={`comic-panel ${activeScenario.accentColor} p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6`}>
            <div className="flex items-center gap-4">
              <CharacterAvatar character={activeScenario.character} size="lg" />
              <div className="space-y-1">
                <div className="text-xs font-extrabold text-slate-700 uppercase">
                  {activeScenario.subtitle}
                </div>
                <h2 className="font-display text-2xl font-extrabold text-slate-950">
                  {activeScenario.title}
                </h2>
                <p className="text-sm font-semibold text-slate-800 max-w-2xl">
                  {activeScenario.contextDescription}
                </p>
              </div>
            </div>
            <div className="bg-slate-900 text-amber-300 font-math font-extrabold text-2xl px-6 py-4 rounded-xl border-3 border-slate-950 shrink-0">
              {activeScenario.formula}
            </div>
          </div>

          {/* Scenario Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeScenario.questions.map(renderQuestionCard)}
          </div>
        </div>
      )}

      {/* BONUS ARCADE VIEW: QUICK-FIRE, MATCHING & SORTING */}
      {activeTab === 'arcade' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Quick-Fire Round */}
          <div className="lg:col-span-6 comic-panel bg-amber-100 p-6 rounded-2xl space-y-5">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <h2 className="font-display font-extrabold text-xl text-slate-950">
                ⚡ QUICK-FIRE SPEED BLITZ
              </h2>
              <span className="font-math font-extrabold text-sm bg-slate-900 text-amber-300 px-3 py-1 rounded-lg">
                Score: {qfScore} / {QUICK_FIRE_QUESTIONS.length}
              </span>
            </div>

            <div className="comic-panel-sm bg-white p-5 rounded-xl space-y-4">
              <div className="text-xs font-extrabold text-rose-700">
                ROUND {qfIndex + 1} OF {QUICK_FIRE_QUESTIONS.length}
              </div>
              <div className="font-math font-extrabold text-xl sm:text-2xl text-slate-950">
                {QUICK_FIRE_QUESTIONS[qfIndex].question}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {QUICK_FIRE_QUESTIONS[qfIndex].options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      const curr = QUICK_FIRE_QUESTIONS[qfIndex];
                      if (opt === curr.answer) {
                        setQfScore((s) => Math.min(QUICK_FIRE_QUESTIONS.length, s + 1));
                        setQfFeedback(`⚡ HIT! ${curr.explanation}`);
                      } else {
                        setQfFeedback(`Missed! ${curr.explanation}`);
                      }
                    }}
                    className="comic-btn bg-sky-200 hover:bg-sky-300 text-slate-950 font-math font-extrabold text-lg py-3 rounded-xl cursor-pointer"
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {qfFeedback && (
                <div className="p-3 rounded-xl bg-slate-900 text-amber-300 text-xs sm:text-sm font-bold flex items-center justify-between">
                  <span>{qfFeedback}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setQfFeedback('');
                      setQfIndex((i) => (i + 1) % QUICK_FIRE_QUESTIONS.length);
                    }}
                    className="bg-amber-400 text-slate-950 px-3 py-1 rounded-lg font-extrabold text-xs cursor-pointer shrink-0 ml-2"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Equation-to-Output Matcher & Function Sorter */}
          <div className="lg:col-span-6 space-y-6">
            <div className="comic-panel bg-emerald-100 p-6 rounded-2xl space-y-4">
              <h2 className="font-display font-extrabold text-xl text-slate-950 border-b-2 border-slate-900 pb-2">
                🎯 MATCH EQUATIONS TO THEIR OUTPUTS
              </h2>
              <p className="text-xs font-bold text-slate-700">
                Click an expression on the left, then click its matching output on the right!
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  {MATCH_PAIRS.map((pair) => {
                    const done = matchedIds.includes(pair.id);
                    const active = selectedMatchEq === pair.id;
                    return (
                      <button
                        key={pair.id}
                        type="button"
                        disabled={done}
                        onClick={() => setSelectedMatchEq(pair.id)}
                        className={`w-full p-3 rounded-xl border-2 border-slate-900 font-math font-bold text-xs text-left cursor-pointer ${
                          done
                            ? 'bg-emerald-400 text-slate-950 opacity-70'
                            : active
                            ? 'bg-slate-900 text-amber-300'
                            : 'bg-white text-slate-900'
                        }`}
                      >
                        {pair.eq}
                      </button>
                    );
                  })}
                </div>
                <div className="space-y-2">
                  {[MATCH_PAIRS[2], MATCH_PAIRS[0], MATCH_PAIRS[3], MATCH_PAIRS[1]].map((pair) => {
                    const done = matchedIds.includes(pair.id);
                    return (
                      <button
                        key={pair.id}
                        type="button"
                        disabled={done}
                        onClick={() => {
                          if (selectedMatchEq === pair.id) {
                            setMatchedIds((prev) => [...prev, pair.id]);
                            setSelectedMatchEq(null);
                          }
                        }}
                        className={`w-full p-3 rounded-xl border-2 border-slate-900 font-math font-extrabold text-sm text-center cursor-pointer ${
                          done
                            ? 'bg-emerald-400 text-slate-950'
                            : 'bg-white hover:bg-amber-100 text-slate-950'
                        }`}
                      >
                        Output = {pair.out} {done ? '✓' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Function Category Sorter */}
            <div className="comic-panel bg-purple-100 p-6 rounded-2xl space-y-3">
              <h2 className="font-display font-extrabold text-lg text-slate-950 border-b-2 border-slate-900 pb-2">
                🗂️ SORT FUNCTIONS BY CATEGORY (LINEAR vs. QUADRATIC)
              </h2>
              <div className="space-y-2">
                {SORT_ITEMS.map((item) => {
                  const chosen = sortChoices[item.id];
                  const isRight = chosen === item.category;
                  return (
                    <div
                      key={item.id}
                      className="bg-white p-3 rounded-xl border-2 border-slate-900 flex items-center justify-between gap-2"
                    >
                      <span className="font-math font-extrabold text-sm text-slate-950">
                        {item.expr}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {['Linear', 'Quadratic'].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() =>
                              setSortChoices((prev) => ({ ...prev, [item.id]: cat }))
                            }
                            className={`px-3 py-1 rounded-lg font-bold text-xs border-2 border-slate-900 cursor-pointer ${
                              chosen === cat
                                ? isRight
                                  ? 'bg-emerald-400 text-slate-950'
                                  : 'bg-rose-300 text-slate-950'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {cat} {chosen === cat ? (isRight ? '✓' : '✗') : ''}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
