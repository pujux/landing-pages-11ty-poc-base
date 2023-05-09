<script lang="ts">
  export let headline: string;
  export let description: string;
  export let name: string;
</script>
<fieldset class="input-group" name={name}>
  {#if headline}<legend class="input-group__headline">{ headline }</legend>{/if}
  {#if description}<p class="input-group__description">{ description }</p>{/if}
  <slot/>
</fieldset>
<style lang="scss" scoped>
  @use '../../_scss/tools';

  .input-group {
    --int-cols: var(--cols, 1);
    display: grid;
    grid-template-columns: repeat(var(--int-cols), 1fr);
    gap: var(--space-m);

    @include tools.wider-than('medium') {
      --int-cols: var(--cols, 2);
      gap: var(--space-s);
    }

    &__headline {
      font-family: var(--font-headlines);
      grid-column: 1 / -1;
      font-size: var(--step-2);
      text-transform: uppercase;
      padding: 0;

      @include tools.wider-than('medium') {
        font-size: var(--step-1);
      }
    }

    &__description {
      font-size: var(--step-1);
      margin-block-end: var(--space-s);
      grid-column: 1 / -1;

      @include tools.wider-than('medium') {
        font-size: var(--step-0);
      }
    }
  }
</style>