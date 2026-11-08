import React from 'react';
import Link from 'next/link';

export const NAV_ITEMS = [
    { id: 'home', href: '/', label: 'Home' },
    { id: 'services', href: '/services', label: 'Services' },
    { id: 'rates', href: '/rates', label: 'Rates' },
    { id: 'forms', href: '/forms', label: 'Forms' },
    { id: 'about', href: '/about', label: 'About' },
    { id: 'faq', href: '/faq', label: 'FAQs' },
    { id: 'request', href: '/request', label: 'Request a Service' },
];

export default function Navigation({ selectedTab }: { selectedTab: string }) {
    return (
        <div className="nav-container">
            <ul className="nav">
                {NAV_ITEMS.map((item) => (
                    <li
                        key={item.id}
                        className={selectedTab === item.id ? 'selected' : ''}
                    >
                        <Link href={item.href}>{item.label}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
