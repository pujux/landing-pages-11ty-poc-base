module.exports = {
  title: "Reiseschutz SMART - LAMIE direkt",
  links: {
    lamie: "https://www.lamie-direkt.at/"
  },
  footerLinks: [
    {
      href: 'https://www.lamie-direkt.at/impressum/',
      text: 'Impressum',
    }, {
      href: 'https://www.lamie-direkt.at/servicecenter/',
      text: 'Service',
    }
  ],
  eleventyComputed: {
    assetsPrefix: () => process.env.ENV ? '../public/':'../',
    locale: data => data.languages.de.code,
    path: data => data.languages.de.dir,
    faqs: data => `faqs-${data.country}-${data.languages.de.code}`,
    languages: {
      de: {
        url: '.'
      },
      en: {
        url: 'en/'
      }
    },
  }
}
