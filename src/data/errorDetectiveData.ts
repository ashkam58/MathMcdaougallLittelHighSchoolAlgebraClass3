export interface ErrorChallenge {
  id: string;
  code: 'Challenge A' | 'Challenge B' | 'Challenge C' | 'Challenge D';
  title: string;
  functionRule: string;
  monsterClaim: string;
  monsterTaunt: string;
  part1Prompt: string;
  part1Options: string[];
  part1Correct: string;
  part2Prompt: string;
  part2Type: 'numeric' | 'choice';
  part2Options?: string[];
  part2Accepted: string[];
  clues: string[];
  victoryExplanation: string;
}

export const ERROR_CHALLENGES: ErrorChallenge[] = [
  {
    id: 'err-a',
    code: 'Challenge A',
    title: 'The Missing Second x Bug!',
    functionRule: 'f(x) = 2x² + 3x',
    monsterClaim: 'f(3) = 2(3² + 3) = 24',
    monsterTaunt: 'BWAHAHA! I factored out the 2 from 3x and forgot to multiply 3 by x = 3! Will Sajeev spot my sneaky algebra bug?!',
    part1Prompt: 'Step 1: Identify the exact mistake in the student’s calculation f(3) = 2(3² + 3):',
    part1Options: [
      'They failed to multiply 3 by the input 3 in the second term (3x should be 3 × 3, not grouped inside 2(...))',
      'They squared 3 instead of cubing 3',
      'They forgot to divide the final answer by 3',
      'There is no mistake; 24 is correct'
    ],
    part1Correct: 'They failed to multiply 3 by the input 3 in the second term (3x should be 3 × 3, not grouped inside 2(...))',
    part2Prompt: 'Step 2: Calculate the CORRECT numerical value of f(3) for f(x) = 2x² + 3x:',
    part2Type: 'numeric',
    part2Accepted: ['27'],
    clues: [
      'Look closely at the second term + 3x when x = 3: it must be 3(3) = 9!',
      'Compute the first term: 2(3)² = 2(9) = 18. Now add the second term 3(3) = 9: 18 + 9 = 27!'
    ],
    victoryExplanation: 'BUG SQUASHED! In f(x) = 2x² + 3x, only x² is multiplied by 2, and the second term is 3x. Substituting x = 3 gives f(3) = 2(3)² + 3(3) = 2(9) + 9 = 18 + 9 = 27!'
  },
  {
    id: 'err-b',
    code: 'Challenge B',
    title: 'The Notation Scramble!',
    functionRule: 'g(x) = 5x − 10',
    monsterClaim: 'g(4) = g + 4',
    monsterTaunt: 'HEE-HEE! Why bother using the rule 5x − 10 when I can just turn g(4) into g + 4?!',
    part1Prompt: 'Step 1: Explain the notation error in writing g(4) = g + 4:',
    part1Options: [
      'g is the function name, not a variable! g(4) means substitute x = 4 into the rule 5x − 10',
      'They should have written g × 4 instead of g + 4',
      'They should have divided g by 4',
      'They should have added 10 to g'
    ],
    part1Correct: 'g is the function name, not a variable! g(4) means substitute x = 4 into the rule 5x − 10',
    part2Prompt: 'Step 2: What is the actual numerical value of g(4) for g(x) = 5x − 10?',
    part2Type: 'numeric',
    part2Accepted: ['10'],
    clues: [
      'g is the name of the function machine, NOT a number or variable you can add to 4.',
      'Plug x = 4 into the rule 5x − 10: calculate 5(4) − 10.'
    ],
    victoryExplanation: 'NOTATION RESCUED! g(4) means "the output of function g when input x = 4". Substituting 4 into 5x − 10 gives g(4) = 5(4) − 10 = 20 − 10 = 10!'
  },
  {
    id: 'err-c',
    code: 'Challenge C',
    title: 'The Clash of Two Students!',
    functionRule: 'f(x) = x² + 2',
    monsterClaim: 'Student A says f(3) = 11.   |   Student B says f(3) = 15.',
    monsterTaunt: 'One student followed Order of Operations, and the other fell into my trap by adding 3 + 2 before squaring or miscalculating! Who is right?',
    part1Prompt: 'Step 1: Who is correct, Student A (f(3) = 11) or Student B (f(3) = 15), and why?',
    part1Options: [
      'Student A is correct because 3² + 2 = 9 + 2 = 11',
      'Student B is correct because (3 + 2) × 3 = 15',
      'Both students are wrong because 3² is 6, so 6 + 2 = 8',
      'Both students are right because functions can have two outputs'
    ],
    part1Correct: 'Student A is correct because 3² + 2 = 9 + 2 = 11',
    part2Prompt: 'Step 2: Confirm the correct output value of f(3) for f(x) = x² + 2:',
    part2Type: 'numeric',
    part2Accepted: ['11'],
    clues: [
      'Substitute x = 3 into x² + 2: write (3)² + 2.',
      '3² = 3 × 3 = 9, and 9 + 2 = 11!'
    ],
    victoryExplanation: 'CASE CLOSED! Student A is 100% correct: f(3) = 3² + 2 = 9 + 2 = 11. Student B did not follow the rule x² + 2.'
  },
  {
    id: 'err-d',
    code: 'Challenge D',
    title: 'The Input vs. Output Identity Crisis!',
    functionRule: 'f(x) = 3x + 1   |   Given: f(a) = 16',
    monsterClaim: 'f(16) and f(a) = 16 are the exact same thing!',
    monsterTaunt: 'Wait—is 16 the INPUT or the OUTPUT?! If I confuse Sajeev between f(16) and f(a) = 16, my plan succeeds!',
    part1Prompt: 'Step 1: Explain the difference between f(16) and f(a) = 16:',
    part1Options: [
      'In f(16), 16 is the INPUT (so output = 49); in f(a) = 16, 16 is the OUTPUT (so we solve 3a + 1 = 16)',
      'In f(16), 16 is the output; in f(a) = 16, 16 is the input',
      'Both mean multiply f by 16',
      'There is no difference between them'
    ],
    part1Correct: 'In f(16), 16 is the INPUT (so output = 49); in f(a) = 16, 16 is the OUTPUT (so we solve 3a + 1 = 16)',
    part2Prompt: 'Step 2: Solve for the missing input a when f(a) = 16 (where f(x) = 3x + 1):',
    part2Type: 'numeric',
    part2Accepted: ['5'],
    clues: [
      'Since f(a) = 16, set the rule equal to 16: 3a + 1 = 16.',
      'Subtract 1 from both sides: 3a = 15. Divide by 3 to find a!'
    ],
    victoryExplanation: 'ULTIMATE DETECTIVE VICTORY! When f(a) = 16, 16 is the output: 3a + 1 = 16 ⇒ 3a = 15 ⇒ a = 5. By contrast, f(16) uses 16 as the input: 3(16) + 1 = 49!'
  }
];

export interface ExamPart {
  id: string;
  partLabel: string;
  prompt: string;
  marks: number;
  autoGradable: boolean;
  inputPlaceholder: string;
  acceptedAnswers: string[];
  modelAnswer: string;
  workingExplanation: string;
}

export interface ExamQuestion {
  id: string;
  numberLabel: string;
  title: string;
  totalMarks: number;
  equationBanner: string;
  contextText?: string;
  parts: ExamPart[];
}

export const EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 'exam-q1',
    numberLabel: 'Q1',
    title: 'Function Evaluation',
    totalMarks: 3,
    equationBanner: 'f(x) = 2x + 9',
    parts: [
      {
        id: 'q1a',
        partLabel: 'a',
        prompt: 'Find f(6).',
        marks: 1,
        autoGradable: true,
        inputPlaceholder: 'Enter numerical value...',
        acceptedAnswers: ['21'],
        modelAnswer: '21',
        workingExplanation: 'f(6) = 2(6) + 9 = 12 + 9 = 21.'
      },
      {
        id: 'q1b',
        partLabel: 'b',
        prompt: 'Find f(a).',
        marks: 1,
        autoGradable: true,
        inputPlaceholder: 'e.g. 2a + 9',
        acceptedAnswers: ['2a+9'],
        modelAnswer: '2a + 9',
        workingExplanation: 'Replace x with a: f(a) = 2a + 9.'
      },
      {
        id: 'q1c',
        partLabel: 'c',
        prompt: 'Find and simplify f(a + 2).',
        marks: 1,
        autoGradable: true,
        inputPlaceholder: 'e.g. 2a + 13',
        acceptedAnswers: ['2a+13', '2(a+2)+9'],
        modelAnswer: '2a + 13',
        workingExplanation: 'f(a + 2) = 2(a + 2) + 9 = 2a + 4 + 9 = 2a + 13.'
      }
    ]
  },
  {
    id: 'exam-q2',
    numberLabel: 'Q2',
    title: 'Quadratic Function',
    totalMarks: 2,
    equationBanner: 'p(x) = x² − 4x + 7',
    parts: [
      {
        id: 'q2a',
        partLabel: 'a',
        prompt: 'Calculate p(3).',
        marks: 2,
        autoGradable: true,
        inputPlaceholder: 'Enter numerical value...',
        acceptedAnswers: ['4'],
        modelAnswer: '4',
        workingExplanation: 'p(3) = (3)² − 4(3) + 7 = 9 − 12 + 7 = 4.'
      }
    ]
  },
  {
    id: 'exam-q3',
    numberLabel: 'Q3',
    title: 'Find the Input',
    totalMarks: 3,
    equationBanner: 'g(x) = 5x − 6',
    parts: [
      {
        id: 'q3a',
        partLabel: 'a',
        prompt: 'If g(a) = 24, find the value of a.',
        marks: 3,
        autoGradable: true,
        inputPlaceholder: 'a = ...',
        acceptedAnswers: ['6'],
        modelAnswer: '6',
        workingExplanation: 'Set 5a − 6 = 24 ⇒ 5a = 30 ⇒ a = 6.'
      }
    ]
  },
  {
    id: 'exam-q4',
    numberLabel: 'Q4',
    title: 'Real-World Application: Delivery Company',
    totalMarks: 4,
    equationBanner: 'C(n) = 8n + 15',
    contextText: 'A delivery company charges a $15 fixed fee and $8 per kilometre (n).',
    parts: [
      {
        id: 'q4a',
        partLabel: 'a',
        prompt: 'Explain in words what C(n) represents (1 mark — Teacher reviewable).',
        marks: 1,
        autoGradable: false,
        inputPlaceholder: 'Explain what C(n) represents...',
        acceptedAnswers: ['cost', 'charge', 'total', 'kilometre', 'kilometer', 'delivery', 'distance'],
        modelAnswer: 'The total delivery charge (in dollars) for a distance of n kilometres.',
        workingExplanation: 'C(n) represents the total delivery cost in dollars for travelling n kilometres, including the $15 fixed fee.'
      },
      {
        id: 'q4b',
        partLabel: 'b',
        prompt: 'Calculate C(5). (1 mark)',
        marks: 1,
        autoGradable: true,
        inputPlaceholder: 'Enter dollar amount...',
        acceptedAnswers: ['55', '$55'],
        modelAnswer: '55 (or $55)',
        workingExplanation: 'C(5) = 8(5) + 15 = 40 + 15 = $55.'
      },
      {
        id: 'q4c',
        partLabel: 'c',
        prompt: 'Find the distance (n in km) if the total charge is $103. (2 marks)',
        marks: 2,
        autoGradable: true,
        inputPlaceholder: 'n = ...',
        acceptedAnswers: ['11', '11km'],
        modelAnswer: '11 km',
        workingExplanation: 'Set 8n + 15 = 103 ⇒ 8n = 88 ⇒ n = 11 kilometres.'
      }
    ]
  },
  {
    id: 'exam-q5',
    numberLabel: 'Q5',
    title: 'Comparing Functions',
    totalMarks: 4,
    equationBanner: 'f(x) = 2x + 1     and     g(x) = x + 7',
    parts: [
      {
        id: 'q5a',
        partLabel: 'a',
        prompt: 'Find f(4). (1 mark)',
        marks: 1,
        autoGradable: true,
        inputPlaceholder: 'f(4) = ...',
        acceptedAnswers: ['9'],
        modelAnswer: '9',
        workingExplanation: 'f(4) = 2(4) + 1 = 8 + 1 = 9.'
      },
      {
        id: 'q5b',
        partLabel: 'b',
        prompt: 'Find g(4). (1 mark)',
        marks: 1,
        autoGradable: true,
        inputPlaceholder: 'g(4) = ...',
        acceptedAnswers: ['11'],
        modelAnswer: '11',
        workingExplanation: 'g(4) = 4 + 7 = 11.'
      },
      {
        id: 'q5c',
        partLabel: 'c',
        prompt: 'Find x when f(x) = g(x). (2 marks)',
        marks: 2,
        autoGradable: true,
        inputPlaceholder: 'x = ...',
        acceptedAnswers: ['6'],
        modelAnswer: '6',
        workingExplanation: 'Set 2x + 1 = x + 7. Subtract x from both sides: x + 1 = 7. Subtract 1: x = 6. (Check: f(6) = 13 and g(6) = 13!)'
      }
    ]
  },
  {
    id: 'exam-q6',
    numberLabel: 'Q6',
    title: 'Find and Correct the Mistake',
    totalMarks: 3,
    equationBanner: 'h(x) = 3x² + 2   |   Student wrote: h(2) = (3 × 2)² + 2 = 38',
    parts: [
      {
        id: 'q6a',
        partLabel: 'a',
        prompt: 'Explain the student’s mistake in writing (3 × 2)² + 2 (1 mark — Teacher reviewable).',
        marks: 1,
        autoGradable: false,
        inputPlaceholder: 'Describe the order of operations mistake...',
        acceptedAnswers: ['exponent', 'square', 'multiply', 'order', '3', 'first', 'pemdas', 'bodmas'],
        modelAnswer: 'The student multiplied 3 × 2 before squaring. By Order of Operations (PEMDAS), only x = 2 should be squared first: 3 × (2)².',
        workingExplanation: 'In 3x², the exponent 2 applies ONLY to x, not to 3. You must square 2 first (2² = 4) and then multiply by 3.'
      },
      {
        id: 'q6b',
        partLabel: 'b',
        prompt: 'Calculate the correct value of h(2). (2 marks)',
        marks: 2,
        autoGradable: true,
        inputPlaceholder: 'Correct h(2) = ...',
        acceptedAnswers: ['14'],
        modelAnswer: '14',
        workingExplanation: 'h(2) = 3(2)² + 2 = 3(4) + 2 = 12 + 2 = 14.'
      }
    ]
  },
  {
    id: 'exam-q7',
    numberLabel: 'Q7',
    title: 'Interpret Function Notation',
    totalMarks: 1,
    equationBanner: 'f(4) = 17',
    parts: [
      {
        id: 'q7a',
        partLabel: 'a',
        prompt: 'Explain clearly what the mathematical statement f(4) = 17 means (1 mark — Teacher reviewable).',
        marks: 1,
        autoGradable: false,
        inputPlaceholder: 'When the input is 4...',
        acceptedAnswers: ['input', 'output', '4', '17', 'when'],
        modelAnswer: 'When the input x to function f is 4, the output f(4) is 17.',
        workingExplanation: '4 is the input value (domain element) dropped into function f, and 17 is the resulting output value (range element).'
      }
    ]
  }
];

export interface HomeworkProblem {
  id: string;
  number: number;
  section: string;
  equation: string;
  prompt: string;
  acceptedAnswers: string[];
  hint: string;
  solution: string;
}

export const HOMEWORK_PROBLEMS: HomeworkProblem[] = [
  {
    id: 'hw-1',
    number: 1,
    section: 'Part A: Core Evaluation (McDougal Littell §1.7 / §4.2)',
    equation: 'f(x) = 6x − 9',
    prompt: 'Evaluate f(4).',
    acceptedAnswers: ['15'],
    hint: 'Substitute x = 4: 6(4) − 9.',
    solution: 'f(4) = 6(4) − 9 = 24 − 9 = 15.'
  },
  {
    id: 'hw-2',
    number: 2,
    section: 'Part A: Core Evaluation (McDougal Littell §1.7 / §4.2)',
    equation: 'g(x) = −3x + 14',
    prompt: 'Evaluate g(−2).',
    acceptedAnswers: ['20'],
    hint: 'Watch the negative signs! (−3)(−2) = +6, then add 14.',
    solution: 'g(−2) = −3(−2) + 14 = 6 + 14 = 20.'
  },
  {
    id: 'hw-3',
    number: 3,
    section: 'Part B: Quadratic & Multi-Term Functions',
    equation: 'h(x) = x² − 6x + 10',
    prompt: 'Evaluate h(5).',
    acceptedAnswers: ['5'],
    hint: 'Substitute x = 5 in both places: (5)² − 6(5) + 10.',
    solution: 'h(5) = 25 − 30 + 10 = 5.'
  },
  {
    id: 'hw-4',
    number: 4,
    section: 'Part B: Quadratic & Multi-Term Functions',
    equation: 'p(x) = 3x² − 5',
    prompt: 'Evaluate p(−3).',
    acceptedAnswers: ['22'],
    hint: 'Square −3 first: (−3)² = +9. Then multiply by 3 and subtract 5.',
    solution: 'p(−3) = 3(−3)² − 5 = 3(9) − 5 = 27 − 5 = 22.'
  },
  {
    id: 'hw-5',
    number: 5,
    section: 'Part C: Algebraic & Combined Functions',
    equation: 'f(x) = 5x − 4',
    prompt: 'Find and simplify f(a + 3).',
    acceptedAnswers: ['5a+11', '5(a+3)-4'],
    hint: 'Write 5(a + 3) − 4, distribute the 5, and combine 15 − 4.',
    solution: 'f(a + 3) = 5(a + 3) − 4 = 5a + 15 − 4 = 5a + 11.'
  },
  {
    id: 'hw-6',
    number: 6,
    section: 'Part C: Algebraic & Combined Functions',
    equation: 'f(x) = 2x + 3   and   g(x) = x² − 2',
    prompt: 'Find f(4) + g(4).',
    acceptedAnswers: ['25'],
    hint: 'f(4) = 2(4) + 3 = 11, and g(4) = 4² − 2 = 14. Add 11 + 14!',
    solution: 'f(4) = 11 and g(4) = 14, so f(4) + g(4) = 11 + 14 = 25.'
  },
  {
    id: 'hw-7',
    number: 7,
    section: 'Part D: Reverse Machine & Real-World Modelling',
    equation: 'k(x) = 7x − 11',
    prompt: 'Find the input x when k(x) = 45.',
    acceptedAnswers: ['8'],
    hint: 'Set 7x − 11 = 45. Add 11 to both sides (7x = 56), then divide by 7.',
    solution: '7x − 11 = 45 ⇒ 7x = 56 ⇒ x = 8.'
  },
  {
    id: 'hw-8',
    number: 8,
    section: 'Part D: Reverse Machine & Real-World Modelling',
    equation: 'M(h) = 18h + 25  (Tutoring Pay in $ for h hours plus $25 bonus)',
    prompt: 'How many hours (h) did Sajeev tutor if he earned $115?',
    acceptedAnswers: ['5'],
    hint: 'Set 18h + 25 = 115, subtract 25, then divide by 18.',
    solution: '18h + 25 = 115 ⇒ 18h = 90 ⇒ h = 5 hours.'
  }
];
