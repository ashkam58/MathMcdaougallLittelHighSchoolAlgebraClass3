import React from 'react';
import {
  Eye,
  Lightbulb,
  BookOpen,
  PenTool,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Play,
  Pause
} from 'lucide-react';

interface TeacherToolbarProps {
  globalRevealAnswers: boolean;
  onToggleRevealAnswers: () => void;
  globalShowHints: boolean;
  onToggleShowHints: () => void;
  globalShowNotes: boolean;
  onToggleShowNotes: () => void;
  onOpenWhiteboard: () => void;
  onLaunchSection: (section: string) => void;
  timerPaused: boolean;
  onToggleTimerPaused: () => void;
  fontScale: number;
  onChangeFontScale: (delta: number) => void;
  onResetCurrentActivity: () => void;
}

export const TeacherToolbar: React.FC<TeacherToolbarProps> = ({
  globalRevealAnswers,
  onToggleRevealAnswers,
  globalShowHints,
  onToggleShowHints,
  globalShowNotes,
  onToggleShowNotes,
  onOpenWhiteboard,
  onLaunchSection,
  timerPaused,
  onToggleTimerPaused,
  fontScale,
  onChangeFontScale,
  onResetCurrentActivity
}) => {
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  return (
    <div className="bg-slate-900 text-white border-b-3 border-slate-950 px-4 py-2 sticky top-16 z-30 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-display font-extrabold text-xs bg-amber-400 text-slate-950 px-2.5 py-1 rounded-md">
            TEACHER DECK
          </span>
          <select
            aria-label="Jump to any classroom section"
            onChange={(e) => {
              if (e.target.value) onLaunchSection(e.target.value);
            }}
            defaultValue=""
            className="bg-slate-800 text-amber-300 border border-slate-600 rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer"
          >
            <option value="" disabled>
              Jump to Section...
            </option>
            <option value="welcome">1. Comic Welcome Screen</option>
            <option value="briefing">2. Mission Briefing</option>
            <option value="slides">3. Interactive Lesson Slides (1–14)</option>
            <option value="lab">4. Function Machine Lab</option>
            <option value="worked">5. Guided Worked Examples</option>
            <option value="practice">6. Practice Arena (Levels 1–4)</option>
            <option value="detective">7. Error Detective</option>
            <option value="exam">8. Final Boss Exam (20 Marks)</option>
            <option value="homework">9. Homework Assignment</option>
            <option value="progress">10. Sajeev Progress Report</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={onToggleRevealAnswers}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border cursor-pointer ${
              globalRevealAnswers
                ? 'bg-emerald-400 text-slate-950 border-white'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{globalRevealAnswers ? 'Answers Shown' : 'Show Answers'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleShowHints}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border cursor-pointer ${
              globalShowHints
                ? 'bg-amber-400 text-slate-950 border-white'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{globalShowHints ? 'Hints Shown' : 'Show Hints'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleShowNotes}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border cursor-pointer ${
              globalShowNotes
                ? 'bg-purple-400 text-slate-950 border-white'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Speaker Notes</span>
          </button>

          <button
            type="button"
            onClick={onOpenWhiteboard}
            className="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 bg-sky-400 text-slate-950 cursor-pointer"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Whiteboard</span>
          </button>

          <button
            type="button"
            onClick={onToggleTimerPaused}
            className="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer"
          >
            {timerPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{timerPaused ? 'Resume Timer' : 'Pause Timer'}</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeFontScale(-0.08)}
            title="Decrease Text Size"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-math text-xs font-bold px-1">
            {Math.round(fontScale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => onChangeFontScale(0.08)}
            title="Increase Text Size"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleFullscreen}
            title="Fullscreen Classroom"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onResetCurrentActivity}
            title="Reset Activity View"
            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset View</span>
          </button>
        </div>
      </div>
    </div>
  );
};
