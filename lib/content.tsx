/**
 * Helpers for rendering the editable content in /content (edited by Danielle
 * through the CMS at /admin). Markdown is converted to HTML at build time.
 */
import { Fragment } from 'react';
import { Marked } from 'marked';

// The site's CSS colors <strong> red inside page text, but the original pages
// use plain bold <b>, so **bold** renders as <b>.
const md = new Marked({
    breaks: true,
    renderer: {
        strong({ tokens }) {
            return `<b>${this.parser.parseInline(tokens)}</b>`;
        },
    },
});

/** Block Markdown (paragraphs, lists, headings) as HTML. */
export function Markdown({
    text,
    className,
}: {
    text?: string;
    className?: string;
}) {
    if (!text) return null;
    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: md.parse(text) as string }}
        />
    );
}

/** Inline Markdown (bold/italic/links only), e.g. inside a heading. */
export function InlineMarkdown({ text }: { text?: string }) {
    if (!text) return null;
    return (
        <span
            dangerouslySetInnerHTML={{
                __html: md.parseInline(text) as string,
            }}
        />
    );
}

/** Plain text where each new line becomes a line break. */
export function Lines({ text }: { text?: string }) {
    const lines = (text || '').split('\n');
    return (
        <>
            {lines.map((line, i) => (
                <Fragment key={i}>
                    {i > 0 && <br />}
                    {line}
                </Fragment>
            ))}
        </>
    );
}

/**
 * Resized, modern-format (WebP/AVIF) version of a site image via the Netlify
 * Image CDN. Only on Netlify builds; local dev serves the original file.
 */
export function imageUrl(src: string | undefined, width: number): string {
    if (!src) return '';
    if (process.env.IMAGE_CDN !== '1' || !src.startsWith('/')) return src;
    return `/.netlify/images?url=${encodeURIComponent(src)}&w=${width}`;
}

/** URL-friendly id for in-page links, e.g. FAQ questions. */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 60);
}
