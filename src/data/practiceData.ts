import { CharacterId } from './slidesData';

export interface PracticeQuestion {
  id: string;
  level: 1 | 2 | 3 | 4;
  groupTitle?: string;
  numberLabel: string;
  equationDisplay: string;
  prompt: string;
  inputPlaceholder: string;
  type: 'numeric' | 'expression' | 'choice';
  options?: string[];
  acceptedAnswers: string[];
  hints: string[];
  explanation: string;
  character: CharacterId;
  skill: 'notation' | 'linear' | 'quadratic' | 'combined' | 'reverse' | 'realworld';
}

export interface RealWorldScenario {
  id: string;
  title: string;
  subtitle: string;
  formula: string;
  contextDescription: string;
  badgeText: string;
  character: CharacterId;
  accentColor: string;
  questions: PracticeQuestion[];
}

export interface WorkedExampleItem {
  id: string;
  title: string;
  category: string;
  problemStatement: string;
  givenEquation: string;
  goalText: string;
  character: CharacterId;
  characterTip: string;
  steps: {
    stepNumber: number;
    title: string;
    algebra: string;
    reason: string;
    interactivePrompt: string;
    interactiveExpected: string[];
  }[];
}

export const WORKED_EXAMPLES: WorkedExampleItem[] = [
  {
    id: 'we-linear',
    title: 'Example 1: Linear Function Evaluation',
    category: 'Linear Substitution',
    problemStatement: 'Evaluate f(5) for the linear function f(x) = 4x − 7.',
    givenEquation: 'f(x) = 4x − 7',
    goalText: 'Find f(5)',
    character: 'fox',
    characterTip: 'Always put parentheses around your substituted number before multiplying!',
    steps: [
      {
        stepNumber: 1,
        title: 'Substitute Input x = 5',
        algebra: 'f(5) = 4(5) − 7',
        reason: 'Replace every x with (5) so we see the multiplication clearly.',
        interactivePrompt: 'What is 4 × 5?',
        interactiveExpected: ['20']
      },
      {
        stepNumber: 2,
        title: 'Multiply First (PEMDAS)',
        algebra: 'f(5) = 20 − 7',
        reason: 'Multiplication comes before subtraction.',
        interactivePrompt: 'Now subtract: what is 20 − 7?',
        interactiveExpected: ['13']
      },
      {
        stepNumber: 3,
        title: 'State the Final Output',
        algebra: 'f(5) = 13',
        reason: 'When the input x is 5, the output of function f is 13.',
        interactivePrompt: 'What coordinate point (x, y) does f(5) = 13 represent? Type the y-value:',
        interactiveExpected: ['13']
      }
    ]
  },
  {
    id: 'we-quadratic',
    title: 'Example 2: Quadratic Function Evaluation',
    category: 'Quadratic Trinomial',
    problemStatement: 'Evaluate g(2) for the quadratic function g(x) = x² + 3x − 4.',
    givenEquation: 'g(x) = x² + 3x − 4',
    goalText: 'Find g(2)',
    character: 'professor',
    characterTip: 'Watch out! The variable x appears in TWO places—substitute 2 into both x² and 3x!',
    steps: [
      {
        stepNumber: 1,
        title: 'Substitute x = 2 into Every x Term',
        algebra: 'g(2) = (2)² + 3(2) − 4',
        reason: 'Both the squared term and the linear term receive the input 2.',
        interactivePrompt: 'Evaluate the exponent first: what is (2)²?',
        interactiveExpected: ['4']
      },
      {
        stepNumber: 2,
        title: 'Evaluate Exponent and Multiplication',
        algebra: 'g(2) = 4 + 6 − 4',
        reason: '(2)² = 4 and 3(2) = 6.',
        interactivePrompt: 'Combine 4 + 6 − 4 to find g(2):',
        interactiveExpected: ['6']
      }
    ]
  },
  {
    id: 'we-algebraic-input',
    title: 'Example 3: Evaluating with an Algebraic Input f(a + 2)',
    category: 'Exam-Style Algebraic Input',
    problemStatement: 'Given f(x) = 3x + 8, find and simplify f(a + 2).',
    givenEquation: 'f(x) = 3x + 8',
    goalText: 'Find f(a + 2)',
    character: 'bot',
    characterTip: 'Treat the entire expression (a + 2) as a single package dropped into the x hopper!',
    steps: [
      {
        stepNumber: 1,
        title: 'Replace x with (a + 2) in Parentheses',
        algebra: 'f(a + 2) = 3(a + 2) + 8',
        reason: 'The whole input (a + 2) must be multiplied by 3 using the Distributive Property.',
        interactivePrompt: 'Distribute 3 across (a + 2): what is 3 × 2?',
        interactiveExpected: ['6']
      },
      {
        stepNumber: 2,
        title: 'Distribute and Combine Like Terms',
        algebra: 'f(a + 2) = 3a + 6 + 8  ⇒  3a + 14',
        reason: 'Add the constant terms 6 + 8 = 14.',
        interactivePrompt: 'Write the simplified expression for f(a + 2):',
        interactiveExpected: ['3a+14']
      }
    ]
  },
  {
    id: 'we-reverse',
    title: 'Example 4: Reversing the Machine to Find Input x',
    category: 'Reverse Evaluation',
    problemStatement: 'Given f(x) = 5x − 3, find the input x when f(x) = 22.',
    givenEquation: 'f(x) = 5x − 3',
    goalText: 'Find x when f(x) = 22',
    character: 'captain',
    characterTip: 'We know the output is 22! Set the rule equal to 22 and use inverse operations!',
    steps: [
      {
        stepNumber: 1,
        title: 'Set the Function Rule Equal to 22',
        algebra: '5x − 3 = 22',
        reason: 'Since f(x) = 22, we replace f(x) with 22.',
        interactivePrompt: 'Add 3 to both sides: what does 5x equal?',
        interactiveExpected: ['25']
      },
      {
        stepNumber: 2,
        title: 'Divide Both Sides by 5',
        algebra: '5x = 25  ⇒  x = 5',
        reason: '25 ÷ 5 = 5, so the missing input is x = 5.',
        interactivePrompt: 'What is the final value of x?',
        interactiveExpected: ['5']
      }
    ]
  }
];

export const LEVEL_1_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'l1-q1',
    level: 1,
    numberLabel: 'Q1',
    equationDisplay: 'f(x) = 2x + 7',
    prompt: 'Find f(3).',
    inputPlaceholder: 'Enter numerical output...',
    type: 'numeric',
    acceptedAnswers: ['13'],
    hints: [
      'Substitute x = 3 into f(x) = 2x + 7: write 2(3) + 7.',
      'Multiply first: 2 × 3 = 6. Now add 7!'
    ],
    explanation: 'Substitute x = 3: f(3) = 2(3) + 7 = 6 + 7 = 13.',
    character: 'fox',
    skill: 'linear'
  },
  {
    id: 'l1-q2',
    level: 1,
    numberLabel: 'Q2',
    equationDisplay: 'g(x) = 5x − 4',
    prompt: 'Find g(6).',
    inputPlaceholder: 'Enter numerical output...',
    type: 'numeric',
    acceptedAnswers: ['26'],
    hints: [
      'Replace x with 6 in g(x) = 5x − 4: write 5(6) − 4.',
      '5 × 6 = 30. Now subtract 4 from 30.'
    ],
    explanation: 'Substitute x = 6: g(6) = 5(6) − 4 = 30 − 4 = 26.',
    character: 'captain',
    skill: 'linear'
  },
  {
    id: 'l1-q3',
    level: 1,
    numberLabel: 'Q3',
    equationDisplay: 'h(x) = x² + 3',
    prompt: 'Find h(4).',
    inputPlaceholder: 'Enter numerical output...',
    type: 'numeric',
    acceptedAnswers: ['19'],
    hints: [
      'Substitute x = 4 into h(x) = x² + 3: write (4)² + 3.',
      'Remember 4² means 4 × 4 = 16. Now add 3!'
    ],
    explanation: 'Substitute x = 4: h(4) = 4² + 3 = 16 + 3 = 19.',
    character: 'professor',
    skill: 'quadratic'
  },
  {
    id: 'l1-q4',
    level: 1,
    numberLabel: 'Q4',
    equationDisplay: 'p(x) = 4x² − 1',
    prompt: 'Find p(2).',
    inputPlaceholder: 'Enter numerical output...',
    type: 'numeric',
    acceptedAnswers: ['15'],
    hints: [
      'Order of Operations! In 4(2)² − 1, square 2 BEFORE multiplying by 4.',
      '(2)² = 4. Next, 4 × 4 = 16. Finally, 16 − 1.'
    ],
    explanation: 'Evaluate the exponent first: p(2) = 4(2)² − 1 = 4(4) − 1 = 16 − 1 = 15.',
    character: 'bot',
    skill: 'quadratic'
  },
  {
    id: 'l1-q5',
    level: 1,
    numberLabel: 'Q5',
    equationDisplay: 'm(x) = 8x + 2',
    prompt: 'Find m(5).',
    inputPlaceholder: 'Enter numerical output...',
    type: 'numeric',
    acceptedAnswers: ['42'],
    hints: [
      'Substitute x = 5: m(5) = 8(5) + 2.',
      '8 × 5 = 40. Now add 2!'
    ],
    explanation: 'm(5) = 8(5) + 2 = 40 + 2 = 42.',
    character: 'fox',
    skill: 'linear'
  },
  {
    id: 'l1-q6',
    level: 1,
    numberLabel: 'Q6',
    equationDisplay: 'q(x) = 3x² + 2x',
    prompt: 'Find q(2).',
    inputPlaceholder: 'Enter numerical output...',
    type: 'numeric',
    acceptedAnswers: ['16'],
    hints: [
      'Plug x = 2 into BOTH x positions: q(2) = 3(2)² + 2(2).',
      '3(2)² = 3(4) = 12, and 2(2) = 4. Add 12 + 4!'
    ],
    explanation: 'Substitute x = 2 in both terms: q(2) = 3(2)² + 2(2) = 3(4) + 4 = 12 + 4 = 16.',
    character: 'professor',
    skill: 'quadratic'
  },
  {
    id: 'l1-q7',
    level: 1,
    numberLabel: 'Q7',
    equationDisplay: 'r(x) = 10 − x',
    prompt: 'Find r(4).',
    inputPlaceholder: 'Enter numerical output...',
    type: 'numeric',
    acceptedAnswers: ['6'],
    hints: [
      'Replace x with 4 in r(x) = 10 − x.',
      'Calculate 10 − 4.'
    ],
    explanation: 'r(4) = 10 − 4 = 6.',
    character: 'captain',
    skill: 'linear'
  },
  {
    id: 'l1-q8',
    level: 1,
    numberLabel: 'Q8',
    equationDisplay: 't(x) = x² − 5x + 6',
    prompt: 'Find t(3).',
    inputPlaceholder: 'Enter numerical output...',
    type: 'numeric',
    acceptedAnswers: ['0'],
    hints: [
      'Substitute x = 3 into every x: t(3) = (3)² − 5(3) + 6.',
      '3² = 9 and 5(3) = 15. Compute 9 − 15 + 6.'
    ],
    explanation: 't(3) = (3)² − 5(3) + 6 = 9 − 15 + 6 = −6 + 6 = 0. (When a function output is 0, x = 3 is called a zero or root of the function!)',
    character: 'bot',
    skill: 'quadratic'
  },
  {
    id: 'l1-q9',
    level: 1,
    numberLabel: 'Q9',
    equationDisplay: 'f(2) = 11',
    prompt: 'If f(2) = 11, identify the input and the output.',
    inputPlaceholder: 'Select the correct identification...',
    type: 'choice',
    options: [
      'Input = 2, Output = 11',
      'Input = 11, Output = 2',
      'Input = f, Output = 22',
      'Input = 2, Output = 9'
    ],
    acceptedAnswers: ['Input = 2, Output = 11'],
    hints: [
      'The number inside the parentheses f(x) is always the input x.',
      'The result on the other side of the equals sign is the output f(x).'
    ],
    explanation: 'In f(2) = 11, the number inside the parentheses (2) is the input, and the value of f(2) (11) is the output.',
    character: 'fox',
    skill: 'notation'
  },
  {
    id: 'l1-q10',
    level: 1,
    numberLabel: 'Q10',
    equationDisplay: 'g(7) = 20',
    prompt: 'Explain what the mathematical statement g(7) = 20 means.',
    inputPlaceholder: 'Select the exact mathematical meaning...',
    type: 'choice',
    options: [
      'When the input to function g is 7, the output is 20',
      'Variable g multiplied by 7 equals 20',
      'When the input to function g is 20, the output is 7',
      'Function g adds 13 to every number in the universe'
    ],
    acceptedAnswers: ['When the input to function g is 7, the output is 20'],
    hints: [
      'Remember: g is the function name, NOT a variable being multiplied.',
      'What goes into machine g, and what comes out?'
    ],
    explanation: 'g(7) = 20 means that when the input x = 7 is entered into function g, the resulting output value is 20.',
    character: 'professor',
    skill: 'notation'
  }
];

export const LEVEL_2_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'l2-q1a',
    level: 2,
    groupTitle: 'Set 1: Linear & Algebraic Inputs — f(x) = 3x + 8',
    numberLabel: '1a',
    equationDisplay: 'f(x) = 3x + 8',
    prompt: 'Find f(4).',
    inputPlaceholder: 'e.g. 20',
    type: 'numeric',
    acceptedAnswers: ['20'],
    hints: ['Substitute x = 4: f(4) = 3(4) + 8.', '12 + 8 = 20.'],
    explanation: 'f(4) = 3(4) + 8 = 12 + 8 = 20.',
    character: 'fox',
    skill: 'linear'
  },
  {
    id: 'l2-q1b',
    level: 2,
    groupTitle: 'Set 1: Linear & Algebraic Inputs — f(x) = 3x + 8',
    numberLabel: '1b',
    equationDisplay: 'f(x) = 3x + 8',
    prompt: 'Find f(7).',
    inputPlaceholder: 'e.g. 29',
    type: 'numeric',
    acceptedAnswers: ['29'],
    hints: ['Substitute x = 7: f(7) = 3(7) + 8.', '21 + 8 = 29.'],
    explanation: 'f(7) = 3(7) + 8 = 21 + 8 = 29.',
    character: 'fox',
    skill: 'linear'
  },
  {
    id: 'l2-q1c',
    level: 2,
    groupTitle: 'Set 1: Linear & Algebraic Inputs — f(x) = 3x + 8',
    numberLabel: '1c',
    equationDisplay: 'f(x) = 3x + 8',
    prompt: 'Find f(a) in terms of a.',
    inputPlaceholder: 'e.g. 3a + 8',
    type: 'expression',
    acceptedAnswers: ['3a+8'],
    hints: ['Replace the input variable x with the new input letter a.', 'Since x is replaced by a, 3x + 8 becomes 3a + 8.'],
    explanation: 'Replacing x with a directly gives f(a) = 3a + 8.',
    character: 'professor',
    skill: 'notation'
  },
  {
    id: 'l2-q1d',
    level: 2,
    groupTitle: 'Set 1: Linear & Algebraic Inputs — f(x) = 3x + 8',
    numberLabel: '1d',
    equationDisplay: 'f(x) = 3x + 8',
    prompt: 'Find and simplify f(a + 2).',
    inputPlaceholder: 'e.g. 3a + 14',
    type: 'expression',
    acceptedAnswers: ['3a+14', '3(a+2)+8'],
    hints: [
      'Replace x with (a + 2) in parentheses: f(a + 2) = 3(a + 2) + 8.',
      'Distribute the 3: 3a + 6 + 8. Now combine 6 + 8!'
    ],
    explanation: 'Substitute (a + 2) for x: f(a + 2) = 3(a + 2) + 8 = 3a + 6 + 8 = 3a + 14.',
    character: 'professor',
    skill: 'linear'
  },
  {
    id: 'l2-q2a',
    level: 2,
    groupTitle: 'Set 2: Quadratic Evaluation — g(x) = 2x² − 3x + 1',
    numberLabel: '2a',
    equationDisplay: 'g(x) = 2x² − 3x + 1',
    prompt: 'Find g(2).',
    inputPlaceholder: 'Enter numerical output...',
    type: 'numeric',
    acceptedAnswers: ['3'],
    hints: [
      'Substitute x = 2: g(2) = 2(2)² − 3(2) + 1.',
      '2(4) − 6 + 1 = 8 − 6 + 1.'
    ],
    explanation: 'g(2) = 2(2)² − 3(2) + 1 = 2(4) − 6 + 1 = 8 − 6 + 1 = 3.',
    character: 'bot',
    skill: 'quadratic'
  },
  {
    id: 'l2-q2b',
    level: 2,
    groupTitle: 'Set 2: Quadratic Evaluation — g(x) = 2x² − 3x + 1',
    numberLabel: '2b',
    equationDisplay: 'g(x) = 2x² − 3x + 1',
    prompt: 'Find g(4).',
    inputPlaceholder: 'Enter numerical output...',
    type: 'numeric',
    acceptedAnswers: ['21'],
    hints: [
      'Substitute x = 4: g(4) = 2(4)² − 3(4) + 1.',
      '4² = 16, so 2(16) − 12 + 1 = 32 − 12 + 1.'
    ],
    explanation: 'g(4) = 2(4)² − 3(4) + 1 = 2(16) − 12 + 1 = 32 − 12 + 1 = 21.',
    character: 'bot',
    skill: 'quadratic'
  },
  {
    id: 'l2-q2c',
    level: 2,
    groupTitle: 'Set 2: Quadratic Evaluation — g(x) = 2x² − 3x + 1',
    numberLabel: '2c',
    equationDisplay: 'g(x) = 2x² − 3x + 1',
    prompt: 'Find g(5).',
    inputPlaceholder: 'Enter numerical output...',
    type: 'numeric',
    acceptedAnswers: ['36'],
    hints: [
      'Substitute x = 5: g(5) = 2(5)² − 3(5) + 1.',
      '5² = 25, so 2(25) − 15 + 1 = 50 − 15 + 1.'
    ],
    explanation: 'g(5) = 2(5)² − 3(5) + 1 = 2(25) − 15 + 1 = 50 − 15 + 1 = 36.',
    character: 'bot',
    skill: 'quadratic'
  },
  {
    id: 'l2-q3a',
    level: 2,
    groupTitle: 'Set 3: Combining Two Functions — f(x) = x + 6 and g(x) = 3x − 2',
    numberLabel: '3a',
    equationDisplay: 'f(x) = x + 6   |   g(x) = 3x − 2',
    prompt: 'Find f(5) + g(5).',
    inputPlaceholder: 'Enter combined result...',
    type: 'numeric',
    acceptedAnswers: ['24'],
    hints: [
      'First calculate f(5) = 5 + 6 = 11.',
      'Next calculate g(5) = 3(5) − 2 = 13. Now add 11 + 13!'
    ],
    explanation: 'f(5) = 5 + 6 = 11 and g(5) = 3(5) − 2 = 13. Therefore, f(5) + g(5) = 11 + 13 = 24.',
    character: 'captain',
    skill: 'combined'
  },
  {
    id: 'l2-q3b',
    level: 2,
    groupTitle: 'Set 3: Combining Two Functions — f(x) = x + 6 and g(x) = 3x − 2',
    numberLabel: '3b',
    equationDisplay: 'f(x) = x + 6   |   g(x) = 3x − 2',
    prompt: 'Find f(3) × g(3).',
    inputPlaceholder: 'Enter product...',
    type: 'numeric',
    acceptedAnswers: ['63'],
    hints: [
      'First find f(3) = 3 + 6 = 9.',
      'Next find g(3) = 3(3) − 2 = 7. Multiply 9 × 7!'
    ],
    explanation: 'f(3) = 3 + 6 = 9 and g(3) = 3(3) − 2 = 7. Multiplying gives f(3) × g(3) = 9 × 7 = 63.',
    character: 'captain',
    skill: 'combined'
  },
  {
    id: 'l2-q3c',
    level: 2,
    groupTitle: 'Set 3: Combining Two Functions — f(x) = x + 6 and g(x) = 3x − 2',
    numberLabel: '3c',
    equationDisplay: 'f(x) = x + 6   |   g(x) = 3x − 2',
    prompt: 'Find f(8) − g(8).',
    inputPlaceholder: 'Enter difference (watch sign!)...',
    type: 'numeric',
    acceptedAnswers: ['-8'],
    hints: [
      'First find f(8) = 8 + 6 = 14.',
      'Next find g(8) = 3(8) − 2 = 22. Now compute 14 − 22!'
    ],
    explanation: 'f(8) = 8 + 6 = 14 and g(8) = 3(8) − 2 = 22. Subtracting gives f(8) − g(8) = 14 − 22 = −8.',
    character: 'captain',
    skill: 'combined'
  },
  {
    id: 'l2-q4',
    level: 2,
    groupTitle: 'Set 4: Spot & Fix the Student Error!',
    numberLabel: '4',
    equationDisplay: 'f(x) = 4x + 3   |   Student wrote: f(5) = 4x + 3 × 5 = 19',
    prompt: 'The student multiplied the constant 3 by 5 and left x in the formula! What is the CORRECT value of f(5)?',
    inputPlaceholder: 'Enter the correct value of f(5)...',
    type: 'numeric',
    acceptedAnswers: ['23'],
    hints: [
      'The mistake: The student left x alone and multiplied +3 by 5 instead of replacing x with 5!',
      'Replace x with 5: f(5) = 4(5) + 3 = 20 + 3.'
    ],
    explanation: 'Mistake identified: The student failed to substitute 5 in place of x (writing 4x + 3×5). Correct substitution replaces x with 5: f(5) = 4(5) + 3 = 20 + 3 = 23.',
    character: 'monster',
    skill: 'linear'
  }
];

export const LEVEL_3_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'l3-q1',
    level: 3,
    numberLabel: 'Q1',
    equationDisplay: 'f(x) = 4x + 5   |   f(x) = 29',
    prompt: 'Find the missing input x if f(x) = 29.',
    inputPlaceholder: 'x = ...',
    type: 'numeric',
    acceptedAnswers: ['6'],
    hints: [
      'Set the rule equal to the output: 4x + 5 = 29.',
      'Subtract 5 from both sides: 4x = 24. Now divide by 4!'
    ],
    explanation: 'Set 4x + 5 = 29. Subtract 5: 4x = 24. Divide by 4: x = 6. (Check: 4(6) + 5 = 29!)',
    character: 'fox',
    skill: 'reverse'
  },
  {
    id: 'l3-q2',
    level: 3,
    numberLabel: 'Q2',
    equationDisplay: 'g(x) = 3x − 7   |   g(x) = 20',
    prompt: 'Find the missing input x if g(x) = 20.',
    inputPlaceholder: 'x = ...',
    type: 'numeric',
    acceptedAnswers: ['9'],
    hints: [
      'Set the rule equal to 20: 3x − 7 = 20.',
      'Add 7 to both sides: 3x = 27. Now divide by 3!'
    ],
    explanation: 'Set 3x − 7 = 20. Add 7: 3x = 27. Divide by 3: x = 9. (Check: 3(9) − 7 = 20!)',
    character: 'captain',
    skill: 'reverse'
  },
  {
    id: 'l3-q3',
    level: 3,
    numberLabel: 'Q3',
    equationDisplay: 'h(x) = 2x² + 1   |   h(x) = 19',
    prompt: 'Find the positive input x if h(x) = 19.',
    inputPlaceholder: 'Positive x = ...',
    type: 'numeric',
    acceptedAnswers: ['3'],
    hints: [
      'Set 2x² + 1 = 19. Subtract 1 from both sides to get 2x² = 18.',
      'Divide by 2 to get x² = 9. What positive number squared equals 9?'
    ],
    explanation: 'Set 2x² + 1 = 19 ⇒ 2x² = 18 ⇒ x² = 9. The positive square root of 9 is x = 3.',
    character: 'professor',
    skill: 'reverse'
  },
  {
    id: 'l3-q4',
    level: 3,
    numberLabel: 'Q4',
    equationDisplay: 'p(x) = 5x + 10   |   Output = 60',
    prompt: 'Find the input x if the output is 60.',
    inputPlaceholder: 'x = ...',
    type: 'numeric',
    acceptedAnswers: ['10'],
    hints: [
      'Write the equation 5x + 10 = 60.',
      'Subtract 10 from both sides: 5x = 50. Now divide by 5!'
    ],
    explanation: 'Set 5x + 10 = 60 ⇒ 5x = 50 ⇒ x = 10.',
    character: 'bot',
    skill: 'reverse'
  },
  {
    id: 'l3-q5',
    level: 3,
    numberLabel: 'Q5',
    equationDisplay: 'r(x) = x² − 4   |   Output = 21',
    prompt: 'Find the positive input x if the output is 21.',
    inputPlaceholder: 'Positive x = ...',
    type: 'numeric',
    acceptedAnswers: ['5'],
    hints: [
      'Set x² − 4 = 21 and add 4 to both sides.',
      'x² = 25. What positive number squared is 25?'
    ],
    explanation: 'Set x² − 4 = 21 ⇒ x² = 25. Taking the positive square root gives x = 5.',
    character: 'professor',
    skill: 'reverse'
  }
];

export const LEVEL_4_SCENARIOS: RealWorldScenario[] = [
  {
    id: 'rw-cinema',
    title: 'MISSION 1: CINEMA TICKET MACHINE',
    subtitle: 'Starlight IMAX Theater · Montgomery Mall',
    formula: 'C(n) = 12n + 5',
    contextDescription: 'The cinema ticket machine charges a fixed booking fee of $5 plus $12 for each ticket purchased (n).',
    badgeText: 'Linear Cost Model',
    character: 'fox',
    accentColor: 'bg-amber-100',
    questions: [
      {
        id: 'l4-c1',
        level: 4,
        numberLabel: '1a',
        equationDisplay: 'C(n) = 12n + 5',
        prompt: 'What does C(n) represent in this real-world scenario?',
        inputPlaceholder: 'Select meaning...',
        type: 'choice',
        options: [
          'The total cost in dollars for buying n tickets (including the $5 fee)',
          'The number of cinema seats left in row n',
          'The price of 12 buckets of popcorn',
          'The discount given to n moviegoers'
        ],
        acceptedAnswers: ['The total cost in dollars for buying n tickets (including the $5 fee)'],
        hints: ['Look at the units: $12 per ticket times n tickets, plus $5 booking fee.'],
        explanation: 'C(n) is the total cost (in dollars) of purchasing n cinema tickets including the $5 booking fee.',
        character: 'fox',
        skill: 'realworld'
      },
      {
        id: 'l4-c2',
        level: 4,
        numberLabel: '1b',
        equationDisplay: 'C(n) = 12n + 5',
        prompt: 'Calculate C(3) (the total cost in dollars for 3 tickets).',
        inputPlaceholder: 'Enter dollar amount...',
        type: 'numeric',
        acceptedAnswers: ['41', '$41'],
        hints: ['Substitute n = 3: C(3) = 12(3) + 5.', '36 + 5 = 41.'],
        explanation: 'C(3) = 12(3) + 5 = 36 + 5 = $41.',
        character: 'fox',
        skill: 'realworld'
      },
      {
        id: 'l4-c3',
        level: 4,
        numberLabel: '1c',
        equationDisplay: 'C(n) = 12n + 5',
        prompt: 'Calculate C(6) (the total cost in dollars for 6 tickets).',
        inputPlaceholder: 'Enter dollar amount...',
        type: 'numeric',
        acceptedAnswers: ['77', '$77'],
        hints: ['Substitute n = 6: C(6) = 12(6) + 5.', '72 + 5 = 77.'],
        explanation: 'C(6) = 12(6) + 5 = 72 + 5 = $77.',
        character: 'fox',
        skill: 'realworld'
      },
      {
        id: 'l4-c4',
        level: 4,
        numberLabel: '1d',
        equationDisplay: 'C(6) = 77',
        prompt: 'Interpret what the statement C(6) = 77 means in context.',
        inputPlaceholder: 'Select interpretation...',
        type: 'choice',
        options: [
          'Buying 6 cinema tickets costs a total of $77 including the booking fee',
          'Buying 77 cinema tickets costs $6 each',
          'Each ticket costs $77 when you buy 6',
          'The booking fee increases to $77 after 6 minutes'
        ],
        acceptedAnswers: ['Buying 6 cinema tickets costs a total of $77 including the booking fee'],
        hints: ['Input n = 6 is the number of tickets; output C(6) = 77 is the total cost in dollars.'],
        explanation: 'Input n = 6 means 6 tickets, and output C(6) = 77 means the total cost is $77.',
        character: 'fox',
        skill: 'realworld'
      },
      {
        id: 'l4-c5',
        level: 4,
        numberLabel: '1e',
        equationDisplay: 'C(n) = 12n + 5 = 101',
        prompt: 'Find the number of tickets (n) if the total cost is $101.',
        inputPlaceholder: 'n = ...',
        type: 'numeric',
        acceptedAnswers: ['8'],
        hints: ['Set 12n + 5 = 101 and subtract 5 from both sides.', '12n = 96. Now divide 96 by 12!'],
        explanation: '12n + 5 = 101 ⇒ 12n = 96 ⇒ n = 8 tickets.',
        character: 'fox',
        skill: 'realworld'
      }
    ]
  },
  {
    id: 'rw-mobile',
    title: 'MISSION 2: MOBILE DATA PLAN',
    subtitle: 'HeroNet 5G Monthly Data Tracker',
    formula: 'D(n) = 2 + 3n',
    contextDescription: 'A mobile plan includes 2 GB of base data plus 3 GB per extra data pack (n) purchased, or costs $2 base + $3 per GB.',
    badgeText: 'Telecom Rate Function',
    character: 'bot',
    accentColor: 'bg-sky-100',
    questions: [
      {
        id: 'l4-m1',
        level: 4,
        numberLabel: '2a',
        equationDisplay: 'D(n) = 2 + 3n',
        prompt: 'Calculate D(4).',
        inputPlaceholder: 'Enter value...',
        type: 'numeric',
        acceptedAnswers: ['14'],
        hints: ['Substitute n = 4: D(4) = 2 + 3(4).', '2 + 12 = 14.'],
        explanation: 'D(4) = 2 + 3(4) = 2 + 12 = 14.',
        character: 'bot',
        skill: 'realworld'
      },
      {
        id: 'l4-m2',
        level: 4,
        numberLabel: '2b',
        equationDisplay: 'D(n) = 2 + 3n',
        prompt: 'Calculate D(8).',
        inputPlaceholder: 'Enter value...',
        type: 'numeric',
        acceptedAnswers: ['26'],
        hints: ['Substitute n = 8: D(8) = 2 + 3(8).', '2 + 24 = 26.'],
        explanation: 'D(8) = 2 + 3(8) = 2 + 24 = 26.',
        character: 'bot',
        skill: 'realworld'
      },
      {
        id: 'l4-m3',
        level: 4,
        numberLabel: '2c',
        equationDisplay: 'D(n) = 2 + 3n',
        prompt: 'What does the coefficient 3 represent in D(n) = 2 + 3n?',
        inputPlaceholder: 'Select meaning of 3...',
        type: 'choice',
        options: [
          'The rate of change: each additional unit of n increases D(n) by 3',
          'The fixed starting amount when n = 0',
          'The maximum number of phones allowed on the plan',
          'The total cost after 3 months'
        ],
        acceptedAnswers: ['The rate of change: each additional unit of n increases D(n) by 3'],
        hints: ['In a linear function, the number multiplying n is the rate of change (slope) per unit of n.'],
        explanation: 'The coefficient 3 is the rate of change per unit of n (every increase of 1 in n adds 3 to the output D(n)).',
        character: 'bot',
        skill: 'realworld'
      },
      {
        id: 'l4-m4',
        level: 4,
        numberLabel: '2d',
        equationDisplay: 'D(n) = 2 + 3n = 20',
        prompt: 'Find n when D(n) = 20.',
        inputPlaceholder: 'n = ...',
        type: 'numeric',
        acceptedAnswers: ['6'],
        hints: ['Set 2 + 3n = 20 and subtract 2 from both sides.', '3n = 18. Divide 18 by 3!'],
        explanation: '2 + 3n = 20 ⇒ 3n = 18 ⇒ n = 6.',
        character: 'bot',
        skill: 'realworld'
      }
    ]
  },
  {
    id: 'rw-water',
    title: 'MISSION 3: HYDRO-LAB WATER TANK',
    subtitle: 'Volume in Litres After t Minutes',
    formula: 'V(t) = 50 + 8t',
    contextDescription: 'A water storage tank already holds water and is being filled at a constant rate of 8 litres per minute (t).',
    badgeText: 'Rate of Fill Model',
    character: 'captain',
    accentColor: 'bg-emerald-100',
    questions: [
      {
        id: 'l4-w1',
        level: 4,
        numberLabel: '3a',
        equationDisplay: 'V(t) = 50 + 8t',
        prompt: 'What is the initial volume of water in the tank (in litres, at t = 0)?',
        inputPlaceholder: 'Litres at t = 0...',
        type: 'numeric',
        acceptedAnswers: ['50'],
        hints: ['Initial volume means time t = 0.', 'Calculate V(0) = 50 + 8(0).'],
        explanation: 'At t = 0 minutes, V(0) = 50 + 8(0) = 50 litres.',
        character: 'captain',
        skill: 'realworld'
      },
      {
        id: 'l4-w2',
        level: 4,
        numberLabel: '3b',
        equationDisplay: 'V(t) = 50 + 8t',
        prompt: 'Find the volume after 5 minutes, V(5).',
        inputPlaceholder: 'Litres after 5 min...',
        type: 'numeric',
        acceptedAnswers: ['90'],
        hints: ['Substitute t = 5: V(5) = 50 + 8(5).', '50 + 40 = 90.'],
        explanation: 'V(5) = 50 + 8(5) = 50 + 40 = 90 litres.',
        character: 'captain',
        skill: 'realworld'
      },
      {
        id: 'l4-w3',
        level: 4,
        numberLabel: '3c',
        equationDisplay: 'V(t) = 50 + 8t',
        prompt: 'Find the volume after 10 minutes, V(10).',
        inputPlaceholder: 'Litres after 10 min...',
        type: 'numeric',
        acceptedAnswers: ['130'],
        hints: ['Substitute t = 10: V(10) = 50 + 8(10).', '50 + 80 = 130.'],
        explanation: 'V(10) = 50 + 8(10) = 50 + 80 = 130 litres.',
        character: 'captain',
        skill: 'realworld'
      },
      {
        id: 'l4-w4',
        level: 4,
        numberLabel: '3d',
        equationDisplay: 'V(10) = 130',
        prompt: 'Interpret what V(10) = 130 means.',
        inputPlaceholder: 'Select meaning...',
        type: 'choice',
        options: [
          'After 10 minutes of filling, the tank contains 130 litres of water',
          'After 130 minutes, the tank contains 10 litres of water',
          'The tank leaks 130 litres every 10 minutes',
          'It takes 10 tanks to hold 130 litres'
        ],
        acceptedAnswers: ['After 10 minutes of filling, the tank contains 130 litres of water'],
        hints: ['t = 10 is time in minutes; V(10) = 130 is volume in litres.'],
        explanation: 'V(10) = 130 means that after 10 minutes, the volume of water in the tank is 130 litres.',
        character: 'captain',
        skill: 'realworld'
      },
      {
        id: 'l4-w5',
        level: 4,
        numberLabel: '3e',
        equationDisplay: 'V(t) = 50 + 8t = 150',
        prompt: 'How many minutes (t) does it take for the tank to reach 150 litres?',
        inputPlaceholder: 't = ... (decimals allowed)',
        type: 'numeric',
        acceptedAnswers: ['12.5', '25/2'],
        hints: ['Set 50 + 8t = 150 and subtract 50 from both sides.', '8t = 100. Now divide 100 by 8 (100 ÷ 8 = 12.5)!'],
        explanation: '50 + 8t = 150 ⇒ 8t = 100 ⇒ t = 100 ÷ 8 = 12.5 minutes.',
        character: 'captain',
        skill: 'realworld'
      }
    ]
  },
  {
    id: 'rw-profit',
    title: 'MISSION 4: COMIC SHOP BUSINESS PROFIT',
    subtitle: 'Sajeev’s Superhero Print Studio',
    formula: 'P(n) = 25n − 100',
    contextDescription: 'Selling n limited-edition graphic novels brings in $25 per book, minus $100 in fixed printing setup costs.',
    badgeText: 'Profit & Break-Even',
    character: 'professor',
    accentColor: 'bg-purple-100',
    questions: [
      {
        id: 'l4-p1',
        level: 4,
        numberLabel: '4a',
        equationDisplay: 'P(n) = 25n − 100',
        prompt: 'Calculate P(10) (the profit in dollars when 10 items are sold).',
        inputPlaceholder: 'Enter profit...',
        type: 'numeric',
        acceptedAnswers: ['150', '$150'],
        hints: ['Substitute n = 10: P(10) = 25(10) − 100.', '250 − 100 = 150.'],
        explanation: 'P(10) = 25(10) − 100 = 250 − 100 = $150 profit.',
        character: 'professor',
        skill: 'realworld'
      },
      {
        id: 'l4-p2',
        level: 4,
        numberLabel: '4b',
        equationDisplay: 'P(n) = 25n − 100',
        prompt: 'Calculate P(20) (the profit in dollars when 20 items are sold).',
        inputPlaceholder: 'Enter profit...',
        type: 'numeric',
        acceptedAnswers: ['400', '$400'],
        hints: ['Substitute n = 20: P(20) = 25(20) − 100.', '500 − 100 = 400.'],
        explanation: 'P(20) = 25(20) − 100 = 500 − 100 = $400 profit.',
        character: 'professor',
        skill: 'realworld'
      },
      {
        id: 'l4-p3',
        level: 4,
        numberLabel: '4c',
        equationDisplay: 'P(0) = 25(0) − 100 = −100',
        prompt: 'Interpret what P(0) = −100 means for the business.',
        inputPlaceholder: 'Select business interpretation...',
        type: 'choice',
        options: [
          'If 0 items are sold, the business has a loss of $100 due to fixed startup costs',
          'The business sells 100 items for $0 each',
          'Each item costs $100 to ship',
          'The business earns $100 bonus before selling anything'
        ],
        acceptedAnswers: ['If 0 items are sold, the business has a loss of $100 due to fixed startup costs'],
        hints: ['When n = 0 items are sold, P(0) = −100. What does a negative profit mean?'],
        explanation: 'P(0) = −100 means that when 0 items are sold, the business experiences a net loss of $100 (the fixed setup cost).',
        character: 'professor',
        skill: 'realworld'
      },
      {
        id: 'l4-p4',
        level: 4,
        numberLabel: '4d',
        equationDisplay: 'P(n) = 25n − 100 = 150',
        prompt: 'Find the sales quantity (n) required to earn exactly $150 profit.',
        inputPlaceholder: 'n = ...',
        type: 'numeric',
        acceptedAnswers: ['10'],
        hints: ['Set 25n − 100 = 150 and add 100 to both sides.', '25n = 250. Now divide by 25!'],
        explanation: '25n − 100 = 150 ⇒ 25n = 250 ⇒ n = 10 items.',
        character: 'professor',
        skill: 'realworld'
      },
      {
        id: 'l4-p5',
        level: 4,
        numberLabel: '4e',
        equationDisplay: 'P(n) = 25n − 100',
        prompt: 'Explain what the number 25 represents in P(n) = 25n − 100.',
        inputPlaceholder: 'Select meaning of 25...',
        type: 'choice',
        options: [
          'The profit/revenue earned per single item sold ($25 per unit)',
          'The fixed daily rent of the store',
          'The number of employees working at the studio',
          'The total profit after 25 days'
        ],
        acceptedAnswers: ['The profit/revenue earned per single item sold ($25 per unit)'],
        hints: ['25 multiplies n (the number of items sold).'],
        explanation: '25 is the rate of profit/revenue gained for each individual item sold ($25 per item).',
        character: 'professor',
        skill: 'realworld'
      }
    ]
  }
];

export interface QuickFireItem {
  id: string;
  question: string;
  answer: string;
  options: string[];
  explanation: string;
}

export const QUICK_FIRE_QUESTIONS: QuickFireItem[] = [
  { id: 'qf-1', question: 'If f(x) = 3x, find f(7)', answer: '21', options: ['10', '21', '37', '14'], explanation: 'f(7) = 3 × 7 = 21.' },
  { id: 'qf-2', question: 'If g(x) = x² − 5, find g(4)', answer: '11', options: ['3', '11', '21', '16'], explanation: 'g(4) = 4² − 5 = 16 − 5 = 11.' },
  { id: 'qf-3', question: 'If h(x) = 2x + 1, find h(0)', answer: '1', options: ['0', '1', '2', '3'], explanation: 'h(0) = 2(0) + 1 = 1.' },
  { id: 'qf-4', question: 'If f(x) = 10 − 2x, find f(3)', answer: '4', options: ['4', '16', '8', '6'], explanation: 'f(3) = 10 − 2(3) = 10 − 6 = 4.' },
  { id: 'qf-5', question: 'If f(x) = 4x and f(x) = 32, find x', answer: '8', options: ['8', '28', '128', '4'], explanation: '4x = 32 ⇒ x = 8.' },
  { id: 'qf-6', question: 'If p(x) = x² + 10, find p(−3)', answer: '19', options: ['1', '19', '7', '16'], explanation: 'p(−3) = (−3)² + 10 = 9 + 10 = 19.' }
];
