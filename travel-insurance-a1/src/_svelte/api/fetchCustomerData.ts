import {getUuid} from "../utils/getUuid";
import type {FetchCustomerDataResponse} from "./models/FetchCustomerDataResponse";

export type FetchCustomerData = Promise<{
  status: 'success' | 'error',
  data?: FetchCustomerDataResponse
  error?: unknown,
}>;

export const fetchCustomerData = async (config): FetchCustomerData => {
  const{customerId, apis, auth, isLocal} = config;
  const baseUrl = apis.methods.getCustomerData;
  const requestUrl = `${baseUrl}?id=${customerId}&product=TravelInsurance`;
  const correlationId = getUuid();

  const headers = new Headers();
  headers.append("subscription-key", apis.auth.subscriptionKey);
  headers.append("correlationId", correlationId);
  headers.append("userPrincipalId", apis.auth.subscriptionKey);
  headers.append("Authorization", auth);
  headers.append('Content-Type', 'application/json');

  const requestOptions = {
    method: 'GET',
    headers: headers
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
