const svgContents = require('eleventy-plugin-svg-contents');
const directoryOutput = require('@11ty/eleventy-plugin-directory-output');
const translate = require('./src/_11ty/filters/translate.js');
const debug = require('./src/_11ty/filters/debug.js');
const selectByCountryLanguage = require('./src/_11ty/filters/selectByCountryLanguage.js');
const jsonify = require('./src/_11ty/filters/jsonify.js');

module.exports = function(eleventyConfig) {
    // make these filters available in 11ty
    eleventyConfig.addFilter('translate', translate);
    eleventyConfig.addFilter('debug', debug);
    eleventyConfig.addFilter('selectByCountryLanguage', selectByCountryLanguage);
    eleventyConfig.addFilter('jsonify', jsonify);

    // copy these files to the output directory
    eleventyConfig.addPassthroughCopy('src/_svelte');
    eleventyConfig.addPassthroughCopy('src/_scss');
    eleventyConfig.addPassthroughCopy('src/translations');
    eleventyConfig.addPassthroughCopy({'src/assets':'public/assets'});

    // plugins
    eleventyConfig.addPlugin(svgContents);
    eleventyConfig.addPlugin(directoryOutput)

    return {
        dir: {
            input: "src",
            layouts: "_layouts",
            output: "_site"
        }
    }
}
