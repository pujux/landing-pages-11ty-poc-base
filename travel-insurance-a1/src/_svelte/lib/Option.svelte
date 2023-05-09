<script lang="ts">
  import {getContext} from "svelte";

  const getSetting = getContext('setting');
  const translate = getContext('translate');

  const currency = getSetting('currency');
  const showAreaIcon = getSetting('showAreaIcons');

  export let icon: string;
  export let name: string;
  export let type: string;
  export let areas: Array<{name: string, value: number}>;
  export let checklabel: string;
  export let checkid: string;
  export let checkname: string;
  export let checkvalue: any;
  export let group: string;
</script>
<div class="option">
  <dt class="option__header">
    {#if icon}
      <img class="option__logo" src={icon} alt="" loading="lazy">
    {/if}
    <span class="option__name">
            <p class="main">{name}</p>
            <p class="sub">{type}</p>
        </span>
  </dt>
  <dd class="option__main">
    <div class="option__areas">
      {#each areas as area}
        <p class="area">
          {#if showAreaIcon}
                        <span class="area__icon">
                            <img src={area.icon} alt="" loading="lazy">
                        </span>
          {/if}
          <span class="area__name">{area.name}</span>
          <strong class="area__price  price">
            <span class="price__value">{area.value}</span>
            <span class="price__currency">{currency}</span>
            <span class="price__for-period">/{translate('Day')}</span>
          </strong>
        </p>
      {/each}
    </div>
    <div class="option__check">
      <label class="label" for={checkid}>{checklabel}</label>
      <input class="checkbox" bind:group id={checkid} on:change type="radio" name={checkname} value={checkvalue}>
    </div>
  </dd>
</div>
<style lang="scss" scoped>
  @use '../../_scss/tools' as *;

  .option {
    $p: &;
    --int-bg-color: var(--bg-color, var(--color-light-grey));
    --int-padding: var(--space-2xs-xs);
    --int-gap: var(--gap, 0);
    display: flex;
    flex-direction: column;
    gap: var(--int-gap);
    position: relative;
    flex: 1;

    @include wider-than(medium) {
      --int-padding: var(--space-m-l);
    }

    &__header {
      padding-block: calc(var(--int-padding) * 2);
      padding-inline: var(--int-padding);
      background-color: var(--int-bg-color);
      display: flex;
      align-items: center;
      flex-direction: column;
      gap: var(--space-l);
      flex: 1;
    }

    &__logo {
      @include narrower-than(medium) {
        display: block;
        width: 2em;
        height: auto;
      }
    }

    &__name {
      font-size: calc(var(--step-3) * .95);
      font-family: var(--font-headlines);
      line-height: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: .15em;

      & > .main {
        font-size: inherit;
        line-height: inherit;
        color: var(--theme-color, currentcolor);
      }
      .sub {
        font-size: .6em;
        font-weight: 400;
        text-align: center;
      }
    }

    &__main {
    }

    &__areas {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      gap: var(--int-gap);

      .area {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        background-color: var(--int-bg-color);
        padding-inline: var(--int-padding);
        padding-block: var(--space-2xs-xs);
        text-align: center;

        @include wider-than(medium) {
          flex-direction: row;
          font-size: calc(var(--step-1) * 1.25);
          gap: 1em;
        }

        &__icon {
          display: block;
          width: 1.5em;
          aspect-ratio: 1/1;
          object-fit: contain;
        }

        &__name {
          text-transform: uppercase;
          color: var(--theme-color, var(--color-accent, currentcolor));
          flex: 1;
          text-align: start;
          font-weight: 400;
        }

        &__price {
          font-size: 1.25em;
        }

        .price {
          font-weight: 400;
          display: flex;
          justify-content: end;
          align-items: baseline;
          text-transform: uppercase;
          flex-wrap: wrap;
          line-height: 1;
          text-align: end;

          &__currency {
            font-size: .6em;
            display: inline-block;
            margin-inline-start: .25em;
            margin-block: auto;
          }

          &__for-period {
            font-size: .5em;
            display: block;
            width: 100%;
            text-transform: none;
          }
        }
      }
    }

    &__check {
      background-color: hsl(0 0% 91%);
      padding: var(--int-padding);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1em;

      .label {
        font-size: var(--step--1);
        text-align: end;

        @include narrower-than(medium) {
          line-height: 1;
        }

        @include wider-than(medium) {
          font-size: var(--step-1);
        }

        &::before {
          content: '';
          position: absolute;
          inset: 0;
        }

        &:where(:hover, :focus) {
          cursor: pointer;
        }
      }

      .checkbox {
        display: inline-block;
        font-size: var(--step-2);
        width: 1em;
        height: 1em;
        margin: 0;
      }
    }
  }
</style>
