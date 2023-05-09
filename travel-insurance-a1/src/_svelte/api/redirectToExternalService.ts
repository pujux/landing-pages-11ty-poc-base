export const redirectToExternalService = (baseUrl) => {
  let url = new URL(baseUrl);
  const redirectUri = window.location;

  // query Parameters
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('client_id', 'insuranceportal-client');
  url.searchParams.append('response_mode', 'fragment');
  url.searchParams.append('scope', 'openid+insuranceportalmsisdn');
  url.searchParams.append('redirect_uri', redirectUri);

  return window.location.href = decodeURIComponent(url);
}
