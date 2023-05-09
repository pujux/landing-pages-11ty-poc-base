<script lang="ts">
  import {format, formatRFC3339, parse, parseISO} from 'date-fns';
  import {getContext, onDestroy, onMount, setContext} from "svelte";
  import {fade} from "svelte/transition";
  import {
    additionalPeopleStore,
    AdditionalPerson, clearAdditionalPeople,
    storeAdditionalPerson
  } from "./stores/additional-people";
  import Modal from "./lib/Modal.svelte";
  import ConsentCheck from "./lib/ConsentCheck.svelte";
  import {fetchCustomerData} from "./api/fetchCustomerData";
  import {fetchCustomerDataFromPartner} from './api/fetchCustomerDataFromPartner';
  import {fetchAccessToken} from "./api/fetchAccessToken";
  import ChooseProduct from "../../site/_svelte/lib/ChooseProduct.svelte";
  import MainInsuredForm from "./lib/MainInsuredForm.svelte";
  import AdditionalPeople from "./lib/AdditionalPeople.svelte";
  import {getUuid} from "./utils/getUuid";
  import {validateContract} from "./api/validateContract";
  import {validateTariff} from "./api/validateTariff";
  import {redirectToExternalService} from "./api/redirectToExternalService";
  import {fetchHTTPCookie} from "./api/fetchHTTPCookie";
  import {fetchPhoneNumber} from "./api/fetchPhoneNumber";
  import Spinner from "./lib/Spinner.svelte";
  import type {FetchCustomerDataResponse} from "./api/models/FetchCustomerDataResponse";
  import {getWebsitePromotionText} from "./api/getWebsitePromotionText";

  export let i18n;
  export let config;
  export let apis;
  export let country;
  export let lang;

  // make the translations available to all its descendants with a function, retreivable with getContext().
  setContext('translate', (key: String): String => i18n[key] || key);
  const translate = getContext('translate');

  // make the settings available to all its descendants with a function, retreivable with getContext().
  setContext('setting', (key: String): String => config[key] || undefined);
  const getSetting = getContext('setting');

  // make the form settings available to all its descendants
  setContext('formFieldSettings', (field: String, fields: 'fields' | 'additionalPeopleFields' = 'fields'): String => config['form'][fields].find( o => o.name === field ) || undefined);

  // make the language available to all its descendants with a function, retreivable with getContext().
  setContext('language', (): String => lang);

  setContext('keepBirthdayEditable', false);

  const deriveBirthdayFromPersonalId = getSetting('deriveBirthdayFromPersonalId');
  const retrieveDataPermissionMandatory = getSetting('retrieveDataPermissionMandatory');
  const requiresIdParameter = getSetting('requiresIdParameter');
  const productConfig = getSetting('products');
  const consentConfig = getSetting('consentDeclarations');

  // build the url to the api request for retrieving the customers data from a1
  const urlParams = new URLSearchParams(window.location.search);
  const urlHash = window.location.hash;
  const urlHashCode = urlHash.split('=')[0].split('#')[1];
  let customerId = urlParams.has(getSetting('requiresIdParameter')) && urlParams.get(getSetting('requiresIdParameter'));
  const trackingId = urlParams.has('tid') && urlParams.get('tid');
  // this code will be used to set an HTTP Cookie from an API, which is needed to retreive the phoneNumber
  const authCode = urlHash && urlHashCode === 'code' && urlHash.split('=')[1];

  const currentDateTime = new Date();
  let chosenProduct: 'family' | 'single'; // which product was chosen
  let additionalPeople; // will subscribe to the store that contains all people, that are set additionally when choosing a 'family' product
  let retrieveDataPermission: boolean = getSetting('showRetrieveDataPermissionModal') ? undefined:false; // whether consent was given to communicate with the A1 API
  let showRetrieveDataPermissionModal: boolean = retrieveDataPermission ? true:false;
  let retriedDataRetrieval: number = 0; // how often was a communication to the A1 api to load customer data attempted
  let containsUnsavedAdditionalPeople: boolean = false; // logs if there
  let submittable: boolean = false;
  let presubmit: boolean = getSetting('usePreSubmit') || false; // the form will only be submittable if this is false, if presubmit is passed. This is to _intercept_ the first submit to show an additional message
  let additionalPeopleError: string; // show validation error, regarding some of the configured ages for additional people
  let apiError: unknown; // tracks errors from the API communication
  let tokenUsed = false; // tracks if the token was rejected by the setToken API endpoint
  let submitError: unknown; // tracks errors from the form submission
  let redirecting: boolean = false;
  let loading: boolean = false;
  const maxLoadingTime = 15000;
  let showLongLoadingMessage: boolean = false;
  let isEligible: boolean; // tracks if the phone number has a tarrif that is is eligible for these products
  let hasValidContract: boolean; // tracks, if the phone number has a valid contract for these products
  let promotionText: string | false;
  let promotionCode:string;
  let apiRequestConfig = {
    customerId: customerId,
    apis: apis,
    auth: '',
    code: authCode
  };
  // will contain data from the A1 api to fill the form with
  let customerData: FetchCustomerDataResponse['data'] | unknown;
  let insuredRisk: unknown;
  let additionalInformation: unknown;
  let mainPerson: unknown;
  let mainPhoneNumber: unknown;
  let formData: unknown;


  let timer; // for settimeout references

  // to decide whether to include some utility in local development
  const isLocal = apis.url?.includes('localhost') || false;

  const unsubAdditionalPeople = additionalPeopleStore.subscribe(people => additionalPeople = people);

  // get the access token
  async function getAccessToken()  {
    loading = true;

    await fetchAccessToken(apiRequestConfig).then(response => {
      if (!response || response.status === 'error') {
        loading = false;
        apiError = {
          type: 'accessToken',
          message: response.error
        }
        return;
      } else {
        loading = false;
        apiRequestConfig.auth = `${response.data.token_type} ${response.data.access_token}`;
        isLocal && console.log('Access token fetched successfully:', response.data);

        return response.data;
      }
    });
  }

  function reload() {
    if (urlHashCode) {
      const target = window.location.href.split('#')[0];
      window.location.href = target;
    } else {
      window.location.reload();
    }
  }

  // execute the fetch task and feed it into the application
  function loadCustomerData(retry = 0) {
    loading = true;
    retriedDataRetrieval = retry; // can be used to log how often this function was called

    // do the actual fetch
    if (getSetting('getCustomerDataMethod') === 'getCustomerData') {
      fetchCustomerData(apiRequestConfig).then(response => {
        if (!response || response.status === 'error') {
          loading = false;
          apiError = {
            type: 'customerData',
            message: response.error
          }
          return;
        } else {
          insuredRisk = JSON.parse(response.data.data.insuredRisk);
          additionalInformation = JSON.parse(response.data.data.contract.additionalInformation);
          mainPhoneNumber = insuredRisk.MSISDN;
          customerData = response.data.data;
          if(response.data.data.policyHolder.partnerReference.toLowerCase() == '2bfb5089-11a8-e711-80da-00155d257b58' || response.data.data.policyHolder.partnerReference.toLowerCase() == 'f1819c67-3ed0-e711-80dd-00155dd477bf' || response.data.data.policyHolder.partnerReference.toLowerCase() == 'dab293ea-5cd0-e711-80d7-00155dd475ce'){
            promotionText = "Dummy - lets have a solution in the future";
            promotionCode = "dummy";
          }else{
            promotionText = getWebsitePromotionText(lang,customerData?.websitePromotionText);
            promotionCode = customerData?.contract?.promotionCode;
          }
          const birthday = format(parseISO(customerData.contract.mainInsuredPerson.dateOfBirth), 'dd.MM.yyyy');
          mainPerson = {...response.data.data.contract.mainInsuredPerson, dateOfBirth: birthday};
          loading = false;
          isLocal && console.log('Customer data fetched successfully:', response.data);

        }
      });
    } else if (getSetting('getCustomerDataMethod') === 'getCustomerDataFromPartner') {
      fetchCustomerDataFromPartner(apiRequestConfig).then(response => {
        if (!response || response.status === 'error') {
          loading = false;
          apiError = {
            type: 'customerData',
            message: response.error
          }
          return;
        } else {
          isLocal && console.log("customerData: ", response.data);

          promotionText = "Dummy - lets have a solution in the future";
            promotionCode = "dummy";
          mainPhoneNumber = customerId;
          customerData = response.data;
          mainPerson = {
            salutation: customerData.data.gender,
            firstName: customerData.data.firstName,
            lastName: customerData.data.lastName,
            address: {
              addressLine1: customerData.data.street,
              addressLine2: customerData.data.streetNumber,
              postalCode: customerData.data.postalCode,
              city: customerData.data.city,
            },
            email: customerData.data.email,
            dateOfBirth: customerData.data.dateOfBirth && format(parseISO(customerData.data.dateOfBirth), 'dd.MM.yyyy')
          };
          loading = false;
          isLocal && console.log('Customer data fetched successfully from partner:', response.data);
        }
      })
    }
  }

  function retryFetches(type, retry = 0) {
    apiError = false;
    loading = true;
    if (!type) {
      return;
    } else if (type === 'customerData') {
      loadCustomerData(retry);
    } else if (type === 'accessToken') {
      getAccessToken();
    }
  }

  function handleProductChange(e) {
    chosenProduct = e.detail;

    if (chosenProduct === 'single' && additionalPeople.length > 0) {
      clearAdditionalPeople();
    }
  }

  function addAdditionalPerson() {
    const nthPerson: number = additionalPeople.length;

    containsUnsavedAdditionalPeople = true;

    const newPerson: AdditionalPerson = {
      id: getUuid(),
      age: 0,
      birthDate: undefined,
      formData: undefined,
      saved: false,
      name: `${translate('New Person')} ${nthPerson + 1} ${translate('unsaved')}`,
      type: undefined
    }

    storeAdditionalPerson(newPerson);
  }

  // go through additionalPeople and check them for age-limits according to settings and display errors if needed
  function validateAdditionalPeople() {
    let adults = 0;
    let children = 0;
    let errors = 0;
    let errorMessages = [];

    // go through all additional people and do some validation
    additionalPeople.forEach( person => {
      if (errors >= 1) { // if there are already errors, we don't need to check anything anymore
        return;
      } else if (!person.saved) { // unsaved people in the form...
        errors++;
        errorMessages.push(translate('There are unsaved people in the form.'));
        containsUnsavedAdditionalPeople = true;
        return;
      } else { // no errors from previous loops and no unsaved people
        containsUnsavedAdditionalPeople = false;

        // check all the age restrictions, as configured
        if (person.age >= getSetting('childMaxAge')) { // check adults
          if (getSetting('adultMaxAge') && (person.age >= getSetting('adultMaxAge'))) { // oops, no old people allowed!
            errors++;
            errorMessages.push(translate('People over the maximum age are not covered.'));
            return;
          } else {
            adults++;

            // if the number of adults exceeds the maximum adults allowed
            if (adults > getSetting('maxAdditionalAdults')) {
              errors++;
              errorMessages.push(translate('The amount of adults exceeds the allowed amount.'));
              return;
            }
          }
        } else { // check children
          children++;
          // if the number of children exceeds the maximum children allowed
          if (children > getSetting('maxAdditionalChildren')) {
            errors++;
            errorMessages.push(translate('The amount of children exceeds the allowed amount'));
            return;
          }
        }
      }
    })

    // after the loop has ran through, if we have any errors, join them and display them.
    if (errors >= 1) {
      additionalPeopleError = errorMessages.join('<br>');
      submittable = false;
    } else {
      additionalPeopleError = undefined;
      submittable = true;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const baseUrl = apis.methods.create;
    let requestUrl = `${baseUrl}?product=TravelInsurance`;
    formData = Object.fromEntries(new FormData(e.target).entries());
    isLocal && console.log("FormData:", formData);
    const productType = chosenProduct === 'single' ? productConfig.single.type:productConfig.family.type;
    const correlationId = getUuid();

    // for sites that rely on the proposalId parameter, send them with the request so that their system can correctly connect the contract to the proposal
    if (requiresIdParameter) {
      requestUrl = `${requestUrl}&proposalId=${customerId}`;
    }

    submitError = undefined; // reset any form-submission errors

    if (presubmit) {
      presubmit = false;
      submittable = false;
      setTimeout(() => submittable = true, 2000);
      return;
    } else {
      submittable = false;
    }

    loading = true;

    // headers
    const headers = new Headers();
    headers.append("subscription-key", apis.auth.subscriptionKey);
    headers.append("userPrincipalId", apis.auth.subscriptionKey);
    headers.append("Authorization", apiRequestConfig.auth);
    headers.append("CorrelationId", correlationId);
    headers.append("Content-Type", "application/json");

    let data = {
      ['insuranceContractType']: productType,
      ['selectedCovers']: customerData?.selectedCovers,
      ['policyHolder']: {
        ['partnerUserId']: mainPhoneNumber || customerData?.policyHolder?.partnerUserId,
        ['partnerReference']: customerData?.policyHolder?.partnerReference,
        ['gender']: formData?.salutation || customerData?.policyHolder?.gender || 'unknown',
        ['titlePrefix']: formData?.titlePrefix || customerData?.policyHolder?.titlePrefix,
        ['titleSuffix']: formData?.titlePrefix || customerData?.policyHolder?.titleSuffix,
        ['firstName']: formData?.firstName,
        ['lastName']: formData?.lastName,
        ['companyName']: formData?.companyName || customerData?.policyHolder?.companyName,
        ['nationalIdentificationNumber']: formData?.nationalIdentificationNumber || customerData?.policyHolder?.companyName,
        ['dateOfBirth']: format(parse(formData?.dateOfBirth, 'dd.MM.yyyy', new Date()), 'yyyy-MM-dd') || customerData?.policyHolder?.dateOfBirth,
        ['phoneNumber']: mainPhoneNumber,
        ['email']: formData?.email || customerData?.policyHolder?.email,
        ['passport']: {
          ['passportNumber']: formData?.passportNumber || customerData?.policyHolder?.passport?.passportNumber,
        },
        ['address']: {
          ['addressLine1']: formData?.street || customerData?.policyHolder?.address?.addressLine1,
          ['addressLine2']: customerData?.policyHolder?.address?.addressLine2,
          ['postalCode']: formData?.postalCode || customerData?.policyHolder?.address?.postalCode,
          ['city']: formData?.city || customerData?.policyHolder?.address?.city,
          ['country']: formData?.country || customerData?.policyHolder?.address?.country || "AUT",
        }
      },
      ['contract']: {
        ['subscriptionDate']: formatRFC3339(currentDateTime),
        ['promotionCode']: promotionCode,
        ['verificationMethod']: customerData?.contract?.verificationMethod || "Pin",
        ['mainInsuredPerson']: {
          ['gender']: formData?.salutation || customerData?.contract?.mainInsuredPerson?.gender || 'unknown',
          ['titlePrefix']: formData?.titlePrefix || customerData?.contract?.mainInsuredPerson?.titlePrefix,
          ['titleSuffix']: formData?.titlePrefix || customerData?.contract?.mainInsuredPerson?.titleSuffix,
          ['firstName']: formData?.firstName,
          ['lastName']: formData?.lastName,
          ['companyName']: formData?.companyName || customerData?.contract?.mainInsuredPerson?.companyName,
          ['nationalIdentificationNumber']: formData?.nationalIdentificationNumber || customerData?.contract?.mainInsuredPerson?.companyName,
          ['dateOfBirth']: format(parse(formData?.dateOfBirth, 'dd.MM.yyyy', new Date()), 'yyyy-MM-dd') || customerData?.contract?.mainInsuredPerson?.dateOfBirth,
          ['phoneNumber']: mainPhoneNumber,
          ['email']: formData?.email || customerData?.contract?.mainInsuredPerson?.email,
          ['passport']: {
            ['passportNumber']: formData?.passportNumber || customerData?.contract?.mainInsuredPerson?.passport?.passportNumber,
          },
          ['address']: {
            ['addressLine1']: formData?.street || customerData?.contract?.mainInsuredPerson?.address?.addressLine1,
            ['addressLine2']: customerData?.contract?.mainInsuredPerson?.address?.addressLine2,
            ['postalCode']: formData?.postalCode || customerData?.contract?.mainInsuredPerson?.address?.postalCode,
            ['city']: formData?.city || customerData?.contract?.mainInsuredPerson?.address?.city,
            ['country']: formData?.country || customerData?.contract?.mainInsuredPerson?.address?.country || "AUT",
          },
        },
        ['additionalInformation']: JSON.stringify({
            ['retailerId']: additionalInformation?.retailerId,
            ['salesPerson']: additionalInformation?.salesPerson,
            ['salesChannel']: additionalInformation?.salesChannel || "Online",
        }),
        ['declarationsOfConsent']: [
          {
            ['identifier']: consentConfig.filter( o => o.name === 'roaming' )[0].value,
            ['date']: formatRFC3339(currentDateTime),
            ['indicator']: true
          }, {
            ['identifier']: consentConfig.filter( o => o.name === 'consultationWaiver' )[0].value,
            ['date']: formatRFC3339(currentDateTime),
            ['indicator']: true
          }, {
            ['identifier']: consentConfig.filter( o => o.name === 'electronicCommunication' )[0].value,
            ['date']: formatRFC3339(currentDateTime),
            ['indicator']: true
          }
        ]
      },
      ['insuredRisk']: JSON.stringify({
        ['MSISDN']: mainPhoneNumber,
        ['isSmartSim']: insuredRisk?.isSmartSim || false,
        ['caseId']: insuredRisk?.caseId,
        ['tariffId']: insuredRisk?.tariffId,
        ['tariffName']: insuredRisk?.tariffName,
      }),
      ['payment']: {
        ['paymentType']: customerData?.payment?.paymentType || "MobilePhoneContract",
        ['details']: JSON.stringify({
          ['billingReferenceNr']: customerData?.payment?.details?.billingReferenceNr || mainPhoneNumber
        })
      }
    }

    isLocal && console.log('Data Structure', JSON.stringify(data));

    // add additional people, if set.
    if (chosenProduct === 'family' && additionalPeople.length > 0) {
      let additionallyInsured = [];

      // build the correct structure
      additionalPeople.forEach(person => {
        if (person.saved) {
          isLocal && console.log('Saved Person', person);
          additionallyInsured.push({
            gender: person.formData?.salutation || 'unknown',
            firstName: person.formData?.firstName,
            lastName: person.formData?.lastName,
            nationalIdentificationNumber: person.formData?.nationalIdentificationNumber,
            dateOfBirth: format(parse(person.formData?.dateOfBirth, 'dd.MM.yyyy', new Date()), 'yyyy-MM-dd'),
            passport: {
              passportNumber: person.formData?.passportNumber,
            },
          })
        }
      });

      // add it to the request body
      data['contract']['additionalInsuredPersons'] = additionallyInsured;
    }

    // add the tracking code from the query parameter, if set
    if (trackingId) {
      data['contract']['trackingCode'] = trackingId;
    } else if (customerData?.contract?.trackingCode) {
      data['contract']['trackingCode'] = customerData?.contract?.trackingCode;
    }

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(requestUrl, requestOptions);

      if (!response.ok) {
        const error = await response.json();

        if (error.ErrorCode === '409') {
          throw new Error('contract-already-exists');
        } else {
          throw new Error(`${response.status} ${error.statusText}: ${error.Message}`);
        }
      }

      const data = await response.json();

      if ( data.succeeded ) {
        try {
          window.location.href = getSetting('redirectOnSuccessTo')[lang];
        } catch(e) {
          window.location.href = '/success/';
        }
      }

    } catch (error) {
      loading = false;

      if (submitError === 'contract-already-exists') {
        submitError = translate('A contract for the phone number $1n already exists. If this was a mistake, try using a <a href="$2n">different phone number</a> or contact our <a href="$3n">helpdesk</a>.').replace('$1n', mainPhoneNumber)
         .replace('$2n', getSetting('externalPhoneVerificationUrl'))
         .replace('$3n', getSetting('helpdeskTel')?.replace(/\s/, ''));
      } else {
        submitError = error;
        submittable = true;
      }

      isLocal && console.log('submit error', error);
    }
  }

  onMount(() => {
    getAccessToken().then(() => {
      if (getSetting('getCustomerIdFromExternalService')) {
        if (authCode) {
          // set the http cookie
          loading = true;
          fetchHTTPCookie(apiRequestConfig).then(response => {
            if (!response || response.status === 'error') {
              loading = false;

              if (response.error.message === 'token-expired') {
                tokenUsed = true;
                return;
              } else {
                apiError = response.error;
                return;
              }
            } else {
              fetchPhoneNumber(apiRequestConfig).then(response => {
                if (!response || response.status === 'error') {
                  loading = false;
                  apiError = response.error;
                  return;
                } else {
                  mainPhoneNumber = response.data.mobile_phone_number;
                  customerId = mainPhoneNumber as string;
                  apiRequestConfig.customerId = customerId;

                  if (getSetting('validateContract') || getSetting('validateTariff')) {
                    // optionally validate the contract
                    if (getSetting('validateContract')) {
                      validateContract(apiRequestConfig).then(response => {
                        if (!response || response.status === 'error') {
                          loading = false;
                          apiError = {
                            type: 'customerData', // clicking on "retry" in the api error modal, will restart the entire chain
                            message: response.error
                          }
                          return;
                        } else {
                          if (response.data.data.hasActive === true) {
                            loading = false;
                            hasValidContract = false;
                            apiError = {
                              type: 'customerData', // clicking on "retry" in the api error modal, will restart the entire chain
                              message: translate('There is already an active contract associated with this phone number. Please use a different phone number.')
                            }
                          } else {
                            hasValidContract = true;

                            // optionally validate the tariff
                            if (getSetting('validateTariff')) {
                              validateTariff(apiRequestConfig).then(response => {
                                if (!response || response.status === 'error') {
                                  loading = false;
                                  apiError = {
                                    type: 'customerData', // clicking on "retry" in the api error modal, will restart the entire chain
                                    message: response.error
                                  }
                                  return;
                                } else {
                                  if (response.data.data.eligible) {
                                    loading = false;
                                    isEligible = true;
                                    return;
                                  } else {
                                    loading = false;
                                    isEligible = false;
                                    return;
                                  }
                                }
                              });
                            } else {
                              return;
                            }
                          }
                        }
                      });
                    }
                  } else {
                    loading = false;
                  }
                }
              });
            }
          })
        }
      }
    });
  });

  $: {
    // in the case of A1 Croatia, customers with this birthday are A1 employees. They still need to be able to sign up, but this date wouldn't be valid. So in this case only, we need to make sure that the form field is actually editable, so that they can add their real birthday.
    if (mainPerson && mainPerson.dateOfBirth === '01.01.0001') {
      setContext('keepBirthdayEditable', true);
    }

    // handle whether the data retreival consent modal should be shown or not
    if (retrieveDataPermission === undefined) {
      // this is the initial state; show the modal
      showRetrieveDataPermissionModal = true;
    } else if (retrieveDataPermission === true) {
      // the user has agreed to the data retreival consent; show the form
      showRetrieveDataPermissionModal = false;
    } else if (retrieveDataPermission === false) {
      // the user has disagreed to the data retreival consent; show the form
      if (retrieveDataPermissionMandatory) {
        showRetrieveDataPermissionModal = true;
      } else {
        showRetrieveDataPermissionModal = false;
      }
    }

    // enable the hint about excessive loading times, when the configured time is reached
    if (loading === true) {
      showLongLoadingMessage = false;
      timer = setTimeout(() => {
        showLongLoadingMessage = true;
      }, maxLoadingTime);
    } else if (loading === false) { // disable the hint about excessive loading times, when the loading is done
      clearTimeout(timer);
      showLongLoadingMessage = false;
    }

    // if additional people were deleted
    if (additionalPeople.length === 0) {
      containsUnsavedAdditionalPeople = false;
      submittable = true;
    }
  }
  onDestroy(() => unsubAdditionalPeople());
</script>
{#if getSetting('getCustomerIdFromExternalService') && !authCode}
  <Modal open={true} headline={translate('A1 subscription required')}>
    <p>{translate("An active A1 subscription phone number is required to activate the insurance. By clicking the button, you'll be redirect to the A1 Authentication.")}</p>
    <span slot="button-decline" style="display: none;"></span>
    <button class="button" style="width: 100%;" type="button" slot="button-accept" disabled={redirecting} on:click={() => {
      redirecting = true;
      redirectToExternalService(getSetting('externalPhoneVerificationUrl'));
    }}>
      {#if redirecting}
        <span class="button__spinner"><Spinner /></span>
        { translate('...Redirecting') }
      {:else}
        { translate('Verify now') }
      {/if}
    </button>
  </Modal>
{:else if loading}
  <Modal open={true} nobuttons={true} loading="true" headline={translate('Data is being checked')}>
    <p>{translate('Please be patient for a moment...')}</p>
    {#if showLongLoadingMessage }
      <div class="long-loading-message">
        <p>{ translate('It seems that this page is taking longer to load than expected. Please try again or follow one of the following methods to overcome this issue:') }</p>
        <ul>
          <li>{ translate('Open this link in a different browser') }</li>
          <li>{ translate('Try forwarding this link to another device and loading this page on that other device') }</li>
          <li>{ translate('If you still have trouble loading the page, please contact our customer service for assistance:')}  <a href="tel:{getSetting('helpdeskTel')?.replace(/\s/, '')}">{getSetting('helpdeskTel')}</a>, <a href="mailto:{getSetting('helpdeskEmail')?.replace(/\s/, '')}">{getSetting('helpdeskEmail')}</a></li>
        </ul>
      </div>
    {/if}
  </Modal>
{:else if !customerId && tokenUsed}
  <Modal open={true} headline={translate('Session expired')}>
    <p>{translate('Please revalidate your A1 phone number. In order to revalidate you\'ll be redirect to the A1 Authentication.')}</p>
    <span slot="button-decline" style="display: none;"></span>
    <button class="button" style="width: 100%;" type="button" slot="button-accept" disabled={redirecting} on:click={() => {
      redirecting = true;
      redirectToExternalService(getSetting('externalPhoneVerificationUrl'));
    }}>
      {#if redirecting}
        <span class="button__spinner"><Spinner /></span>
        { translate('...Redirecting') }
      {:else}
        { translate('Verify phone number now') }
      {/if}
    </button>
  </Modal>
{:else if !customerId && requiresIdParameter}
  <Modal open={true}>
    <p>{translate('Something went wrong. Please try again, or contact our helpdesk:')} <a href="tel:{getSetting('helpdeskTel')?.replace(/\s/, '')}">{getSetting('helpdeskTel')}</a></p>
    <span slot="button-decline" style="display: none;"></span>
    <button class="button" style="width: 100%;" type="button" slot="button-accept" disabled={redirecting} on:click={() => {
      loading = true;
      reload();
    }}>
      {#if loading}
        <span class="button__spinner"><Spinner /></span>
        { translate('...Reloading') }
      {:else}
        { translate('Reload to try again') }
      {/if}
    </button>
  </Modal>
{:else}
  {#if getSetting('validateTariff') && isEligible === false}
    <Modal open={true} headline={translate('Tariff not eligible')}>
      <p>{translate("The tariff associated with your telephone number is not eligible for these products. Please use a different phone number. By clicking the button, you\'ll be redirected to the A1 Authentication, where you can choose a different phone number.")}</p>
      <span slot="button-decline" style="display: none;"></span>
      <button class="button" style="width: 100%;" type="button" slot="button-accept" disabled={redirecting} on:click={() => {
      redirecting = true;
      redirectToExternalService(getSetting('externalPhoneVerificationUrl'));
    }}>
        {#if redirecting}
          <span class="button__spinner"><Spinner /></span>
          { translate('...Redirecting') }
        {:else}
          { translate('Verify now') }
        {/if}
      </button>
    </Modal>
  {:else if getSetting('validateContract') && hasValidContract === false}
    <Modal open={true} headline={translate('Phone Number in use')}>
      <p>{translate("Travel protection already exists under this phone number. Please use a different phone number")}</p>
      <span slot="button-decline" style="display: none;"></span>
      <button class="button" style="width: 100%;" type="button" slot="button-accept" disabled={redirecting} on:click={() => {
      redirecting = true;
      redirectToExternalService(getSetting('externalPhoneVerificationUrl'));
    }}>
        {#if redirecting}
          <span class="button__spinner"><Spinner /></span>
          { translate('...Redirecting') }
        {:else}
          { translate('Verify different phone now') }
        {/if}
      </button>
    </Modal>
  {:else}
    {#if getSetting('showRetrieveDataPermissionModal')}
      <Modal open={showRetrieveDataPermissionModal}
             on:denied={() => retrieveDataPermission = false}
             on:accepted={() => {
               retrieveDataPermission = true
               loadCustomerData();
             }}
             hideDeclineButton={retrieveDataPermissionMandatory}
      >
        {#if retrieveDataPermissionMandatory}
          <p>{translate('Entering this website for information about and subscription of A1 travel insurance requires retrieving your basic personal data (name, address, personal ID, birthday) stored with A1.')}</p>
        {:else}
          <p>{translate('I agree that LAMIE may retrieve my personal data (first and last name, phone number, date of birth, address) from A1 to pre-fill the registration form.')}</p>
        {/if}
      </Modal>
    {/if}
    {#if !retrieveDataPermissionMandatory || retrieveDataPermission}
      <Modal open={apiError ? true:false} headline={ translate('Something went wrong') }>
        <p>{translate('There was an error trying to get your data from our Servers.')}</p>
        {#if apiError.message }<code><pre>{apiError.message}</pre></code>{/if}
        {#if retriedDataRetrieval > 3}
          <p class="color-accent">{ translate('The Problem seems to persist, you can try gain a bit later, or you can contact our helpdesk in order to get help:') }  <a href="tel:{getSetting('helpdeskTel')?.replace(/\s/, '')}">{getSetting('helpdeskTel')}</a></p>
        {/if}
        <button class="button vers--outline" type="button" style="width: 100%;" slot="button-decline" disabled={loading} on:click={() => retryFetches(apiError.type, retriedDataRetrieval+1)}>
          {#if loading}
            { translate('Reloading...') }
          {:else}
            { translate('Reload to try again') }
          {/if}
        </button>
        <span slot="button-accept" style="display: none;"></span>
      </Modal>
      <form on:submit={handleSubmit} class="form">
        <fieldset class="form__insurance-options">
          <legend class="base-headline">{translate('Choose your Option:')}</legend>
          <ChooseProduct on:choose={(product) => handleProductChange(product)} />
        </fieldset>
        {#if getSetting('downloads')}
          <div class="form__downloads">
            {#each getSetting('downloads') as download, i}
              <a class="button vers--outline" href={download.link[lang]} key={i} target="_blank">{download.name[lang]}</a>
            {/each}
          </div>
        {/if}
        {#if getSetting('showFormIntro')}
          <div class="form__intro">
            <p>{translate('Your cover is activated automatically once you start travelling and is only charged for the actual days you are travelling. Insurance premium is depending on the actual travel destination and is charged directly to your A1 invoice.')}</p>
          </div>
        {/if}
        {#if chosenProduct}
          <hr class="form__divider">
          <section class="form__customer-data customer-data" transition:fade>
            <MainInsuredForm
              prefilled={mainPerson}
              phoneNumber={mainPhoneNumber}
              :redirecting
              on:phoneNumberSwitch={e => {
                redirecting = true;
                redirectToExternalService(getSetting('externalPhoneVerificationUrl'));
              }}
              on:setFormLocked={ v => submittable = !v.detail }
            >
              {#if chosenProduct === "family"}
                <AdditionalPeople
                  error={additionalPeopleError}
                  unsavedPeople={containsUnsavedAdditionalPeople}
                  on:remove={validateAdditionalPeople}
                  on:save={validateAdditionalPeople}
                  on:add={addAdditionalPerson}
                />
              {/if}
            </MainInsuredForm>
          </section>
          {#if promotionText}
            <section class="form__promotion-text">
              <p>{ promotionText }</p>
            </section>
          {/if}
          <section class="form__consent-declarations">
            <h2 class="base-headline">{ translate('Declaration of Consent') }</h2>
            <ul class="check-list" role="list">
              {#each consentConfig as declaration, i}
                <li class="check-list__item" key={i}>
                  <ConsentCheck name={declaration.name}>{@html declaration.text[lang] }</ConsentCheck>
                </li>
              {/each}
            </ul>
          </section>
          <div class="form__submit">
            {#if containsUnsavedAdditionalPeople}
              <div class="form__submit-hints" transition:fade>
                <p>{ translate('You have added at least one additional person to your coverage without filling our their data and saving it. In order to submit the form, save them or remove them.') }</p>
              </div>
            {/if}
            {#if presubmit}
              <button class="button" type="submit" disabled={!submittable || loading}>
                {#if loading}
                  <span class="button__spinner"><Spinner /></span>
                {/if}
                { translate('Submit') }
              </button>
            {:else}
              {#if getSetting('usePreSubmit')}
                <div class="form__submit-summary" transition:fade>
                  <p>{ translate('Please be sure that the e-mail you provided is correct. You are about to register your insurance with this e-mail address:') }</p>
                  <p><code>{ formData?.email }</code></p>
                  <p>{ translate('If this looks correct to you, please proceed.') }</p>
                </div>
              {/if}
              <button class="button" type="submit" disabled={!submittable || loading}>
                {#if loading}
                  <span class="button__spinner"><Spinner/></span>
                {/if}
                { translate('Register now') }
              </button>
            {/if}
            {#if submitError}
              <div class="form__submit-errors" transition:fade>
                <p>{ translate('Something went wrong:') }</p>
                <p>{ translate('There was an error, trying to submit the form to our servers:') }</p>
                <pre><code>{submitError}</code></pre>
                <small>{ translate('You can try to submit the form again. If the error persists, feel free to contact our helpdesk:') } <a href="tel:{getSetting('helpdeskTel')?.replace(/\s/, '')}">{getSetting('helpdeskTel')}</a></small>
              </div>
            {/if}
          </div>
        {/if}
      </form>
    {/if}
  {/if}
{/if}

<style lang="scss">
  .long-loading-message {
    margin-block-start: var(--space-l-xl);
    padding: var(--space-s-m);
    background-color: hsl(0 0% 95.4%);
    border-radius: 4px;
    font-size: var(--step--1);
    text-align: start;

    > p {
      font-size: inherit;
      text-align: inherit;

      & + * {
        margin-block-start: .5em;
      }
    }

    ul {
      text-align: inherit;
      padding-inline-start: 1.25em;

      a {
        color: var(--color-accent);
        tect-decoration: underline;
      }
    }
  }

  :global(fieldset) {
    margin: 0;
    padding: 0;
    border: 0;
  }

  form :global(.input-group + .input-group) {
    margin-block-start: var(--space-l-xl);
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: var(--space-l-2xl);

    &__divider {
      margin-block: 0;
    }

    &__intro {
      text-align: center;
    }

    &__downloads {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2xs-xs);
    }

    &__promotion-text {
      margin-block: var(--space-s-m);
      margin-inline: auto;
      max-width: 65ch;
      font-size: var(--step-1);
      background-color: hsl(var(--color-accent-hs) 50% / .05);
      text-align: center;
      padding: var(--space-m-l);
      color: var(--color-accent-500);

      p {
        font-size: inherit;
      }
    }

    &__consent-declarations {
      .check-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-s);
        margin-block-start: var(--space-m-l);
      }
    }

    &__submit-summary {
      margin-block: var(--space-s-m);
      margin-inline: auto;
      max-width: 65ch;
      font-size: var(--step--1);
      background-color: hsl(var(--color-highlight-hs) 50% / .05);
      border: 1px solid var(--color-highlight);
      text-align: center;
      padding: var(--space-m-l);

      p + p {
        margin-block-start: .5em;
      }
    }

    &__submit-hints {
      margin-inline: auto;
      text-align: center;
      max-width: 65ch;
      font-size: var(--step--1);
      color: var(--color-medium-grey);
      margin-block-end: 1em;
    }

    &__submit-errors {
      margin-block-start: var(--space-s-m);
      padding: var(--space-s-m);
      border-radius: 2px;
      background-color: var(--color-error-100);
      color: var(--color-error);
      max-width: 65ch;
      margin-inline: auto;
      text-align: center;

      code {
        white-space: pre-wrap;
      }

      > p:first-child {
        margin-block-end: 1em;
        font-weight: 600;
        color: var(--color-accent);
      }
    }
  }
</style>
