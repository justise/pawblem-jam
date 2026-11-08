import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    trailingSlash: true,
    turbopack: {
        root: __dirname,
    },
    async redirects() {
        return [
            {
                source: '/petsitters',
                destination: '/about/',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
