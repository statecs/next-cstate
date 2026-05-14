'use client';

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

const RATING_COLORS = ['#E63322', '#0F0F0F', '#6B6B66', '#b5b5b0', '#e8e4da'];

const VOLUME_COLORS = [
    'rgba(230,51,34,0.85)',
    'rgba(15,15,15,0.80)',
    'rgba(107,107,102,0.75)',
    'rgba(181,181,176,0.70)',
    'rgba(230,51,34,0.60)',
    'rgba(15,15,15,0.55)',
];

function ratingColor(value: number): string {
    if (value >= 4.5) return '#0F0F0F';
    if (value >= 4.0) return '#E63322';
    if (value >= 3.0) return '#6B6B66';
    return '#b5b5b0';
}

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
              return total > 0 ? (weightedSum / total).toFixed(1) : null;
          })()
        : null;

    const tickColor = '#6B6B66';

    return (
        <section id="section-2" className="border-b border-zinc-900 dark:border-zinc-700 py-16 px-8 bg-[#F4F1EA] dark:bg-zinc-950">
            {/* 3-col section header */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr_220px] gap-6 mb-10 pb-8 border-b border-dashed border-zinc-200 dark:border-zinc-700">
                <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-400 pt-1">
                    <span className="text-red-600 dark:text-red-500">§02</span>
                    {' · DATA & INSIGHTS'}
                </div>
                <h2
                    className="font-serif leading-[0.94] tracking-[-0.025em] text-zinc-900 dark:text-zinc-50"
                    style={{ fontSize: 'clamp(32px, 5vw, 72px)' }}
                >
                    Where the data lands.
                </h2>
                <div className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 sm:text-right pt-1">
                    {metaResponses ? `${metaResponses} responses` : ''}
                </div>
            </div>

            {/* Charts grid */}
            <div className="grid gap-px border border-zinc-900 dark:border-zinc-700 lg:grid-cols-2 bg-zinc-900 dark:bg-zinc-700">
                {ratingDistributionData && (
                    <div className="bg-[#F4F1EA] dark:bg-zinc-950 p-6">
                        <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400 mb-6">
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
                                        <span className="font-serif text-2xl text-zinc-900 dark:text-zinc-50">{avgScore}</span>
                                        <span className="font-mono text-[10px] text-red-600 dark:text-red-500 uppercase tracking-[0.08em]">avg</span>
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
                                    <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {avgRatingPerModuleData && (
                    <div className="bg-[#F4F1EA] dark:bg-zinc-950 p-6">
                        <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400 mb-6">
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
                    <div className="bg-[#F4F1EA] dark:bg-zinc-950 p-6 lg:col-span-2">
                        <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400 mb-6">
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
                                            grid: { color: 'rgba(15,15,15,0.08)' },
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
