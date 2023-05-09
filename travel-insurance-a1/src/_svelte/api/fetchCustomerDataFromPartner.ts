import {getUuid} from "../utils/getUuid";

export type FetchCustomerData = Promise<{
  status: 'success' | 'error',
  data?: unknown,
  error?: unknown,
}>;

export const fetchCustomerDataFromPartner = async (config): FetchCustomerData => {
  const{customerId, apis, auth, isLocal} = config;
  const baseUrl = apis.methods.getCustomerDataFromPartner;
  const requestUrl = `${baseUrl}?msisdn=${customerId}&product=TravelInsurance`;
  const correlationId = getUuid();

  const headers = new Headers();
  headers.append("subscription-key", apis.auth.subscriptionKey);
  headers.append("correlationId", correlationId);
  headers.append("userPrincipalId", apis.auth.subscriptionKey);
  headers.append("Authorization", auth);
  headers.append('Content-Type', 'application/json');

  const requestOptions: RequestInit = {
    method: 'GET',
    headers: headers,
    credentials: 'include'
  };

  try {
    const response: any = await fetch(requestUrl, requestOptions);

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
