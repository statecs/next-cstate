import React from 'react';
import type { Document } from '@contentful/rich-text-types';

// Rich text has no "columns" block, so a grid is marked up inline instead:
//
//   [grid]            ← a paragraph holding only this (or "[grid 3]" for three columns)
//   ### Heading       ← every heading starts a new card
//   body paragraphs   ← everything up to the next heading belongs to the card
//   [/grid]
//
// The heading can be a real heading block or, since the editor tends to keep
// a typed "### Title" as plain text, a paragraph starting with one to six
// hashes. In that form a soft line break after the title starts the body.
//
// The markers are stripped and the run between them becomes one CARD_GRID
// node, whose cards are numbered in order. Nothing else in the document moves.

export const CARD_GRID = 'card-grid';
export const CARD = 'card';

const OPEN = /^\[grid(?:[\s:]+(\d))?\]$/i;
const CLOSE = /^\[\/grid\]$/i;
const MD_HEADING = /^(#{1,6})\s+/;

type Node = { nodeType: string; data?: any; content?: Node[]; value?: string };

const HEADINGS = new Set(['heading-1', 'heading-2', 'heading-3', 'heading-4', 'heading-5', 'heading-6']);

const paragraphText = (node: Node): string | null => {
  if (node.nodeType !== 'paragraph') return null;
  return (node.content ?? [])
    .map((child) => (child.nodeType === 'text' ? child.value ?? '' : ''))
    .join('')
    .trim();
};

// The editor leaves empty paragraphs around headings; they would otherwise
// become empty cards or stray gaps.
const isBlank = (node: Node) =>
  node.nodeType === 'paragraph' &&
  paragraphText(node) === '' &&
  (node.content ?? []).every((child) => child.nodeType === 'text');

// "### Title\nBody" typed into one paragraph → a heading node plus, when a
// line break follows the title, a paragraph carrying the remaining inline
// nodes with their marks and links intact.
const splitInlineHeading = (node: Node): Node[] | null => {
  if (node.nodeType !== 'paragraph') return null;
  const content = node.content ?? [];
  const first = content[0];
  if (!first || first.nodeType !== 'text') return null;
  const match = (first.value ?? '').match(MD_HEADING);
  if (!match) return null;

  const title: Node[] = [];
  const body: Node[] = [];
  let split = false;
  content.forEach((child, i) => {
    if (split) {
      body.push(child);
      return;
    }
    if (child.nodeType !== 'text') {
      title.push(child);
      return;
    }
    const value = i === 0 ? (child.value ?? '').slice(match[0].length) : child.value ?? '';
    const lineBreak = value.indexOf('\n');
    if (lineBreak === -1) {
      title.push({ ...child, value });
      return;
    }
    title.push({ ...child, value: value.slice(0, lineBreak).trimEnd() });
    const rest = value.slice(lineBreak + 1).replace(/^\n+/, '');
    if (rest) body.push({ ...child, value: rest });
    split = true;
  });

  const out: Node[] = [{ nodeType: `heading-${match[1].length}`, data: {}, content: title }];
  if (body.length) out.push({ nodeType: 'paragraph', data: {}, content: body });
  return out;
};

const buildGrid = (blocks: Node[], columns: number): Node => {
  const cards: Node[] = [];
  blocks.flatMap((block) => splitInlineHeading(block) ?? [block]).forEach((block) => {
    if (isBlank(block)) return;
    if (HEADINGS.has(block.nodeType) || cards.length === 0) {
      cards.push({ nodeType: CARD, data: { index: cards.length + 1 }, content: [] });
    }
    cards[cards.length - 1].content!.push(block);
  });
  return { nodeType: CARD_GRID, data: { columns }, content: cards };
};

export const groupCardGrids = (document: Document): Document => {
  const content = (document.content ?? []) as unknown as Node[];
  const out: Node[] = [];
  let i = 0;

  while (i < content.length) {
    const open = paragraphText(content[i])?.match(OPEN);
    if (!open) {
      out.push(content[i]);
      i += 1;
      continue;
    }

    // An unclosed grid runs to the end of the document rather than swallowing
    // the marker text into the article.
    let j = i + 1;
    while (j < content.length && !CLOSE.test(paragraphText(content[j]) ?? '')) j += 1;

    out.push(buildGrid(content.slice(i + 1, j), Number(open[1]) || 2));
    i = j + 1;
  }

  return { ...document, content: out as unknown as Document['content'] };
};

export const cardGridRenderers = {
  [CARD_GRID]: (node: any, children: React.ReactNode) => (
    <div className="aurora-cardgrid" style={{ ['--card-grid-cols' as string]: node.data?.columns ?? 2 }}>
      {children}
    </div>
  ),
  [CARD]: (node: any, children: React.ReactNode) => (
    <div className="aurora-cardgrid-cell">
      <span className="aurora-cardgrid-index">{String(node.data?.index ?? 1).padStart(2, '0')}</span>
      {children}
    </div>
  ),
};
