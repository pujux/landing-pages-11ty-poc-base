module.exports = {
    links: {
        a1: "",
        lamie: ""
    },
    eleventyComputed: {
        assetsPrefix: () => process.env.ENV ? '../../public/':'../../',
        locale: data => data.languages.en.code,
        path: data => data.languages.en.dir,
        faqs: data => `faqs-${data.country}-${data.languages.en.code}`,
        languages: {
            sr: {
                url: '../'
            },
            en: {
                url: '.'
            }
        },
    }
}
