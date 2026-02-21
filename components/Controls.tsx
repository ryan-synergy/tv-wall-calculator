'use client';
import { CalculatorState } from '@/lib/types';

interface Props {
  state: CalculatorState;
  onChange: (updates: Partial<CalculatorState>) => void;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1.5">
      {children}
    </label>
  );
}

function NumberInput({ value, onChange, min, max, step = 1, suffix }: {
  value: number; onChange: (v: number) => void;
  min?: number; max?: number; step?: number; suffix?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-24 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
      />
      {suffix && <span className="text-slate-500 text-sm">{suffix}</span>}
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors mr-2
        ${checked ? 'bg-amber-400' : 'bg-slate-600'}
      `}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

export default function Controls({ state, onChange }: Props) {
  const wallWidthFt = Math.floor(state.wallWidth / 12);
  const wallWidthIn = Math.round(state.wallWidth % 12);
  const wallHeightFt = Math.floor(state.wallHeight / 12);
  const wallHeightIn = Math.round(state.wallHeight % 12);

  return (
    <div className="space-y-6">
      {/* Wall Dimensions */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <Label>Wall Dimensions</Label>
        <div className="space-y-3">
          <div>
            <span className="text-slate-500 text-xs mb-1 block">Width</span>
            <div className="flex items-center gap-2">
              <NumberInput
                value={wallWidthFt} min={0} max={50}
                onChange={(v) => onChange({ wallWidth: v * 12 + wallWidthIn })}
                suffix="ft"
              />
              <NumberInput
                value={wallWidthIn} min={0} max={11}
                onChange={(v) => onChange({ wallWidth: wallWidthFt * 12 + v })}
                suffix="in"
              />
            </div>
          </div>
          <div>
            <span className="text-slate-500 text-xs mb-1 block">Height</span>
            <div className="flex items-center gap-2">
              <NumberInput
                value={wallHeightFt} min={0} max={30}
                onChange={(v) => onChange({ wallHeight: v * 12 + wallHeightIn })}
                suffix="ft"
              />
              <NumberInput
                value={wallHeightIn} min={0} max={11}
                onChange={(v) => onChange({ wallHeight: wallHeightFt * 12 + v })}
                suffix="in"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mount Height */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <Label>Mount Height (floor to TV center)</Label>
        <NumberInput
          value={state.mountHeight} min={12} max={120}
          onChange={(v) => onChange({ mountHeight: v })}
          suffix="inches"
        />
        <p className="text-slate-500 text-xs mt-2">Standard eye level: 57" (living room), 48" (bedroom)</p>
      </div>

      {/* Viewing Distance */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <Label>Viewing Distance</Label>
        <div className="flex items-center mb-3">
          <Toggle
            checked={state.viewingDistanceAuto}
            onChange={(v) => onChange({ viewingDistanceAuto: v })}
            label=""
          />
          <span className="text-slate-400 text-sm">Auto-calculate (recommended)</span>
        </div>
        {!state.viewingDistanceAuto && (
          <NumberInput
            value={state.viewingDistance} min={24} max={480}
            onChange={(v) => onChange({ viewingDistance: v })}
            suffix="inches"
          />
        )}
      </div>

      {/* Fireplace */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center mb-3">
          <Toggle
            checked={state.hasFireplace}
            onChange={(v) => onChange({ hasFireplace: v })}
            label=""
          />
          <Label>Fireplace / Obstruction</Label>
        </div>
        {state.hasFireplace && (
          <div>
            <span className="text-slate-500 text-xs mb-1 block">Obstruction height from floor</span>
            <NumberInput
              value={state.fireplaceHeight} min={0} max={84}
              onChange={(v) => onChange({ fireplaceHeight: v })}
              suffix="inches"
            />
          </div>
        )}
      </div>
    </div>
  );
}
