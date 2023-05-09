import {getUuid} from "../utils/getUuid";

export type fetchHTTPCookie = Promise<{
  status: 'success' | 'error',
  data?: unknown,
  error?: unknown,
}>;

export const fetchHTTPCookie = async (config): fetchHTTPCookie => {
  const{apis, auth, code} = config;
  const baseUrl = apis.methods.httpCookie;
  const requestUrl = `${baseUrl}?code=${code}&isTest=false`;
  const correlationId = getUuid();

  const headers = new Headers();
  headers.append("subscription-key", apis.auth.subscriptionKey);
  headers.append("correlationId", correlationId);
  headers.append("userPrincipalId", apis.auth.subscriptionKey);
  headers.append('Content-Type', 'application/json');

  const requestOptions = {
    method: 'GET',
    headers: headers,
    credentials: 'include'
  };

  try {
    const response: any = await fetch(requestUrl, requestOptions);
    if (!response.ok) {
      const error = await response.json();

      if (error.ErrorCode === 'PA039') {
        throw new Error('token-expired');
      } else {
        throw new Error(`${response.status} ${error.statusText}: ${error.Message}`);
      }
    }

    return {
      status: 'success',
      data: response
    };
  } catch (error) {
    return {
      status: 'error',
      error: error
    };
  }
}
