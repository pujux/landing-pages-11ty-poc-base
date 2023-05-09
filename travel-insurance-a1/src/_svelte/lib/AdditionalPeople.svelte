<script lang="ts">
  import {createEventDispatcher, getContext, onDestroy} from "svelte";
  import AdditionalPersonForm from "./AdditionalPersonForm.svelte";
  import {additionalPeopleStore} from "../stores/additional-people";
  import {format, parse} from "date-fns";

  const dispatch = createEventDispatcher();

  const translate = getContext('translate');
  const getSetting = getContext('setting');

  let additionalPeople;
  const unsubAdditionalPeople = additionalPeopleStore.subscribe(people => additionalPeople = people);
  
  export let error = undefined;
  export let unsavedPeople = false;

  // this is the base, translatable string
  const introBase = translate(`You can add up to $n additional people.`);
  const noticeBase = translate(`$n1 adult (under the age of $n2) and up to $n3 children (under the age of $n4) are can be added`);
  const noticeBaseNoMaxAge = translate(`$n1 adult and up to $n2 children (under the age of $n3) are can be added`);

  // builds the string with the country-specific settings
  const intro = introBase.replace('$n', getSetting('maxAdditionalPeople'));
  const notice = noticeBase
    .replace('$n1', getSetting('maxAdditionalAdults'))
    .replace('$n2', getSetting('adultMaxAge'))
    .replace('$n3', getSetting('maxAdditionalChildren'))
    .replace('$n4', getSetting('childMaxAge'));

  const noticeNoMaxAge = noticeBaseNoMaxAge
    .replace('$n1', getSetting('maxAdditionalAdults'))
    .replace('$n2', getSetting('maxAdditionalChildren'))
    .replace('$n3', getSetting('childMaxAge'));


  function handleRemove() {
    dispatch('remove');
  }

  function handleSave() {
    dispatch('save');
  }

  function handleAdd() {
    dispatch('add');
  }

  onDestroy(() => unsubAdditionalPeople());
</script>
<section class="additional-people">
  <header class="additional-people__header">
    <h4 class="additional-people__headline  base-headline">{ translate('Additionally Insured People') }</h4>
    <p class="additional-people__intro">{ intro }</p>
    <small class="additional-people__notice">{ getSetting('adultMaxAge') ? notice:noticeNoMaxAge }</small>
    {#if error }
      <p class="additional-people__error">{error}</p>
    {/if}
  </header>
  {#if additionalPeople.length > 0 }
    <ol class="additional-people__list">
      {#each additionalPeople as person, i }
        <li class="additional-people__list-item">
          <details class="additional-person" open={!person.saved}>
            <summary class="additional-person__label">
              <p class="name">{ person.name }</p><br>
              <p class="type">
                {#if person.saved}
                  { translate(person.type) } ({person.age}), { format(parse(person.birthDate, 'dd.MM.yyyy', new Date()), 'dd.MM.yyyy') }
                {:else}
                  { translate('Insert this persons data in the form below and save it') }
                {/if}
              </p>
            </summary>
            <div class="additional-person__form">
              <AdditionalPersonForm person={person} on:remove={handleRemove} on:save={handleSave} />
            </div>
          </details>
        </li>
      {/each}
    </ol>
  {/if}
  {#if (additionalPeople.length < getSetting('maxAdditionalPeople')) && !unsavedPeople && !error }
    <button class="button  vers--outline" type="button" on:click={handleAdd}>
      <span class="icon">
        <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 8V1m0 7v7m0-7H1m7 0h7" stroke="#000" stroke-width="2" stroke-linecap="round"/></svg>
      </span>
      { translate('Add Person') }
    </button>
  {/if}
</section>
<style lang="scss" scoped>
  .additional-people {
    display: flex;
    flex-direction: column;
    gap: var(--space-l-xl);
    align-items: center;
    margin-block-start: var(--space-xl-2xl);

    &__header {
      display: flex;
      flex-direction: column;
      text-align: center;
    }

    &__intro {
      font-size: var(--step-1);
      margin-block-start: 1em;
    }

    &__notice {
      font-size: var(--step-0);
      margin-block-start: .25em;
      max-width: 65ch;
    }

    &__error {
      max-width: 65ch;
      padding: 1em;
      font-size: calc(var(--step-0) * .9);
      background-color: var(--color-error-100);
      color: var(--color-error);
      margin-block-start: 1em;
    }

    &__list {
      --int-padding: var(--space-2xs-xs);
      max-width: 450px;
      width: 100%;
      padding: 0;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: var(--int-padding);

      &-item {
        padding: var(--int-padding);

        & + li {
          border-top: 1px solid var(--color-grey);
          padding-top: calc(var(--int-padding) * 2);
        }
      }
    }
  }

  .additional-person {
    --int-padding: var(--space-xs-s);
    padding: var(--int-padding);

    &[open] {
      background-color: var(--color-light-grey);
      border-radius: 2px;
    }

    &__label {
      font-size: var(--step-1);

      &:where(:hover, :focus) {
        cursor: pointer;
      }

      .name {
        display: inline-block;
        font-size: 1em;
      }

      .type {
        font-size: .85em;
        font-style: italic;
        color: var(--color-medium-grey);
      }
    }

    &__form {
      --cols: 1 !important;
      margin-block-start: var(--int-padding);
    }
  }
</style>
