import {getUuid} from "../utils/getUuid";

export type DeactivateInsurance = Promise<{
  status: 'success' | 'error',
  data?: unknown,
  error?: unknown,
}>;

export const deactivateInsurance = async (config): DeactivateInsurance => {
  const{travelId, apis, auth} = config;
  const currentDate = new Date();
  const dateFormatted = currentDate.toISOString();
  const baseUrl = apis.methods.deactivate;
  const requestUrl = `${baseUrl}?product=TravelInsurance`;
  const correlationId = getUuid();

  // headers
  const headers = new Headers();
  headers.append("subscription-key", apis.auth.subscriptionKey);
  headers.append("correlationId", correlationId);
  headers.append("userPrincipalId", apis.auth.subscriptionKey);
  headers.append("Authorization", auth);
  headers.append('Content-Type', 'application/json');

  // body
  const data = {
    travelId: travelId,
    deactivatedOn: dateFormatted,
    source: "Web"
  }

  // options
  const requestOptions = {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(data)
  };

  try {
    const response: any = await fetch(requestUrl, requestOptions);

    if (!response.ok) {
      const error = await response.json();

      if (response.status === '422') {
        throw new Error(response.status);
      }

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
