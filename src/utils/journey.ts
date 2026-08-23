/**
 * Ordering for the journey timeline. The home page renders the first page on
 * the server and the client fetches the rest from /api/journey, so both sides
 * have to agree on the sequence exactly — hence one shared helper.
 */

/** Contentful stores a full date; the timeline groups and labels by year alone. */
export const toJourneyYear = (value: string) => new Date(value).getFullYear().toString();

/**
 * Newest first, with `year` normalised to the label the timeline shows.
 * Array.prototype.sort is stable, so entries sharing a year keep the order
 * Contentful returned them in.
 */
export const orderJourneys = <T extends { year: string }>(items: T[]): T[] =>
    [...items]
        .sort((a, b) => toJourneyYear(b.year).localeCompare(toJourneyYear(a.year)))
        .map(item => ({ ...item, year: toJourneyYear(item.year) }));

/** Rows rendered up front, and fetched per batch thereafter. */
export const JOURNEY_PAGE_SIZE = 6;
