module.exports = {
    links: {
        a1: "https://www.a1.hr/",
        lamie: "https://www.lamie-direkt.at/en/"
    },
    eleventyComputed: {
        assetsPrefix: () => process.env.ENV ? '../public/':'../',
        locale: data => data.languages.hr.code,
        path: data => data.languages.hr.dir,
        faqs: data => `faqs-${data.country}-${data.languages.hr.code}`,
        languages: {
            hr: {
                url: '.'
            },
            en: {
                url: 'en/'
            }
        },
    }
}