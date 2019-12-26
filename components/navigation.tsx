import React from 'react';
import Link from 'next/link';
import PropTypes, { InferProps } from 'prop-types';

export default function Navigation({
    selectedTab,
}: InferProps<typeof Navigation.propTypes>) {
    const isSelected = tabName => {
        return selectedTab == tabName ? 'selected' : '';
    };

    return (
        <div className="nav-container">
            <ul className="nav">
                <li className={isSelected('home')}>
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                </li>
                <li className={isSelected('services')}>
                    <Link href="/services">
                        <a>Services</a>
                    </Link>
                </li>
                <li className={isSelected('rates')}>
                    <Link href="/rates">
                        <a>Rates</a>
                    </Link>
                </li>
                <li className={isSelected('forms')}>
                    <Link href="/forms">
                        <a>Forms</a>
                    </Link>
                </li>
                <li className={isSelected('team')}>
                    <Link href="/petsitters">
                        <a>Team</a>
                    </Link>
                </li>
                <li className={isSelected('faq')}>
                    <Link href="/faq">
                        <a>FAQs</a>
                    </Link>
                </li>
                <li className={isSelected('request')}>
                    <Link href="/request">
                        <a className="red">Request Service</a>
                    </Link>
                </li>
            </ul>
        </div>
    );
}

Navigation.propTypes = {
    selectedTab: PropTypes.string.isRequired,
};
