'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SizeTiles from '@/components/SizeTiles';
import Controls from '@/components/Controls';
import RoomDiagram from '@/components/RoomDiagram';
import ResultsPanel from '@/components/ResultsPanel';
import { CalculatorState } from '@/lib/types';
import { calculate, recommendedViewingDistance } from '@/lib/calculations';

const DEFAULT_STATE: CalculatorState = {
  tvSize: 75,
  customSize: '',
  wallWidth: 144,   // 12 feet
  wallHeight: 108,  // 9 feet
  mountHeight: 57,
  viewingDistance: 112,
  viewingDistanceAuto: true,
  hasFireplace: false,
  fireplaceHeight: 42,
  multipleTV: false,
  gridLayout: '1x2',
};

function parseState(params: URLSearchParams): CalculatorState {
  return {
    tvSize: parseInt(params.get('tvSize') || '75'),
    customSize: params.get('customSize') || '',
    wallWidth: parseFloat(params.get('wallWidth') || '144'),
    wallHeight: parseFloat(params.get('wallHeight') || '108'),
    mountHeight: parseFloat(params.get('mountHeight') || '57'),
    viewingDistance: parseFloat(params.get('viewingDistance') || '112'),
    viewingDistanceAuto: params.get('viewingDistanceAuto') !== 'false',
    hasFireplace: params.get('hasFireplace') === 'true',
    fireplaceHeight: parseFloat(params.get('fireplaceHeight') || '42'),
    multipleTV: params.get('multipleTV') === 'true',
    gridLayout: (params.get('gridLayout') as CalculatorState['gridLayout']) || '1x2',
  };
}

function stateToParams(state: CalculatorState): URLSearchParams {
  const p = new URLSearchParams();
  Object.entries(state).forEach(([k, v]) => p.set(k, String(v)));
  return p;
}

function CalculatorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<CalculatorState>(() => {
    if (typeof window !== 'undefined' && searchParams.toString()) {
      return parseState(searchParams);
    }
    return DEFAULT_STATE;
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (searchParams.toString()) {
      setState(parseState(searchParams));
    }
  }, []);// eslint-disable-line

  const updateState = useCallback((updates: Partial<CalculatorState>) => {
    setState(prev => {
      const next = { ...prev, ...updates };
      // auto-update viewing distance
      if (next.viewingDistanceAuto) {
        const sz = next.tvSize === 0 ? (parseFloat(next.customSize) || 65) : next.tvSize;
        next.viewingDistance = recommendedViewingDistance(sz);
      }
      // sync URL
      const params = stateToParams(next);
      router.replace(`?${params.toString()}`, { scroll: false });
      return next;
    });
  }, [router]);

  const handleSizeSelect = (size: number) => {
    const sz = size === 0 ? (parseFloat(state.customSize) || 65) : size;
    updateState({
      tvSize: size,
      viewingDistance: state.viewingDistanceAuto ? recommendedViewingDistance(sz) : state.viewingDistance,
    });
  };

  const results = calculate(state);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10 print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">TV Wall Calculator</h1>
            <p className="text-slate-500 text-xs">Professional AV Planning Tool</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-600 text-xs">by Synergy AV</span>
          </div>
        </div>
      </header>

      {/* Print Header */}
      <div className="hidden print:block p-8 border-b">
        <h1 className="text-2xl font-bold">TV Wall Calculator — Synergy AV</h1>
        <p className="text-gray-500">Professional Installation Planning Report</p>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Size Tiles — HERO */}
        <section className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <SizeTiles
            selected={state.tvSize}
            customSize={state.customSize}
            onSelect={handleSizeSelect}
            onCustomChange={(v) => updateState({ customSize: v, viewingDistanceAuto: state.viewingDistanceAuto })}
          />
        </section>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
          {/* Left: Controls */}
          <aside className="print:hidden">
            <Controls state={state} onChange={updateState} />
          </aside>

          {/* Right: Diagram + Results */}
          <div className="space-y-6">
            <section className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-3">
                Room Diagram — Live Preview
              </p>
              <RoomDiagram state={state} results={results} />
            </section>

            <section className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-4">
                Specifications & Results
              </p>
              <ResultsPanel
                results={results}
                onCopyLink={handleCopyLink}
                onExportPDF={handleExportPDF}
                copied={copied}
              />
            </section>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 mt-12 py-6 text-center print:hidden">
        <p className="text-slate-600 text-xs">Synergy AV — TV Wall Calculator · Professional Sales Tool</p>
      </footer>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading calculator...</div>
      </div>
    }>
      <CalculatorInner />
    </Suspense>
  );
}
