import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  X,
  Pen,
  Eraser,
  Square,
  Circle,
  ArrowUpRight,
  Type,
  Grid,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Maximize2,
  Minimize2,
  LayoutTemplate
} from 'lucide-react';

interface WhiteboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ToolMode = 'pen' | 'eraser' | 'rect' | 'circle' | 'arrow' | 'text';
type TemplateType = 'blank' | 'machine' | 'table' | 'coord' | 'steps';

const PEN_COLORS = [
  { name: 'Ink Black', hex: '#0F172A' },
  { name: 'Hero Red', hex: '#E11D48' },
  { name: 'Electric Blue', hex: '#0284C7' },
  { name: 'Emerald Green', hex: '#059669' },
  { name: 'Amber Gold', hex: '#D97706' },
  { name: 'Royal Purple', hex: '#7C3AED' }
];

export const WhiteboardModal: React.FC<WhiteboardModalProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<ToolMode>('pen');
  const [color, setColor] = useState<string>('#0F172A');
  const [brushSize, setBrushSize] = useState<number>(4);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [textToStamp, setTextToStamp] = useState<string>('f(x) = 3x + 2');

  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);

  const isDrawingRef = useRef<boolean>(false);
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const snapshotBeforeShapeRef = useRef<ImageData | null>(null);

  const saveSnapshotToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIdx + 1);
      return [...sliced.slice(-19), data];
    });
    setHistoryIdx((prev) => Math.min(19, prev + 1));
  }, [historyIdx]);

  const drawTemplateOnCanvas = useCallback(
    (template: TemplateType) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (showGrid) {
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 30) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 30) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }

      ctx.strokeStyle = '#0F172A';
      ctx.fillStyle = '#0F172A';
      ctx.lineWidth = 3;
      ctx.font = 'bold 18px "JetBrains Mono", monospace';

      if (template === 'machine') {
        // Function Machine diagram template
        ctx.strokeRect(320, 140, 320, 200);
        ctx.fillText('INPUT (x) ──►', 140, 245);
        ctx.fillText('FUNCTION RULE f(x)', 375, 180);
        ctx.fillText('──► OUTPUT f(x)', 660, 245);
      } else if (template === 'table') {
        // Input-Output Table template
        const startX = 220;
        const startY = 90;
        const w = 520;
        const rowH = 55;
        ctx.strokeRect(startX, startY, w, rowH * 6);
        for (let r = 1; r <= 5; r++) {
          ctx.beginPath();
          ctx.moveTo(startX, startY + r * rowH);
          ctx.lineTo(startX + w, startY + r * rowH);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(startX + 140, startY);
        ctx.lineTo(startX + 140, startY + rowH * 6);
        ctx.moveTo(startX + 360, startY);
        ctx.lineTo(startX + 360, startY + rowH * 6);
        ctx.stroke();
        ctx.fillText('Input x', startX + 30, startY + 35);
        ctx.fillText('Rule Work', startX + 190, startY + 35);
        ctx.fillText('Output f(x)', startX + 380, startY + 35);
      } else if (template === 'coord') {
        // Coordinate plane template
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        ctx.beginPath();
        ctx.moveTo(100, cy);
        ctx.lineTo(canvas.width - 100, cy);
        ctx.moveTo(cx, 40);
        ctx.lineTo(cx, canvas.height - 40);
        ctx.stroke();
        ctx.fillText('x (Input)', canvas.width - 190, cy - 12);
        ctx.fillText('f(x) (Output)', cx + 14, 65);
      } else if (template === 'steps') {
        // Step-by-step algebra workspace
        ctx.fillText('1. Given Function Rule:   f(x) =', 80, 90);
        ctx.fillText('2. Substitute Input ( ):  f(   ) =', 80, 190);
        ctx.fillText('3. Simplify Step-by-Step:', 80, 290);
        ctx.fillText('4. Final Output Statement:', 80, 390);
      }

      const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([snap]);
      setHistoryIdx(0);
    },
    [showGrid]
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => drawTemplateOnCanvas('blank'), 30);
    }
  }, [isOpen, drawTemplateOnCanvas]);

  if (!isOpen) return null;

  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getCanvasCoords(e);
    startPosRef.current = pos;

    if (tool === 'text') {
      ctx.fillStyle = color;
      ctx.font = `bold ${Math.max(18, brushSize * 5)}px "JetBrains Mono", monospace`;
      ctx.fillText(textToStamp, pos.x, pos.y);
      saveSnapshotToHistory();
      return;
    }

    isDrawingRef.current = true;
    snapshotBeforeShapeRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getCanvasCoords(e);

    if (tool === 'pen' || tool === 'eraser') {
      ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
      ctx.lineWidth = tool === 'eraser' ? brushSize * 5 : brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (snapshotBeforeShapeRef.current) {
      ctx.putImageData(snapshotBeforeShapeRef.current, 0, 0);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      const sx = startPosRef.current.x;
      const sy = startPosRef.current.y;

      if (tool === 'rect') {
        ctx.strokeRect(sx, sy, pos.x - sx, pos.y - sy);
      } else if (tool === 'circle') {
        const radius = Math.hypot(pos.x - sx, pos.y - sy);
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (tool === 'arrow') {
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        const angle = Math.atan2(pos.y - sy, pos.x - sx);
        const headLen = 15;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(
          pos.x - headLen * Math.cos(angle - Math.PI / 6),
          pos.y - headLen * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(
          pos.x - headLen * Math.cos(angle + Math.PI / 6),
          pos.y - headLen * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      }
    }
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    saveSnapshotToHistory();
  };

  const handleUndo = () => {
    if (historyIdx <= 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const prevIdx = historyIdx - 1;
    ctx.putImageData(history[prevIdx], 0, 0);
    setHistoryIdx(prevIdx);
  };

  const handleRedo = () => {
    if (historyIdx >= history.length - 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const nextIdx = historyIdx + 1;
    ctx.putImageData(history[nextIdx], 0, 0);
    setHistoryIdx(nextIdx);
  };

  const handleSaveSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'function-heroes-whiteboard.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Digital Mathematics Whiteboard"
      className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-2 sm:p-6"
    >
      <div
        className={`comic-panel bg-amber-100 rounded-2xl flex flex-col justify-between overflow-hidden ${
          isFullscreen ? 'w-full h-full' : 'w-full max-w-6xl h-[88vh]'
        }`}
      >
        {/* Top Whiteboard Toolbar */}
        <div className="bg-slate-900 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b-3 border-slate-950">
          <div className="flex items-center gap-2">
            <span className="font-comic-title text-2xl text-amber-300 tracking-wide">
              HERO DIGITAL MATH WHITEBOARD
            </span>
          </div>

          {/* Drawing Tools */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'pen', label: 'Pen', icon: Pen },
              { id: 'eraser', label: 'Eraser', icon: Eraser },
              { id: 'rect', label: 'Box', icon: Square },
              { id: 'circle', label: 'Circle', icon: Circle },
              { id: 'arrow', label: 'Arrow', icon: ArrowUpRight },
              { id: 'text', label: 'Math Stamp', icon: Type }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTool(item.id as ToolMode)}
                  className={`px-2.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 border cursor-pointer ${
                    tool === item.id
                      ? 'bg-amber-400 text-slate-950 border-white'
                      : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIdx <= 0}
              title="Undo"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIdx >= history.length - 1}
              title="Redo"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
            >
              <Redo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => drawTemplateOnCanvas('blank')}
              title="Clear Board"
              className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
            <button
              type="button"
              onClick={handleSaveSnapshot}
              title="Save Snapshot"
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save PNG</span>
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title="Fullscreen Whiteboard"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Whiteboard"
              className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Second Row: Colors, Brush Size, Math Equation Stamp & Ready-to-Use Templates */}
        <div className="bg-white px-4 py-2.5 border-b-2 border-slate-900 flex flex-wrap items-center justify-between gap-3">
          {/* Colors & Brush Size */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              {PEN_COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setColor(c.hex)}
                  aria-label={c.name}
                  className={`w-6 h-6 rounded-full border-2 cursor-pointer ${
                    color === c.hex ? 'border-slate-950 scale-125' : 'border-slate-300'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>

            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <span>Size:</span>
              <input
                type="range"
                min={2}
                max={14}
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-20 accent-slate-900"
              />
            </label>

            {tool === 'text' && (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={textToStamp}
                  onChange={(e) => setTextToStamp(e.target.value)}
                  placeholder="Equation or text to stamp..."
                  className="px-2.5 py-1 rounded border-2 border-slate-900 font-math font-bold text-xs w-44"
                />
                {['f(x) = ', 'x² + ', 'f(a + 2)'].map((eq) => (
                  <button
                    key={eq}
                    type="button"
                    onClick={() => setTextToStamp(eq)}
                    className="px-2 py-0.5 rounded bg-amber-100 border border-slate-900 font-math text-xs font-bold cursor-pointer"
                  >
                    {eq}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ready-to-Use Templates */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
              <LayoutTemplate className="w-3.5 h-3.5" /> Templates:
            </span>
            {[
              { id: 'machine', label: 'Function Machine' },
              { id: 'table', label: 'I/O Table' },
              { id: 'coord', label: 'Coordinate Plane' },
              { id: 'steps', label: 'Algebra Workspace' }
            ].map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => drawTemplateOnCanvas(tpl.id as TemplateType)}
                className="px-2.5 py-1 rounded-lg border-2 border-slate-900 bg-sky-100 hover:bg-sky-200 text-slate-950 font-bold text-xs cursor-pointer"
              >
                {tpl.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setShowGrid(!showGrid);
                setTimeout(() => drawTemplateOnCanvas('blank'), 10);
              }}
              className="px-2.5 py-1 rounded-lg border-2 border-slate-900 bg-slate-100 font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
          </div>
        </div>

        {/* Drawing Canvas Area */}
        <div className="flex-1 bg-slate-200 p-3 flex items-center justify-center overflow-hidden">
          <canvas
            ref={canvasRef}
            width={1100}
            height={600}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="w-full h-full bg-white rounded-xl border-3 border-slate-900 shadow-inner touch-none cursor-crosshair"
          />
        </div>
      </div>
    </div>
  );
};
