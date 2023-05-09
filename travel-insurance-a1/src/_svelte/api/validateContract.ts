import {getUuid} from "../utils/getUuid";

export type validateContract = Promise<{
  status: 'success' | 'error',
  data?: unknown,
  error?: unknown,
}>;

export const validateContract = async (config): validateContract => {
  const{customerId, apis, auth} = config;
  const baseUrl = apis.methods.validateContract;
  const requestUrl = `${baseUrl}?product=TravelInsurance&msisdn=${customerId}`;
  const correlationId = getUuid();

  // headers
  const headers = new Headers();
  headers.append("subscription-key", apis.auth.subscriptionKey);
  headers.append("correlationId", correlationId);
  headers.append("userPrincipalId", apis.auth.subscriptionKey);
  headers.append("Authorization", auth);
  headers.append('Content-Type', 'application/json');

  // options
  const requestOptions = {
    method: 'GET',
    headers: headers
  };

  try {
    const response: any = await fetch(requestUrl, requestOptions);

    if (!response.ok) {
      const error = await response.json();

      if (error.Message) {
        throw new Error(error.Message);
      } else {
        throw new Error(error.StatusCode);
      }
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
