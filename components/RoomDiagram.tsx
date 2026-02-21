'use client';
import { CalculatorState, CalculatorResults } from '@/lib/types';
import { inchesToFeetInches } from '@/lib/calculations';

interface Props {
  state: CalculatorState;
  results: CalculatorResults;
}

export default function RoomDiagram({ state, results }: Props) {
  const SVG_W = 520;
  const SVG_H = 380;
  const PAD = 40;

  const wallW = state.wallWidth || 120;
  const wallH = state.wallHeight || 108;

  const scaleX = (SVG_W - PAD * 2) / wallW;
  const scaleY = (SVG_H - PAD * 2 - 60) / wallH; // 60px for floor viewing distance
  const scale = Math.min(scaleX, scaleY);

  const drawW = wallW * scale;
  const drawH = wallH * scale;
  const originX = (SVG_W - drawW) / 2;
  const originY = PAD;

  // TV position
  const tvW = results.tv.width * scale;
  const tvH = results.tv.height * scale;
  const tvX = originX + (drawW - tvW) / 2;
  const tvY = originY + drawH - (state.mountHeight + results.tv.height / 2) * scale;

  // Outlet
  const outletY = originY + drawH - results.outletHeight * scale;
  const centerX = originX + drawW / 2;

  // Fireplace
  const fpW = 48 * scale; // standard 4ft fireplace
  const fpH = state.fireplaceHeight * scale;
  const fpX = originX + (drawW - fpW) / 2;
  const fpY = originY + drawH - fpH;

  // Viewing distance line (floor level)
  const floorY = originY + drawH;
  const vdScale = Math.min(results.recommendedDistance * scale, drawW * 0.9);

  const fits = results.fitsOnWall && results.fitsHeightOnWall;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full rounded-lg border border-slate-700"
        style={{ background: '#0f172a', maxHeight: 420 }}
      >
        {/* Wall outline */}
        <rect
          x={originX} y={originY}
          width={drawW} height={drawH}
          fill="#1e293b" stroke="#475569" strokeWidth="2" rx="2"
        />

        {/* Wall dimension labels */}
        <text x={originX + drawW / 2} y={originY - 10} textAnchor="middle" fill="#64748b" fontSize="11">
          {inchesToFeetInches(wallW)} wide
        </text>
        <text
          x={originX - 12} y={originY + drawH / 2}
          textAnchor="middle" fill="#64748b" fontSize="11"
          transform={`rotate(-90, ${originX - 12}, ${originY + drawH / 2})`}
        >
          {inchesToFeetInches(wallH)} tall
        </text>

        {/* Fireplace */}
        {state.hasFireplace && state.fireplaceHeight > 0 && (
          <>
            <rect x={fpX} y={fpY} width={fpW} height={fpH} fill="#374151" stroke="#6b7280" strokeWidth="1.5" rx="2" />
            <text x={fpX + fpW / 2} y={fpY + fpH / 2 + 4} textAnchor="middle" fill="#9ca3af" fontSize="10">
              Fireplace
            </text>
          </>
        )}

        {/* Center dashed line */}
        <line
          x1={centerX} y1={originY + 8}
          x2={centerX} y2={originY + drawH - 8}
          stroke="#334155" strokeWidth="1" strokeDasharray="4 4"
        />

        {/* TV */}
        {results.fitsOnWall && results.fitsHeightOnWall && tvY > originY && (
          <>
            <rect
              x={tvX} y={tvY}
              width={tvW} height={tvH}
              fill={fits ? '#1d4ed8' : '#7f1d1d'}
              stroke={fits ? '#3b82f6' : '#ef4444'}
              strokeWidth="2" rx="3"
            />
            {/* TV screen inner */}
            <rect
              x={tvX + 3} y={tvY + 3}
              width={tvW - 6} height={tvH - 6}
              fill={fits ? '#1e3a8a' : '#991b1b'}
              rx="2"
            />
            {/* TV size label */}
            <text
              x={tvX + tvW / 2} y={tvY + tvH / 2 + 4}
              textAnchor="middle" fill="white" fontSize="12" fontWeight="bold"
            >
              {results.tv.diagonal}"
            </text>

            {/* TV width dimension */}
            <line x1={tvX} y1={tvY - 8} x2={tvX + tvW} y2={tvY - 8} stroke="#f59e0b" strokeWidth="1" />
            <line x1={tvX} y1={tvY - 12} x2={tvX} y2={tvY - 4} stroke="#f59e0b" strokeWidth="1" />
            <line x1={tvX + tvW} y1={tvY - 12} x2={tvX + tvW} y2={tvY - 4} stroke="#f59e0b" strokeWidth="1" />
            <text x={tvX + tvW / 2} y={tvY - 12} textAnchor="middle" fill="#f59e0b" fontSize="10">
              {results.tv.width}"
            </text>
          </>
        )}

        {/* Outlet marker */}
        {results.fitsOnWall && (
          <>
            <circle cx={centerX} cy={outletY} r="5" fill="#10b981" stroke="#34d399" strokeWidth="1.5" />
            <text x={centerX + 10} y={outletY + 4} fill="#34d399" fontSize="9">
              outlet {inchesToFeetInches(results.outletHeight)} AFF
            </text>
          </>
        )}

        {/* Mount height label */}
        {results.fitsOnWall && results.fitsHeightOnWall && tvY > originY && (
          <>
            <line
              x1={originX + drawW + 8} y1={floorY}
              x2={originX + drawW + 8} y2={tvY + tvH / 2}
              stroke="#64748b" strokeWidth="1" strokeDasharray="3 3"
            />
            <text
              x={originX + drawW + 16}
              y={(floorY + tvY + tvH / 2) / 2 + 4}
              fill="#64748b" fontSize="9"
            >
              {inchesToFeetInches(state.mountHeight)}
            </text>
          </>
        )}

        {/* Viewing distance indicator */}
        <line x1={centerX} y1={floorY} x2={centerX} y2={floorY + 30} stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
        <line
          x1={centerX - vdScale / 2} y1={floorY + 25}
          x2={centerX + vdScale / 2} y2={floorY + 25}
          stroke="#7c3aed" strokeWidth="1.5"
        />
        <circle cx={centerX - vdScale / 2} cy={floorY + 25} r="3" fill="#7c3aed" />
        <circle cx={centerX + vdScale / 2} cy={floorY + 25} r="3" fill="#7c3aed" />
        <text x={centerX} y={floorY + 38} textAnchor="middle" fill="#a78bfa" fontSize="10">
          Recommended {inchesToFeetInches(results.recommendedDistance)} viewing distance
        </text>

        {/* Fit warning */}
        {(!results.fitsOnWall || !results.fitsHeightOnWall) && (
          <>
            <rect x={originX + 8} y={originY + 8} width={drawW - 16} height={36} fill="#7f1d1d" rx="4" opacity="0.9" />
            <text x={originX + drawW / 2} y={originY + 32} textAnchor="middle" fill="#fca5a5" fontSize="13" fontWeight="bold">
              ⚠ TV does not fit on this wall
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
