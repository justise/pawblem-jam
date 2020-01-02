// next.config.js
const withCSS = require('@zeit/next-css');
const withImages = require('next-images');
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

module.exports = withPlugins([
    [optimizedImages, {}],
    [withImages, {}],
    [withCSS, {}],
]);
