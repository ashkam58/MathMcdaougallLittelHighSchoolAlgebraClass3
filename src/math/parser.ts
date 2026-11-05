export interface EvaluationStep {
  label: string;
  expression: string;
  detail: string;
}

export interface EvaluationResult {
  valid: boolean;
  output: number;
  formattedOutput: string;
  steps: EvaluationStep[];
  error?: string;
}

type TokenType = 'NUMBER' | 'VAR' | 'OP' | 'LPAREN' | 'RPAREN';

interface Token {
  type: TokenType;
  value: string;
  numValue?: number;
}

/**
 * Normalizes superscript characters and math symbols into standard ASCII math tokens.
 */
export function normalizeExpressionString(raw: string): string {
  return raw
    .trim()
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/[−–—]/g, '-')
    .replace(/[×·]/g, '*')
    .replace(/÷/g, '/');
}

/**
 * Displays a math rule with proper typographic superscripts and minus signs.
 */
export function formatDisplayRule(raw: string): string {
  return raw
    .replace(/\^2/g, '²')
    .replace(/\^3/g, '³')
    .replace(/\*/g, '·')
    .replace(/-/g, '−');
}

/**
 * Formats a number cleanly (avoids floating point noise like 3.0000000000000004).
 */
export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return 'Undefined';
  const rounded = Math.round(n * 1e9) / 1e9;
  if (Object.is(rounded, -0)) return '0';
  return String(rounded);
}

/**
 * Tokenizes a mathematical expression safely without eval().
 * Supports numbers, variables (x, n, t, a), +, -, *, /, ^, and parentheses.
 * Automatically inserts explicit multiplication tokens for implicit cases like:
 * 2x -> 2 * x
 * 3(x+1) -> 3 * (x+1)
 * (x+1)(x-1) -> (x+1) * (x-1)
 * x(2) -> x * (2)
 */
export function tokenizeExpression(expr: string, variableName = 'x'): Token[] {
  const cleaned = normalizeExpressionString(expr).replace(/\s+/g, '');
  if (!cleaned) {
    throw new Error('Expression cannot be empty.');
  }

  const rawTokens: Token[] = [];
  let i = 0;
  const varLower = variableName.toLowerCase();

  while (i < cleaned.length) {
    const ch = cleaned[i];

    if (/[0-9.]/.test(ch)) {
      let numStr = '';
      let dotCount = 0;
      while (i < cleaned.length && /[0-9.]/.test(cleaned[i])) {
        if (cleaned[i] === '.') dotCount++;
        if (dotCount > 1) throw new Error('Invalid decimal number.');
        numStr += cleaned[i];
        i++;
      }
      const parsed = Number(numStr);
      if (Number.isNaN(parsed)) throw new Error(`Invalid number: ${numStr}`);
      rawTokens.push({ type: 'NUMBER', value: numStr, numValue: parsed });
      continue;
    }

    if (/[a-zA-Z]/.test(ch)) {
      const lower = ch.toLowerCase();
      if (lower !== varLower && lower !== 'x' && lower !== 'n' && lower !== 't' && lower !== 'a') {
        throw new Error(`Unknown variable "${ch}". Use "${variableName}".`);
      }
      rawTokens.push({ type: 'VAR', value: variableName });
      i++;
      continue;
    }

    if (ch === '(') {
      rawTokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }

    if (ch === ')') {
      rawTokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    if (['+', '-', '*', '/', '^'].includes(ch)) {
      rawTokens.push({ type: 'OP', value: ch });
      i++;
      continue;
    }

    throw new Error(`Unsupported character "${ch}".`);
  }

  // Insert implicit multiplication tokens
  const tokens: Token[] = [];
  for (let idx = 0; idx < rawTokens.length; idx++) {
    const curr = rawTokens[idx];
    const prev = tokens[tokens.length - 1];

    if (prev) {
      const prevIsValue = prev.type === 'NUMBER' || prev.type === 'VAR' || prev.type === 'RPAREN';
      const currIsValueStart = curr.type === 'VAR' || curr.type === 'LPAREN' || (prev.type === 'RPAREN' && curr.type === 'NUMBER') || (prev.type === 'VAR' && curr.type === 'NUMBER');
      if (prevIsValue && currIsValueStart) {
        tokens.push({ type: 'OP', value: '*' });
      }
    }
    tokens.push(curr);
  }

  return tokens;
}

/**
 * Evaluates a tokenized expression using a recursive-descent parser (no eval).
 * Grammar:
 *   Expr   -> Term (( '+' | '-' ) Term)*
 *   Term   -> Factor (( '*' | '/' ) Factor)*
 *   Factor -> ('+' | '-') Factor | Power
 *   Power  -> Primary ('^' Factor)?
 *   Primary-> NUMBER | VAR | '(' Expr ')'
 */
export function evaluateTokens(tokens: Token[], varValue: number): number {
  let pos = 0;

  function peek(): Token | undefined {
    return tokens[pos];
  }

  function consume(): Token {
    return tokens[pos++];
  }

  function parseExpr(): number {
    let left = parseTerm();
    while (peek() && peek()!.type === 'OP' && (peek()!.value === '+' || peek()!.value === '-')) {
      const op = consume().value;
      const right = parseTerm();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  function parseTerm(): number {
    let left = parseFactor();
    while (peek() && peek()!.type === 'OP' && (peek()!.value === '*' || peek()!.value === '/')) {
      const op = consume().value;
      const right = parseFactor();
      if (op === '/') {
        if (Math.abs(right) < 1e-12) {
          throw new Error('Division by zero is undefined.');
        }
        left = left / right;
      } else {
        left = left * right;
      }
    }
    return left;
  }

  function parseFactor(): number {
    const t = peek();
    if (t && t.type === 'OP' && (t.value === '+' || t.value === '-')) {
      consume();
      const val = parseFactor();
      return t.value === '-' ? -val : val;
    }
    return parsePower();
  }

  function parsePower(): number {
    const base = parsePrimary();
    if (peek() && peek()!.type === 'OP' && peek()!.value === '^') {
      consume();
      const exp = parseFactor();
      return Math.pow(base, exp);
    }
    return base;
  }

  function parsePrimary(): number {
    const t = peek();
    if (!t) {
      throw new Error('Unexpected end of expression.');
    }
    if (t.type === 'NUMBER') {
      consume();
      return t.numValue!;
    }
    if (t.type === 'VAR') {
      consume();
      return varValue;
    }
    if (t.type === 'LPAREN') {
      consume();
      const val = parseExpr();
      const closing = peek();
      if (!closing || closing.type !== 'RPAREN') {
        throw new Error('Mismatched parentheses: missing ")".');
      }
      consume();
      return val;
    }
    throw new Error(`Unexpected token "${t.value}".`);
  }

  const result = parseExpr();
  if (pos < tokens.length) {
    throw new Error(`Unexpected token "${tokens[pos].value}".`);
  }
  return result;
}

/**
 * Evaluates a function rule for a given input and returns animated step-by-step work.
 */
export function evaluateFunctionRule(
  rule: string,
  inputVal: number,
  fnName = 'f',
  varName = 'x'
): EvaluationResult {
  try {
    const tokens = tokenizeExpression(rule, varName);
    const output = evaluateTokens(tokens, inputVal);
    if (!Number.isFinite(output)) {
      return {
        valid: false,
        output: NaN,
        formattedOutput: 'Undefined',
        steps: [],
        error: 'Result is undefined or infinite.'
      };
    }

    const formattedIn = formatNumber(inputVal);
    const formattedOut = formatNumber(output);
    const displayRule = formatDisplayRule(rule);

    // Build substituted string by replacing variable occurrences with (inputVal)
    const normalized = normalizeExpressionString(rule);
    const varRegex = new RegExp(varName, 'gi');
    const substitutedRaw = normalized.replace(varRegex, `(${formattedIn})`);
    const substitutedDisplay = formatDisplayRule(substitutedRaw);

    const steps: EvaluationStep[] = [
      {
        label: '1. Write Function Rule',
        expression: `${fnName}(${varName}) = ${displayRule}`,
        detail: `Start with function ${fnName} and identify the input variable ${varName}.`
      },
      {
        label: `2. Substitute Input ${varName} = ${formattedIn}`,
        expression: `${fnName}(${formattedIn}) = ${substitutedDisplay}`,
        detail: `Replace every ${varName} with (${formattedIn}) in parentheses.`
      }
    ];

    // Add intermediate power or multiplication simplification if powers exist
    if (normalized.includes('^2')) {
      const sqVal = formatNumber(inputVal * inputVal);
      const afterPower = formatDisplayRule(
        normalized.replace(new RegExp(`${varName}\\^2`, 'gi'), `(${sqVal})`).replace(varRegex, `(${formattedIn})`)
      );
      steps.push({
        label: '3. Evaluate Exponents First',
        expression: `${fnName}(${formattedIn}) = ${afterPower}`,
        detail: `Calculate (${formattedIn})² = ${sqVal} before multiplying.`
      });
    }

    steps.push({
      label: `${steps.length + 1}. Compute Final Output`,
      expression: `${fnName}(${formattedIn}) = ${formattedOut}`,
      detail: `When input is ${formattedIn}, the output of ${fnName} is ${formattedOut}.`
    });

    return {
      valid: true,
      output: Math.round(output * 1e9) / 1e9,
      formattedOutput: formattedOut,
      steps
    };
  } catch (err) {
    return {
      valid: false,
      output: NaN,
      formattedOutput: 'Error',
      steps: [],
      error: err instanceof Error ? err.message : 'Invalid mathematical rule.'
    };
  }
}

/**
 * Normalizes a student's typed math answer so harmless whitespace/symbol differences
 * match while keeping distinct algebraic expressions distinct.
 */
export function normalizeMathAnswer(input: string): string {
  const trimmed = input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/[−–—]/g, '-')
    .replace(/[×·*]/g, '');

  // If the entire answer is a valid number (e.g. "14.0" or "+14"), normalize numerically
  if (/^[+-]?(\d+(\.\d+)?|\.\d+)$/.test(trimmed)) {
    return formatNumber(Number(trimmed));
  }

  // Strip optional leading lhs like "f(6)=" or "x=" or "a=" if student typed full equation
  const eqParts = trimmed.split('=');
  const rhs = eqParts.length === 2 && /^[a-z0-9()+^-]+$/.test(eqParts[0]) ? eqParts[1] : trimmed;

  if (/^[+-]?(\d+(\.\d+)?|\.\d+)$/.test(rhs)) {
    return formatNumber(Number(rhs));
  }

  return rhs;
}

/**
 * Checks whether a student's answer matches any of the accepted canonical answers.
 */
export function checkMathAnswer(studentInput: string, acceptedAnswers: string[]): boolean {
  if (!studentInput || !studentInput.trim()) return false;
  const normStudent = normalizeMathAnswer(studentInput);
  return acceptedAnswers.some((ans) => normalizeMathAnswer(ans) === normStudent);
}

export interface ExamPartSubmission {
  id: string;
  maxMarks: number;
  autoGradable: boolean;
  studentAnswer: string;
  acceptedAnswers?: string[];
  teacherAwardedMarks?: number;
}

/**
 * Computes total marks and breakdown for the 20-mark Final Boss Exam.
 */
export function calculateExamScore(parts: ExamPartSubmission[]): {
  totalAwarded: number;
  maxTotal: number;
  partScores: Record<string, number>;
} {
  let totalAwarded = 0;
  let maxTotal = 0;
  const partScores: Record<string, number> = {};

  for (const part of parts) {
    maxTotal += part.maxMarks;
    if (typeof part.teacherAwardedMarks === 'number') {
      const clamped = Math.max(0, Math.min(part.maxMarks, part.teacherAwardedMarks));
      partScores[part.id] = clamped;
      totalAwarded += clamped;
    } else if (part.autoGradable && part.acceptedAnswers) {
      const isCorrect = checkMathAnswer(part.studentAnswer, part.acceptedAnswers);
      const score = isCorrect ? part.maxMarks : 0;
      partScores[part.id] = score;
      totalAwarded += score;
    } else {
      // Written reasoning question: check keyword rubric heuristically until teacher overrides
      const ans = part.studentAnswer.trim().toLowerCase();
      let heuristic = 0;
      if (ans.length >= 12 && part.acceptedAnswers) {
        const matchedKeywords = part.acceptedAnswers.filter((kw) => ans.includes(kw.toLowerCase()));
        if (matchedKeywords.length >= Math.min(2, part.acceptedAnswers.length)) {
          heuristic = part.maxMarks;
        }
      }
      partScores[part.id] = heuristic;
      totalAwarded += heuristic;
    }
  }

  return { totalAwarded, maxTotal, partScores };
}
