import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateFunctionRule,
  checkMathAnswer,
  calculateExamScore
} from './parser';

test('Built-in and custom linear/quadratic function rules evaluate accurately', () => {
  // f(x) = 2x + 5
  const r1 = evaluateFunctionRule('2x + 5', 4, 'f', 'x');
  assert.equal(r1.valid, true);
  assert.equal(r1.output, 13);

  // Negative input: f(-3) = 2(-3) + 5 = -1
  const rNeg = evaluateFunctionRule('2x + 5', -3, 'f', 'x');
  assert.equal(rNeg.output, -1);

  // Fractional input: f(1.5) = 2(1.5) + 5 = 8
  const rFrac = evaluateFunctionRule('2x + 5', 1.5, 'f', 'x');
  assert.equal(rFrac.output, 8);

  // Quadratic: p(x) = 2x^2 - 3x + 1 at x = 4 -> 2(16) - 12 + 1 = 21
  const rQuad = evaluateFunctionRule('2x² - 3x + 1', 4, 'p', 'x');
  assert.equal(rQuad.valid, true);
  assert.equal(rQuad.output, 21);

  // Quadratic with negative input: g(x) = x^2 + 3x - 4 at x = -2 -> 4 - 6 - 4 = -6
  const rQuadNeg = evaluateFunctionRule('x^2 + 3x - 4', -2, 'g', 'x');
  assert.equal(rQuadNeg.output, -6);
});

test('Math answer normalization handles harmless formatting without false positives', () => {
  assert.equal(checkMathAnswer('13', ['13']), true);
  assert.equal(checkMathAnswer('f(3) = 13', ['13']), true);
  assert.equal(checkMathAnswer(' 3a + 8 ', ['3a+8']), true);
  assert.equal(checkMathAnswer('3a + 14', ['3a+14', '3(a+2)+8']), true);
  assert.equal(checkMathAnswer('3(a + 2) + 8', ['3a+14', '3(a+2)+8']), true);
  assert.equal(checkMathAnswer('3a + 10', ['3a+14', '3(a+2)+8']), false);
  assert.equal(checkMathAnswer('21', ['21']), true);
  assert.equal(checkMathAnswer('-100', ['-100']), true);
});

test('Final Boss Exam scorer totals exactly 20 marks and respects teacher review overrides', () => {
  const parts = [
    { id: 'q1a', maxMarks: 1, autoGradable: true, studentAnswer: '21', acceptedAnswers: ['21'] },
    { id: 'q1b', maxMarks: 1, autoGradable: true, studentAnswer: '2a + 9', acceptedAnswers: ['2a+9'] },
    { id: 'q1c', maxMarks: 1, autoGradable: true, studentAnswer: '2a + 13', acceptedAnswers: ['2a+13', '2(a+2)+9'] },
    { id: 'q2', maxMarks: 2, autoGradable: true, studentAnswer: '4', acceptedAnswers: ['4'] },
    { id: 'q3', maxMarks: 3, autoGradable: true, studentAnswer: '6', acceptedAnswers: ['6'] },
    { id: 'q4a', maxMarks: 1, autoGradable: false, studentAnswer: 'Total delivery cost in dollars for n kilometres', acceptedAnswers: ['cost', 'kilometre'] },
    { id: 'q4b', maxMarks: 1, autoGradable: true, studentAnswer: '55', acceptedAnswers: ['55'] },
    { id: 'q4c', maxMarks: 2, autoGradable: true, studentAnswer: '11', acceptedAnswers: ['11'] },
    { id: 'q5a', maxMarks: 1, autoGradable: true, studentAnswer: '9', acceptedAnswers: ['9'] },
    { id: 'q5b', maxMarks: 1, autoGradable: true, studentAnswer: '11', acceptedAnswers: ['11'] },
    { id: 'q5c', maxMarks: 2, autoGradable: true, studentAnswer: '6', acceptedAnswers: ['6'] },
    { id: 'q6', maxMarks: 3, autoGradable: true, studentAnswer: '14', acceptedAnswers: ['14'] },
    { id: 'q7', maxMarks: 1, autoGradable: false, studentAnswer: 'When input x is 4, the output of f is 17', acceptedAnswers: ['input', 'output'] }
  ];

  const res = calculateExamScore(parts);
  assert.equal(res.maxTotal, 20);
  assert.equal(res.totalAwarded, 20);
});
