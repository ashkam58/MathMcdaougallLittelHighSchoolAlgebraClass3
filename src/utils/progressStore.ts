export type SkillKey = 'notation' | 'linear' | 'quadratic' | 'combined' | 'reverse' | 'realworld';

export interface SkillStat {
  attempted: number;
  correct: number;
}

export interface StudentProgress {
  studentName: string;
  xp: number;
  stars: number;
  questionsAttempted: number;
  questionsCorrect: number;
  hintsUsed: number;
  totalTimeSeconds: number;
  completedIds: string[];
  needsImprovementIds: { id: string; label: string; equation: string }[];
  skills: Record<SkillKey, SkillStat>;
  secretRulesSolved: number;
  errorsCaught: string[];
  examResult?: {
    score: number;
    maxScore: number;
    timeTakenSeconds: number;
    completedAt: string;
    partScores: Record<string, number>;
    studentAnswers: Record<string, string>;
  };
}

const STORAGE_KEY = 'function_heroes_sajeev_progress_v1';

export function createInitialProgress(): StudentProgress {
  return {
    studentName: 'Sajeev',
    xp: 0,
    stars: 0,
    questionsAttempted: 0,
    questionsCorrect: 0,
    hintsUsed: 0,
    totalTimeSeconds: 0,
    completedIds: [],
    needsImprovementIds: [],
    skills: {
      notation: { attempted: 0, correct: 0 },
      linear: { attempted: 0, correct: 0 },
      quadratic: { attempted: 0, correct: 0 },
      combined: { attempted: 0, correct: 0 },
      reverse: { attempted: 0, correct: 0 },
      realworld: { attempted: 0, correct: 0 }
    },
    secretRulesSolved: 0,
    errorsCaught: []
  };
}

export function loadProgress(): StudentProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialProgress();
    const parsed = JSON.parse(raw) as Partial<StudentProgress>;
    const defaults = createInitialProgress();
    return {
      ...defaults,
      ...parsed,
      skills: {
        ...defaults.skills,
        ...(parsed.skills || {})
      }
    };
  } catch {
    return createInitialProgress();
  }
}

export function saveProgress(progress: StudentProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage quota errors in sandboxed iframes
  }
}

export function resetStoredProgress(): StudentProgress {
  const fresh = createInitialProgress();
  saveProgress(fresh);
  return fresh;
}
