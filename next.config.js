// next.config.js
const withCSS = require('@zeit/next-css');
const withImages = require('next-images');
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

module.exports = withPlugins(
    [
        [optimizedImages, {}],
        [withImages, {}],
        [withCSS, {}],
    ],
    {
        trailingSlash: true,
        exportPathMap: function () {
            return {
                '/': { page: '/' },
                '/faq': { page: '/faq' },
                '/forms': { page: '/forms' },
                '/petsitters': { page: '/petsitters' },
                '/rates': { page: '/rates' },
                '/request': { page: '/request' },
                '/services': { page: '/services' },
            };
        },
    }
);
