'use client';

import { MetricCard } from './metric-card';
import { formatCurrency, formatPercent, formatPBP } from '@/lib/format';
import type { CalculationResults } from '@/lib/types';

interface MetricsSectionProps {
  results: CalculationResults;
  targetPbp: number;
}

export function MetricsSection({ results, targetPbp }: MetricsSectionProps) {
  const pbpHighlight: 'green' | 'red' | 'amber' | null =
    results.pbp === null ? 'red' : results.pbpIsIdeal ? 'green' : 'amber';

  const npvHighlight: 'green' | 'red' | null =
    results.npv > 0 ? 'green' : results.npv < 0 ? 'red' : null;

  return (
    <section>
      <div className="flex items-center mb-2">
        <h2 className="text-sm font-semibold tracking-widest text-slate-600 dark:text-slate-400">
          KEY METRICS
        </h2>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
        <MetricCard
          id="metric-pbp"
          label="Payback Period"
          value={formatPBP(results.pbp)}
          highlight={pbpHighlight}
        />
        <MetricCard
          id="metric-roi"
          label="ROI"
          value={formatPercent(results.roi)}
          highlight={results.roi > 0 ? 'green' : results.roi < 0 ? 'red' : null}
        />
        <MetricCard
          id="metric-npv"
          label="NPV"
          value={isNaN(results.npv) ? '—' : `${results.npv >= 0 ? '+' : ''}${formatCurrency(results.npv)}`}
          highlight={npvHighlight}
        />
        <MetricCard
          id="metric-irr"
          label="IRR (Annual)"
          value={isNaN(results.irr) ? '—' : formatPercent(results.irr)}
          highlight={results.irr > 0 ? 'green' : results.irr < 0 ? 'red' : null}
        />
      </div>

      {results.pbp !== null && (
        <p className={`mt-3 text-xs font-medium ${results.pbpIsIdeal ? 'text-emerald-400' : 'text-amber-400'}`}>
          {results.pbpIsIdeal
            ? `PBP of ${results.pbp.toFixed(1)} months is within the ${targetPbp}-month target.`
            : `PBP of ${results.pbp.toFixed(1)} months exceeds the ${targetPbp}-month ideal target.`}
        </p>
      )}
    </section>
  );
}
