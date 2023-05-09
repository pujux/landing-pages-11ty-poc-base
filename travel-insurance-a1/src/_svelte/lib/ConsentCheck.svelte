<script lang="ts">
  export let name: string;

  const id = `consent-check-${name}`;
</script>
<div class="consent-check">
  <label class="consent-check__label" for={id}>
    <slot />
  </label>
  <input class="consent-check__checkbox" type="checkbox" id={id} name={name} on:change required>
</div>
<style lang="scss" scoped>
  .consent-check {
    font-size: var(--step-0);
    display: flex;
    flex-direction: row-reverse;
    align-items: start;
    gap: 1em;

    &__label {
      line-height: 1.5;
      flex: 1;

      &:where(:focus, :hover) {
        cursor: pointer;
      }
    }

    &__checkbox {
      font: inherit;
      margin: 0;
      margin-block-start: .3em;
    }
  }
</style>
