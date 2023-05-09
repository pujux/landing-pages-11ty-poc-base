<script lang="ts">
  import {getContext} from "svelte";
  import {fly} from "svelte/transition";

  export let label: string;
  export let description: string;
  export let errors: string;
  export let required: boolean;
  export let readonly: boolean;
  export let id: string;
  export let value: any;
  export let selection: Array<{ label: string, value: string }> ;
  export let input = {
    element: "input",
    type: HTMLInputElement["type"] = 'text',
    name: HTMLInputElement["name"] = ''
  };

  const translate = getContext('translate');
</script>
<div class={`input-field vers--${input.name} ${errors ? 'has-errors':''}`}>
  <label class="input-field__label" for={id}>{ label }
    {#if required}*{/if}
    {#if readonly}
      <span class="read-only">{ translate('read only') }</span>
    {/if}
  </label>
  {#if description }<p class="input-field__description">{ description }</p>{/if}
  {#if input.element === "select" }
    <select class="input-field__input" on:change id={id} {...input} {required} bind:value={value} {...$$restProps}>
      {#each selection as option, i}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  {:else}
    <input class="input-field__input" on:change on:keyup id={id} {...input} {...$$restProps} {required} {readonly} value={value} on:input={e => e.target.value}>
  {/if}
  {#if errors}<small class="input-field__errors" transition:fly>{errors}</small>{/if}
</div>
<style lang="scss" scoped>
  @use '../../_scss/tools';

  .input-field {
    $p: &;
    display: flex;
    flex-direction: column;
    font-size: var(--step-1);
    gap: var(--space-2xs);

    @include tools.wider-than('medium') {
      font-size: var(--step-0);
    }

    &__label {
      order: 1;
      font-family: var(--font-headlines);
      font-size: 1em;

      .read-only {
        font-size: .85em;
        line-height: 1;
        color: var(--color-dark-grey);
        background-color: var(--color-light-grey);
        display: inline-flex;
        align-items: center;
        padding-block: .15em;
        padding-inline: .3em;
        border-radius: 2px;
      }
    }

    &__description {
      order: 3;
      font-size: .8em;
      color: var(--color-medium-grey);
      font-style: italic;
      line-height: 1.3;
    }

    &__input {
      order: 2;
      font: inherit;
      display: block;

      &[readonly] {
        pointer-events: none;
        cursor: not-allowed;
        color: var(--color-medium-grey);
      }
    }

    &__errors {
      order: 3;
      font-size: .85em;
      padding: 1em;
      border-radius: 2px;
      background-color: var(--color-error-100);
      color: var(--color-error);
    }

    &.vers--phone :global(+ .input-field) {
      grid-column: 1;
    }

    &.has-errors {
      #{$p} {
        &__label {
          color: var(--color-error);
        }
      }
    }
  }
</style>
