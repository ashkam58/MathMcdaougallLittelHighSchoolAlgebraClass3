import React, { useState } from 'react';
import {
  Star,
  Zap,
  Award,
  Target,
  Clock,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { StudentProgress, SkillKey } from '../utils/progressStore';
import { CharacterAvatar } from './ComicCharacters';

interface ProgressReportProps {
  progress: StudentProgress;
  onResetProgress: () => void;
  onJumpToSection: (section: string) => void;
}

const SKILL_LABELS: Record<SkillKey, { name: string; std: string }> = {
  notation: { name: 'Function Notation Meaning f(x)', std: 'HSF-IF.A.1' },
  linear: { name: 'Linear Function Substitution', std: 'HSF-IF.A.2' },
  quadratic: { name: 'Quadratic Function Evaluation', std: 'HSF-IF.A.2' },
  combined: { name: 'Combining Two Functions f(x) + g(x)', std: 'HSF-IF.A.2' },
  reverse: { name: 'Reversing Machine (Find Input x)', std: 'HSF-IF.A.2' },
  realworld: { name: 'Real-World Function Modelling', std: 'HSF-IF.A.2' }
};

export const ProgressReport: React.FC<ProgressReportProps> = ({
  progress,
  onResetProgress,
  onJumpToSection
}) => {
  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  const accuracy =
    progress.questionsAttempted > 0
      ? Math.round((progress.questionsCorrect / progress.questionsAttempted) * 100)
      : 100;

  const minutesActive = Math.max(1, Math.round(progress.totalTimeSeconds / 60));

  const badges = [
    {
      id: 'b-initiate',
      title: 'Notation Initiate',
      desc: 'Solve at least 5 function questions',
      unlocked: progress.questionsCorrect >= 5
    },
    {
      id: 'b-lab',
      title: 'Secret Rule Codebreaker',
      desc: 'Crack a Secret Rule in the Function Machine Lab',
      unlocked: progress.secretRulesSolved >= 1
    },
    {
      id: 'b-detective',
      title: 'Error Monster Buster',
      desc: 'Defeat the Error Monster in Error Detective',
      unlocked: progress.errorsCaught.length >= 1
    },
    {
      id: 'b-boss',
      title: 'Final Boss Conqueror',
      desc: 'Complete the 20-Mark Final Boss Examination',
      unlocked: Boolean(progress.examResult)
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="comic-panel bg-amber-300 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <CharacterAvatar character="fox" mood="happy" size="lg" />
          <div className="space-y-1">
            <div className="text-xs sm:text-sm font-extrabold text-slate-900">
              SECTION 12 · OFFICIAL STUDENT ANALYTICS &amp; MASTERY REPORT
            </div>
            <h1 className="font-comic-title text-4xl sm:text-5xl text-slate-950 tracking-wide">
              SAJEEV’S HERO PROGRESS REPORT
            </h1>
            <p className="text-xs sm:text-sm font-bold text-slate-800">
              Montgomery Township School District · McDougal Littell Algebra 1 · Class 03
            </p>
          </div>
        </div>

        {/* Reset Progress Control */}
        <div>
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="comic-btn bg-white hover:bg-rose-100 text-rose-900 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Progress</span>
            </button>
          ) : (
            <div className="comic-panel-sm bg-white p-3 rounded-xl flex items-center gap-2">
              <span className="text-xs font-extrabold text-rose-900">Confirm Reset?</span>
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmReset(false);
                }}
                className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs cursor-pointer"
              >
                Yes, Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-3 py-1 rounded-lg bg-slate-200 text-slate-900 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Top 6 KPI Stat Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="comic-panel bg-white p-4 rounded-2xl text-center space-y-1">
          <Zap className="w-6 h-6 text-amber-500 mx-auto" />
          <div className="font-math font-extrabold text-2xl text-slate-950">{progress.xp} XP</div>
          <div className="text-xs font-bold text-slate-600">Hero Experience</div>
        </div>

        <div className="comic-panel bg-white p-4 rounded-2xl text-center space-y-1">
          <Star className="w-6 h-6 text-amber-500 fill-amber-400 mx-auto" />
          <div className="font-math font-extrabold text-2xl text-slate-950">{progress.stars}</div>
          <div className="text-xs font-bold text-slate-600">Stars Earned</div>
        </div>

        <div className="comic-panel bg-white p-4 rounded-2xl text-center space-y-1">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
          <div className="font-math font-extrabold text-2xl text-slate-950">
            {progress.questionsCorrect} / {progress.questionsAttempted}
          </div>
          <div className="text-xs font-bold text-slate-600">Correct / Attempted</div>
        </div>

        <div className="comic-panel bg-white p-4 rounded-2xl text-center space-y-1">
          <Target className="w-6 h-6 text-sky-600 mx-auto" />
          <div className="font-math font-extrabold text-2xl text-slate-950">{accuracy}%</div>
          <div className="text-xs font-bold text-slate-600">Accuracy Rate</div>
        </div>

        <div className="comic-panel bg-white p-4 rounded-2xl text-center space-y-1">
          <Clock className="w-6 h-6 text-indigo-600 mx-auto" />
          <div className="font-math font-extrabold text-2xl text-slate-950">{minutesActive}m</div>
          <div className="text-xs font-bold text-slate-600">Time in Classroom</div>
        </div>

        <div className="comic-panel bg-white p-4 rounded-2xl text-center space-y-1">
          <HelpCircle className="w-6 h-6 text-rose-600 mx-auto" />
          <div className="font-math font-extrabold text-2xl text-slate-950">{progress.hintsUsed}</div>
          <div className="text-xs font-bold text-slate-600">Hints Used</div>
        </div>
      </div>

      {/* Main Split: Skill Mastery Breakdown vs. Badges & Revision Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Columns: Skill Mastery & Final Exam Result */}
        <div className="lg:col-span-7 space-y-6">
          <div className="comic-panel bg-white p-6 rounded-2xl space-y-5">
            <h2 className="font-display text-xl font-extrabold text-slate-950 border-b-2 border-slate-900 pb-2">
              PERFORMANCE BY ALGEBRA 1 SKILL
            </h2>

            <div className="space-y-4">
              {(Object.keys(SKILL_LABELS) as SkillKey[]).map((key) => {
                const stat = progress.skills[key] || { attempted: 0, correct: 0 };
                const pct =
                  stat.attempted > 0 ? Math.round((stat.correct / stat.attempted) * 100) : 0;
                const info = SKILL_LABELS[key];

                return (
                  <div key={key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold">
                      <span className="text-slate-900">
                        {info.name} <span className="text-slate-500 font-math">({info.std})</span>
                      </span>
                      <span className="font-math text-slate-800">
                        {stat.correct}/{stat.attempted} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden border-2 border-slate-900">
                      <div
                        className={`h-full transition-all duration-300 ${
                          pct >= 80
                            ? 'bg-emerald-500'
                            : pct >= 50
                            ? 'bg-amber-400'
                            : 'bg-sky-400'
                        }`}
                        style={{ width: `${stat.attempted === 0 ? 8 : pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Final Boss Exam Summary Card */}
          <div className="comic-panel bg-sky-100 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <h2 className="font-display text-xl font-extrabold text-slate-950">
                FINAL BOSS EXAMINATION RECORD (20 MARKS)
              </h2>
              <Award className="w-6 h-6 text-slate-900" />
            </div>

            {progress.examResult ? (
              <div className="comic-panel-sm bg-white p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="font-math font-extrabold text-2xl text-emerald-800">
                    Score: {progress.examResult.score} / {progress.examResult.maxScore} Marks (
                    {Math.round(
                      (progress.examResult.score / progress.examResult.maxScore) * 100
                    )}
                    %)
                  </div>
                  <div className="text-xs font-bold text-slate-600 mt-1">
                    Completed at {progress.examResult.completedAt} · Time Taken:{' '}
                    {Math.max(1, Math.round(progress.examResult.timeTakenSeconds / 60))} min
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onJumpToSection('exam')}
                  className="comic-btn bg-slate-900 text-amber-300 font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Review Exam Script
                </button>
              </div>
            ) : (
              <div className="comic-panel-sm bg-white p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-sm font-bold text-slate-700">
                  Sajeev has not submitted the 20-Mark Final Boss Exam yet!
                </p>
                <button
                  type="button"
                  onClick={() => onJumpToSection('exam')}
                  className="comic-btn bg-rose-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer whitespace-nowrap"
                >
                  Take Final Boss Exam Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Columns: Achievement Badges & Questions Needing Improvement */}
        <div className="lg:col-span-5 space-y-6">
          <div className="comic-panel bg-emerald-100 p-6 rounded-2xl space-y-4">
            <h2 className="font-display text-xl font-extrabold text-slate-950 border-b-2 border-slate-900 pb-2">
              SUPERHERO ACHIEVEMENT BADGES
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-4 rounded-xl border-2 border-slate-900 flex flex-col justify-between ${
                    b.unlocked ? 'bg-amber-300 text-slate-950' : 'bg-white/70 text-slate-500'
                  }`}
                >
                  <div className="font-display font-extrabold text-sm">
                    {b.unlocked ? '🏆 ' : '🔒 '}
                    {b.title}
                  </div>
                  <p className="text-xs font-semibold mt-1">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="comic-panel bg-rose-100 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <h2 className="font-display text-lg font-extrabold text-slate-950 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-700" />
                <span>AREAS REQUIRING REVISION</span>
              </h2>
            </div>

            {progress.needsImprovementIds.length === 0 ? (
              <div className="comic-panel-sm bg-white p-4 rounded-xl text-xs sm:text-sm font-bold text-emerald-900">
                Zero unresolved mistakes! Keep practicing across the Arena to test new skills!
              </div>
            ) : (
              <div className="space-y-2">
                {progress.needsImprovementIds.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-3 rounded-xl border-2 border-slate-900 flex items-center justify-between gap-2 text-xs font-bold"
                  >
                    <span className="text-slate-900">{item.label}</span>
                    <span className="font-math text-rose-700">{item.equation}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
