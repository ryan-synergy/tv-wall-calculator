'use client';
import { CalculatorResults } from '@/lib/types';
import { inchesToFeetInches } from '@/lib/calculations';

interface Props {
  results: CalculatorResults;
  onCopyLink: () => void;
  onExportPDF: () => void;
  copied: boolean;
}

function StatCard({ label, value, sub, warning }: { label: string; value: string; sub?: string; warning?: boolean }) {
  return (
    <div className={`rounded-xl p-4 border ${warning ? 'border-red-700 bg-red-950/30' : 'border-slate-700 bg-slate-800/50'}`}>
      <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1">{label}</p>
      <p className={`text-xl font-bold ${warning ? 'text-red-400' : 'text-white'}`}>{value}</p>
      {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
    </div>
  );
}

export default function ResultsPanel({ results, onCopyLink, onExportPDF, copied }: Props) {
  const { tv, recommendedDistance, floorToBottom, floorToTop, outletHeight, fitsOnWall, fitsHeightOnWall } = results;
  const fits = fitsOnWall && fitsHeightOnWall;

  return (
    <div className="space-y-4">
      {/* Fit warning */}
      {!fits && (
        <div className="rounded-xl p-4 border border-red-700 bg-red-950/40">
          <p className="text-red-400 font-bold text-sm">
            ⚠️ {!fitsOnWall ? 'TV is too wide for this wall.' : 'TV mount height exceeds wall height.'}
            {' '}Adjust TV size or wall dimensions.
          </p>
        </div>
      )}

      {/* TV Specs */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="TV Size"
          value={`${tv.diagonal}"`}
          sub="16:9 aspect ratio"
        />
        <StatCard
          label="Physical Size"
          value={`${tv.width}" × ${tv.height}"`}
          sub={`${tv.widthCm} × ${tv.heightCm} cm`}
        />
        <StatCard
          label="Recommended Distance"
          value={inchesToFeetInches(recommendedDistance)}
          sub={`${recommendedDistance}" from screen`}
        />
        <StatCard
          label="Floor to Bottom of TV"
          value={inchesToFeetInches(floorToBottom)}
          sub={`Top at ${inchesToFeetInches(floorToTop)}`}
          warning={floorToBottom < 18}
        />
        <StatCard
          label="Outlet Recommendation"
          value={inchesToFeetInches(outletHeight)}
          sub="above finished floor"
        />
        <StatCard
          label="Wall Fit"
          value={fits ? '✓ Fits' : '✗ Too Large'}
          warning={!fits}
        />
      </div>

      {/* Notes */}
      <div className="rounded-xl p-4 border border-slate-700 bg-slate-800/30 text-sm text-slate-400 space-y-1">
        <p className="font-semibold text-slate-300 mb-2">Installation Notes</p>
        <p>• Outlet should be centered horizontally behind TV</p>
        <p>• Use a low-voltage bracket or in-wall cable management</p>
        <p>• 4K: 1.5× diagonal viewing distance | 1080p: 2.5× diagonal</p>
        <p>• Structural stud or proper backing required for mounts over 100 lbs</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 print:hidden">
        <button
          onClick={onCopyLink}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-800 hover:bg-slate-700 py-3 text-slate-300 font-semibold text-sm transition-colors"
        >
          {copied ? '✓ Copied!' : '🔗 Copy Link'}
        </button>
        <button
          onClick={onExportPDF}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-amber-600 bg-amber-600/10 hover:bg-amber-600/20 py-3 text-amber-400 font-semibold text-sm transition-colors"
        >
          📄 Export PDF
        </button>
      </div>
    </div>
  );
}
