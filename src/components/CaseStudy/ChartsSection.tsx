'use client';

import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface ChartsSectionProps {
    ratingDistributionData?: CaseStudyChartData;
    avgRatingPerModuleData?: CaseStudyChartData;
    responseVolumeData?: CaseStudyChartData;
    metaResponses?: string;
}

function useIsLight() {
    const [isLight, setIsLight] = useState(() =>
        typeof window !== 'undefined' && document.documentElement.classList.contains('light')
    );
    useEffect(() => {
        const obs = new MutationObserver(() =>
            setIsLight(document.documentElement.classList.contains('light'))
        );
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => obs.disconnect();
    }, []);
    return isLight;
}

export const ChartsSection = ({
    ratingDistributionData,
    avgRatingPerModuleData,
    responseVolumeData,
    metaResponses,
}: ChartsSectionProps) => {
    const isLight = useIsLight();
    const hasAny = ratingDistributionData || avgRatingPerModuleData || responseVolumeData;
    if (!hasAny) return null;

    // lav: dark rgb(201,182,255) / light rgb(124,95,207)
    const lav = isLight ? '124,95,207' : '201,182,255';
    // peri: dark rgb(106,168,255) / light rgb(46,111,212)
    const peri = isLight ? '46,111,212' : '106,168,255';

    // Light mode needs higher minimum opacity — pale bg washes out subtle tints
    const [o1, o2, o3, o4, o5] = isLight
        ? [0.30, 0.48, 0.64, 0.80, 0.94]
        : [0.20, 0.38, 0.56, 0.74, 0.90];

    const RATING_COLORS = [
        `rgba(${lav},${o1})`,
        `rgba(${lav},${o2})`,
        `rgba(${lav},${o3})`,
        `rgba(${lav},${o4})`,
        `rgba(${lav},${o5})`,
    ];

    const [vHi, vLo] = isLight ? [0.80, 0.68] : [0.72, 0.62];
    const VOLUME_COLORS = [
        `rgba(${peri},${vHi})`,
        `rgba(${peri},${vLo})`,
        `rgba(${peri},${vHi})`,
        `rgba(${peri},${vLo})`,
        `rgba(${peri},${vHi})`,
        `rgba(${peri},${vLo})`,
    ];

    const [rc1, rc2, rc3, rc4] = isLight
        ? [0.94, 0.76, 0.54, 0.32]
        : [0.90, 0.68, 0.44, 0.22];

    const ratingColor = (value: number): string => {
        if (value >= 4.5) return `rgba(${lav},${rc1})`;
        if (value >= 4.0) return `rgba(${lav},${rc2})`;
        if (value >= 3.0) return `rgba(${lav},${rc3})`;
        return `rgba(${lav},${rc4})`;
    };

    const tickColor = isLight ? '#5c556e' : '#9d97ab';
    const gridColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
    const cellCls = isLight ? 'p-6' : 'bg-[var(--aurora-bg)]/70 backdrop-blur-sm p-6';

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
              return total > 0 ? (weightedSum / total).toFixed(1) : null;
          })()
        : null;

    return (
        <section id="section-2" className="border-b border-[var(--aurora-line2)] py-16 px-8">
            {/* 3-col section header */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr_220px] gap-6 mb-10 pb-8 border-b border-dashed border-[var(--aurora-line)]">
                <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--aurora-muted)] pt-1">
                    <span className="text-[var(--aurora-peri)]">§02</span>
                    {' · DATA & INSIGHTS'}
                </div>
                <h2
                    className="font-serif leading-[0.94] tracking-[-0.025em] text-[var(--aurora-text)]"
                    style={{ fontSize: 'clamp(32px, 5vw, 72px)' }}
                >
                    Where the data lands.
                </h2>
                <div className="font-mono text-[11px] text-[var(--aurora-faint)] sm:text-right pt-1">
                    {metaResponses ? `${metaResponses} responses` : ''}
                </div>
            </div>

            {/* Charts grid */}
            <div className="grid lg:grid-cols-2 gap-8">
                {ratingDistributionData && (
                    <div className={cellCls}>
                        <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--aurora-muted)] mb-6">
                            Rating Distribution
                        </h3>
                        <div className="flex justify-center">
                            <div className="relative w-52 h-52">
                                <Doughnut
                                    data={{
                                        labels: ratingDistributionData.labels,
                                        datasets: [
                                            {
                                                data: ratingDistributionData.data,
                                                backgroundColor: RATING_COLORS,
                                                borderWidth: 0,
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        cutout: '72%',
                                        animation: { animateRotate: true, duration: 800 },
                                        plugins: { legend: { display: false } },
                                    }}
                                />
                                {avgScore && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="font-serif text-2xl text-[var(--aurora-text)]">{avgScore}</span>
                                        <span className="font-mono text-[10px] text-[var(--aurora-peri)] uppercase tracking-[0.08em]">avg</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4">
                            {(ratingDistributionData.labels ?? []).map((label, i) => (
                                <div key={label} className="flex items-center gap-1.5">
                                    <span
                                        className="inline-block w-2 h-2 flex-shrink-0"
                                        style={{ backgroundColor: RATING_COLORS[i % RATING_COLORS.length] }}
                                    />
                                    <span className="font-mono text-[10px] text-[var(--aurora-muted)]">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {avgRatingPerModuleData && (
                    <div className={cellCls}>
                        <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--aurora-muted)] mb-6">
                            Avg. Rating per Module
                        </h3>
                        <Bar
                            data={{
                                labels: avgRatingPerModuleData.labels,
                                datasets: [
                                    {
                                        data: avgRatingPerModuleData.data,
                                        backgroundColor: avgRatingPerModuleData.data.map(ratingColor),
                                        borderRadius: 0,
                                        barThickness: 18,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                indexAxis: 'y' as const,
                                animation: { duration: 600 },
                                plugins: { legend: { display: false } },
                                scales: {
                                    x: {
                                        min: 0,
                                        max: 5,
                                        grid: { display: false },
                                        ticks: { color: tickColor, font: { size: 11, family: 'monospace' } },
                                    },
                                    y: {
                                        grid: { display: false },
                                        ticks: { color: tickColor, font: { size: 11, family: 'monospace' } },
                                    },
                                },
                            }}
                        />
                    </div>
                )}

                {responseVolumeData && (
                    <div className={`${cellCls} lg:col-span-2`}>
                        <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--aurora-muted)] mb-6">
                            Response Volume by Module
                        </h3>
                        <div className="h-52">
                            <Bar
                                data={{
                                    labels: responseVolumeData.labels,
                                    datasets: [
                                        {
                                            data: responseVolumeData.data,
                                            backgroundColor: responseVolumeData.data.map(
                                                (_, i) => VOLUME_COLORS[i % VOLUME_COLORS.length]
                                            ),
                                            borderRadius: 0,
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    animation: { duration: 600 },
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        x: {
                                            grid: { display: false },
                                            ticks: { color: tickColor, font: { size: 11, family: 'monospace' } },
                                        },
                                        y: {
                                            grid: { color: gridColor },
                                            ticks: { color: tickColor, font: { size: 11, family: 'monospace' } },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
