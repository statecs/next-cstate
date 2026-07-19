import React from 'react';

/**
 * Placeholder for the project / case-study route while the entry is fetched.
 * Mirrors CaseStudyHeader's layout so the real content lands in roughly the
 * same place instead of snapping in over a blank screen.
 */
export const CaseStudySkeleton = () => (
    <div className="aurora-main min-h-screen" aria-busy="true" aria-label="Loading project">
        <div className="px-5 sm:px-8 pt-10 sm:pt-14 pb-6 max-w-6xl mx-auto">
            {/* eyebrow */}
            <div className="aurora-skel h-3 w-40 mb-8" />

            {/* title */}
            <div className="aurora-skel h-[clamp(38px,7vw,72px)] w-[85%] max-w-[640px] mb-4" />
            <div className="aurora-skel h-[clamp(38px,7vw,72px)] w-[55%] max-w-[420px] mb-8" />

            {/* subtitle */}
            <div className="aurora-skel h-4 w-[70%] max-w-[520px] mb-2.5" />
            <div className="aurora-skel h-4 w-[45%] max-w-[340px] mb-9" />

            {/* tags */}
            <div className="flex flex-wrap gap-2.5 mb-10">
                {[88, 72, 104, 80].map((w, i) => (
                    <div key={i} className="aurora-skel h-7 rounded-full" style={{ width: w }} />
                ))}
            </div>
        </div>

        {/* hero — same container + gutters as the text blocks above and below */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="aurora-skel h-[36vh] min-h-[200px] max-h-[440px] rounded-xl" />
        </div>

        {/* meta strip */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-7 grid grid-cols-2 sm:flex sm:gap-14 gap-6">
            {['Role', 'Tools', 'Duration'].map(label => (
                <div key={label}>
                    <div className="aurora-skel h-2.5 w-16 mb-2.5" />
                    <div className="aurora-skel h-4 w-32" />
                </div>
            ))}
        </div>
    </div>
);

export default CaseStudySkeleton;
