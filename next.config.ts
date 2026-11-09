import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    trailingSlash: true,
    turbopack: {
        root: __dirname,
    },
    env: {
        // Netlify sets NETLIFY=true during its builds; images are then served
        // resized via the Netlify Image CDN (see lib/content.tsx).
        IMAGE_CDN: process.env.NETLIFY === 'true' ? '1' : '',
    },
    async rewrites() {
        // Site editor (Decap CMS) lives in public/admin/.
        return [{ source: '/admin/', destination: '/admin/index.html' }];
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
