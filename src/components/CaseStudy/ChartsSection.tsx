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

const RATING_COLORS = ['#facc15', '#f97316', '#22d3ee', '#4ade80', '#a78bfa'];

const VOLUME_COLORS = [
    'rgba(250,204,21,0.85)',
    'rgba(251,146,60,0.85)',
    'rgba(52,211,153,0.85)',
    'rgba(96,165,250,0.85)',
    'rgba(167,139,250,0.85)',
    'rgba(244,114,182,0.85)',
];

function ratingColor(value: number): string {
    if (value >= 4.5) return '#4ade80';
    if (value >= 4.0) return '#facc15';
    if (value >= 3.0) return '#f97316';
    return '#f87171';
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

    return (
        <section className="py-12 px-4 sm:px-8 bg-gray-50 dark:bg-zinc-900/50">
            <div className="max-w-5xl mx-auto">
                <p className="text-xs font-semibold uppercase tracking-widest text-yellow-500 mb-2">
                    {metaResponses ? `· LEARNER FEEDBACK · ${metaResponses}` : 'DATA & INSIGHTS'}
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10">
                    Data &amp; Insights
                </h2>
                <div className="grid gap-10 lg:grid-cols-2">
                    {ratingDistributionData && (
                        <div className="group cursor-default rounded-xl border border-zinc-700/50 bg-zinc-800/60 p-6 border-t-2 border-t-yellow-500/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 hover:border-zinc-600/70">
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
                                Rating Distribution
                            </h3>
                            <div className="flex justify-center">
                                <div className="relative w-56 h-56">
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
                                            plugins: {
                                                legend: { display: false },
                                            },
                                        }}
                                    />
                                    {avgScore && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                            <span className="text-2xl font-bold text-white">{avgScore}</span>
                                            <span className="text-yellow-400 text-sm">★ avg</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Custom HTML legend */}
                            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4">
                                {(ratingDistributionData.labels ?? []).map((label, i) => (
                                    <div key={label} className="flex items-center gap-1.5">
                                        <span
                                            className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: RATING_COLORS[i % RATING_COLORS.length] }}
                                        />
                                        <span className="text-xs text-zinc-400">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {avgRatingPerModuleData && (
                        <div className="group cursor-default rounded-xl border border-zinc-700/50 bg-zinc-800/60 p-6 border-t-2 border-t-yellow-500/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 hover:border-zinc-600/70">
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
                                Avg. Rating per Module
                            </h3>
                            <Bar
                                data={{
                                    labels: avgRatingPerModuleData.labels,
                                    datasets: [
                                        {
                                            data: avgRatingPerModuleData.data,
                                            backgroundColor: avgRatingPerModuleData.data.map(ratingColor),
                                            borderRadius: 8,
                                            barThickness: 20,
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    indexAxis: 'y' as const,
                                    animation: { duration: 600 },
                                    plugins: {
                                        legend: { display: false },
                                    },
                                    scales: {
                                        x: {
                                            min: 0,
                                            max: 5,
                                            grid: { display: false },
                                            ticks: { color: '#9ca3af', font: { size: 11 } },
                                        },
                                        y: {
                                            grid: { display: false },
                                            ticks: { color: '#9ca3af', font: { size: 11 } },
                                        },
                                    },
                                }}
                            />
                        </div>
                    )}

                    {responseVolumeData && (
                        <div className="group cursor-default rounded-xl border border-zinc-700/50 bg-zinc-800/60 p-6 border-t-2 border-t-blue-500/60 lg:col-span-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 hover:border-zinc-600/70">
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
                                Response Volume by Module
                            </h3>
                            <div className="h-56">
                                <Bar
                                    data={{
                                        labels: responseVolumeData.labels,
                                        datasets: [
                                            {
                                                data: responseVolumeData.data,
                                                backgroundColor: responseVolumeData.data.map(
                                                    (_, i) => VOLUME_COLORS[i % VOLUME_COLORS.length]
                                                ),
                                                borderRadius: 10,
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        animation: { duration: 600 },
                                        plugins: {
                                            legend: { display: false },
                                        },
                                        scales: {
                                            x: {
                                                grid: { display: false },
                                                ticks: { color: '#9ca3af', font: { size: 11 } },
                                            },
                                            y: {
                                                grid: { color: 'rgba(128,128,128,0.15)' },
                                                ticks: { color: '#9ca3af', font: { size: 11 } },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
