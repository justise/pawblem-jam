/**
 * Live preview for the site editor (/admin). The editor's preview pane embeds
 * this page and sends it the unsaved content via postMessage; it renders that
 * content with the same components and styles as the real pages.
 */
import { useEffect, useState, type MouseEvent } from 'react';
import Head from 'next/head';
import {
    AboutBody,
    FaqBody,
    HomeBody,
    ServicesBody,
} from '../components/pageBodies';
import {
    ClosedNoticeBar,
    ClosedRequestNoteText,
} from '../components/closedNotice';
import { isClosed } from '../lib/siteStatus';

type PreviewMessage = { type: 'pawblem-preview'; page: string; data: any };

function ClosedNoticePreview({ notice }: { notice: any }) {
    const showing = isClosed(new Date(), notice);
    return (
        <>
            <p className="edit-preview-label">
                {showing
                    ? 'Banner at the top of every page:'
                    : notice.show
                      ? 'The banner is switched on, but its "hide" date has passed, so visitors don’t see it. It would look like this:'
                      : 'The banner is switched off, so visitors don’t see it. It would look like this:'}
            </p>
            <div style={{ opacity: showing ? 1 : 0.5 }}>
                <ClosedNoticeBar notice={notice} />
            </div>
            <p className="edit-preview-label">Note on the Request page:</p>
            <div className="content-text" style={{ opacity: showing ? 1 : 0.5 }}>
                {notice.requestPageNote ? (
                    <ClosedRequestNoteText notice={notice} />
                ) : (
                    <p>(none)</p>
                )}
            </div>
        </>
    );
}

function Body({ page, data }: { page: string; data: any }) {
    switch (page) {
        case 'home':
            return (
                <HomeBody
                    home={data}
                    reviews={
                        <p className="edit-preview-label">
                            (Customer reviews slideshow appears here)
                        </p>
                    }
                />
            );
        case 'services':
            return <ServicesBody services={data} />;
        case 'about':
            return <AboutBody about={data} />;
        case 'faq':
            return <FaqBody faq={data} />;
        case 'closed-notice':
            return <ClosedNoticePreview notice={data} />;
        default:
            return null;
    }
}

export default function EditPreview() {
    const [message, setMessage] = useState<PreviewMessage | null>(null);

    useEffect(() => {
        const onMessage = (e: MessageEvent) => {
            if (e.origin !== window.location.origin) return;
            if (e.data?.type === 'pawblem-preview') setMessage(e.data);
        };
        window.addEventListener('message', onMessage);
        // Ask the editor for the current content.
        window.parent.postMessage(
            { type: 'pawblem-preview-ready' },
            window.location.origin,
        );
        return () => window.removeEventListener('message', onMessage);
    }, []);

    // Links would navigate away inside the preview pane; FAQ in-page links still work.
    const stayHere = (e: MouseEvent) => {
        const link = (e.target as HTMLElement).closest('a');
        if (link && !link.getAttribute('href')?.startsWith('#')) {
            e.preventDefault();
        }
    };

    return (
        <div id="container" onClickCapture={stayHere}>
            <Head>
                <title>Preview</title>
                <meta name="robots" content="noindex" />
            </Head>
            <style>{`
                .edit-preview-label { color: #777; font-style: italic; text-align: center; margin: 16px; }
            `}</style>
            <div id="content">
                {message && <Body page={message.page} data={message.data} />}
            </div>
        </div>
    );
}
