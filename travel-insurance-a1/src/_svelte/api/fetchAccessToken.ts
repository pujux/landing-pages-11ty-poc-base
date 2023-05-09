export type FetchAccessToken = Promise<{
  status: 'success' | 'error',
  data?: unknown,
  error?: unknown,
}>;

export const fetchAccessToken = async (config): FetchAccessToken => {
  const{apis} = config;
  const accessTokenUrl = apis.methods.accessToken;
  const requestUrl = accessTokenUrl;

  // build the headers
  let headers = new Headers();
  headers.append('Host', accessTokenUrl.hostname)
  headers.append("Authorization", apis.auth.basic);
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  // build the params
  let params = new URLSearchParams();
  params.append("grant_type", "password");
  params.append("username", apis.auth.username);
  params.append("password", apis.auth.password);

  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: params
  };

  try {
    const response: any = await fetch(requestUrl, requestOptions);

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(data.errors);
    }

    return {
      status: 'success',
      data: data
    };
  } catch (error) {
    return {
      status: 'error',
      error: error
    };
  }
}
