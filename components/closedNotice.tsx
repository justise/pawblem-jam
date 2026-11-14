import { useEffect, useState } from 'react';
import { InlineMarkdown } from '../lib/content';
import { closedNotice, isClosed } from '../lib/siteStatus';

/** Site-wide "closed" banner; hides itself once its "hide on" date arrives. */
export default function ClosedNotice() {
    // Rendered in the static HTML when switched on; the browser re-checks the date.
    const [show, setShow] = useState(closedNotice.show);
    useEffect(() => setShow(isClosed()), []);
    if (!show) return null;
    return (
        <div className="closed-notice" role="status">
            <strong>{closedNotice.headline}</strong>{' '}
            <InlineMarkdown text={closedNotice.message} />
        </div>
    );
}

/** Note on the Request page while closed. */
export function ClosedRequestNote() {
    const [show, setShow] = useState(closedNotice.show);
    useEffect(() => setShow(isClosed()), []);
    if (!show || !closedNotice.requestPageNote) return null;
    return (
        <p className="closed-request-note">
            <InlineMarkdown text={closedNotice.requestPageNote} />
        </p>
    );
}
