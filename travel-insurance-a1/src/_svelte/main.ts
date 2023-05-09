import * as Sentry from '@sentry/svelte';
import { BrowserTracing} from "@sentry/tracing";

import App from './App.svelte'

const htmlRoot = document.documentElement;
const locale = htmlRoot.getAttribute('lang');
const country = htmlRoot.getAttribute('data-country');

/**
 * Reads in the Translation file corresponding to the locale that was set in the html's lang attribute
 */
async function getTranslations(): Promise<Object> {
  return await import(`../translations/${locale}.json`).then(strings => strings.default);
}

async function getConfigData(): Promise<Object> {
  return await import(`../${country}/config.json`).then(strings => strings.default);
}

async function getApiUrls(): Promise<Object> {
  return await import(`../${country}/api.json`).then(strings => strings.default);
}

/**
 * Initialize Sentry, according to the setup wizard
 */
Sentry.init({
  dsn: "https://ab486a6879dd4824949847ce3fc5c91f@o4504888797102080.ingest.sentry.io/4504888799461376",
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  environment: import.meta.env.MODE,
  //debug: true,
});

Promise.all([getTranslations(), getConfigData(), getApiUrls()]).then(data => {
  const translations = data[0];
  const config = data[1];
  const apiUrls = data[2];

  new App({
    target: document.getElementById('app'),
    props: {
      i18n: translations,
      config: config,
      apis: apiUrls,
      lang: locale,
      country: country
    }
  });
});
