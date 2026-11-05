import React, { useState } from 'react';
import {
  Play,
  Sliders,
  Columns,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Plus,
  Sparkles
} from 'lucide-react';
import { evaluateFunctionRule, formatDisplayRule, checkMathAnswer } from '../math/parser';
import { AnimatedFunctionMachineSVG, CharacterAvatar } from './ComicCharacters';

interface BuiltInMachine {
  id: string;
  fnName: string;
  label: string;
  rule: string;
  description: string;
}

const BUILT_IN_MACHINES: BuiltInMachine[] = [
  { id: 'fn-f', fnName: 'f', label: 'f(x) = 2x + 5', rule: '2x + 5', description: 'Linear: Double x, then add 5' },
  { id: 'fn-g', fnName: 'g', label: 'g(x) = 3x − 4', rule: '3x - 4', description: 'Linear: Triple x, then subtract 4' },
  { id: 'fn-h', fnName: 'h', label: 'h(x) = x² + 3', rule: 'x^2 + 3', description: 'Quadratic: Square x, then add 3' },
  { id: 'fn-p', fnName: 'p', label: 'p(x) = 2x² − 3x + 1', rule: '2x^2 - 3x + 1', description: 'Quadratic Trinomial' }
];

interface SecretMystery {
  id: string;
  title: string;
  pairs: { x: number; out: number }[];
  acceptedRules: string[];
  displayAnswer: string;
  hint: string;
}

const SECRET_MYSTERIES: SecretMystery[] = [
  {
    id: 'mys-1',
    title: 'Mystery Machine #1',
    pairs: [
      { x: 1, out: 5 },
      { x: 2, out: 8 },
      { x: 4, out: 14 },
      { x: 6, out: 20 }
    ],
    acceptedRules: ['3x+2', 'f(x)=3x+2'],
    displayAnswer: '3x + 2',
    hint: 'Each time x increases by 1, the output goes up by 3! At x = 1, 3(1) = 3, and we need + 2 to reach 5.'
  },
  {
    id: 'mys-2',
    title: 'Mystery Machine #2',
    pairs: [
      { x: 0, out: -1 },
      { x: 2, out: 7 },
      { x: 3, out: 11 },
      { x: 5, out: 19 }
    ],
    acceptedRules: ['4x-1', 'f(x)=4x-1'],
    displayAnswer: '4x − 1',
    hint: 'At x = 0 the output is −1. When x increases by 1, the output jumps by 4!'
  },
  {
    id: 'mys-3',
    title: 'Mystery Machine #3 (Quadratic Boss!)',
    pairs: [
      { x: 1, out: 3 },
      { x: 2, out: 6 },
      { x: 3, out: 11 },
      { x: 4, out: 18 }
    ],
    acceptedRules: ['x^2+2', 'f(x)=x^2+2'],
    displayAnswer: 'x² + 2',
    hint: 'Compare the outputs (3, 6, 11, 18) with the perfect squares (1, 4, 9, 16)!'
  }
];

interface FunctionMachineLabProps {
  onSecretRuleSolved: () => void;
}

export const FunctionMachineLab: React.FC<FunctionMachineLabProps> = ({
  onSecretRuleSolved
}) => {
  const [selectedId, setSelectedId] = useState<string>('fn-f');
  const [customRule, setCustomRule] = useState<string>('4x - 1');
  const [useCustom, setUseCustom] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('4');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Dual machine comparison state
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [compareId, setCompareId] = useState<string>('fn-h');

  // Custom table inputs
  const [tableInputs, setTableInputs] = useState<number[]>([-2, 0, 1, 3, 4, 6]);
  const [newTableX, setNewTableX] = useState<string>('');

  // Mystery rule detective challenge state
  const [mysteryIdx, setMysteryIdx] = useState<number>(0);
  const [mysteryGuess, setMysteryGuess] = useState<string>('');
  const [mysteryStatus, setMysteryStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showMysteryHint, setShowMysteryHint] = useState<boolean>(false);

  const activeMachine = BUILT_IN_MACHINES.find((m) => m.id === selectedId) || BUILT_IN_MACHINES[0];
  const compareMachine = BUILT_IN_MACHINES.find((m) => m.id === compareId) || BUILT_IN_MACHINES[2];

  const activeRule = useCustom ? customRule : activeMachine.rule;
  const activeFnName = useCustom ? 'k' : activeMachine.fnName;

  const parsedInput = Number(inputText);
  const numericInput = Number.isFinite(parsedInput) ? parsedInput : 0;

  const evalResult = evaluateFunctionRule(activeRule, numericInput, activeFnName, 'x');
  const compareResult = evaluateFunctionRule(compareMachine.rule, numericInput, compareMachine.fnName, 'x');

  const handleRunAnimation = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 350);
  };

  const handleAddTableX = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(newTableX);
    if (!Number.isNaN(val) && !tableInputs.includes(val)) {
      setTableInputs([...tableInputs, val].sort((a, b) => a - b));
      setNewTableX('');
    }
  };

  const currentMystery = SECRET_MYSTERIES[mysteryIdx];

  const handleCheckMystery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mysteryGuess.trim()) return;
    if (checkMathAnswer(mysteryGuess, currentMystery.acceptedRules)) {
      setMysteryStatus('correct');
      onSecretRuleSolved();
    } else {
      setMysteryStatus('wrong');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Top Header Banner */}
      <div className="comic-panel bg-sky-300 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs sm:text-sm font-extrabold text-slate-900">
            ACT 3 · INTERACTIVE FUNCTION MACHINE LABORATORY
          </div>
          <h1 className="font-comic-title text-4xl sm:text-5xl text-slate-950 tracking-wide">
            THE FUNCTION MACHINE LAB
          </h1>
          <p className="text-sm sm:text-base font-semibold text-slate-800 max-w-2xl">
            Drop positive, negative, or decimal inputs into any function rule, watch the step-by-step processor, compare two machines side-by-side, and crack the Secret Rule!
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCompareMode(!compareMode)}
          className={`comic-btn font-display font-extrabold text-sm sm:text-base px-5 py-3 rounded-xl flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
            compareMode ? 'bg-amber-400 text-slate-950' : 'bg-white text-slate-900'
          }`}
        >
          <Columns className="w-5 h-5" />
          <span>{compareMode ? 'Single Machine View' : 'Compare Two Machines'}</span>
        </button>
      </div>

      {/* Main Two-Zone Simulation Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: Interactive Machine Stage + Step-by-Step Pipeline */}
        <div className="lg:col-span-7 space-y-6">
          <div className="comic-panel bg-white p-6 rounded-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-slate-900 pb-3">
              <h2 className="font-display text-xl font-extrabold text-slate-950">
                LIVE PROCESSOR STAGE
              </h2>
              <span className="font-math text-xs sm:text-sm font-extrabold bg-slate-900 text-amber-300 px-3 py-1 rounded-lg">
                INPUT → FUNCTION RULE → CALCULATION → OUTPUT
              </span>
            </div>

            {/* Primary Animated Machine */}
            <AnimatedFunctionMachineSVG
              inputValue={numericInput}
              ruleDisplay={formatDisplayRule(activeRule)}
              outputValue={evalResult.valid ? evalResult.formattedOutput : 'ERR'}
              isProcessing={isProcessing}
              fnName={activeFnName}
            />

            {/* Optional Second Machine for Comparison Mode */}
            {compareMode && (
              <div className="pt-4 border-t-2 border-dashed border-slate-300 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display font-extrabold text-sm text-indigo-900">
                    COMPARISON MACHINE 2: {compareMachine.label}
                  </span>
                  <select
                    aria-label="Select second machine to compare"
                    value={compareId}
                    onChange={(e) => setCompareId(e.target.value)}
                    className="border-2 border-slate-900 rounded-lg px-3 py-1 bg-indigo-100 font-math font-bold text-xs cursor-pointer"
                  >
                    {BUILT_IN_MACHINES.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
                <AnimatedFunctionMachineSVG
                  inputValue={numericInput}
                  ruleDisplay={formatDisplayRule(compareMachine.rule)}
                  outputValue={compareResult.valid ? compareResult.formattedOutput : 'ERR'}
                  isProcessing={isProcessing}
                  fnName={compareMachine.fnName}
                />
              </div>
            )}

            {/* 4-Stage Pipeline Cards: INPUT -> RULE -> CALCULATION -> OUTPUT */}
            {evalResult.valid ? (
              <div className="space-y-3">
                <h3 className="font-display text-sm font-extrabold text-slate-900 uppercase">
                  Step-by-Step Internal Chamber Breakdown:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {evalResult.steps.map((st, i) => (
                    <div
                      key={i}
                      className="comic-panel-sm bg-amber-50 p-4 rounded-xl flex flex-col justify-between space-y-2"
                    >
                      <div className="text-xs font-extrabold text-rose-700">{st.label}</div>
                      <div className="font-math font-extrabold text-base sm:text-lg text-slate-950 bg-white px-3 py-2 rounded-lg border-2 border-slate-900">
                        {st.expression}
                      </div>
                      <p className="text-xs font-semibold text-slate-700">{st.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="comic-panel-sm bg-rose-100 p-4 rounded-xl text-rose-950 font-bold text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>Rule Parser Notice: {evalResult.error}</span>
              </div>
            )}
          </div>

          {/* Input-Output Table Generator */}
          <div className="comic-panel bg-white p-6 rounded-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-900 pb-3">
              <div>
                <h2 className="font-display text-lg font-extrabold text-slate-950">
                  LIVE INPUT–OUTPUT TABLE ({activeFnName}(x) = {formatDisplayRule(activeRule)})
                </h2>
                <p className="text-xs font-semibold text-slate-600">
                  Click any row to load that input into the machine above!
                </p>
              </div>

              <form onSubmit={handleAddTableX} className="flex items-center gap-2">
                <label className="sr-only" htmlFor="add-table-x">Add x value to table</label>
                <input
                  id="add-table-x"
                  type="number"
                  step="any"
                  value={newTableX}
                  onChange={(e) => setNewTableX(e.target.value)}
                  placeholder="Add x..."
                  className="w-24 px-3 py-1.5 rounded-lg border-2 border-slate-900 font-math font-bold text-xs"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg border-2 border-slate-900 bg-emerald-400 hover:bg-emerald-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Row</span>
                </button>
              </form>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-math text-sm">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="py-2.5 px-4 rounded-tl-lg">Input (x)</th>
                    <th className="py-2.5 px-4">Substituted Rule</th>
                    <th className="py-2.5 px-4">Output {activeFnName}(x)</th>
                    {compareMode && (
                      <th className="py-2.5 px-4 rounded-tr-lg bg-indigo-900 text-amber-300">
                        Compare {compareMachine.fnName}(x)
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-200">
                  {tableInputs.map((xVal) => {
                    const rowRes = evaluateFunctionRule(activeRule, xVal, activeFnName, 'x');
                    const compRes = evaluateFunctionRule(compareMachine.rule, xVal, compareMachine.fnName, 'x');
                    const isSelected = xVal === numericInput;
                    return (
                      <tr
                        key={xVal}
                        onClick={() => {
                          setInputText(String(xVal));
                          handleRunAnimation();
                        }}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-amber-200 font-extrabold' : 'hover:bg-slate-100'
                        }`}
                      >
                        <td className="py-2.5 px-4 font-bold text-slate-950">x = {xVal}</td>
                        <td className="py-2.5 px-4 text-slate-700">
                          {rowRes.steps[1]?.expression || '-'}
                        </td>
                        <td className="py-2.5 px-4 font-extrabold text-emerald-800">
                          {rowRes.formattedOutput}
                        </td>
                        {compareMode && (
                          <td className="py-2.5 px-4 font-extrabold text-indigo-800 bg-indigo-50/50">
                            {compRes.formattedOutput}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Control Deck + Secret Rule Discovery Challenge */}
        <div className="lg:col-span-5 space-y-6">
          {/* Machine Control Deck */}
          <div className="comic-panel bg-amber-100 p-6 rounded-2xl space-y-5">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <h2 className="font-display text-lg font-extrabold text-slate-950 flex items-center gap-2">
                <Sliders className="w-5 h-5" />
                <span>MACHINE CONTROL DECK</span>
              </h2>
            </div>

            {/* Step 1: Enter Numerical Input */}
            <div className="space-y-2">
              <label htmlFor="lab-input-x" className="block font-display font-extrabold text-sm text-slate-900">
                1. Enter Any Input Number (x):
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="lab-input-x"
                  type="number"
                  step="any"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border-3 border-slate-900 bg-white font-math font-extrabold text-xl text-slate-950"
                />
                <button
                  type="button"
                  onClick={handleRunAnimation}
                  className="comic-btn bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-extrabold px-5 py-3 rounded-xl flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Run Machine</span>
                </button>
              </div>

              {/* Quick Preset Inputs (including negative and decimal!) */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-xs font-bold text-slate-700 mr-1">Quick Presets:</span>
                {[-4, -2, -0.5, 0, 1.5, 3, 4, 10].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setInputText(String(preset));
                      handleRunAnimation();
                    }}
                    className={`px-2 py-1 rounded-lg font-math font-bold text-xs border-2 border-slate-900 cursor-pointer ${
                      numericInput === preset ? 'bg-slate-900 text-amber-300' : 'bg-white text-slate-900 hover:bg-amber-200'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Built-In Functions */}
            <div className="space-y-2">
              <span className="block font-display font-extrabold text-sm text-slate-900">
                2. Select a Built-In Function Machine:
              </span>
              <div className="grid grid-cols-1 gap-2">
                {BUILT_IN_MACHINES.map((m) => {
                  const isActive = !useCustom && selectedId === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setUseCustom(false);
                        setSelectedId(m.id);
                        handleRunAnimation();
                      }}
                      className={`p-3 rounded-xl border-2 border-slate-900 text-left flex items-center justify-between transition-all cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-[3px_3px_0px_#FACC15]'
                          : 'bg-white hover:bg-amber-50 text-slate-900'
                      }`}
                    >
                      <span className="font-math font-extrabold text-sm sm:text-base">
                        {m.label}
                      </span>
                      <span className={`text-xs font-semibold ${isActive ? 'text-amber-300' : 'text-slate-600'}`}>
                        {m.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Safe Custom Rule Builder */}
            <div className="comic-panel-sm bg-white p-4 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <label htmlFor="custom-rule-input" className="font-display font-extrabold text-xs sm:text-sm text-slate-900">
                  3. Custom Rule Builder (Safe Algebra Parser):
                </label>
                <button
                  type="button"
                  onClick={() => setUseCustom(!useCustom)}
                  className={`px-2.5 py-1 rounded-md text-xs font-extrabold border-2 border-slate-900 cursor-pointer ${
                    useCustom ? 'bg-emerald-400 text-slate-950' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {useCustom ? 'Active' : 'Use Custom'}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-math font-extrabold text-sm text-slate-900 shrink-0">
                  k(x) =
                </span>
                <input
                  id="custom-rule-input"
                  type="text"
                  value={customRule}
                  onChange={(e) => {
                    setCustomRule(e.target.value);
                    setUseCustom(true);
                  }}
                  placeholder="e.g. 5x - 3 or x^2 + 2x"
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-900 font-math font-bold text-sm bg-slate-50"
                />
              </div>
              <p className="text-[11px] font-semibold text-slate-600">
                Supports <code className="font-math">x</code>, <code className="font-math">^2</code>, <code className="font-math">+</code>, <code className="font-math">-</code>, <code className="font-math">*</code>, <code className="font-math">/</code>, and parentheses <code className="font-math">()</code>.
              </p>
            </div>
          </div>

          {/* Secret Function Rule Detective Challenge */}
          <div className="comic-panel bg-emerald-100 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-800" />
                <h2 className="font-display text-lg font-extrabold text-slate-950">
                  CRACK THE SECRET FUNCTION RULE!
                </h2>
              </div>
              <div className="flex items-center gap-1">
                {SECRET_MYSTERIES.map((m, idx) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setMysteryIdx(idx);
                      setMysteryGuess('');
                      setMysteryStatus('idle');
                      setShowMysteryHint(false);
                    }}
                    className={`px-2.5 py-1 rounded-md font-math font-bold text-xs border-2 border-slate-900 cursor-pointer ${
                      mysteryIdx === idx ? 'bg-slate-900 text-amber-300' : 'bg-white text-slate-900'
                    }`}
                  >
                    #{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CharacterAvatar character="fox" size="sm" />
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                Observe the inputs and outputs below for <strong>{currentMystery.title}</strong> and deduce the formula for <strong>f(x)</strong>!
              </p>
            </div>

            {/* Observed Clues Table */}
            <div className="grid grid-cols-4 gap-2 text-center font-math">
              {currentMystery.pairs.map((p) => (
                <div key={p.x} className="bg-white p-2.5 rounded-xl border-2 border-slate-900">
                  <div className="text-xs font-bold text-slate-500">x = {p.x}</div>
                  <div className="text-sm sm:text-base font-extrabold text-emerald-700 mt-0.5">
                    f({p.x}) = {p.out}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleCheckMystery} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-math font-extrabold text-base text-slate-950 shrink-0">
                  f(x) =
                </span>
                <input
                  type="text"
                  value={mysteryGuess}
                  onChange={(e) => setMysteryGuess(e.target.value)}
                  placeholder="e.g. 3x + 2"
                  aria-label="Enter secret function rule"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border-2 border-slate-900 bg-white font-math font-bold text-base"
                />
                <button
                  type="submit"
                  className="comic-btn bg-slate-900 hover:bg-slate-800 text-amber-300 font-display font-extrabold text-sm px-4 py-2.5 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
                >
                  Check Rule
                </button>
              </div>
            </form>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowMysteryHint(!showMysteryHint)}
                className="text-xs font-extrabold text-emerald-950 underline flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showMysteryHint ? 'Hide Clue' : 'Need a Detective Clue?'}</span>
              </button>
            </div>

            {showMysteryHint && (
              <div className="bg-white p-3 rounded-xl border-2 border-slate-900 text-xs font-semibold text-slate-800">
                <strong>Clue:</strong> {currentMystery.hint}
              </div>
            )}

            {mysteryStatus === 'correct' && (
              <div className="bg-emerald-300 p-3.5 rounded-xl border-2 border-slate-900 text-xs sm:text-sm font-extrabold text-slate-950 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-900 shrink-0" />
                <span>BINGO! The secret rule is f(x) = {currentMystery.displayAnswer}! (+50 XP)</span>
              </div>
            )}

            {mysteryStatus === 'wrong' && (
              <div className="bg-rose-200 p-3.5 rounded-xl border-2 border-slate-900 text-xs sm:text-sm font-bold text-rose-950 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-900 shrink-0" />
                <span>Not quite! Test your rule with all four x-values in the table or check the clue!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
