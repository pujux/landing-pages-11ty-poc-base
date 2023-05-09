<script lang="ts">
  import {createEventDispatcher, getContext, onDestroy} from "svelte";
  import {differenceInYears, format, parse} from "date-fns";
  import InputGroup from "./InputGroup.svelte";
  import InputField from "./InputField.svelte";
  import {deriveBirthday} from "../utils/deriveBirthday";
  import {
    additionalPeopleStore,
    AdditionalPerson,
    removeAdditionalPerson,
    updateAdditionalPerson
  } from "../stores/additional-people";
  import {ValidateDateOfBirth, validateDateOfBirth} from "../utils/validateBirthday";

  export let person: AdditionalPerson;
  export let id = person.id;
  export let locked = !person.saved;

  let error: string;
  let debounceTimer;
  let formErrors: {[key: string]: string};
  let additionalPeople;

  const unsubAdditionalPeople = additionalPeopleStore.subscribe(people => additionalPeople = people);

  const translate = getContext('translate');
  const getSetting = getContext('setting');
  const getFormFieldSetting = getContext('formFieldSettings');
  const dispatch = createEventDispatcher();

  // contains all fields that are required
  const requiredFields = getSetting('form')['additionalPeopleFields'].filter(field => field.required);

  const deriveBirthdayFromPersonalId = getSetting('deriveBirthdayFromPersonalId');

  let derivedBirthday = person.formData?.dateOfBirth || '';

  function updateFormData(e, field, fromEvent = true) {
    // reset all errors, if a value has changed
    error = undefined;

    let newFormData = null;

    if (fromEvent) {
      if (field === 'dateOfBirth') {
        const ageConfig = {
          adultMaxAge: parseInt(getSetting('adultMaxAge')),
          childMaxAge: parseInt(getSetting('childMaxAge')),
          maxAdditionalAdults: parseInt(getSetting('maxAdditionalAdults')),
          maxAdditionalChildren: parseInt(getSetting('maxAdditionalChildren'))
        }
        const validity: ValidateDateOfBirth = validateDateOfBirth(e.target.value, ageConfig, additionalPeople);

        if (validity?.valid) {
          locked = false;
          derivedBirthday = e.target.value;
          newFormData = {...person.formData, ['dateOfBirth']: e.target.value};
          formErrors = {...formErrors, ['dateOfBirth']: null};
        } else {
          locked = true;
          if (validity.error === 'empty') {
            formErrors = {...formErrors, ['dateOfBirth']: translate('Please enter a date of birth.')};
          } else if (validity.error === 'format-invalid') {
            formErrors = {...formErrors, ['dateOfBirth']: translate('We cannot handle this format, please enter the date of birth in the format DD.MM.YYYY., e.g. 01.01.2000.')};
          } else if (validity.error === 'too-many-adults') {
            formErrors = {...formErrors, ['dateOfBirth']: translate('You cannot add more adults.')};
          } else if (validity.error === 'too-many-children') {
            formErrors = {...formErrors, ['dateOfBirth']: translate('You cannot add more children.')};
          } else if (validity.error === 'age-too-high') {
            formErrors = {...formErrors, ['dateOfBirth']: translate('People over the age of $n1 cannot be added.').replace('$n1', getSetting('adultMaxAge'))};
          } else {
            formErrors = {...formErrors, ['dateOfBirth']: validity.error};
          }
        }
      } else {
        newFormData = {...person.formData, [field]: e.target.value};
      }
    } else {
      newFormData = {...person.formData, [field]: e};
    }

    // check if newFormData contains all required fields
    const allRequiredFieldsFilled = requiredFields.every(field => {
      return newFormData[field.name] !== undefined && newFormData[field.name] !== '';
    });

    // only if all of these fields exist and there are no shown birthday errors
    if ( allRequiredFieldsFilled && !formErrors?.dateOfBirth ) {
      // ...and if they are not empty
      Object.keys(newFormData).forEach(key => {
        if (key !== 'passportNumber') {
          if (newFormData[key] === '') {
            return locked = true;
          }
        }
      });

      locked = false;
    } else {
      locked = true;
    }

    person = {...person, formData: newFormData};
  }

  function handlePersonalIdChange(e) {
    if (deriveBirthdayFromPersonalId) {
      const birthday = deriveBirthday(e.target.value);
      derivedBirthday = format(birthday, 'dd.MM.yyyy');

      updateFormData(derivedBirthday, 'dateOfBirth', false);
    }

    updateFormData(e, 'nationalIdentificationNumber');
  }

  function remove() {
    removeAdditionalPerson(person);
    dispatch('remove');
  }

  function save() {
    const { firstName, lastName, dateOfBirth } = person.formData;
    let newPerson = {
      name: '',
      type: '',
      age: 0,
      birthDate: 0,
      saved: false
    };

    // set the name
    newPerson.name = `${firstName} ${lastName}`;

    // set birthday, type & age
    const parsedBirthDate = parse(dateOfBirth, 'dd.MM.yyyy', new Date());
    const today = new Date();
    const age = differenceInYears(today, parsedBirthDate);

    newPerson.age = age;
    newPerson.birthDate = dateOfBirth;

    if (age < getSetting('childMaxAge')) {
      newPerson.type = 'Child';
    } else {
      newPerson.type = 'Adult';
    }

    // set it to saved
    newPerson.saved = true;

    person = {...person, ...newPerson};

    updateAdditionalPerson(person);
    dispatch('save', person);
  }

  function debounceUpdateFormData(e, name) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      updateFormData(e, name);
    }, 750);
  }

  onDestroy(() => {
    unsubAdditionalPeople();
  });
</script>

<div class="add-person-form">
  <div class="add-person-form__fields">
    <InputGroup name="additional-people">
      {#if getFormFieldSetting('salutation', 'additionalPeopleFields')}
        <InputField
                label={translate('Salutation')}
                required={getFormFieldSetting('salutation', 'additionalPeopleFields').required}
                value={person.formData?.salutation || null}
                id={`${id}-salutation`}
                on:change={(e) => updateFormData(e, 'salutation')}
                selection={[
                  {label: translate('Mr.'), value: 'Male'},
                  {label: translate('Mrs.'), value: 'Female'},
                  {label: translate('Unknown'), value: 'Unknown'}
                ]}
                input={{ element: 'select', type: 'text', name: `additional-person-${id}-salutation` }}
        />
      {/if}
      {#if getFormFieldSetting('nationalIdentificationNumber', 'additionalPeopleFields')}
        <InputField
                label={`${translate('Personal ID')} / ${getSetting('personalIdTerm')} `}
                required={getFormFieldSetting('nationalIdentificationNumber', 'additionalPeopleFields').required}
                value={person.formData?.nationalIdentificationNumber}
                id={`${id}-personal-id`}
                on:change={handlePersonalIdChange}
                input={{ type: 'number', name: `additional-person-${id}-personal-id` }}
        />
      {/if}
      {#if getFormFieldSetting('dateOfBirth', 'additionalPeopleFields')}
        <InputField
                label={translate('Date of Birth')}
                description={translate('Birthday, eg. 01.12.1979')}
                required={getFormFieldSetting('dateOfBirth', 'additionalPeopleFields').required}
                value={ deriveBirthdayFromPersonalId ? derivedBirthday:(person.formData?.dateOfBirth ? person.formData.dateOfBirth:null)}
                id={`${id}-birth-date`}
                on:change={(e) => updateFormData(e, 'dateOfBirth')}
                on:keyup={(e) => debounceUpdateFormData(e, 'dateOfBirth')}
                errors={formErrors?.dateOfBirth}
                input={{ type: 'text', name: `additional-person-${id}-birth-date`, pattern: '^([0]?[1-9]|[1|2][0-9]|[3][0|1])[.]([0]?[1-9]|[1][0-2])[.]([0-9]{4}|[0-9]{2})$'}}
        />
      {/if}
      {#if getFormFieldSetting('firstName', 'additionalPeopleFields')}
        <InputField
                label={translate('First Name')}
                required={getFormFieldSetting('firstName', 'additionalPeopleFields').required}
                value={person.formData?.firstName || null}
                id={`${id}-first-name`}
                on:change={(e) => updateFormData(e, 'firstName')}
                on:keyup={(e) => debounceUpdateFormData(e, 'firstName')}
                input={{ type: 'text', name: `additional-person-${id}-first-name` }}
        />
      {/if}
      {#if getFormFieldSetting('lastName', 'additionalPeopleFields')}
        <InputField
                label={translate('Surname')}
                required={getFormFieldSetting('lastName', 'additionalPeopleFields').required}
                value={person.formData?.lastName || null}
                id={`${id}-surname`}
                on:change={(e) => updateFormData(e, 'lastName')}
                on:keyup={(e) => debounceUpdateFormData(e, 'lastName')}
                input={{ type: 'text', name: `additional-person-${id}-surname` }}
        />
      {/if}
      {#if getFormFieldSetting('passportNumber', 'additionalPeopleFields')}
        <InputField
                label={translate('Passport Number')}
                required={getFormFieldSetting('passportNumber', 'additionalPeopleFields').required}
                value={person.formData?.passportNumber || null}
                id={`${id}-passport-number`}
                on:change={(e) => updateFormData(e, 'passportNumber')}
                on:keyup={(e) => debounceUpdateFormData(e, 'passportNumber')}
                input={{ type: 'text', name: `additional-person-${id}-passport-number` }}
        />
      {/if}
    </InputGroup>
  </div>
  {#if error}
    <div class="add-person-form__errors">
      <p>{error}</p>
    </div>
  {/if}
  <div class="add-person-form__controls">
    <button class="button  vers--outline" type="button" on:click={remove}>{translate('Remove')}</button>
    <button class="button" type="button" on:click={save} disabled={locked}>{translate('Save')}</button>
  </div>
</div>
<style lang="scss" scoped>
  .add-person-form {
    display: flex;
    flex-direction: column;
    gap: var(--int-padding);

    &__controls {
      display: flex;
      gap: var(--int-padding, 1em);
    }
  }
</style>
