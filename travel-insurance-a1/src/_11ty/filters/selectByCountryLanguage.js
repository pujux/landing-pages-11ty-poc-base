/**
 * Filter by a given country and language
 */
module.exports = (items, country, language) => {
    return items.filter(item => item.data.country === country && item.data.locale === language);
}