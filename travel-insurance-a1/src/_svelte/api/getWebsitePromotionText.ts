import type {FetchCustomerDataResponse} from "./models/FetchCustomerDataResponse";

/**
 * Accepts a language code and an array of text strings and returns the text string for the given language code. This little utility is necessary, because the API relies on a different ISO standard for language coding, than the one used by this application.
 *
 * @param _lang
 * @param _textArray
 */
export function getWebsitePromotionText(_lang: string = 'en', _textArray: FetchCustomerDataResponse['data']['websitePromotionText']): string | false {
  if (!_textArray) {
    return false;
  }
  switch (_lang) {
    case "de":
      return _textArray.deu;
    case "sr":
      return _textArray.srp;
    case "en":
      return _textArray.eng;
    default:
      return _textArray.eng;
  }
}
