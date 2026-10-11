'use client';

/**
 * The hero's "scroll" cue, as a link to the section below. A plain #about link
 * already jumps there; the click handler makes it a smooth scroll (instant when
 * reduced motion is asked for) and moves focus along, so the next Tab starts
 * from the section rather than back in the hero.
 */
const AuroraScrollCue: React.FC<{ target?: string }> = ({ target = 'about' }) => (
    <a
        href={`#${target}`}
        className="aurora-scrollcue"
        aria-label="Scroll to About"
        onClick={e => {
            const el = document.getElementById(target);
            if (!el) return;
            e.preventDefault();
            const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
            el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
            if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
            el.focus({ preventScroll: true });
        }}
    >
        <span className="aurora-mouse" aria-hidden="true" />
        <span className="aurora-mono" aria-hidden="true">scroll</span>
    </a>
);

export default AuroraScrollCue;
