import Link from 'next/link';
import { ArrowUpRightIcon } from 'lucide-react';
import { PRODUCT_LINKS } from '@/utils/constants';
import { ProductIcon } from '@/components/AuroraProductLinks';

const liveCount = PRODUCT_LINKS.filter(a => !a.comingSoon).length;

/**
 * The apps from PRODUCT_LINKS as cards at the top of /projects: icon, name,
 * pitch, a short description and where it runs. The corner button opens the
 * live site in a new tab; the footer links to the app's project page when it
 * has one. Those
 * project pages are left out of the "Other projects" grid below, so an app is
 * listed once. An app flagged comingSoon is shown but not linked.
 */
const AuroraAppCards: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
    <section
        className={className ? `aurora-apps ${className}` : 'aurora-apps'}
        style={style}
        aria-labelledby="aurora-apps-title"
    >
        <div className="aurora-sec-head">
            <h2 id="aurora-apps-title">Apps I&apos;ve built</h2>
            <span className="aurora-mono">
                {liveCount} live · {PRODUCT_LINKS.length - liveCount} coming
            </span>
        </div>
        <ul className="aurora-apps-grid">
            {PRODUCT_LINKS.map(app => (
                <li key={app.key}>
                    <article
                        className={app.comingSoon ? 'aurora-apps-card soon' : 'aurora-apps-card'}
                        aria-labelledby={`aurora-app-${app.key}`}
                    >
                        <div className="aurora-apps-top">
                            <span className="aurora-apps-icon">
                                <ProductIcon product={app.key} size={18} />
                            </span>
                            <div className="aurora-apps-titles">
                                <h3 className="aurora-apps-name" id={`aurora-app-${app.key}`}>{app.label}</h3>
                                <p className="aurora-apps-blurb">{app.blurb}</p>
                            </div>
                            {!app.comingSoon && (
                                <a
                                    href={app.url}
                                    className="aurora-apps-open"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Open ${app.host} in a new tab`}
                                    title={`Open ${app.host}`}
                                >
                                    <ArrowUpRightIcon size={18} strokeWidth={1.6} aria-hidden="true" />
                                </a>
                            )}
                        </div>
                        <p className="aurora-apps-desc">{app.description}</p>
                        <div className="aurora-apps-foot">
                            {app.platforms && app.platforms.length > 0 && (
                                <ul className="aurora-apps-platforms" aria-label="Runs on">
                                    {app.platforms.map(p => (
                                        <li key={p}>{p}</li>
                                    ))}
                                </ul>
                            )}
                            {app.comingSoon ? (
                                <span className="aurora-apps-soon">Coming soon</span>
                            ) : (
                                app.projectSlug && (
                                    <Link
                                        href={`/projects/${app.projectSlug}`}
                                        className="aurora-apps-link"
                                        aria-label={`Read about the ${app.label} project`}
                                    >
                                        The project <span aria-hidden="true">→</span>
                                    </Link>
                                )
                            )}
                        </div>
                    </article>
                </li>
            ))}
        </ul>
    </section>
);

export default AuroraAppCards;
