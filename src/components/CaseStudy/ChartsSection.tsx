interface ChartsSectionProps {
    ratingDistributionData?: CaseStudyChartData;
    avgRatingPerModuleData?: CaseStudyChartData;
    responseVolumeData?: CaseStudyChartData;
    metaResponses?: string;
}

const RATING_TINTS = [30, 48, 64, 80, 100];

const BarList = ({
    data,
    max,
    decimals = 0,
}: {
    data: CaseStudyChartData;
    max?: number;
    decimals?: number;
}) => {
    const labels = data.labels ?? [];
    const values = data.data ?? [];
    const scale = max ?? Math.max(...values, 1);

    return (
        <div>
            {labels.map((label, i) => {
                const value = values[i] ?? 0;
                const width = Math.min(100, (value / scale) * 100);
                return (
                    <div key={label} className="grid grid-cols-[minmax(0,120px)_1fr_40px] items-center gap-3 mb-3.5 last:mb-0">
                        <span className="font-mono text-[11px] text-[var(--aurora-muted)] truncate">{label}</span>
                        <div className="h-2 rounded-full bg-[var(--aurora-line)] overflow-hidden">
                            <div
                                className="h-full rounded-full"
                                style={{
                                    width: `${width}%`,
                                    background: 'linear-gradient(90deg, var(--aurora-peri), var(--aurora-lav))',
                                }}
                            />
                        </div>
                        <span className="font-mono text-[11px] text-[var(--aurora-text)] text-right">
                            {decimals ? value.toFixed(decimals) : value}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export const ChartsSection = ({
    ratingDistributionData,
    avgRatingPerModuleData,
    responseVolumeData,
    metaResponses,
}: ChartsSectionProps) => {
    const hasAny = ratingDistributionData || avgRatingPerModuleData || responseVolumeData;
    if (!hasAny) return null;

    const avgScore = ratingDistributionData
        ? (() => {
              const labels = ratingDistributionData.labels ?? [];
              const data = ratingDistributionData.data ?? [];
              let weightedSum = 0;
              let total = 0;
              labels.forEach((label, i) => {
                  const stars = parseFloat(label);
                  if (!isNaN(stars)) {
                      weightedSum += stars * (data[i] ?? 0);
                      total += data[i] ?? 0;
                  }
              });
              return total > 0 ? weightedSum / total : null;
          })()
        : null;

    const ratingTotal = (ratingDistributionData?.data ?? []).reduce((sum, v) => sum + v, 0);

    return (
        <section id="section-3" className="border-b border-[var(--aurora-line2)] py-16 px-8">
            {/* Section header */}
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-6 mb-11 items-end">
                <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--aurora-faint)]">
                    <span className="text-[var(--aurora-peri)]">03</span>
                    {' · Data & insights'}
                </div>
                <h2
                    className="font-serif leading-[1.02] tracking-[-0.02em] text-[var(--aurora-text)]"
                    style={{ fontSize: 'clamp(30px, 4.2vw, 54px)' }}
                >
                    Where the data lands.
                </h2>
            </div>

            {/* Bento data cards — elevated fills instead of a bordered spreadsheet */}
            <div className="grid lg:grid-cols-2 gap-5">
                {ratingDistributionData && (
                    <div className="rounded bg-[var(--aurora-bg2)] shadow-[inset_0_0_0_1px_var(--aurora-line)] p-7">
                        <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--aurora-muted)] mb-6">
                            Rating distribution
                        </h3>

                        {avgScore !== null && (
                            <div className="flex items-center gap-6 mb-6">
                                <div
                                    className="w-[76px] h-[76px] rounded-full flex-shrink-0 relative flex items-center justify-center"
                                    style={{
                                        background: `conic-gradient(var(--aurora-lav) 0 ${(avgScore / 5) * 100}%, var(--aurora-line2) ${(avgScore / 5) * 100}% 100%)`,
                                    }}
                                >
                                    <div className="absolute inset-[7px] rounded-full bg-[var(--aurora-bg2)]" />
                                    <span className="relative font-serif text-xl text-[var(--aurora-text)]">
                                        {avgScore.toFixed(1)}
                                    </span>
                                </div>
                                <div>
                                    <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--aurora-faint)]">
                                        Weighted average
                                    </div>
                                    <div className="font-serif text-[15px] text-[var(--aurora-muted)] mt-1">
                                        across {ratingTotal || metaResponses} responses
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex h-2.5 rounded-full overflow-hidden mb-3">
                            {(ratingDistributionData.labels ?? []).map((label, i) => {
                                const value = ratingDistributionData.data?.[i] ?? 0;
                                const width = ratingTotal > 0 ? (value / ratingTotal) * 100 : 0;
                                return (
                                    <span
                                        key={label}
                                        style={{
                                            width: `${width}%`,
                                            background: `color-mix(in srgb, var(--aurora-lav) ${RATING_TINTS[i % RATING_TINTS.length]}%, transparent)`,
                                        }}
                                    />
                                );
                            })}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                            {(ratingDistributionData.labels ?? []).map((label, i) => (
                                <div key={label} className="flex items-center gap-1.5">
                                    <span
                                        className="inline-block w-2 h-2 rounded-sm"
                                        style={{
                                            background: `color-mix(in srgb, var(--aurora-lav) ${RATING_TINTS[i % RATING_TINTS.length]}%, transparent)`,
                                        }}
                                    />
                                    <span className="font-mono text-[10px] text-[var(--aurora-muted)]">
                                        {label} {ratingDistributionData.data?.[i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {avgRatingPerModuleData && (
                    <div className="rounded bg-[var(--aurora-bg2)] shadow-[inset_0_0_0_1px_var(--aurora-line)] p-7">
                        <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--aurora-muted)] mb-6">
                            Avg. rating per module
                        </h3>
                        <BarList data={avgRatingPerModuleData} max={5} decimals={1} />
                    </div>
                )}

                {responseVolumeData && (
                    <div className="rounded bg-[var(--aurora-bg2)] shadow-[inset_0_0_0_1px_var(--aurora-line)] p-7 lg:col-span-2">
                        <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--aurora-muted)] mb-6">
                            Response volume by module
                        </h3>
                        <BarList data={responseVolumeData} />
                    </div>
                )}
            </div>
        </section>
    );
};
