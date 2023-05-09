require('dotenv').config();
const path = require("path");
const fs = require("fs");

/* Taken from Jérôme Coupé: https://github.com/collapsology/collapsology/blob/master/src/_11ty/filters/translate.js
 * Replace a string with a translation, if present in a file corresponding to the passed locale
 */
module.exports = function (str, locale = "") {
    const filePath = path.resolve(`./src/translations/${locale}.json`);

    if (locale === '') {
        return str;
    }

    // if the translation file does not exist
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "{}");
    }

    const translations = require(filePath);

    // do it only on local / when needed
    if (process.env.MAKE_STRINGS === 'true') {
        // write the strings to the file
        try {
            translations[str] = translations[str] || '';

            // write the new strings to the file
            try {
                fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), 'utf-8');
            } catch (e) {
                console.log(e);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return translations[str] || str;
};