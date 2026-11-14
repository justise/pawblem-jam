import { useEffect, useState } from 'react';
import { InlineMarkdown } from '../lib/content';
import { closedNotice, isClosed } from '../lib/siteStatus';

type Notice = typeof closedNotice;

/** The banner itself (also used by the editor's live preview). */
export function ClosedNoticeBar({ notice }: { notice: Notice }) {
    return (
        <div className="closed-notice" role="status">
            <strong>{notice.headline}</strong>{' '}
            <InlineMarkdown text={notice.message} />
        </div>
    );
}

/** The Request-page note itself (also used by the editor's live preview). */
export function ClosedRequestNoteText({ notice }: { notice: Notice }) {
    if (!notice.requestPageNote) return null;
    return (
        <p className="closed-request-note">
            <InlineMarkdown text={notice.requestPageNote} />
        </p>
    );
}

/** Site-wide "closed" banner; hides itself once its "hide on" date arrives. */
export default function ClosedNotice() {
    // Rendered in the static HTML when switched on; the browser re-checks the date.
    const [show, setShow] = useState(closedNotice.show);
    useEffect(() => setShow(isClosed()), []);
    if (!show) return null;
    return <ClosedNoticeBar notice={closedNotice} />;
}

/** Note on the Request page while closed. */
export function ClosedRequestNote() {
    const [show, setShow] = useState(closedNotice.show);
    useEffect(() => setShow(isClosed()), []);
    if (!show) return null;
    return <ClosedRequestNoteText notice={closedNotice} />;
}
