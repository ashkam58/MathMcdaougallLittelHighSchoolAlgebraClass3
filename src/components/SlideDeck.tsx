import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Lightbulb,
  Eye,
  BookOpen,
  RotateCcw,
  LogOut,
  CheckCircle2,
  AlertCircle,
  PenTool
} from 'lucide-react';
import { LESSON_SLIDES } from '../data/slidesData';
import { SkillKey } from '../utils/progressStore';
import { CharacterAvatar, CHARACTER_META, AnimatedFunctionMachineSVG } from './ComicCharacters';
import { checkMathAnswer } from '../math/parser';

interface SlideDeckProps {
  currentSlideIndex: number;
  onSelectSlide: (idx: number) => void;
  isTeacherMode: boolean;
  globalShowNotes: boolean;
  globalRevealAnswers: boolean;
  globalShowHints: boolean;
  onToggleNotes: () => void;
  onOpenWhiteboard: () => void;
  onExitPresentation: () => void;
  onRecordAttempt: (
    id: string,
    correct: boolean,
    skill: SkillKey,
    label: string,
    equation: string
  ) => void;
  onRecordHint: () => void;
}

export const SlideDeck: React.FC<SlideDeckProps> = ({
  currentSlideIndex,
  onSelectSlide,
  isTeacherMode,
  globalShowNotes,
  globalRevealAnswers,
  globalShowHints,
  onToggleNotes,
  onOpenWhiteboard,
  onExitPresentation,
  onRecordAttempt,
  onRecordHint
}) => {
  const slide = LESSON_SLIDES[currentSlideIndex] || LESSON_SLIDES[0];
  const containerRef = useRef<HTMLDivElement>(null);

  const [studentInput, setStudentInput] = useState<string>('');
  const [feedback, setFeedback] = useState<{ status: 'idle' | 'correct' | 'incorrect'; message: string }>({
    status: 'idle',
    message: ''
  });
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [localReveal, setLocalReveal] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [interactiveX, setInteractiveX] = useState<number>(4);

  // Reset per-slide checkpoint state when slide changes
  useEffect(() => {
    setStudentInput('');
    setFeedback({ status: 'idle', message: '' });
    setHintLevel(0);
    setLocalReveal(false);
    setInteractiveX(4);
  }, [currentSlideIndex]);

  // Keyboard navigation using ArrowLeft, ArrowRight, and Space
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        if (currentSlideIndex < LESSON_SLIDES.length - 1) {
          onSelectSlide(currentSlideIndex + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentSlideIndex > 0) {
          onSelectSlide(currentSlideIndex - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, onSelectSlide]);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleCheckAnswer = (selectedOption?: string) => {
    const valToTest = selectedOption !== undefined ? selectedOption : studentInput;
    if (!valToTest.trim()) return;

    const isCorrect =
      slide.checkpoint.type === 'choice'
        ? slide.checkpoint.acceptedAnswers.includes(valToTest)
        : checkMathAnswer(valToTest, slide.checkpoint.acceptedAnswers);

    onRecordAttempt(
      slide.checkpoint.id,
      isCorrect,
      slide.checkpoint.skill,
      `Slide ${slide.slideNumber} Checkpoint`,
      slide.mathHighlight.equation
    );

    if (isCorrect) {
      setFeedback({
        status: 'correct',
        message: `SUPERHERO HIT! ${slide.checkpoint.explanation}`
      });
    } else {
      setFeedback({
        status: 'incorrect',
        message: `Not quite! Review the worked steps or click "Show Hint" for a clue, then try again.`
      });
    }
  };

  const handleRevealHint = () => {
    if (hintLevel < slide.checkpoint.hints.length) {
      setHintLevel((prev) => prev + 1);
      onRecordHint();
    }
  };

  const handleRestartSlideActivity = () => {
    setStudentInput('');
    setFeedback({ status: 'idle', message: '' });
    setHintLevel(0);
    setLocalReveal(false);
    setInteractiveX(4);
  };

  const showAnswerNow = localReveal || globalRevealAnswers;
  const visibleHintsCount = globalShowHints ? slide.checkpoint.hints.length : hintLevel;
  const progressPct = Math.round(((currentSlideIndex + 1) / LESSON_SLIDES.length) * 100);
  const charMeta = CHARACTER_META[slide.character];

  return (
    <div
      ref={containerRef}
      className="halftone-bg px-3 sm:px-6 py-3 flex flex-col justify-between gap-3"
    >
      {/* Top Presentation Control Strip */}
      <div className="max-w-7xl mx-auto w-full comic-panel-sm bg-white px-3.5 py-2 rounded-xl flex flex-wrap xl:flex-nowrap items-center justify-between gap-2">
        {/* Left: Direct slide selector + progress bar */}
        <div className="flex items-center gap-2.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <span className="text-rose-700 font-extrabold whitespace-nowrap">
              {slide.slideNumber <= 8 ? 'ACT 1' : 'ACT 2'} · Slide:
            </span>
            <select
              aria-label="Select slide number"
              value={currentSlideIndex}
              onChange={(e) => onSelectSlide(Number(e.target.value))}
              className="border-2 border-slate-900 rounded-lg px-2 py-1 bg-amber-100 font-math font-bold text-xs max-w-[260px] truncate cursor-pointer"
            >
              {LESSON_SLIDES.map((s, idx) => (
                <option key={s.slideNumber} value={idx}>
                  {String(s.slideNumber).padStart(2, '0')} / {LESSON_SLIDES.length} — {s.title}
                </option>
              ))}
            </select>
          </label>

          {/* Progress Bar */}
          <div className="hidden md:flex items-center gap-1.5 w-24">
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-900">
              <div
                className="h-full bg-emerald-500 transition-all duration-200"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="font-math text-[11px] font-bold text-slate-700">{progressPct}%</span>
          </div>
        </div>

        {/* Right: Presentation Utility Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={handleRevealHint}
            disabled={visibleHintsCount >= slide.checkpoint.hints.length}
            className="px-2.5 py-1 rounded-lg border-2 border-slate-900 bg-amber-200 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Hint ({visibleHintsCount}/{slide.checkpoint.hints.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setLocalReveal(!localReveal)}
            className="px-2.5 py-1 rounded-lg border-2 border-slate-900 bg-sky-200 hover:bg-sky-300 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showAnswerNow ? 'Hide Answer' : 'Reveal Answer'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleNotes}
            className={`px-2.5 py-1 rounded-lg border-2 border-slate-900 font-bold text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 ${
              globalShowNotes ? 'bg-purple-300 text-slate-950' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Notes</span>
          </button>

          <button
            type="button"
            onClick={onOpenWhiteboard}
            className="px-2.5 py-1 rounded-lg border-2 border-slate-900 bg-emerald-200 hover:bg-emerald-300 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Whiteboard</span>
          </button>

          <button
            type="button"
            onClick={handleRestartSlideActivity}
            title="Restart slide activity"
            className="px-2 py-1 rounded-lg border-2 border-slate-900 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>

          <button
            type="button"
            onClick={handleToggleFullscreen}
            title="Toggle Fullscreen"
            className="px-2 py-1 rounded-lg border-2 border-slate-900 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Window' : 'Fullscreen'}</span>
          </button>

          <button
            type="button"
            onClick={onExitPresentation}
            title="Exit Presentation"
            className="px-2 py-1 rounded-lg border-2 border-slate-900 bg-rose-100 hover:bg-rose-200 text-rose-950 font-bold text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </div>

      {/* Main Slide Canvas (16:9 Widescreen Split) */}
      <div className="max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 7 Columns: Comic Visual Stage + Worked Steps */}
        <div className="lg:col-span-7 comic-panel bg-white p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Slide Number & Learning Objective */}
            <div className="space-y-1 border-b-2 border-slate-900 pb-3">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-600">
                <span>SLIDE {String(slide.slideNumber).padStart(2, '0')} OF {LESSON_SLIDES.length}</span>
                <span>{slide.subtitle}</span>
              </div>
              <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-950">
                {slide.title}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-700">
                <strong className="text-slate-950">Learning Objective:</strong> {slide.objective}
              </p>
            </div>

            {/* Comic Character + Speech Bubble */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-amber-50 border-2 border-slate-900 p-4 rounded-xl">
              <div className="flex flex-col items-center shrink-0">
                <CharacterAvatar
                  character={slide.character}
                  mood={feedback.status === 'correct' ? 'happy' : 'idle'}
                  size="md"
                />
                <span className="text-xs font-extrabold text-slate-900 mt-1">
                  {charMeta.name}
                </span>
              </div>
              <div className="comic-panel-sm bg-white p-4 rounded-xl flex-1">
                <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                  “{slide.speechBubble}”
                </p>
              </div>
            </div>

            {/* Prominent Mathematical Equation Highlight */}
            <div className="comic-panel-sm bg-slate-900 p-5 rounded-xl space-y-4">
              <div className="text-center">
                <div className="font-math text-2xl sm:text-3xl font-extrabold text-amber-300 tracking-wide">
                  {slide.mathHighlight.equation}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {slide.mathHighlight.annotations.map((ann, idx) => (
                  <div
                    key={idx}
                    className={`${ann.color} p-3 rounded-lg border-2 border-slate-950 flex flex-col justify-between`}
                  >
                    <span className="font-display font-extrabold text-xs uppercase tracking-wider">
                      {ann.label}
                    </span>
                    <span className="text-xs sm:text-sm font-bold mt-1 leading-snug">
                      {ann.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Mini-Machine on Slide 3, 5, 6, 10 */}
            {(slide.slideNumber === 3 || slide.slideNumber === 5 || slide.slideNumber === 6 || slide.slideNumber === 10) && (
              <div className="comic-panel-sm bg-sky-50 p-4 rounded-xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-display font-extrabold text-xs sm:text-sm text-slate-900">
                    INTERACTIVE SLIDE EXPERIMENT — CHANGE INPUT x:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[-1, 2, 4, 5, 8].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setInteractiveX(val)}
                        className={`px-2.5 py-1 rounded-md font-math font-bold text-xs border-2 border-slate-900 cursor-pointer ${
                          interactiveX === val ? 'bg-amber-400 text-slate-950' : 'bg-white text-slate-800 hover:bg-amber-100'
                        }`}
                      >
                        x={val}
                      </button>
                    ))}
                  </div>
                </div>
                {slide.slideNumber === 10 ? (
                  <div className="grid grid-cols-3 gap-2 text-center font-math text-xs sm:text-sm font-bold">
                    <div className="bg-white p-2.5 rounded-lg border-2 border-slate-900">
                      f({interactiveX}) = 2({interactiveX}) + 3 = <strong className="text-sky-700">{2 * interactiveX + 3}</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border-2 border-slate-900">
                      g({interactiveX}) = ({interactiveX})² − 1 = <strong className="text-amber-700">{interactiveX * interactiveX - 1}</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border-2 border-slate-900">
                      h({interactiveX}) = 5({interactiveX}) = <strong className="text-emerald-700">{5 * interactiveX}</strong>
                    </div>
                  </div>
                ) : (
                  <AnimatedFunctionMachineSVG
                    inputValue={interactiveX}
                    ruleDisplay="3x + 2"
                    outputValue={3 * interactiveX + 2}
                    fnName="f"
                  />
                )}
              </div>
            )}
          </div>

          {/* Step-by-Step Mathematical Breakdown */}
          <div className="space-y-2.5">
            <h2 className="font-display text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Step-by-Step Comic Walkthrough:
            </h2>
            <div className="grid grid-cols-1 gap-2.5">
              {slide.workedSteps.map((ws, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl border-2 border-slate-900 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <span className="font-display font-extrabold text-xs text-rose-700">
                      {ws.step}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-700">
                      {ws.note}
                    </p>
                  </div>
                  <div className="font-math font-extrabold text-sm sm:text-base bg-white px-3 py-1.5 rounded-lg border-2 border-slate-900 text-slate-950 shrink-0">
                    {ws.math}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Interactive Student Checkpoint & Teacher Speaker Notes */}
        <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
          {/* Student Checkpoint Panel */}
          <div className="comic-panel bg-amber-100 p-6 rounded-2xl space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                <span className="font-display font-extrabold text-sm text-slate-950">
                  ⚡ STUDENT CHECKPOINT · SLIDE {slide.slideNumber}
                </span>
                <span className="font-math text-xs font-bold text-slate-700">
                  +25 XP
                </span>
              </div>

              <p className="font-display text-base sm:text-lg font-extrabold text-slate-950 leading-snug">
                {slide.checkpoint.prompt}
              </p>

              {/* Input or Multiple Choice Options */}
              {slide.checkpoint.type === 'choice' && slide.checkpoint.options ? (
                <div className="space-y-2.5">
                  {slide.checkpoint.options.map((opt) => {
                    const isSelected = studentInput === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setStudentInput(opt);
                          handleCheckAnswer(opt);
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border-2 border-slate-900 font-semibold text-sm transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white shadow-[3px_3px_0px_#FACC15]'
                            : 'bg-white hover:bg-amber-50 text-slate-900'
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
                    handleCheckAnswer();
                  }}
                  className="space-y-3"
                >
                  <label className="block">
                    <span className="sr-only">Your Answer for Slide {slide.slideNumber}</span>
                    <input
                      type="text"
                      value={studentInput}
                      onChange={(e) => setStudentInput(e.target.value)}
                      placeholder="Type your numerical answer..."
                      className="w-full px-4 py-3 rounded-xl border-3 border-slate-900 bg-white font-math font-bold text-lg text-slate-950 focus:outline-none focus:ring-4 focus:ring-sky-400"
                    />
                  </label>
                  <button
                    type="submit"
                    className="comic-btn w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-extrabold text-base py-3 px-6 rounded-xl cursor-pointer"
                  >
                    Submit Checkpoint Answer
                  </button>
                </form>
              )}

              {/* Progressive Hints Box */}
              {visibleHintsCount > 0 && (
                <div className="comic-panel-sm bg-white p-4 rounded-xl space-y-2">
                  <div className="font-display font-extrabold text-xs text-amber-700 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4" />
                    <span>FUNCTION FOX CLUES:</span>
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-sm font-semibold text-slate-800 list-disc pl-4">
                    {slide.checkpoint.hints.slice(0, visibleHintsCount).map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Instant Explanatory Feedback */}
              {feedback.status !== 'idle' && (
                <div
                  className={`comic-panel-sm p-4 rounded-xl flex items-start gap-3 ${
                    feedback.status === 'correct'
                      ? 'bg-emerald-200 text-slate-950'
                      : 'bg-rose-200 text-slate-950'
                  }`}
                >
                  {feedback.status === 'correct' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-800 shrink-0 mt-0.5" />
                  )}
                  <div className="text-xs sm:text-sm font-bold leading-relaxed">
                    {feedback.message}
                  </div>
                </div>
              )}

              {/* Revealed Answer Box */}
              {showAnswerNow && (
                <div className="comic-panel-sm bg-sky-200 p-4 rounded-xl space-y-1">
                  <div className="text-xs font-extrabold text-slate-900">
                    REVEALED SOLUTION &amp; EXPLANATION:
                  </div>
                  <div className="font-math font-extrabold text-base text-slate-950">
                    Answer: {slide.checkpoint.acceptedAnswers[0]}
                  </div>
                  <p className="text-xs font-semibold text-slate-800">
                    {slide.checkpoint.explanation}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t-2 border-slate-900/20 flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Use ← / → Arrow Keys or Space to navigate</span>
              <span>Skill: {slide.checkpoint.skill.toUpperCase()}</span>
            </div>
          </div>

          {/* Teacher Speaking Notes Panel (Shown when toggled or in Teacher Mode) */}
          {(globalShowNotes || isTeacherMode) && (
            <div className="comic-panel bg-purple-100 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                <span className="font-display font-extrabold text-sm text-purple-950 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>TEACHER SPEAKER NOTES (SLIDE {slide.slideNumber})</span>
                </span>
              </div>
              <div className="space-y-2 text-xs sm:text-sm text-slate-900">
                <p>
                  <strong className="font-extrabold">Delivery Guide:</strong> {slide.teacherNotes.explanation}
                </p>
                <p>
                  <strong className="font-extrabold text-emerald-900">Expected Answer:</strong>{' '}
                  <span className="font-math font-bold">{slide.teacherNotes.expectedAnswer}</span>
                </p>
                <p>
                  <strong className="font-extrabold text-rose-900">Common Mistake Alert:</strong>{' '}
                  {slide.teacherNotes.commonMistakes}
                </p>
                <p>
                  <strong className="font-extrabold text-indigo-900">Follow-Up Question:</strong>{' '}
                  “{slide.teacherNotes.followUpQuestion}”
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Slide Navigation Bar */}
      <div className="max-w-7xl mx-auto w-full comic-panel-sm bg-white px-4 py-3 rounded-xl flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onSelectSlide(Math.max(0, currentSlideIndex - 1))}
          disabled={currentSlideIndex === 0}
          className="comic-btn bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-950 font-display font-extrabold text-sm sm:text-base px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous Slide</span>
        </button>

        {/* Quick Dot / Pill Slide Strip */}
        <div className="hidden lg:flex items-center gap-1.5">
          {LESSON_SLIDES.map((s, idx) => (
            <button
              key={s.slideNumber}
              type="button"
              onClick={() => onSelectSlide(idx)}
              aria-label={`Go to slide ${s.slideNumber}`}
              className={`w-7 h-7 rounded-lg font-math font-bold text-xs border-2 border-slate-900 transition-transform cursor-pointer ${
                idx === currentSlideIndex
                  ? 'bg-amber-400 text-slate-950 scale-110 shadow-[2px_2px_0px_#0F172A]'
                  : 'bg-slate-100 text-slate-700 hover:bg-amber-100'
              }`}
            >
              {s.slideNumber}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            onSelectSlide(Math.min(LESSON_SLIDES.length - 1, currentSlideIndex + 1))
          }
          disabled={currentSlideIndex === LESSON_SLIDES.length - 1}
          className="comic-btn bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-display font-extrabold text-sm sm:text-base px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>Next Slide</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
