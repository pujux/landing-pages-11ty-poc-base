module.exports = {
    links: {
        a1: "https://www.a1.net/",
        lamie: "https://www.lamie-direkt.at/en/"
    },
    eleventyComputed: {
        assetsPrefix: () => process.env.ENV ? '../../public/':'../../',
        locale: data => data.languages.en.code,
        path: data => data.languages.en.dir,
        faqs: data => `faqs-${data.country}-${data.languages.en.code}`,
        languages: {
            hr: {
                url: '../'
            },
            en: {
                url: '.'
            }
        },
    }
}