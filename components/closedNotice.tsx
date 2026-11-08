import { useEffect, useState } from 'react';
import Link from 'next/link';
import { REOPEN_LABEL, isClosed } from '../lib/siteStatus';

/** Site-wide "closed until" banner; hides itself once the reopen date arrives. */
export default function ClosedNotice() {
    // Rendered in the static HTML; the browser re-checks the date on load.
    const [show, setShow] = useState(true);
    useEffect(() => setShow(isClosed()), []);
    if (!show) return null;
    return (
        <div className="closed-notice" role="status">
            <strong>Pawblem Solved is currently closed.</strong> We reopen{' '}
            {REOPEN_LABEL} and are{' '}
            <Link href="/request">taking requests from new clients</Link> now.
        </div>
    );
}
