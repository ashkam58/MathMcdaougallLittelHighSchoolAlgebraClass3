import React, { useState, useEffect } from 'react';
import {
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Send,
  Play,
  Pause,
  FileCheck2
} from 'lucide-react';
import { EXAM_QUESTIONS } from '../data/errorDetectiveData';
import { calculateExamScore, ExamPartSubmission } from '../math/parser';
import { CharacterAvatar } from './ComicCharacters';

interface ExamSimulatorProps {
  isTeacherMode: boolean;
  timerPausedExternal: boolean;
  savedExamResult?: {
    score: number;
    maxScore: number;
    timeTakenSeconds: number;
    completedAt: string;
    partScores: Record<string, number>;
    studentAnswers: Record<string, string>;
  };
  onSaveExamResult: (result: {
    score: number;
    maxScore: number;
    timeTakenSeconds: number;
    completedAt: string;
    partScores: Record<string, number>;
    studentAnswers: Record<string, string>;
  }) => void;
}

const EXAM_DURATION_SECONDS = 20 * 60; // 20 minutes

export const ExamSimulator: React.FC<ExamSimulatorProps> = ({
  isTeacherMode,
  timerPausedExternal,
  savedExamResult,
  onSaveExamResult
}) => {
  const [examState, setExamState] = useState<'intro' | 'active' | 'submitted'>(
    savedExamResult ? 'submitted' : 'intro'
  );
  const [secondsLeft, setSecondsLeft] = useState<number>(EXAM_DURATION_SECONDS);
  const [localPaused, setLocalPaused] = useState<boolean>(false);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [viewAllMode, setViewAllMode] = useState<boolean>(true);

  const [answers, setAnswers] = useState<Record<string, string>>(
    savedExamResult?.studentAnswers || {}
  );
  const [teacherOverrides, setTeacherOverrides] = useState<Record<string, number>>({});

  const isPaused = localPaused || timerPausedExternal;

  useEffect(() => {
    if (examState !== 'active' || isPaused) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [examState, isPaused]);

  // Auto-submit if timer reaches 0
  useEffect(() => {
    if (examState === 'active' && secondsLeft === 0) {
      handleSubmitExam();
    }
  }, [secondsLeft, examState]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const buildSubmissions = (
    overrideMap: Record<string, number> = teacherOverrides
  ): ExamPartSubmission[] => {
    const list: ExamPartSubmission[] = [];
    for (const q of EXAM_QUESTIONS) {
      for (const p of q.parts) {
        list.push({
          id: p.id,
          maxMarks: p.marks,
          autoGradable: p.autoGradable,
          studentAnswer: answers[p.id] || '',
          acceptedAnswers: p.acceptedAnswers,
          teacherAwardedMarks: overrideMap[p.id]
        });
      }
    }
    return list;
  };

  const handleSubmitExam = () => {
    const subs = buildSubmissions();
    const scoreRes = calculateExamScore(subs);
    const timeTaken = EXAM_DURATION_SECONDS - secondsLeft;
    setExamState('submitted');
    onSaveExamResult({
      score: scoreRes.totalAwarded,
      maxScore: scoreRes.maxTotal,
      timeTakenSeconds: timeTaken,
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      partScores: scoreRes.partScores,
      studentAnswers: answers
    });
  };

  const handleTeacherMarkOverride = (partId: string, marks: number) => {
    const updatedOverrides = { ...teacherOverrides, [partId]: marks };
    setTeacherOverrides(updatedOverrides);
    const subs = buildSubmissions(updatedOverrides);
    const scoreRes = calculateExamScore(subs);
    const timeTaken = savedExamResult?.timeTakenSeconds ?? EXAM_DURATION_SECONDS - secondsLeft;
    onSaveExamResult({
      score: scoreRes.totalAwarded,
      maxScore: scoreRes.maxTotal,
      timeTakenSeconds: timeTaken,
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      partScores: scoreRes.partScores,
      studentAnswers: answers
    });
  };

  const handleRetryExam = () => {
    setAnswers({});
    setTeacherOverrides({});
    setSecondsLeft(EXAM_DURATION_SECONDS);
    setLocalPaused(false);
    setActiveQuestionIdx(0);
    setExamState('active');
  };

  const liveScoreResult = calculateExamScore(buildSubmissions());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Top Exam Header Bar */}
      <div className="comic-panel bg-slate-900 text-white p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="text-xs sm:text-sm font-extrabold text-amber-300">
            SECTION 6 · MONTGOMERY TOWNSHIP ALGEBRA 1 ASSESSMENT · HSF-IF.A.2
          </div>
          <h1 className="font-comic-title text-4xl sm:text-5xl text-white tracking-wider">
            FUNCTION NOTATION: FINAL BOSS EXAM
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-300">
            Total Marks: 20 Marks · Time Allowed: 20 Minutes · Questions Q1–Q7
          </p>
        </div>

        {/* Live Countdown Timer & Controls */}
        <div className="flex items-center gap-3 flex-wrap shrink-0">
          <div
            className={`comic-panel-sm px-5 py-3 rounded-xl flex items-center gap-2.5 font-math font-extrabold text-xl ${
              secondsLeft < 180 && examState === 'active'
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-amber-400 text-slate-950'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span>{formatTimer(secondsLeft)}</span>
          </div>

          {examState === 'active' && (
            <button
              type="button"
              onClick={() => setLocalPaused(!localPaused)}
              className="comic-btn bg-white text-slate-900 font-bold text-xs sm:text-sm px-4 py-3 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
          )}

          {examState !== 'intro' && (
            <button
              type="button"
              onClick={handleRetryExam}
              className="comic-btn bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Exam</span>
            </button>
          )}
        </div>
      </div>

      {/* EXAM INTRO SCREEN */}
      {examState === 'intro' && (
        <div className="comic-panel bg-amber-100 p-8 rounded-2xl max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <CharacterAvatar character="professor" size="xl" />
            <div className="space-y-3">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-950">
                Ready for the 20-Mark Final Boss Exam, Sajeev?
              </h2>
              <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
                This examination tests every skill from Class 03: linear and algebraic function evaluation, quadratic functions, reversing the machine to find missing inputs, real-world delivery modelling, comparing two functions, and spotting order-of-operations mistakes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="comic-panel-sm bg-white p-4 rounded-xl">
              <div className="font-math font-extrabold text-2xl text-slate-950">20 Marks</div>
              <div className="text-xs font-bold text-slate-600 mt-1">Across 7 Structured Questions</div>
            </div>
            <div className="comic-panel-sm bg-white p-4 rounded-xl">
              <div className="font-math font-extrabold text-2xl text-slate-950">20 Minutes</div>
              <div className="text-xs font-bold text-slate-600 mt-1">Official Exam Countdown Timer</div>
            </div>
            <div className="comic-panel-sm bg-white p-4 rounded-xl">
              <div className="font-math font-extrabold text-2xl text-emerald-700">Auto + Teacher</div>
              <div className="text-xs font-bold text-slate-600 mt-1">Instant Math Grading &amp; Written Review</div>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => {
                setSecondsLeft(EXAM_DURATION_SECONDS);
                setExamState('active');
              }}
              className="comic-btn bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-extrabold text-lg sm:text-xl px-10 py-4 rounded-xl flex items-center gap-3 cursor-pointer"
            >
              <Play className="w-6 h-6 fill-current" />
              <span>START 20-MINUTE FINAL BOSS EXAM</span>
            </button>
          </div>
        </div>
      )}

      {/* SUBMITTED PERFORMANCE REPORT BANNER */}
      {examState === 'submitted' && (
        <div className="comic-panel bg-emerald-200 p-6 sm:p-8 rounded-2xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b-2 border-slate-900 pb-4">
            <div className="flex items-center gap-4">
              <Award className="w-12 h-12 text-slate-950 shrink-0" />
              <div>
                <div className="text-xs font-extrabold text-emerald-950 uppercase">
                  OFFICIAL EXAMINATION RESULTS REPORT · STUDENT: SAJEEV
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-950">
                  Final Score: {liveScoreResult.totalAwarded} / {liveScoreResult.maxTotal} Marks (
                  {Math.round((liveScoreResult.totalAwarded / liveScoreResult.maxTotal) * 100)}%)
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-display font-extrabold text-sm bg-slate-900 text-amber-300 px-4 py-2 rounded-xl">
                Grade:{' '}
                {liveScoreResult.totalAwarded >= 18
                  ? 'A+ (Superhero Mastery!)'
                  : liveScoreResult.totalAwarded >= 15
                  ? 'A (Strong Readiness)'
                  : liveScoreResult.totalAwarded >= 12
                  ? 'B (Solid Progress)'
                  : 'Needs Revision'}
              </span>
            </div>
          </div>

          {/* Question-by-Question Mark Breakdown Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {EXAM_QUESTIONS.map((q) => {
              const qEarned = q.parts.reduce(
                (acc, p) => acc + (liveScoreResult.partScores[p.id] || 0),
                0
              );
              return (
                <div
                  key={q.id}
                  className="comic-panel-sm bg-white p-3 rounded-xl text-center space-y-1"
                >
                  <div className="text-xs font-extrabold text-slate-600">
                    {q.numberLabel}: {q.title.split(' ')[0]}
                  </div>
                  <div className="font-math font-extrabold text-lg text-slate-950">
                    {qEarned} / {q.totalMarks}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ACTIVE OR SUBMITTED EXAM QUESTIONS */}
      {examState !== 'intro' && (
        <div className="space-y-6">
          {/* Question Navigation Bar */}
          <div className="comic-panel-sm bg-white p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-extrabold text-slate-700 mr-1">QUESTIONS:</span>
              {EXAM_QUESTIONS.map((q, idx) => {
                const allPartsFilled = q.parts.every((p) => (answers[p.id] || '').trim().length > 0);
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setActiveQuestionIdx(idx);
                      setViewAllMode(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-math font-extrabold text-xs border-2 border-slate-900 cursor-pointer ${
                      !viewAllMode && activeQuestionIdx === idx
                        ? 'bg-slate-900 text-amber-300'
                        : allPartsFilled
                        ? 'bg-emerald-300 text-slate-950'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {q.numberLabel} ({q.totalMarks}m)
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setViewAllMode(!viewAllMode)}
              className="px-3.5 py-1.5 rounded-lg border-2 border-slate-900 bg-amber-200 hover:bg-amber-300 font-bold text-xs cursor-pointer"
            >
              {viewAllMode ? 'Focus One Question at a Time' : 'Show Full Exam Paper (Q1–Q7)'}
            </button>
          </div>

          {/* Render Questions */}
          <div className="space-y-6">
            {(viewAllMode ? EXAM_QUESTIONS : [EXAM_QUESTIONS[activeQuestionIdx]]).map((q) => (
              <div key={q.id} className="comic-panel bg-white p-6 sm:p-8 rounded-2xl space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-slate-900 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-math font-extrabold text-base bg-slate-900 text-amber-300 px-3 py-1 rounded-lg">
                      {q.numberLabel}
                    </span>
                    <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-950">
                      {q.title}
                    </h2>
                  </div>
                  <span className="font-math font-extrabold text-sm text-rose-700">
                    [{q.totalMarks} {q.totalMarks === 1 ? 'mark' : 'marks'}]
                  </span>
                </div>

                {/* Equation Banner */}
                <div className="bg-slate-900 text-amber-300 font-math font-extrabold text-lg sm:text-xl px-5 py-3 rounded-xl">
                  {q.equationBanner}
                </div>

                {q.contextText && (
                  <p className="text-sm sm:text-base font-bold text-slate-800 bg-amber-50 p-3.5 rounded-xl border-2 border-slate-900">
                    {q.contextText}
                  </p>
                )}

                {/* Parts */}
                <div className="space-y-4">
                  {q.parts.map((part) => {
                    const earned = liveScoreResult.partScores[part.id] ?? 0;
                    const isFullMarks = earned === part.marks;

                    return (
                      <div
                        key={part.id}
                        className="p-4 rounded-xl border-2 border-slate-900 bg-slate-50 space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <label
                            htmlFor={`exam-input-${part.id}`}
                            className="font-display font-extrabold text-sm sm:text-base text-slate-950"
                          >
                            ({part.partLabel}) {part.prompt}
                          </label>
                          <span className="font-math font-bold text-xs text-slate-600 shrink-0">
                            [{part.marks} {part.marks === 1 ? 'mark' : 'marks'}]
                          </span>
                        </div>

                        <input
                          id={`exam-input-${part.id}`}
                          type="text"
                          disabled={examState === 'submitted'}
                          value={answers[part.id] || ''}
                          onChange={(e) =>
                            setAnswers((prev) => ({ ...prev, [part.id]: e.target.value }))
                          }
                          placeholder={part.inputPlaceholder}
                          className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-900 font-math font-bold text-base bg-white disabled:bg-slate-100 text-slate-950"
                        />

                        {/* Post-Submission Mark & Model Solution */}
                        {(examState === 'submitted' || isTeacherMode) && (
                          <div className="pt-2 border-t border-slate-300 space-y-2">
                            {examState === 'submitted' && (
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold">
                                  {isFullMarks ? (
                                    <span className="text-emerald-800 flex items-center gap-1">
                                      <CheckCircle2 className="w-4 h-4" /> Awarded: {earned} /{' '}
                                      {part.marks}
                                    </span>
                                  ) : (
                                    <span className="text-rose-800 flex items-center gap-1">
                                      <XCircle className="w-4 h-4" /> Awarded: {earned} /{' '}
                                      {part.marks}
                                    </span>
                                  )}
                                </div>

                                {/* Teacher Review Controls for Written Reasoning */}
                                {!part.autoGradable && (
                                  <div className="flex items-center gap-1.5 bg-purple-100 px-3 py-1 rounded-lg border border-slate-900">
                                    <FileCheck2 className="w-3.5 h-3.5 text-purple-900" />
                                    <span className="text-xs font-extrabold text-purple-950">
                                      Teacher Review Score:
                                    </span>
                                    {Array.from({ length: part.marks + 1 }, (_, m) => (
                                      <button
                                        key={m}
                                        type="button"
                                        onClick={() => handleTeacherMarkOverride(part.id, m)}
                                        className={`px-2 py-0.5 rounded font-math font-bold text-xs border border-slate-900 cursor-pointer ${
                                          earned === m
                                            ? 'bg-slate-900 text-amber-300'
                                            : 'bg-white text-slate-900'
                                        }`}
                                      >
                                        {m}m
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="bg-sky-100 p-3 rounded-lg border border-slate-900 text-xs sm:text-sm space-y-1">
                              <div className="font-extrabold text-slate-950">
                                Model Answer:{' '}
                                <span className="font-math text-emerald-900">
                                  {part.modelAnswer}
                                </span>
                              </div>
                              <div className="font-semibold text-slate-700">
                                Working: {part.workingExplanation}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Exam Footer Button */}
          {examState === 'active' && (
            <div className="comic-panel bg-amber-300 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-950">
                  Finished checking your work, Sajeev?
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-800">
                  Submit your exam paper to lock in your score out of 20 marks and unlock full model solutions!
                </p>
              </div>
              <button
                type="button"
                onClick={handleSubmitExam}
                className="comic-btn bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-extrabold text-base sm:text-lg px-8 py-4 rounded-xl flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Send className="w-5 h-5" />
                <span>SUBMIT EXAM PAPER (20 MARKS)</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
