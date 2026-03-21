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
}

const CHART_COLORS = [
    'rgba(250, 204, 21, 0.85)',
    'rgba(96, 165, 250, 0.85)',
    'rgba(52, 211, 153, 0.85)',
    'rgba(251, 146, 60, 0.85)',
    'rgba(167, 139, 250, 0.85)',
];

const baseBarOptions = {
    responsive: true,
    plugins: {
        legend: { display: false },
    },
    scales: {
        x: {
            grid: { color: 'rgba(128,128,128,0.15)' },
            ticks: { color: '#9ca3af', font: { size: 11 } },
        },
        y: {
            grid: { color: 'rgba(128,128,128,0.15)' },
            ticks: { color: '#9ca3af', font: { size: 11 } },
        },
    },
};

export const ChartsSection = ({
    ratingDistributionData,
    avgRatingPerModuleData,
    responseVolumeData,
}: ChartsSectionProps) => {
    const hasAny = ratingDistributionData || avgRatingPerModuleData || responseVolumeData;
    if (!hasAny) return null;

    return (
        <section className="py-12 px-4 sm:px-8 bg-gray-50 dark:bg-zinc-900/50">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-10">
                    Data &amp; Insights
                </h2>
                <div className="grid gap-10 lg:grid-cols-2">
                    {ratingDistributionData && (
                        <div className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                                Rating Distribution
                            </h3>
                            <div className="flex justify-center">
                                <div className="w-56 h-56">
                                    <Doughnut
                                        data={{
                                            labels: ratingDistributionData.labels,
                                            datasets: [
                                                {
                                                    data: ratingDistributionData.data,
                                                    backgroundColor: CHART_COLORS,
                                                    borderWidth: 0,
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: {
                                                    position: 'bottom',
                                                    labels: { color: '#9ca3af', font: { size: 11 } },
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {avgRatingPerModuleData && (
                        <div className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                                Avg. Rating per Module
                            </h3>
                            <Bar
                                data={{
                                    labels: avgRatingPerModuleData.labels,
                                    datasets: [
                                        {
                                            data: avgRatingPerModuleData.data,
                                            backgroundColor: 'rgba(250, 204, 21, 0.75)',
                                            borderRadius: 6,
                                        },
                                    ],
                                }}
                                options={{
                                    ...baseBarOptions,
                                    indexAxis: 'y' as const,
                                    scales: {
                                        ...baseBarOptions.scales,
                                        x: {
                                            ...baseBarOptions.scales.x,
                                            min: 0,
                                            max: 5,
                                        },
                                    },
                                }}
                            />
                        </div>
                    )}

                    {responseVolumeData && (
                        <div className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6 lg:col-span-2">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                                Response Volume by Module
                            </h3>
                            <Bar
                                data={{
                                    labels: responseVolumeData.labels,
                                    datasets: [
                                        {
                                            data: responseVolumeData.data,
                                            backgroundColor: 'rgba(96, 165, 250, 0.75)',
                                            borderRadius: 6,
                                        },
                                    ],
                                }}
                                options={baseBarOptions}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
