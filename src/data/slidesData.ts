export type CharacterId = 'fox' | 'professor' | 'captain' | 'bot' | 'monster';

export interface SlideCheckpoint {
  id: string;
  prompt: string;
  type: 'numeric' | 'expression' | 'choice';
  options?: string[];
  acceptedAnswers: string[];
  hints: string[];
  explanation: string;
  skill: 'notation' | 'linear' | 'quadratic' | 'combined' | 'reverse';
}

export interface SlideTeacherNotes {
  explanation: string;
  expectedAnswer: string;
  commonMistakes: string;
  followUpQuestion: string;
}

export interface LessonSlide {
  slideNumber: number;
  act: 'ACT 1: THE MYSTERY BEGINS' | 'ACT 2: MASTER THE FUNCTION MACHINE';
  title: string;
  subtitle: string;
  objective: string;
  character: CharacterId;
  speechBubble: string;
  visualType:
    | 'hero-intro'
    | 'definition-map'
    | 'machine-anatomy'
    | 'io-pipeline'
    | 'secret-rule'
    | 'notation-intro'
    | 'notation-anatomy'
    | 'warning-trap'
    | 'y-vs-fx'
    | 'multi-function'
    | 'worked-linear'
    | 'worked-quadratic'
    | 'combined-functions'
    | 'reverse-machine';
  mathHighlight: {
    equation: string;
    annotations: { label: string; detail: string; color: string }[];
  };
  workedSteps: { step: string; math: string; note: string }[];
  checkpoint: SlideCheckpoint;
  teacherNotes: SlideTeacherNotes;
}

export const LESSON_SLIDES: LessonSlide[] = [
  {
    slideNumber: 1,
    act: 'ACT 1: THE MYSTERY BEGINS',
    title: 'Welcome to Function Heroes',
    subtitle: 'Class 03: Function Notation & Evaluating Functions',
    objective: 'Understand the mission goals for mastering function notation f(x) and evaluating algebraic rules (HSF-IF.A.1 & HSF-IF.A.2).',
    character: 'fox',
    speechBubble: 'Welcome to HQ, Sajeev! Every number in Montgomery City has a story—and today you unlock the secret code of the Function Machine!',
    visualType: 'hero-intro',
    mathHighlight: {
      equation: 'f(x) = 3x + 2',
      annotations: [
        { label: 'Curriculum', detail: 'McDougal Littell Algebra 1 · Montgomery Township SD', color: 'bg-amber-100 text-slate-900' },
        { label: 'Standards', detail: 'HSF-IF.A.2 (Primary) · HSF-IF.A.1 (Supporting)', color: 'bg-sky-100 text-slate-900' },
        { label: 'Mission Target', detail: 'Evaluate f(x), decode real-world models & ace the 20-mark Boss Exam', color: 'bg-emerald-100 text-slate-900' }
      ]
    },
    workedSteps: [
      { step: 'Phase 1', math: 'Input → Rule → Output', note: 'Discover how a mathematical function transforms each input into exactly one output.' },
      { step: 'Phase 2', math: 'y = 3x + 2  ⇒  f(x) = 3x + 2', note: 'Upgrade from basic y-equations to precision superhero function notation.' },
      { step: 'Phase 3', math: 'Forward & Reverse Evaluation', note: 'Calculate outputs for any input AND reverse the machine to find missing inputs.' }
    ],
    checkpoint: {
      id: 'slide-1-cp',
      prompt: 'Warm-up Check: If a machine doubles your number and adds 1, what comes out when you drop in 5?',
      type: 'numeric',
      acceptedAnswers: ['11'],
      hints: [
        'First double the input 5: calculate 2 × 5.',
        '2 × 5 = 10. Now add 1 to get the final output!'
      ],
      explanation: 'Doubling 5 gives 2 × 5 = 10, and adding 1 produces 11. You just evaluated your first function rule!',
      skill: 'notation'
    },
    teacherNotes: {
      explanation: 'Welcome Sajeev and set an energetic graphic-novel adventure tone. Connect today’s lesson to McDougal Littell Algebra 1 Chapter on Functions.',
      expectedAnswer: '11 (since 2 × 5 + 1 = 11).',
      commonMistakes: 'Adding before multiplying (5 + 1 = 6, then doubling to 12). Remind students of Order of Operations (PEMDAS).',
      followUpQuestion: 'What if we dropped 0 or -3 into the same machine? What would come out?'
    }
  },
  {
    slideNumber: 2,
    act: 'ACT 1: THE MYSTERY BEGINS',
    title: 'What Is a Mathematical Function?',
    subtitle: 'The Golden Law: One Input → Exactly One Output',
    objective: 'Define a mathematical function as a special relationship where every input produces exactly one predictable output.',
    character: 'professor',
    speechBubble: 'Listen closely, Sajeev! A true function is 100% reliable: feed it a specific input, and it ALWAYS produces one—and only one—output!',
    visualType: 'definition-map',
    mathHighlight: {
      equation: 'Each Input (x)  ──►  Exactly ONE Output f(x)',
      annotations: [
        { label: 'Domain (Inputs)', detail: 'The set of all valid numbers entering the function', color: 'bg-sky-100 text-slate-900' },
        { label: 'Function Rule', detail: 'The exact mathematical operation applied to the input', color: 'bg-amber-100 text-slate-900' },
        { label: 'Range (Outputs)', detail: 'The resulting values that emerge from the rule', color: 'bg-emerald-100 text-slate-900' }
      ]
    },
    workedSteps: [
      { step: 'Valid Function', math: 'x = 3 ──► Output = 9', note: 'Every time you input 3 into "square the number", you strictly get 9.' },
      { step: 'Allowed Sharing', math: 'x = −3 ──► 9   and   x = 3 ──► 9', note: 'Two different inputs CAN produce the same output—each input still has only one arrow leaving it!' },
      { step: 'Broken Machine (NOT a Function)', math: 'x = 4 ──► 7  OR  12 (Unpredictable!)', note: 'If a single input 4 gives two different outputs, the machine is broken—NOT a function.' }
    ],
    checkpoint: {
      id: 'slide-2-cp',
      prompt: 'Which statement best describes a mathematical function?',
      type: 'choice',
      options: [
        'Every input produces exactly one output',
        'Every input produces at least two different outputs',
        'Only positive numbers can be used as inputs',
        'The output is always larger than the input'
      ],
      acceptedAnswers: ['Every input produces exactly one output'],
      hints: [
        'Think about Professor Algebra’s Golden Law of reliability.',
        'When you press a button on a vending machine, how many specific items should that code map to?'
      ],
      explanation: 'By definition (HSF-IF.A.1), a function assigns each element x in its domain to exactly one element f(x) in its range.',
      skill: 'notation'
    },
    teacherNotes: {
      explanation: 'Emphasize the vending machine analogy: pressing button B4 must always dispense the same item. Two buttons can both dispense water, but one button cannot randomly dispense chips or soda.',
      expectedAnswer: 'Every input produces exactly one output.',
      commonMistakes: 'Confusing "two inputs sharing the same output" (which IS a function, like x²) with "one input giving two outputs" (NOT a function).',
      followUpQuestion: 'Is assigning each student to their birthday a function? What about assigning a birthday to a student?'
    }
  },
  {
    slideNumber: 3,
    act: 'ACT 1: THE MYSTERY BEGINS',
    title: 'Introducing the Function Machine',
    subtitle: 'Inside Captain Input & Output Bot’s Workshop',
    objective: 'Visualize how the Function Machine receives raw numerical inputs, applies an internal processor rule, and ejects the output.',
    character: 'captain',
    speechBubble: 'I load the raw number into the top hopper! Inside the chamber, gears multiply, power up, or add—then Output Bot catches the result!',
    visualType: 'machine-anatomy',
    mathHighlight: {
      equation: '[ INTAKE HOPPER: x ] ──► ⚙️ PROCESSOR CHAMBER ──► [ OUTPUT CHUTE: f(x) ]',
      annotations: [
        { label: 'Step 1: Intake', detail: 'Captain Input drops a number x into the top funnel', color: 'bg-sky-100 text-slate-900' },
        { label: 'Step 2: Chamber', detail: 'The machine replaces x in its algebraic formula', color: 'bg-amber-100 text-slate-900' },
        { label: 'Step 3: Output', detail: 'Output Bot displays the computed number', color: 'bg-emerald-100 text-slate-900' }
      ]
    },
    workedSteps: [
      { step: 'Intake', math: 'Drop in x = 6', note: 'The raw number 6 enters the machine.' },
      { step: 'Internal Gear Rule', math: 'Rule: "Multiply by 2, then subtract 1"', note: 'The processor calculates 2 × 6 − 1.' },
      { step: 'Output Chute', math: '12 − 1 = 11', note: 'Output Bot announces 11!' }
    ],
    checkpoint: {
      id: 'slide-3-cp',
      prompt: 'Captain Input drops 8 into a machine with rule "Divide by 2, then add 9". What number does Output Bot receive?',
      type: 'numeric',
      acceptedAnswers: ['13'],
      hints: [
        'First perform the division: 8 ÷ 2.',
        '8 ÷ 2 = 4. Now add 9 to 4.'
      ],
      explanation: '8 ÷ 2 = 4, and 4 + 9 = 13. The machine transforms input 8 into output 13.',
      skill: 'linear'
    },
    teacherNotes: {
      explanation: 'Walk Sajeev through the three physical parts of the machine diagram so that substitution feels concrete rather than abstract.',
      expectedAnswer: '13 (since 8 / 2 + 9 = 4 + 9 = 13).',
      commonMistakes: 'Adding 2 + 9 first before dividing.',
      followUpQuestion: 'Does the input 8 still exist as 8 after the machine processes it, or has it been transformed into 13?'
    }
  },
  {
    slideNumber: 4,
    act: 'ACT 1: THE MYSTERY BEGINS',
    title: 'Input → Rule → Output Pipeline',
    subtitle: 'Tracking Multiple Numbers Through the Same Rule',
    objective: 'Trace multiple inputs (including zero and negative numbers) through a consistent two-step rule to build an Input-Output table.',
    character: 'bot',
    speechBubble: 'BEEP-BOOP! Whether Captain Input feeds me positive, zero, or negative numbers, my internal rule never changes!',
    visualType: 'io-pipeline',
    mathHighlight: {
      equation: 'x  ──► [ Multiply by 4, then subtract 3 ] ──►  4x − 3',
      annotations: [
        { label: 'When x = 2', detail: '4(2) − 3 = 8 − 3 = 5', color: 'bg-sky-100 text-slate-900' },
        { label: 'When x = 0', detail: '4(0) − 3 = 0 − 3 = −3', color: 'bg-amber-100 text-slate-900' },
        { label: 'When x = −2', detail: '4(−2) − 3 = −8 − 3 = −11', color: 'bg-rose-100 text-slate-900' }
      ]
    },
    workedSteps: [
      { step: 'Positive Input (x = 2)', math: '4(2) − 3 = 5', note: 'Input 2 maps to Output 5.' },
      { step: 'Zero Input (x = 0)', math: '4(0) − 3 = −3', note: 'Multiplying by zero clears the 4x term, leaving −3.' },
      { step: 'Negative Input (x = −2)', math: '4(−2) − 3 = −8 − 3 = −11', note: 'Watch the negative signs carefully: −8 minus 3 moves further left to −11.' }
    ],
    checkpoint: {
      id: 'slide-4-cp',
      prompt: 'Using the same pipeline rule (4x − 3), what is the output when the input is x = −1?',
      type: 'numeric',
      acceptedAnswers: ['-7'],
      hints: [
        'Substitute x = −1 into 4x − 3: calculate 4 × (−1) − 3.',
        '4 × (−1) = −4. Now compute −4 − 3.'
      ],
      explanation: 'Substituting x = −1 gives 4(−1) − 3 = −4 − 3 = −7.',
      skill: 'linear'
    },
    teacherNotes: {
      explanation: 'Highlight how negative inputs behave in linear rules. Wrapping negative inputs in parentheses prevents sign errors.',
      expectedAnswer: '-7',
      commonMistakes: 'Computing -4 - 3 as -1 instead of -7.',
      followUpQuestion: 'What happens to the output each time x increases by 1?'
    }
  },
  {
    slideNumber: 5,
    act: 'ACT 1: THE MYSTERY BEGINS',
    title: 'Discover the Secret Rule!',
    subtitle: 'Case File: Input 4 → Output 14',
    objective: 'Translate a verbal two-step machine rule ("Multiply by 3, then add 2") into an algebraic expression and verify input-output pairs.',
    character: 'fox',
    speechBubble: 'Look at this clue, Sajeev! Captain Input entered 4, the machine multiplied by 3 then added 2, and 14 popped out! Let’s write the secret code!',
    visualType: 'secret-rule',
    mathHighlight: {
      equation: 'Input: 4  ──►  [ Multiply by 3, then add 2 ]  ──►  Output: 14',
      annotations: [
        { label: 'Input Value', detail: 'x = 4', color: 'bg-sky-100 text-slate-900' },
        { label: 'Step 1 (×3)', detail: '3 × 4 = 12', color: 'bg-amber-100 text-slate-900' },
        { label: 'Step 2 (+2)', detail: '12 + 2 = 14', color: 'bg-emerald-100 text-slate-900' }
      ]
    },
    workedSteps: [
      { step: 'Test Input 4', math: '3(4) + 2 = 12 + 2 = 14', note: 'Matches our observation! Input 4 gives Output 14.' },
      { step: 'Generalize for Any Input x', math: '3 · x + 2  =  3x + 2', note: 'Replace the specific number 4 with the variable x.' },
      { step: 'Predict Next Output (x = 10)', math: '3(10) + 2 = 30 + 2 = 32', note: 'Our algebraic rule lets us predict any output instantly!' }
    ],
    checkpoint: {
      id: 'slide-5-cp',
      prompt: 'Using this secret rule (Multiply by 3, then add 2), what is the output when Input = 7?',
      type: 'numeric',
      acceptedAnswers: ['23'],
      hints: [
        'Multiply the input 7 by 3 first.',
        '3 × 7 = 21. Now add 2!'
      ],
      explanation: '3(7) + 2 = 21 + 2 = 23.',
      skill: 'linear'
    },
    teacherNotes: {
      explanation: 'Walk through the exact prompt example: Input: 4, Rule: Multiply by 3, then add 2, Output: 14. Connect verbal operations directly to algebraic notation 3x + 2.',
      expectedAnswer: '23',
      commonMistakes: 'Adding 7 + 2 first (9) and multiplying by 3 (27).',
      followUpQuestion: 'How would the algebraic expression change if the machine added 2 FIRST and then multiplied the entire result by 3?'
    }
  },
  {
    slideNumber: 6,
    act: 'ACT 1: THE MYSTERY BEGINS',
    title: 'Introducing Function Notation',
    subtitle: 'Read It Like a Pro: "f of x equals 3x plus 2"',
    objective: 'Write and read standard function notation f(x) = 3x + 2 accurately.',
    character: 'professor',
    speechBubble: 'Mathematicians don’t draw giant metal machines on exam papers—we write a sleek symbol: f(x) = 3x + 2! Read it aloud as "f of x equals 3x plus 2"!',
    visualType: 'notation-intro',
    mathHighlight: {
      equation: 'f(x) = 3x + 2',
      annotations: [
        { label: 'How to Read f(x)', detail: '"f of x" (or "the value of function f at input x")', color: 'bg-amber-100 text-slate-900' },
        { label: 'When x = 4', detail: 'f(4) = 3(4) + 2 = 14', color: 'bg-sky-100 text-slate-900' },
        { label: 'Compact Record', detail: 'f(4) = 14 shows BOTH the input (4) and output (14) in one statement!', color: 'bg-emerald-100 text-slate-900' }
      ]
    },
    workedSteps: [
      { step: 'General Rule', math: 'f(x) = 3x + 2', note: 'Defines the machine rule for any input x.' },
      { step: 'Substitute x = 4', math: 'f(4) = 3(4) + 2', note: 'Every x on BOTH sides is replaced by 4.' },
      { step: 'Complete Statement', math: 'f(4) = 14', note: 'Read as: "f of 4 equals 14" — input 4 produces output 14.' }
    ],
    checkpoint: {
      id: 'slide-6-cp',
      prompt: 'For f(x) = 3x + 2, calculate the value of f(6).',
      type: 'numeric',
      acceptedAnswers: ['20'],
      hints: [
        'Replace x with 6 in 3x + 2.',
        'Calculate 3(6) + 2 = 18 + 2.'
      ],
      explanation: 'f(6) = 3(6) + 2 = 18 + 2 = 20.',
      skill: 'notation'
    },
    teacherNotes: {
      explanation: 'Have Sajeev say "f of x" and "f of 6 equals 20" out loud. Point out why f(4) = 14 is superior to y = 14: you can still see that 4 was the input!',
      expectedAnswer: '20',
      commonMistakes: 'Leaving x inside the right side, such as writing f(6) = 3x(6) + 2.',
      followUpQuestion: 'If I tell you f(0) = 2, what was the input and what was the output?'
    }
  },
  {
    slideNumber: 7,
    act: 'ACT 1: THE MYSTERY BEGINS',
    title: 'Anatomy of Function Notation: What Do f, x, and f(x) Mean?',
    subtitle: 'Decoding Every Piece of the Equation',
    objective: 'Identify the exact role of f (function name), x (input), f(x) (output), and 3x + 2 (function rule).',
    character: 'fox',
    speechBubble: 'Let’s X-ray the formula f(x) = 3x + 2! Each piece has a specific superhero identity—memorize all four!',
    visualType: 'notation-anatomy',
    mathHighlight: {
      equation: 'f ( x )  =  3x + 2',
      annotations: [
        { label: 'f = Function Name', detail: 'Labels which machine we are using (could be f, g, h, C, P)', color: 'bg-amber-100 text-slate-900' },
        { label: 'x = Input', detail: 'The independent variable dropped into the machine', color: 'bg-sky-100 text-slate-900' },
        { label: 'f(x) = Output', detail: 'The entire symbol f(x) represents the final output value (same role as y)', color: 'bg-emerald-100 text-slate-900' },
        { label: '3x + 2 = Function Rule', detail: 'The algebraic instructions telling us how to compute the output', color: 'bg-purple-100 text-slate-900' }
      ]
    },
    workedSteps: [
      { step: 'Function Name', math: 'f, g, h, p', note: 'Just a name tag so we don’t mix up different machines.' },
      { step: 'Input Variable', math: 'x (inside parentheses)', note: 'Tells you what placeholder variable appears in the rule.' },
      { step: 'Output Symbol', math: 'f(x)', note: 'Represents the resulting output after the rule finishes.' },
      { step: 'Function Rule', math: '3x + 2', note: 'The recipe performed on x.' }
    ],
    checkpoint: {
      id: 'slide-7-cp',
      prompt: 'In the statement g(5) = 19, what is the INPUT and what is the OUTPUT?',
      type: 'choice',
      options: [
        'Input is 5, Output is 19',
        'Input is 19, Output is 5',
        'Input is g, Output is 5',
        'Input is 5, Output is 95'
      ],
      acceptedAnswers: ['Input is 5, Output is 19'],
      hints: [
        'Look inside the parentheses g(5) for the input.',
        'The value that g(5) equals is the final output.'
      ],
      explanation: 'Inside the parentheses is the input (5), and the entire expression g(5) equals the output (19). And g is the function name!',
      skill: 'notation'
    },
    teacherNotes: {
      explanation: 'Ensure Sajeev distinguishes between x (the input) and f(x) (the entire output value). Many students think f is the output—clarify that f is the name, and f(x) is the output.',
      expectedAnswer: 'Input is 5, Output is 19.',
      commonMistakes: 'Thinking f(x) means "f and x" rather than the single output value produced by input x.',
      followUpQuestion: 'In h(t) = 10t - 4, what is the function name, input variable, output symbol, and rule?'
    }
  },
  {
    slideNumber: 8,
    act: 'ACT 1: THE MYSTERY BEGINS',
    title: 'CRITICAL WARNING: The Parentheses Trap!',
    subtitle: 'f(3) Does NOT Mean f × 3!',
    objective: 'Avoid the #1 algebra misconception: recognize that parentheses in f(3) indicate function input, NOT multiplication.',
    character: 'monster',
    speechBubble: 'MWAHAHA! I love tricking Algebra students into thinking f(3) means "f times 3" or dividing both sides by 3! Can Sajeev resist my trap?!',
    visualType: 'warning-trap',
    mathHighlight: {
      equation: '⚠️  f(3)  ≠  f × 3  ⚠️',
      annotations: [
        { label: 'THE TRAP (WRONG)', detail: 'Thinking f is a number and multiplying f × 3', color: 'bg-rose-100 text-slate-900' },
        { label: 'THE TRUTH (RIGHT)', detail: 'f(3) means "the output of function f when the input is 3"', color: 'bg-emerald-100 text-slate-900' },
        { label: 'Context Matters', detail: 'In 5(3), 5 is a number so it multiplies. In f(3), f is a function name!', color: 'bg-amber-100 text-slate-900' }
      ]
    },
    workedSteps: [
      { step: 'Error Monster’s Lie', math: 'If f(3) = 12, then f = 12 ÷ 3 = 4  ❌ WRONG!', note: 'You can NEVER divide by 3 to "solve for f" because f is a function name, not a variable!' },
      { step: 'Hero’s Truth', math: 'f(3) = 12 means: Input = 3, Output = 12  ✅ CORRECT!', note: 'On a graph, this corresponds to the coordinate point (3, 12).' }
    ],
    checkpoint: {
      id: 'slide-8-cp',
      prompt: 'What does the notation f(3) actually mean in Algebra?',
      type: 'choice',
      options: [
        'The output of function f when the input is 3',
        'The variable f multiplied by 3',
        'Add 3 to the function f',
        'Divide the function rule by 3'
      ],
      acceptedAnswers: ['The output of function f when the input is 3'],
      hints: [
        'Remember: f is the name of the machine, not a number you multiply.',
        '3 is the number dropped into the input hopper of function f.'
      ],
      explanation: 'f(3) never means f × 3! It strictly means the output of function f when the input x is 3.',
      skill: 'notation'
    },
    teacherNotes: {
      explanation: 'Pause here and emphasize this warning. In algebra, parentheses usually mean multiplication like 4(3) = 12, which is why students get confused by f(3).',
      expectedAnswer: 'The output of function f when the input is 3.',
      commonMistakes: 'Trying to "isolate f" by dividing by the number inside the parentheses.',
      followUpQuestion: 'Why do we write 2(3) = 6 as multiplication, yet f(3) is not multiplication?'
    }
  },
  {
    slideNumber: 9,
    act: 'ACT 2: MASTER THE FUNCTION MACHINE',
    title: 'Function Notation vs. Ordinary y Notation',
    subtitle: 'y = 2x + 5   is the twin of   f(x) = 2x + 5',
    objective: 'Connect familiar linear equations in y = mx + b form directly to function notation f(x) = mx + b.',
    character: 'professor',
    speechBubble: 'Good news, Sajeev! You already know how to work with y = 2x + 5. Function notation f(x) = 2x + 5 does the exact same math—it just upgrades y into f(x)!',
    visualType: 'y-vs-fx',
    mathHighlight: {
      equation: 'y = 2x + 5     ⇔     f(x) = 2x + 5',
      annotations: [
        { label: 'Old Way (y-notation)', detail: '"Find y when x = 3"  →  y = 2(3) + 5 = 11', color: 'bg-slate-200 text-slate-900' },
        { label: 'Hero Way (f(x) notation)', detail: '"Find f(3)"  →  f(3) = 2(3) + 5 = 11', color: 'bg-amber-100 text-slate-900' },
        { label: 'Coordinate Graph Link', detail: 'Point (x, y) is the exact same point as (x, f(x)) = (3, 11)!', color: 'bg-emerald-100 text-slate-900' }
      ]
    },
    workedSteps: [
      { step: 'Identical Rule', math: 'Both rules multiply x by 2 and add 5', note: 'The calculation on the right-hand side does not change at all.' },
      { step: 'Why Upgrade to f(x)?', math: 'f(3) = 11 tells you x = 3 AND y = 11 at a glance', note: 'Writing "y = 11" alone forgets what input produced 11.' },
      { step: 'Multiple Functions', math: 'f(x), g(x), h(x)', note: 'If you have 3 equations all named "y = ...", you can’t tell them apart!' }
    ],
    checkpoint: {
      id: 'slide-9-cp',
      prompt: 'If f(x) = 2x + 5, what is the y-coordinate on the graph when x = 4?',
      type: 'numeric',
      acceptedAnswers: ['13'],
      hints: [
        'Remember: y = f(x), so the y-coordinate when x = 4 is simply f(4).',
        'Calculate f(4) = 2(4) + 5.'
      ],
      explanation: 'Since y = f(x), when x = 4 we compute f(4) = 2(4) + 5 = 8 + 5 = 13. The coordinate point on the graph is (4, 13).',
      skill: 'linear'
    },
    teacherNotes: {
      explanation: 'Demystify f(x) by showing that y and f(x) are interchangeable for the output value (dependent variable).',
      expectedAnswer: '13 (point (4, 13)).',
      commonMistakes: 'Thinking you have to do something extra after finding 2(4) + 5 = 13.',
      followUpQuestion: 'If a graph of f(x) passes through the point (-2, 1), what is f(-2)?'
    }
  },
  {
    slideNumber: 10,
    act: 'ACT 2: MASTER THE FUNCTION MACHINE',
    title: 'One Input, Three Different Functions!',
    subtitle: 'Evaluate f(x), g(x), and h(x) When x = 4',
    objective: 'Distinguish between multiple named functions (f, g, h) and evaluate each rule using the same input x = 4.',
    character: 'captain',
    speechBubble: 'This is why functions have different names! We have THREE machines in the lab: f, g, and h. Let’s feed x = 4 into all three!',
    visualType: 'multi-function',
    mathHighlight: {
      equation: 'f(x) = 2x + 3   |   g(x) = x² − 1   |   h(x) = 5x',
      annotations: [
        { label: 'Machine f at x = 4', detail: 'f(4) = 2(4) + 3 = 8 + 3 = 11', color: 'bg-sky-100 text-slate-900' },
        { label: 'Machine g at x = 4', detail: 'g(4) = (4)² − 1 = 16 − 1 = 15', color: 'bg-amber-100 text-slate-900' },
        { label: 'Machine h at x = 4', detail: 'h(4) = 5(4) = 20', color: 'bg-emerald-100 text-slate-900' }
      ]
    },
    workedSteps: [
      { step: 'Evaluate f(4)', math: 'f(4) = 2(4) + 3 = 11', note: 'Linear machine f doubles 4 and adds 3.' },
      { step: 'Evaluate g(4)', math: 'g(4) = 4² − 1 = 16 − 1 = 15', note: 'Quadratic machine g squares 4 (16) and subtracts 1.' },
      { step: 'Evaluate h(4)', math: 'h(4) = 5(4) = 20', note: 'Proportional machine h multiplies 4 by 5.' }
    ],
    checkpoint: {
      id: 'slide-10-cp',
      prompt: 'Using the same three functions (f(x) = 2x + 3, g(x) = x² − 1, h(x) = 5x), find g(3).',
      type: 'numeric',
      acceptedAnswers: ['8'],
      hints: [
        'Look at the letter! We need function g, which has the rule g(x) = x² − 1.',
        'Substitute x = 3 into x² − 1: calculate 3² − 1.'
      ],
      explanation: 'We select machine g: g(3) = (3)² − 1 = 9 − 1 = 8.',
      skill: 'quadratic'
    },
    teacherNotes: {
      explanation: 'Point out how function names (f, g, h) prevent confusion. When asked for g(3), Sajeev must first match the letter g to the rule x² - 1.',
      expectedAnswer: '8',
      commonMistakes: 'Plugging 3 into f(x) instead of g(x), or computing 3² as 6 instead of 9.',
      followUpQuestion: 'For x = 4, which of the three functions produced the largest output? What if x = 5?'
    }
  },
  {
    slideNumber: 11,
    act: 'ACT 2: MASTER THE FUNCTION MACHINE',
    title: 'Worked Example: Evaluating a Linear Function',
    subtitle: 'Step-by-Step Substitution: f(x) = 4x − 7, Find f(5)',
    objective: 'Execute flawless 3-step algebraic substitution for linear functions.',
    character: 'fox',
    speechBubble: 'On your Montgomery Township exam, showing clean step-by-step substitution earns full method marks! Watch how we solve f(5) for f(x) = 4x − 7!',
    visualType: 'worked-linear',
    mathHighlight: {
      equation: 'Given f(x) = 4x − 7,  find f(5)',
      annotations: [
        { label: 'Step 1: Substitute in ( )', detail: 'f(5) = 4(5) − 7', color: 'bg-sky-100 text-slate-900' },
        { label: 'Step 2: Multiply First', detail: 'f(5) = 20 − 7', color: 'bg-amber-100 text-slate-900' },
        { label: 'Step 3: Subtract', detail: 'f(5) = 13', color: 'bg-emerald-100 text-slate-900' }
      ]
    },
    workedSteps: [
      { step: '1. Write the Original Rule', math: 'f(x) = 4x − 7', note: 'Identify that every x will be replaced by 5.' },
      { step: '2. Substitute Input in Parentheses', math: 'f(5) = 4(5) − 7', note: 'Always wrap the substituted input in parentheses!' },
      { step: '3. Multiply Then Subtract', math: 'f(5) = 20 − 7 = 13', note: 'Final answer: f(5) = 13.' }
    ],
    checkpoint: {
      id: 'slide-11-cp',
      prompt: 'Your turn! Using the same linear function f(x) = 4x − 7, find f(3).',
      type: 'numeric',
      acceptedAnswers: ['5'],
      hints: [
        'Substitute x = 3 into f(x) = 4x − 7: write 4(3) − 7.',
        '4 × 3 = 12. Now compute 12 − 7.'
      ],
      explanation: 'f(3) = 4(3) − 7 = 12 − 7 = 5.',
      skill: 'linear'
    },
    teacherNotes: {
      explanation: 'Model the habit of putting parentheses around substituted values: 4(5) - 7. This habit becomes critical when substituting negatives or expressions like (a + 2).',
      expectedAnswer: '5',
      commonMistakes: 'Writing 45 - 7 instead of 4(5) - 7.',
      followUpQuestion: 'What is f(-2) for this same function f(x) = 4x - 7?'
    }
  },
  {
    slideNumber: 12,
    act: 'ACT 2: MASTER THE FUNCTION MACHINE',
    title: 'Worked Example: Evaluating a Quadratic Function',
    subtitle: 'Multi-Term Substitution: g(x) = x² + 3x − 4, Find g(2)',
    objective: 'Substitute an input into every occurrence of x in a quadratic trinomial and apply PEMDAS accurately.',
    character: 'professor',
    speechBubble: 'Look closely at g(x) = x² + 3x − 4! The variable x appears TWICE on the right side—so you must plug 2 into BOTH places!',
    visualType: 'worked-quadratic',
    mathHighlight: {
      equation: 'Given g(x) = x² + 3x − 4,  find g(2)',
      annotations: [
        { label: 'Step 1: Replace EVERY x', detail: 'g(2) = (2)² + 3(2) − 4', color: 'bg-sky-100 text-slate-900' },
        { label: 'Step 2: Exponents & Multiply', detail: 'g(2) = 4 + 6 − 4', color: 'bg-amber-100 text-slate-900' },
        { label: 'Step 3: Combine Terms', detail: 'g(2) = 6', color: 'bg-emerald-100 text-slate-900' }
      ]
    },
    workedSteps: [
      { step: '1. Write the Quadratic Rule', math: 'g(x) = x² + 3x − 4', note: 'Spot both x terms: x² and 3x.' },
      { step: '2. Substitute x = 2 in Both Places', math: 'g(2) = (2)² + 3(2) − 4', note: 'Never forget the second x!' },
      { step: '3. Exponents, Multiply, then Add/Subtract', math: 'g(2) = 4 + 6 − 4 = 6', note: '4 + 6 = 10, and 10 − 4 = 6.' }
    ],
    checkpoint: {
      id: 'slide-12-cp',
      prompt: 'Using g(x) = x² + 3x − 4, find g(3).',
      type: 'numeric',
      acceptedAnswers: ['14'],
      hints: [
        'Substitute 3 into both x positions: g(3) = (3)² + 3(3) − 4.',
        '(3)² = 9 and 3(3) = 9. Now calculate 9 + 9 − 4.'
      ],
      explanation: 'g(3) = (3)² + 3(3) − 4 = 9 + 9 − 4 = 14.',
      skill: 'quadratic'
    },
    teacherNotes: {
      explanation: 'Point out that when a variable appears multiple times in a function rule, the same input value replaces every single x.',
      expectedAnswer: '14',
      commonMistakes: 'Only substituting into x² and leaving 3x unevaluated, or calculating 3² as 6.',
      followUpQuestion: 'How would you evaluate g(-2) for g(x) = x² + 3x - 4? Watch (-2)² = +4!'
    }
  },
  {
    slideNumber: 13,
    act: 'ACT 2: MASTER THE FUNCTION MACHINE',
    title: 'Team-Up Combo: Combining Two Functions!',
    subtitle: 'f(x) = 3x + 2  and  g(x) = x² + 1  →  Find f(4) + g(4)',
    objective: 'Evaluate two separate functions independently and combine their outputs using arithmetic operations.',
    character: 'bot',
    speechBubble: 'DOUBLE-MACHINE POWER COMBO! To find f(4) + g(4), compute f(4) first, compute g(4) second, and then add their two outputs together!',
    visualType: 'combined-functions',
    mathHighlight: {
      equation: 'Find f(4) + g(4)   where   f(x) = 3x + 2   and   g(x) = x² + 1',
      annotations: [
        { label: 'Part A: Evaluate f(4)', detail: 'f(4) = 3(4) + 2 = 12 + 2 = 14', color: 'bg-sky-100 text-slate-900' },
        { label: 'Part B: Evaluate g(4)', detail: 'g(4) = (4)² + 1 = 16 + 1 = 17', color: 'bg-amber-100 text-slate-900' },
        { label: 'Part C: Add Outputs', detail: 'f(4) + g(4) = 14 + 17 = 31', color: 'bg-emerald-100 text-slate-900' }
      ]
    },
    workedSteps: [
      { step: '1. Calculate Machine f Output', math: 'f(4) = 3(4) + 2 = 14', note: 'Machine f produces 14.' },
      { step: '2. Calculate Machine g Output', math: 'g(4) = (4)² + 1 = 16 + 1 = 17', note: 'Machine g produces 17.' },
      { step: '3. Combine the Results', math: 'f(4) + g(4) = 14 + 17 = 31', note: 'Simply add the two outputs: 14 + 17 = 31!' }
    ],
    checkpoint: {
      id: 'slide-13-cp',
      prompt: 'Using f(x) = 3x + 2 and g(x) = x² + 1, find f(2) + g(2).',
      type: 'numeric',
      acceptedAnswers: ['13'],
      hints: [
        'First find f(2) = 3(2) + 2 = 8.',
        'Next find g(2) = (2)² + 1 = 5. Now add f(2) + g(2)!'
      ],
      explanation: 'f(2) = 3(2) + 2 = 8, and g(2) = (2)² + 1 = 5. Adding them gives 8 + 5 = 13.',
      skill: 'combined'
    },
    teacherNotes: {
      explanation: 'Break composite expressions like f(4) + g(4), f(3) × g(3), or f(8) - g(8) into three bite-sized sub-steps so Sajeev never feels overwhelmed.',
      expectedAnswer: '13 (since f(2) = 8 and g(2) = 5, 8 + 5 = 13).',
      commonMistakes: 'Adding the inputs (4 + 4 = 8) instead of evaluating each function separately.',
      followUpQuestion: 'What would g(4) - f(4) equal using the values we just found?'
    }
  },
  {
    slideNumber: 14,
    act: 'ACT 2: MASTER THE FUNCTION MACHINE',
    title: 'Reverse the Function Machine!',
    subtitle: 'f(x) = 5x − 3  →  Find x When f(x) = 22',
    objective: 'Distinguish between finding an output (given x) and finding a missing input (given f(x)) by solving an algebraic equation.',
    character: 'fox',
    speechBubble: 'Plot twist, Sajeev! What if we already know the OUTPUT is 22, and we need to find the secret INPUT x? We run the Function Machine in REVERSE!',
    visualType: 'reverse-machine',
    mathHighlight: {
      equation: 'Given f(x) = 5x − 3  and  f(x) = 22,  find x',
      annotations: [
        { label: 'Step 1: Set Rule = Output', detail: '5x − 3 = 22  (Do NOT plug 22 into x!)', color: 'bg-rose-100 text-slate-900' },
        { label: 'Step 2: Undo Subtraction (+3)', detail: '5x = 22 + 3  ⇒  5x = 25', color: 'bg-amber-100 text-slate-900' },
        { label: 'Step 3: Undo Multiplication (÷5)', detail: 'x = 25 ÷ 5  ⇒  x = 5', color: 'bg-emerald-100 text-slate-900' }
      ]
    },
    workedSteps: [
      { step: 'Key Difference!', math: 'Find f(22) = Plug 22 into x   vs.   f(x) = 22 = Set rule equal to 22', note: '22 is the OUTPUT f(x), not the input x!' },
      { step: 'Set Up Equation', math: '5x − 3 = 22', note: 'Replace the entire symbol f(x) with 22.' },
      { step: 'Solve for x', math: '5x = 25  ⇒  x = 5', note: 'Check: f(5) = 5(5) − 3 = 25 − 3 = 22. Verified!' }
    ],
    checkpoint: {
      id: 'slide-14-cp',
      prompt: 'For f(x) = 5x − 3, find the input x when f(x) = 37.',
      type: 'numeric',
      acceptedAnswers: ['8'],
      hints: [
        'Set the function rule equal to 37: write 5x − 3 = 37.',
        'Add 3 to both sides to get 5x = 40, then divide by 5.'
      ],
      explanation: 'Set 5x − 3 = 37. Add 3 to both sides: 5x = 40. Divide by 5: x = 8. Check: f(8) = 5(8) − 3 = 37!',
      skill: 'reverse'
    },
    teacherNotes: {
      explanation: 'This is the single most tested distinction on Algebra 1 exams: "Find f(22)" vs. "Find x when f(x) = 22". Have Sajeev verbalize why we set 5x - 3 = 22.',
      expectedAnswer: '8',
      commonMistakes: 'Substituting 22 (or 37) in for x instead of replacing f(x).',
      followUpQuestion: 'How can you always verify your answer after solving for the missing input x?'
    }
  }
];
