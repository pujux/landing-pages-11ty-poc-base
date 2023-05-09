<script lang="ts">
    import InputGroup from "./InputGroup.svelte";
    import InputField from "./InputField.svelte";
    import {createEventDispatcher, getContext, setContext} from "svelte";
    import {formatBirthday} from "../utils/formatBirthday";
    import {deriveBirthday} from "../utils/deriveBirthday";
    import {format} from "date-fns";
    import {validateDateOfBirth, ValidateDateOfBirth} from "../utils/validateBirthday";

    const dispatch = createEventDispatcher();
    
    export let prefilled;
    export let phoneNumber = "";
    export let redirecting = false;

    const translate = getContext('translate');
    const getSetting = getContext('setting');
    const getFormFieldSetting = getContext('formFieldSettings');
    const lang = getContext('language')();
    const keepBirthdayEditable = getContext('keepBirthdayEditable');

    let derivedBirthday = '';
    let formErrors: {[key: string]: string};
    let debounceTimer;

    const birthday = () => {
      if (prefilled?.dateOfBirth) {
        // in this case, the birthday is prefilled but should not be editable. The field is kept editable for the special case of birthdays with 01.01.0001
        if (keepBirthdayEditable) {
          return null;
        } else {
          return prefilled?.dateOfBirth;
        }
      } else if (getSetting('deriveBirthdayFromPersonalId')) {
        return derivedBirthday;
      } else {
        return null;
      }
    }

    function handlePersonalIdChange(e) {
      if (getSetting('deriveBirthdayFromPersonalId')) {
        const birthday = deriveBirthday(e.target.value);
        derivedBirthday = format(birthday, 'dd.MM.yyyy');
      }
    }

    function handlePhoneNumberSwitch(e) {
      redirecting = true;
      dispatch('phoneNumberSwitch');
    }

    function validateBirthday(e) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const ageConfig = {
          adultMaxAge: parseInt(getSetting('adultMaxAge')),
          mainInsuredMinAge: parseInt(getSetting('mainInsuredMinAge'))
        }
        let validity: ValidateDateOfBirth = validateDateOfBirth(e.target.value, ageConfig, false);

        if (validity?.valid) {
          formErrors = {...formErrors, ['dateOfBirth']: null};
          dispatch('setFormLocked', false);
        } else {
          dispatch('setFormLocked', true);
          if (validity.error === 'empty') {
            formErrors = {...formErrors, ['dateOfBirth']: translate('Please enter a date of birth.')};
          } else if (validity.error === 'format-invalid') {
            formErrors = {...formErrors, ['dateOfBirth']: translate('We cannot handle this format, please enter the date of birth in the format DD.MM.YYYY., e.g. 01.01.2000.')};
          } else if (validity.error === 'age-too-high') {
            formErrors = {...formErrors, ['dateOfBirth']: translate('People over the age of $n1 cannot be added.').replace('$n1', getSetting('adultMaxAge'))};
          } else if (validity.error === 'age-too-low') {
            formErrors = {...formErrors, ['dateOfBirth']: translate('The main insured person needs to be at least $n1 or older.').replace('$n1', getSetting('mainInsuredMinAge'))};
          } else {
            formErrors = {...formErrors, ['dateOfBirth']: validity.error};
          }
        }
      }, 750);
    }

    /**
     * Sometimes, the prefilled streetname or number are returning `null`. But as these two are concatenated, they'll be turned into strings. So we have to only concatenate them, when both things are not null, only return the streetname when streetname is given but number isn't, and in other cases, just return null, so that the input remains empty.
     */
    function sanitizeStreetNameNumber(_name, _number) {
      if (_name && _number) {
        return `${_name} ${_number}`;
      } else if (_name && !_number) {
        return _name;
      } else {
        return null;
      }
    }
</script>
<section class="customer-data">
  <h3 class="base-headline customer-data__headline">{translate('Customer Data')}</h3>
  <div class="customer-data__fields">
    <InputGroup headline={translate('Basic Information')}>
      <InputField
        label={translate('A1 Mobile Phone Nr.')}
        description={translate('This phone number activates your travel insurance cover.')}
        required={getFormFieldSetting('phoneNumber').required}
        readonly={getFormFieldSetting('phoneNumber').readonly}
        value={phoneNumber}
        id="phone"
        input={{ type: 'tel', name: 'phoneNumber'}}
      />
      {#if getFormFieldSetting('email')}
        <InputField
          label={translate('E-Mail')}
          required={getFormFieldSetting('email').required}
          readonly={getFormFieldSetting('email').readonly}
          value={prefilled?.email || ''}
          id="email"
          input={{ type: 'email', name: 'email'}}
        />
      {/if}
      {#if getSetting('externalPhoneVerificationUrl')}
        <div class="customer-data__different-phone">
          <button class="button vers--outline" type="button" disabled={redirecting} on:click={handlePhoneNumberSwitch}>
            {#if redirecting}
              { translate('...Redirecting') }
            {:else}
              { translate('Use different phone number') }
            {/if}
          </button>
        </div>
      {/if}
    </InputGroup>
    <InputGroup headline={translate('Main insured Person')}>
      {#if getFormFieldSetting('salutation')}
        <InputField
                label={translate('Salutation')}
                required={getFormFieldSetting('salutation').required}
                value={prefilled?.gender}
                id="title"
                selection={[
                            {label: translate('Mr.'), value: 'Male'},
                            {label: translate('Mrs.'), value: 'Female'},
                            {label: translate('Unknown'), value: 'Unknown'}]}
                input={{ element: "select", type: 'text', name: 'salutation'}}
        />
      {/if}
      {#if getFormFieldSetting('firstName')}
        <InputField
          label={translate('First Name')}
          required={getFormFieldSetting('firstName').required}
          readonly={getFormFieldSetting('firstName').readonly}
          value={prefilled?.firstName || ''}
          id="first-name"
          input={{ type: 'text', name: 'firstName' }}
        />
      {/if}
      {#if getFormFieldSetting('lastName')}
        <InputField
          label={translate('Surname')}
          required={getFormFieldSetting('lastName').required}
          readonly={getFormFieldSetting('lastName').readonly}
          value={prefilled?.lastName || ''}
          id="surname"
          input={{ type: 'text', name: 'lastName'}}
        />
      {/if}
      {#if getFormFieldSetting('nationalIdentificationNumber')}
        <InputField
                label={`${translate('Personal ID')} / ${getSetting('personalIdTerm')} `}
                required={getFormFieldSetting('nationalIdentificationNumber').required}
                readonly={getFormFieldSetting('nationalIdentificationNumber').readonly}
                value={prefilled?.nationalIdentificationNumber}
                id="personal-id"
                input={{ type: 'number', name: 'nationalIdentificationNumber' }}
                on:change={handlePersonalIdChange}
        />
      {/if}
      {#if getFormFieldSetting('dateOfBirth')}
        <InputField
          label={translate('Date of Birth')}
          description={translate('Birthday, eg. 01.12.1979')}
          required={getFormFieldSetting('dateOfBirth').required}
          readonly={getFormFieldSetting('dateOfBirth').readonly && !keepBirthdayEditable}
          value={birthday()}
          errors={formErrors?.dateOfBirth}
          on:keyup={e => validateBirthday(e)}
          id="date-of-birth"
          input={{ type: 'text', name: 'dateOfBirth', pattern: '^([0]?[1-9]|[1|2][0-9]|[3][0|1])[.]([0]?[1-9]|[1][0-2])[.]([0-9]{4}|[0-9]{2})$'}}
        />
      {/if}
      {#if getFormFieldSetting('passportNumber')}
        <InputField
          label={translate('Passport Number')}
          required={getFormFieldSetting('passportNumber').required}
          readonly={getFormFieldSetting('passportNumber').readonly}
          value={prefilled?.passport.passportNumber || ''}
          id="passport-number"
          input={{ type: 'text', name: 'passportNumber'}}
        />
      {/if}
    </InputGroup>
    <InputGroup headline={translate('Address in $n').replace('$n', getSetting('countryName')[lang])}>
      {#if getFormFieldSetting('street')}
        <InputField
                label={translate('Street')}
                description={translate('Street name and number, residence in $n required.').replace('$n', getSetting('countryName')[lang])}
                required={getFormFieldSetting('street').required}
                readonly={getFormFieldSetting('street').readonly}
                value={
                prefilled
                ? sanitizeStreetNameNumber(prefilled.address.addressLine1, prefilled.address.addressLine2)
                : null}
                id="street"
                input={{ type: 'text', name: 'street'}}
        />
      {/if}
      {#if getFormFieldSetting('postalCode')}
        <InputField
                label={translate('Postal Code')}
                required={getFormFieldSetting('postalCode').required}
                readonly={getFormFieldSetting('postalCode').readonly}
                value={prefilled?.address.postalCode || ''}
                id="postal-code"
                input={{ type: 'number', name: 'postalCode'}}
        />
      {/if}
      {#if getFormFieldSetting('city')}
        <InputField
                label={translate('City')}
                required={getFormFieldSetting('city').required}
                readonly={getFormFieldSetting('city').readonly}
                value={prefilled?.address.city || ''}
                id="city"
                input={{ type: 'text', name: 'city'}}
        />
      {/if}
    </InputGroup>
  </div>
  <slot />
</section>
<style lang="scss" scoped>
  .customer-data {
    &__headline {
      margin-block-end: var(--space-l);
    }

    &__different-phone {
      align-self: center;
      justify-self: end;
    }
  }
</style>
