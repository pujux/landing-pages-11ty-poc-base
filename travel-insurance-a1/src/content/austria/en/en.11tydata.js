module.exports = {
  title: "Travel Cover SMART - LAMIE direkt",
  links: {
    lamie: "https://www.lamie-direkt.at/en/"
  },
  footerLinks: [
    {
      href: 'https://www.lamie-direkt.at/en/imprint/',
      text: 'Imprint',
    }, {
      href: 'https://www.lamie-direkt.at/en/service/',
      text: 'Service',
    }
  ],
  eleventyComputed: {
    assetsPrefix: () => process.env.ENV ? '../../public/':'../../',
    locale: data => data.languages.en.code,
    path: data => data.languages.en.dir,
    faqs: data => `faqs-${data.country}-${data.languages.en.code}`,
    languages: {
      de: {
        url: '../'
      },
      en: {
        url: '.'
      }
    },
  }
}
