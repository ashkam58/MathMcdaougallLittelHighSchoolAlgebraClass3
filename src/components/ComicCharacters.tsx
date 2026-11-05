import React from 'react';
import { CharacterId } from '../data/slidesData';

export type CharacterMood = 'idle' | 'happy' | 'thinking' | 'defeated';

export const CHARACTER_META: Record<
  CharacterId,
  { name: string; role: string; badgeBg: string; accentBorder: string }
> = {
  fox: {
    name: 'Function Fox',
    role: 'Master of Function Notation',
    badgeBg: 'bg-amber-400',
    accentBorder: 'border-amber-500'
  },
  professor: {
    name: 'Professor Algebra',
    role: 'Guardian of Mathematical Rules',
    badgeBg: 'bg-sky-400',
    accentBorder: 'border-sky-500'
  },
  captain: {
    name: 'Captain Input',
    role: 'Commander of Domain Values (x)',
    badgeBg: 'bg-indigo-400',
    accentBorder: 'border-indigo-500'
  },
  bot: {
    name: 'Output Bot',
    role: 'Precision Range Calculator f(x)',
    badgeBg: 'bg-emerald-400',
    accentBorder: 'border-emerald-500'
  },
  monster: {
    name: 'Error Monster',
    role: 'Chaos Glitch of Common Mistakes',
    badgeBg: 'bg-rose-400',
    accentBorder: 'border-rose-500'
  }
};

interface CharacterAvatarProps {
  character: CharacterId;
  mood?: CharacterMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  character,
  mood = 'idle',
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-44 h-44'
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none shrink-0 ${sizeClasses} ${className}`}
      aria-label={CHARACTER_META[character].name}
    >
      {character === 'fox' && <FunctionFoxSVG mood={mood} />}
      {character === 'professor' && <ProfessorAlgebraSVG mood={mood} />}
      {character === 'captain' && <CaptainInputSVG mood={mood} />}
      {character === 'bot' && <OutputBotSVG mood={mood} />}
      {character === 'monster' && <ErrorMonsterSVG mood={mood} />}
    </div>
  );
};

const FunctionFoxSVG: React.FC<{ mood: CharacterMood }> = ({ mood }) => (
  <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[3px_3px_0px_#0F172A]">
    {/* Superhero Background Burst */}
    <circle cx="60" cy="62" r="50" fill="#FEF08A" stroke="#0F172A" strokeWidth="4" />
    {/* Cape */}
    <path d="M24 85 L40 62 L80 62 L96 85 L85 106 L35 106 Z" fill="#EF4444" stroke="#0F172A" strokeWidth="3.5" />
    {/* Fox Ears */}
    <polygon points="24,48 30,14 52,36" fill="#F97316" stroke="#0F172A" strokeWidth="3.5" strokeLinejoin="round" />
    <polygon points="29,42 33,22 46,35" fill="#FDE047" />
    <polygon points="96,48 90,14 68,36" fill="#F97316" stroke="#0F172A" strokeWidth="3.5" strokeLinejoin="round" />
    <polygon points="91,42 87,22 74,35" fill="#FDE047" />
    {/* Head */}
    <path
      d="M25 48 C25 30, 95 30, 95 48 C98 68, 78 82, 60 85 C42 82, 22 68, 25 48 Z"
      fill="#F97316"
      stroke="#0F172A"
      strokeWidth="3.5"
    />
    {/* White Cheek Fur */}
    <path d="M26 56 Q44 62 60 84 Q76 62 94 56 Q86 78 60 85 Q34 78 26 56 Z" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.5" />
    {/* Hero Visor Mask */}
    <path d="M28 46 Q60 38 92 46 L88 60 Q60 54 32 60 Z" fill="#0F172A" />
    {/* Expressive Eyes inside Visor */}
    {mood === 'happy' ? (
      <>
        <path d="M38 53 Q44 46 50 53" fill="none" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M70 53 Q76 46 82 53" fill="none" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" />
      </>
    ) : (
      <>
        <ellipse cx="44" cy="52" rx="5.5" ry="6" fill="#38BDF8" />
        <circle cx="46" cy="50" r="2" fill="#FFFFFF" />
        <ellipse cx="76" cy="52" rx="5.5" ry="6" fill="#38BDF8" />
        <circle cx="78" cy="50" r="2" fill="#FFFFFF" />
      </>
    )}
    {/* Nose & Smile */}
    <polygon points="55,70 65,70 60,77" fill="#0F172A" />
    <path d="M52 79 Q60 85 68 79" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
    {/* f(x) Chest Emblem */}
    <rect x="42" y="88" width="36" height="20" rx="6" fill="#FACC15" stroke="#0F172A" strokeWidth="3" />
    <text x="60" y="102" textAnchor="middle" fill="#0F172A" fontWeight="900" fontSize="13" fontFamily="monospace">
      f(x)
    </text>
  </svg>
);

const ProfessorAlgebraSVG: React.FC<{ mood: CharacterMood }> = ({ mood }) => (
  <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[3px_3px_0px_#0F172A]">
    <circle cx="60" cy="62" r="50" fill="#E0F2FE" stroke="#0F172A" strokeWidth="4" />
    {/* Suit & Academic Cape */}
    <path d="M26 105 C28 82, 92 82, 94 105 Z" fill="#1D4ED8" stroke="#0F172A" strokeWidth="3.5" />
    {/* Bowtie */}
    <polygon points="48,86 60,92 48,98" fill="#FACC15" stroke="#0F172A" strokeWidth="2.5" />
    <polygon points="72,86 60,92 72,98" fill="#FACC15" stroke="#0F172A" strokeWidth="2.5" />
    {/* Wild Einstein Hair */}
    <path
      d="M22 52 Q14 36 28 30 Q36 16 60 20 Q84 16 92 30 Q106 36 98 52 Z"
      fill="#F8FAFC"
      stroke="#0F172A"
      strokeWidth="3.5"
    />
    {/* Head */}
    <circle cx="60" cy="56" r="26" fill="#FDE68A" stroke="#0F172A" strokeWidth="3.5" />
    {/* Smart Glasses */}
    <rect x="36" y="46" width="20" height="14" rx="3" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3.5" />
    <rect x="64" y="46" width="20" height="14" rx="3" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3.5" />
    <line x1="56" y1="53" x2="64" y2="53" stroke="#0F172A" strokeWidth="3.5" />
    <circle cx="46" cy="53" r="3" fill="#0F172A" />
    <circle cx="74" cy="53" r="3" fill="#0F172A" />
    {/* Mustache & Smile */}
    <path d="M44 70 Q60 63 76 70 Q68 76 60 71 Q52 76 44 70 Z" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2.5" />
    {mood === 'happy' && <path d="M52 74 Q60 80 68 74" fill="none" stroke="#0F172A" strokeWidth="2.5" />}
  </svg>
);

const CaptainInputSVG: React.FC<{ mood: CharacterMood }> = ({ mood }) => (
  <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[3px_3px_0px_#0F172A]">
    <circle cx="60" cy="62" r="50" fill="#E0E7FF" stroke="#0F172A" strokeWidth="4" />
    {/* Armor Shoulders */}
    <path d="M22 104 C26 78, 94 78, 98 104 Z" fill="#4F46E5" stroke="#0F172A" strokeWidth="3.5" />
    {/* Helmet */}
    <circle cx="60" cy="54" r="27" fill="#FDE68A" stroke="#0F172A" strokeWidth="3.5" />
    <path d="M32 52 C32 26, 88 26, 88 52 L82 44 L60 50 L38 44 Z" fill="#2563EB" stroke="#0F172A" strokeWidth="3.5" />
    {/* Lightning Crest */}
    <polygon points="57,18 67,18 61,29 68,29 54,42 58,31 52,31" fill="#FACC15" stroke="#0F172A" strokeWidth="2" />
    {/* Eyes & Grin */}
    <circle cx="48" cy="56" r="3.5" fill="#0F172A" />
    <circle cx="72" cy="56" r="3.5" fill="#0F172A" />
    <path
      d={mood === 'happy' ? 'M47 67 Q60 76 73 67 Z' : 'M49 68 Q60 74 71 68'}
      fill={mood === 'happy' ? '#FFFFFF' : 'none'}
      stroke="#0F172A"
      strokeWidth="3"
    />
    {/* glowing x orb badge */}
    <circle cx="60" cy="95" r="12" fill="#38BDF8" stroke="#0F172A" strokeWidth="3" />
    <text x="60" y="100" textAnchor="middle" fill="#0F172A" fontWeight="900" fontSize="15" fontFamily="monospace">
      x
    </text>
  </svg>
);

const OutputBotSVG: React.FC<{ mood: CharacterMood }> = ({ mood }) => (
  <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[3px_3px_0px_#0F172A]">
    <circle cx="60" cy="62" r="50" fill="#D1FAE5" stroke="#0F172A" strokeWidth="4" />
    {/* Antenna */}
    <line x1="60" y1="16" x2="60" y2="30" stroke="#0F172A" strokeWidth="4" />
    <circle cx="60" cy="14" r="6" fill="#FACC15" stroke="#0F172A" strokeWidth="3" />
    {/* Robot Ears */}
    <rect x="20" y="48" width="8" height="18" rx="3" fill="#F97316" stroke="#0F172A" strokeWidth="3" />
    <rect x="92" y="48" width="8" height="18" rx="3" fill="#F97316" stroke="#0F172A" strokeWidth="3" />
    {/* Robot Head */}
    <rect x="28" y="30" width="64" height="52" rx="12" fill="#10B981" stroke="#0F172A" strokeWidth="3.5" />
    {/* LED Screen Face */}
    <rect x="35" y="38" width="50" height="24" rx="6" fill="#0F172A" />
    <circle cx="48" cy="50" r="5" fill="#34D399" />
    <circle cx="72" cy="50" r="5" fill="#34D399" />
    {/* Speaker Mouth */}
    <rect x="42" y="68" width="36" height="7" rx="3" fill="#FEF08A" stroke="#0F172A" strokeWidth="2.5" />
    {mood === 'happy' && <line x1="50" y1="68" x2="50" y2="75" stroke="#0F172A" strokeWidth="2.5" />}
    {/* Chest Output Chute */}
    <rect x="34" y="84" width="52" height="22" rx="5" fill="#059669" stroke="#0F172A" strokeWidth="3.5" />
    <text x="60" y="99" textAnchor="middle" fill="#FFFFFF" fontWeight="900" fontSize="11" fontFamily="monospace">
      OUT=f(x)
    </text>
  </svg>
);

const ErrorMonsterSVG: React.FC<{ mood: CharacterMood }> = ({ mood }) => (
  <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[3px_3px_0px_#0F172A]">
    <circle cx="60" cy="62" r="50" fill={mood === 'defeated' ? '#E2E8F0' : '#FFE4E6'} stroke="#0F172A" strokeWidth="4" />
    {/* Crooked Horns */}
    <path d="M32 34 L20 14 L44 26 Z" fill="#A855F7" stroke="#0F172A" strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M88 34 L100 14 L76 26 Z" fill="#A855F7" stroke="#0F172A" strokeWidth="3.5" strokeLinejoin="round" />
    {/* Spiky Monster Body */}
    <path
      d="M24 62 C20 34, 42 24, 60 24 C78 24, 100 34, 96 62 C98 84, 84 98, 60 98 C36 98, 22 84, 24 62 Z"
      fill={mood === 'defeated' ? '#94A3B8' : '#E11D48'}
      stroke="#0F172A"
      strokeWidth="3.5"
    />
    {/* Eyes */}
    {mood === 'defeated' ? (
      <>
        {/* X eyes when defeated */}
        <path d="M39 45 L51 57 M51 45 L39 57" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
        <path d="M69 45 L81 57 M81 45 L69 57" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
      </>
    ) : (
      <>
        <circle cx="45" cy="51" r="8" fill="#FEF08A" stroke="#0F172A" strokeWidth="3" />
        <circle cx="46" cy="51" r="3.5" fill="#0F172A" />
        <circle cx="75" cy="51" r="8" fill="#FEF08A" stroke="#0F172A" strokeWidth="3" />
        <circle cx="74" cy="51" r="3.5" fill="#0F172A" />
        {/* Mischievous Eyebrows */}
        <line x1="36" y1="40" x2="54" y2="45" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="84" y1="40" x2="66" y2="45" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
      </>
    )}
    {/* Jagged Fang Mouth */}
    <path d="M38 70 Q60 82 82 70 L76 66 L68 73 L60 66 L52 73 L44 66 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
    {/* Bug Badge */}
    <rect x="44" y="84" width="32" height="18" rx="4" fill="#FACC15" stroke="#0F172A" strokeWidth="2.5" />
    <text x="60" y="97" textAnchor="middle" fill="#0F172A" fontWeight="900" fontSize="11" fontFamily="monospace">
      {mood === 'defeated' ? 'FIXED!' : 'BUG!'}
    </text>
  </svg>
);

interface AnimatedFunctionMachineSVGProps {
  inputValue: string | number;
  ruleDisplay: string;
  outputValue: string | number;
  isProcessing?: boolean;
  fnName?: string;
}

export const AnimatedFunctionMachineSVG: React.FC<AnimatedFunctionMachineSVGProps> = ({
  inputValue,
  ruleDisplay,
  outputValue,
  isProcessing = false,
  fnName = 'f'
}) => {
  return (
    <div className="relative w-full max-w-xl mx-auto select-none">
      <svg viewBox="0 0 560 250" className="w-full h-auto drop-shadow-[5px_5px_0px_#0F172A]">
        {/* Background Panel */}
        <rect x="8" y="8" width="544" height="234" rx="18" fill="#0F172A" />
        <rect x="14" y="14" width="532" height="222" rx="14" fill="#1E293B" stroke="#334155" strokeWidth="2" />

        {/* Input Pipe (Left) */}
        <path d="M 30 95 L 145 95 L 145 155 L 30 155 Z" fill="#38BDF8" stroke="#0F172A" strokeWidth="4" />
        <rect x="24" y="85" width="22" height="80" rx="6" fill="#0284C7" stroke="#0F172A" strokeWidth="4" />

        {/* Input Orb */}
        <g className={isProcessing ? 'animate-pulse' : ''}>
          <circle cx="88" cy="125" r="24" fill="#FEF08A" stroke="#0F172A" strokeWidth="4" />
          <text x="88" y="116" textAnchor="middle" fill="#0F172A" fontSize="10" fontWeight="800">
            INPUT x
          </text>
          <text x="88" y="135" textAnchor="middle" fill="#0F172A" fontSize="16" fontWeight="900" fontFamily="monospace">
            {inputValue}
          </text>
        </g>

        {/* Arrow into machine */}
        <polygon points="122,125 112,117 112,133" fill="#0F172A" />

        {/* Central Function Machine Body */}
        <rect x="145" y="34" width="270" height="182" rx="22" fill="#FACC15" stroke="#0F172A" strokeWidth="5" />
        <rect x="161" y="50" width="238" height="150" rx="14" fill="#FFFBEB" stroke="#0F172A" strokeWidth="4" />

        {/* Decorative Top Lights */}
        <circle cx="185" cy="24" r="8" fill="#EF4444" stroke="#0F172A" strokeWidth="3" />
        <circle cx="215" cy="24" r="8" fill="#F97316" stroke="#0F172A" strokeWidth="3" />
        <circle cx="245" cy="24" r="8" fill="#10B981" stroke="#0F172A" strokeWidth="3" />

        {/* Machine Header Plaque */}
        <rect x="195" y="60" width="170" height="28" rx="6" fill="#0F172A" />
        <text x="280" y="79" textAnchor="middle" fill="#FACC15" fontSize="13" fontWeight="900" letterSpacing="1">
          MACHINE {fnName.toUpperCase()}(x) RULE
        </text>

        {/* Rule Formula Screen */}
        <rect x="178" y="98" width="204" height="52" rx="8" fill="#0F172A" stroke="#38BDF8" strokeWidth="3" />
        <text x="280" y="130" textAnchor="middle" fill="#38BDF8" fontSize="20" fontWeight="900" fontFamily="monospace">
          {fnName}(x) = {ruleDisplay}
        </text>

        {/* Bottom Status Strip */}
        <text x="280" y="180" textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="800" fontFamily="monospace">
          {fnName}({inputValue}) ──► OUTPUT = {outputValue}
        </text>

        {/* Output Pipe (Right) */}
        <path d="M 415 95 L 530 95 L 530 155 L 415 155 Z" fill="#10B981" stroke="#0F172A" strokeWidth="4" />
        <rect x="514" y="85" width="22" height="80" rx="6" fill="#059669" stroke="#0F172A" strokeWidth="4" />

        {/* Output Orb */}
        <g>
          <circle cx="472" cy="125" r="24" fill="#A7F3D0" stroke="#0F172A" strokeWidth="4" />
          <text x="472" y="116" textAnchor="middle" fill="#0F172A" fontSize="9" fontWeight="800">
            {fnName}({inputValue})
          </text>
          <text x="472" y="135" textAnchor="middle" fill="#0F172A" fontSize="16" fontWeight="900" fontFamily="monospace">
            {outputValue}
          </text>
        </g>
      </svg>
    </div>
  );
};
