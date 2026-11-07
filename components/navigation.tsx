import React from 'react';
import Link from 'next/link';

export default function Navigation({
    selectedTab,
}: {
    selectedTab: string;
}) {
    const isSelected = (tabName: string) => {
        return selectedTab == tabName ? 'selected' : '';
    };

    return (
        <div className="nav-container">
            <ul className="nav">
                <li className={isSelected('home')}>
                    <Link href="/">Home</Link>
                </li>
                <li className={isSelected('services')}>
                    <Link href="/services">Services</Link>
                </li>
                <li className={isSelected('rates')}>
                    <Link href="/rates">Rates</Link>
                </li>
                <li className={isSelected('forms')}>
                    <Link href="/forms">Forms</Link>
                </li>
                <li className={isSelected('team')}>
                    <Link href="/petsitters">Team</Link>
                </li>
                <li className={isSelected('request')}>
                    <Link href="/request">Request Service</Link>
                </li>
            </ul>
        </div>
    );
}
