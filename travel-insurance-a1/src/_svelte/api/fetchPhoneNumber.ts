import {getUuid} from "../utils/getUuid";

export type fetchPhoneNumber = Promise<{
  status: 'success' | 'error',
  data?: unknown,
  error?: unknown,
}>;

export const fetchPhoneNumber = async (config): fetchPhoneNumber => {
  const{apis, auth, isLocal} = config;
  const baseUrl = apis.methods.getPhoneNumber;
  const correlationId = getUuid();

  const headers = new Headers();
  headers.append("subscription-key", apis.auth.subscriptionKey);
  headers.append("correlationId", correlationId);
  headers.append("userPrincipalId", apis.auth.subscriptionKey);
  headers.append("Authorization", auth);
  headers.append('Content-Type', 'application/json');

  const requestOptions = {
    method: 'GET',
    headers: headers,
    credentials: 'include'
  };

  try {
    const response: any = await fetch(baseUrl, requestOptions);

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    isLocal && console.log(data);

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
