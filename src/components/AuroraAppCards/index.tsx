import { PRODUCT_LINKS } from '@/utils/constants';
import { ProductIcon } from '@/components/AuroraProductLinks';

/**
 * The apps from PRODUCT_LINKS as cards at the top of /projects: icon, name,
 * one-line pitch and domain, each opening the live site in a new tab. Kept out
 * of the filtered grid below, which is case studies and projects. An app flagged
 * comingSoon is shown but not linked.
 */
const AuroraAppCards: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
    <section
        className={className ? `aurora-apps ${className}` : 'aurora-apps'}
        style={style}
        aria-labelledby="aurora-apps-title"
    >
        <h2 id="aurora-apps-title" className="aurora-mono">Apps I&apos;ve built</h2>
        <ul className="aurora-apps-grid">
            {PRODUCT_LINKS.map(app => {
                const body = (
                    <>
                        <span className="aurora-apps-icon">
                            <ProductIcon product={app.key} size={18} />
                        </span>
                        <span className="aurora-apps-name">{app.label}</span>
                        <span className="aurora-apps-blurb">{app.blurb}</span>
                        <span className="aurora-apps-host">
                            {app.comingSoon ? (
                                'Coming soon'
                            ) : (
                                <>
                                    {app.host} <span aria-hidden="true">↗</span>
                                </>
                            )}
                        </span>
                    </>
                );
                return (
                    <li key={app.key}>
                        {app.comingSoon ? (
                            <div className="aurora-apps-card soon">{body}</div>
                        ) : (
                            <a
                                className="aurora-apps-card"
                                href={app.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${app.label} — ${app.blurb} (opens ${app.host} in a new tab)`}
                            >
                                {body}
                            </a>
                        )}
                    </li>
                );
            })}
        </ul>
    </section>
);

export default AuroraAppCards;
