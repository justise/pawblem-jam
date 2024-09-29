import React from 'react';
import Link from 'next/link';
import PropTypes, { InferProps } from 'prop-types';

export default function Navigation({
    selectedTab,
}: InferProps<typeof Navigation.propTypes>) {
    const isSelected = (tabName) => {
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
                <li className={isSelected('faq')}>
                    <Link href="/faq">FAQs</Link>
                </li>
                <li className={isSelected('request')}>
                    <Link href="/request">Request Service</Link>
                </li>
            </ul>
        </div>
    );
}

Navigation.propTypes = {
    selectedTab: PropTypes.string.isRequired,
};
