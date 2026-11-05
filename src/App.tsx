/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen,
  FlaskConical,
  Swords,
  ShieldAlert,
  Award,
  BarChart3,
  PenTool,
  GraduationCap,
  UserCheck,
  Compass,
  FileText,
  Layers
} from 'lucide-react';
import {
  StudentProgress,
  SkillKey,
  loadProgress,
  saveProgress,
  resetStoredProgress
} from './utils/progressStore';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MissionBriefing } from './components/MissionBriefing';
import { SlideDeck } from './components/SlideDeck';
import { FunctionMachineLab } from './components/FunctionMachineLab';
import { WorkedExamples } from './components/WorkedExamples';
import { PracticeArena } from './components/PracticeArena';
import { ErrorDetective } from './components/ErrorDetective';
import { ExamSimulator } from './components/ExamSimulator';
import { HomeworkView } from './components/HomeworkView';
import { ProgressReport } from './components/ProgressReport';
import { WhiteboardModal } from './components/WhiteboardModal';
import { TeacherToolbar } from './components/TeacherToolbar';

export type ClassroomSection =
  | 'welcome'
  | 'briefing'
  | 'slides'
  | 'lab'
  | 'worked'
  | 'practice'
  | 'detective'
  | 'exam'
  | 'homework'
  | 'progress';

const NAV_SECTIONS: {
  id: ClassroomSection;
  label: string;
  shortLabel: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  { id: 'briefing', label: 'Mission Briefing', shortLabel: 'Briefing', icon: Compass },
  { id: 'slides', label: '14 Lesson Slides', shortLabel: 'Slides', icon: BookOpen },
  { id: 'lab', label: 'Machine Lab', shortLabel: 'Lab', icon: FlaskConical },
  { id: 'worked', label: 'Worked Examples', shortLabel: 'Examples', icon: Layers },
  { id: 'practice', label: 'Practice Arena (L1–L4)', shortLabel: 'Arena', icon: Swords },
  { id: 'detective', label: 'Error Detective', shortLabel: 'Detective', icon: ShieldAlert },
  { id: 'exam', label: '20-Mark Boss Exam', shortLabel: 'Boss Exam', icon: Award },
  { id: 'homework', label: 'Homework', shortLabel: 'Homework', icon: FileText },
  { id: 'progress', label: 'Sajeev Report', shortLabel: 'Report', icon: BarChart3 }
];

export default function App() {
  const [activeSection, setActiveSection] = useState<ClassroomSection>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('autostart') === '1' ? 'briefing' : 'welcome';
  });

  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isTeacherMode, setIsTeacherMode] = useState<boolean>(false);
  const [whiteboardOpen, setWhiteboardOpen] = useState<boolean>(false);

  // Teacher presentation controls
  const [globalRevealAnswers, setGlobalRevealAnswers] = useState<boolean>(false);
  const [globalShowHints, setGlobalShowHints] = useState<boolean>(false);
  const [globalShowNotes, setGlobalShowNotes] = useState<boolean>(false);
  const [timerPaused, setTimerPaused] = useState<boolean>(false);
  const [fontScale, setFontScale] = useState<number>(1);
  const [activityResetKey, setActivityResetKey] = useState<number>(0);

  // Sajeev persistent progress
  const [progress, setProgress] = useState<StudentProgress>(() => loadProgress());

  // Sync body dataset state for verification
  useEffect(() => {
    document.body.dataset.state = activeSection === 'welcome' ? 'title' : 'playing';
  }, [activeSection]);

  // Classroom session timer tracking
  useEffect(() => {
    if (timerPaused) return;
    const timer = setInterval(() => {
      setProgress((prev) => {
        const updated = { ...prev, totalTimeSeconds: prev.totalTimeSeconds + 5 };
        saveProgress(updated);
        return updated;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [timerPaused]);

  const handleRecordAttempt = useCallback(
    (
      id: string,
      correct: boolean,
      skill: SkillKey,
      label: string,
      equation: string
    ) => {
      setProgress((prev) => {
        const alreadyCompleted = prev.completedIds.includes(id);
        const xpGain = correct ? (alreadyCompleted ? 5 : 30) : 0;
        const newXp = prev.xp + xpGain;
        const newStars = Math.floor(newXp / 100);

        const prevSkill = prev.skills[skill] || { attempted: 0, correct: 0 };
        const updatedSkills = {
          ...prev.skills,
          [skill]: {
            attempted: prevSkill.attempted + 1,
            correct: prevSkill.correct + (correct ? 1 : 0)
          }
        };

        let updatedNeeds = [...prev.needsImprovementIds];
        if (!correct) {
          if (!updatedNeeds.some((item) => item.id === id)) {
            updatedNeeds.push({ id, label, equation });
          }
        } else {
          updatedNeeds = updatedNeeds.filter((item) => item.id !== id);
        }

        const updated: StudentProgress = {
          ...prev,
          xp: newXp,
          stars: newStars,
          questionsAttempted: prev.questionsAttempted + 1,
          questionsCorrect: prev.questionsCorrect + (correct ? 1 : 0),
          completedIds:
            correct && !alreadyCompleted ? [...prev.completedIds, id] : prev.completedIds,
          needsImprovementIds: updatedNeeds,
          skills: updatedSkills
        };
        saveProgress(updated);
        return updated;
      });
    },
    []
  );

  const handleRecordHint = useCallback(() => {
    setProgress((prev) => {
      const updated = { ...prev, hintsUsed: prev.hintsUsed + 1 };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const handleSecretRuleSolved = useCallback(() => {
    setProgress((prev) => {
      const newXp = prev.xp + 50;
      const updated: StudentProgress = {
        ...prev,
        xp: newXp,
        stars: Math.floor(newXp / 100),
        secretRulesSolved: prev.secretRulesSolved + 1
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const handleBugCaught = useCallback((challengeId: string) => {
    setProgress((prev) => {
      const already = prev.errorsCaught.includes(challengeId);
      const newXp = prev.xp + (already ? 10 : 40);
      const updated: StudentProgress = {
        ...prev,
        xp: newXp,
        stars: Math.floor(newXp / 100),
        errorsCaught: already ? prev.errorsCaught : [...prev.errorsCaught, challengeId]
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const handleSaveExamResult = useCallback(
    (result: NonNullable<StudentProgress['examResult']>) => {
      setProgress((prev) => {
        const newXp = prev.xp + result.score * 10;
        const updated: StudentProgress = {
          ...prev,
          xp: newXp,
          stars: Math.floor(newXp / 100),
          examResult: result
        };
        saveProgress(updated);
        return updated;
      });
    },
    []
  );

  const handleResetProgress = () => {
    const fresh = resetStoredProgress();
    setProgress(fresh);
    setActivityResetKey((k) => k + 1);
  };

  return (
    <div
      className="min-h-screen flex flex-col halftone-bg text-slate-900"
      style={{ fontSize: `${Math.round(fontScale * 100)}%` }}
    >
      {/* Top Bar Contract: 3-Zone Header (Brand Wordmark — 5 Primary Nav Links — 1 Primary Action) */}
      <header className="sticky top-0 z-40 bg-amber-300 border-b-3 border-slate-900 px-4 sm:px-8 py-3 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => setActiveSection('welcome')}
          className="font-comic-title text-2xl sm:text-3xl tracking-wider text-slate-950 whitespace-nowrap shrink-0 cursor-pointer"
        >
          FUNCTION HEROES
        </button>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-6 text-sm font-extrabold text-slate-900">
          <button
            type="button"
            onClick={() => setActiveSection('slides')}
            className={`hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'slides' ? 'text-rose-700 underline' : ''
            }`}
          >
            Lesson Slides
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('lab')}
            className={`hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'lab' ? 'text-rose-700 underline' : ''
            }`}
          >
            Machine Lab
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('practice')}
            className={`hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'practice' ? 'text-rose-700 underline' : ''
            }`}
          >
            Practice Arena
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('detective')}
            className={`hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'detective' ? 'text-rose-700 underline' : ''
            }`}
          >
            Error Detective
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('exam')}
            className={`hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'exam' ? 'text-rose-700 underline' : ''
            }`}
          >
            Final Boss Exam
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action (Open Digital Math Whiteboard) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setWhiteboardOpen(true)}
            className="comic-btn bg-slate-900 hover:bg-slate-800 text-amber-300 font-display font-extrabold text-xs sm:text-sm px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <PenTool className="w-4 h-4" />
            <span>Open Whiteboard</span>
          </button>
        </div>
      </header>

      {/* Sub-Header Classroom Mode & Full Section Switcher Bar */}
      <div className="bg-white border-b-2 border-slate-900 px-3 sm:px-6 py-1.5">
        <div className="max-w-7xl mx-auto flex flex-wrap xl:flex-nowrap items-center justify-between gap-2">
          {/* All Sections Strip */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            {NAV_SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isCurrent = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSection(sec.id)}
                  className={`px-2 py-1 rounded-lg font-display font-bold text-xs flex items-center gap-1 border-2 border-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-900 text-amber-300'
                      : 'bg-slate-100 hover:bg-amber-100 text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{sec.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Student XP Counter + Teacher Mode / Student Mode Switch */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveSection('progress')}
              className="px-2.5 py-1 rounded-lg border-2 border-slate-900 bg-amber-100 font-math font-extrabold text-xs text-slate-950 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Sajeev: {progress.xp} XP · ★ {progress.stars}
            </button>

            <div
              role="group"
              aria-label="Classroom Mode Switch"
              className="inline-flex rounded-lg border-2 border-slate-900 bg-slate-100 p-0.5"
            >
              <button
                type="button"
                onClick={() => setIsTeacherMode(false)}
                className={`px-2 py-0.5 rounded-md text-xs font-extrabold flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer ${
                  !isTeacherMode ? 'bg-emerald-400 text-slate-950' : 'text-slate-700'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => setIsTeacherMode(true)}
                className={`px-2 py-0.5 rounded-md text-xs font-extrabold flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer ${
                  isTeacherMode ? 'bg-purple-400 text-slate-950' : 'text-slate-700'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Teacher</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Teacher Presentation Toolbar (Visible in Teacher Mode) */}
      {isTeacherMode && (
        <TeacherToolbar
          globalRevealAnswers={globalRevealAnswers}
          onToggleRevealAnswers={() => setGlobalRevealAnswers((v) => !v)}
          globalShowHints={globalShowHints}
          onToggleShowHints={() => setGlobalShowHints((v) => !v)}
          globalShowNotes={globalShowNotes}
          onToggleShowNotes={() => setGlobalShowNotes((v) => !v)}
          onOpenWhiteboard={() => setWhiteboardOpen(true)}
          onLaunchSection={(sec) => setActiveSection(sec as ClassroomSection)}
          timerPaused={timerPaused}
          onToggleTimerPaused={() => setTimerPaused((v) => !v)}
          fontScale={fontScale}
          onChangeFontScale={(delta) =>
            setFontScale((s) => Math.max(0.85, Math.min(1.25, Number((s + delta).toFixed(2)))))
          }
          onResetCurrentActivity={() => setActivityResetKey((k) => k + 1)}
        />
      )}

      {/* Main Classroom Stage */}
      <main key={activityResetKey} className="flex-1">
        {activeSection === 'welcome' && (
          <WelcomeScreen
            onStartMission={() => setActiveSection('briefing')}
            onJumpToSection={(sec) => setActiveSection(sec as ClassroomSection)}
          />
        )}

        {activeSection === 'briefing' && (
          <MissionBriefing
            onLaunchSlides={() => setActiveSection('slides')}
            onLaunchLab={() => setActiveSection('lab')}
          />
        )}

        {activeSection === 'slides' && (
          <SlideDeck
            currentSlideIndex={currentSlideIndex}
            onSelectSlide={setCurrentSlideIndex}
            isTeacherMode={isTeacherMode}
            globalShowNotes={globalShowNotes}
            globalRevealAnswers={globalRevealAnswers}
            globalShowHints={globalShowHints}
            onToggleNotes={() => setGlobalShowNotes((v) => !v)}
            onOpenWhiteboard={() => setWhiteboardOpen(true)}
            onExitPresentation={() => setActiveSection('briefing')}
            onRecordAttempt={handleRecordAttempt}
            onRecordHint={handleRecordHint}
          />
        )}

        {activeSection === 'lab' && (
          <FunctionMachineLab onSecretRuleSolved={handleSecretRuleSolved} />
        )}

        {activeSection === 'worked' && (
          <WorkedExamples
            globalRevealAnswers={globalRevealAnswers}
            onLaunchPractice={() => setActiveSection('practice')}
          />
        )}

        {activeSection === 'practice' && (
          <PracticeArena
            completedIds={progress.completedIds}
            globalRevealAnswers={globalRevealAnswers}
            globalShowHints={globalShowHints}
            onRecordAttempt={handleRecordAttempt}
            onRecordHint={handleRecordHint}
          />
        )}

        {activeSection === 'detective' && (
          <ErrorDetective
            caughtIds={progress.errorsCaught}
            globalRevealAnswers={globalRevealAnswers}
            onBugCaught={handleBugCaught}
            onRecordHint={handleRecordHint}
          />
        )}

        {activeSection === 'exam' && (
          <ExamSimulator
            isTeacherMode={isTeacherMode}
            timerPausedExternal={timerPaused}
            savedExamResult={progress.examResult}
            onSaveExamResult={handleSaveExamResult}
          />
        )}

        {activeSection === 'homework' && (
          <HomeworkView
            completedIds={progress.completedIds}
            globalRevealAnswers={globalRevealAnswers}
            onRecordAttempt={handleRecordAttempt}
          />
        )}

        {activeSection === 'progress' && (
          <ProgressReport
            progress={progress}
            onResetProgress={handleResetProgress}
            onJumpToSection={(sec) => setActiveSection(sec as ClassroomSection)}
          />
        )}
      </main>

      {/* Interactive Digital Mathematics Whiteboard Modal */}
      <WhiteboardModal
        isOpen={whiteboardOpen}
        onClose={() => setWhiteboardOpen(false)}
      />
    </div>
  );
}
