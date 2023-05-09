require('dotenv').config();

module.exports = {
    links: {
        a1: "",
        lamie: ""
    },
    eleventyComputed: {
        assetsPrefix: () => process.env.ENV ? '../public/':'../',
        locale: data => data.languages.sr.code,
        path: data => data.languages.sr.dir,
        faqs: data => `faqs-${data.country}-${data.languages.sr.code}`,
        languages: {
            sr: {
                url: '.'
            },
            en: {
                url: 'en/'
            }
        },
    }
}
