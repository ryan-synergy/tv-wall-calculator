'use client';

const SIZES = [55, 65, 75, 85, 98, 110];

interface Props {
  selected: number;
  customSize: string;
  onSelect: (size: number) => void;
  onCustomChange: (val: string) => void;
}

export default function SizeTiles({ selected, customSize, onSelect, onCustomChange }: Props) {
  return (
    <div className="w-full">
      <p className="text-slate-400 text-xs uppercase tracking-widest mb-3 font-semibold">
        Select TV Size (diagonal)
      </p>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {SIZES.map((size) => {
          const active = selected === size;
          return (
            <button
              key={size}
              onClick={() => onSelect(size)}
              className={`
                flex flex-col items-center justify-center rounded-xl border-2 py-4 px-2
                transition-all duration-150 font-bold cursor-pointer select-none
                ${active
                  ? 'border-amber-400 bg-amber-400/10 text-amber-400 shadow-lg shadow-amber-400/10'
                  : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
                }
              `}
            >
              <span className="text-2xl">{size}"</span>
              <span className="text-xs text-slate-500 mt-1 font-normal">16:9</span>
            </button>
          );
        })}

        {/* Custom */}
        <button
          onClick={() => onSelect(0)}
          className={`
            flex flex-col items-center justify-center rounded-xl border-2 py-4 px-2
            transition-all duration-150 font-bold cursor-pointer select-none
            ${selected === 0
              ? 'border-amber-400 bg-amber-400/10 text-amber-400 shadow-lg shadow-amber-400/10'
              : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
            }
          `}
        >
          <span className="text-xl">Custom</span>
          <span className="text-xs text-slate-500 mt-1 font-normal">16:9</span>
        </button>
      </div>

      {selected === 0 && (
        <div className="mt-3 flex items-center gap-3">
          <input
            type="number"
            min={20}
            max={220}
            placeholder="e.g. 120"
            value={customSize}
            onChange={(e) => onCustomChange(e.target.value)}
            className="w-32 bg-slate-800 border border-amber-400 rounded-lg px-3 py-2 text-white text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <span className="text-slate-400">inches diagonal</span>
        </div>
      )}
    </div>
  );
}
