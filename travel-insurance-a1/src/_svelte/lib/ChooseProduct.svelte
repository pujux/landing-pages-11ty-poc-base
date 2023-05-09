<script lang="ts">
  // icons
  import singleIcon from '../assets/single.svg';
  import familyIcon from '../assets/family.svg';
  import a1Logo from '../assets/a1-logo.png';
  import europeIcon from '../assets/europe.png';
  import worldIcon from '../assets/world.png';

  import Option from "./Option.svelte";
  import {createEventDispatcher, getContext} from "svelte";

  const dispatch = createEventDispatcher();

  const translate = getContext('translate');
  const getSetting = getContext('setting');
  const productConfig = getSetting('products');

  let chosenProduct = undefined;

  function handleProductChange(e) {
    chosenProduct = e.target.value;
    dispatch('choose', chosenProduct);
  }

  function singlePriceAreas() {
    let areas = [];

    if (productConfig.single.prices.europe) {
      areas.push({
        name: translate('Europe'),
        icon: europeIcon,
        value: productConfig.single.prices.europe,
      });
    }

    if (productConfig.single.prices.worldwide) {
      areas.push({
        name: translate('Worldwide'),
        icon: worldIcon,
        value: productConfig.single.prices.worldwide,
      });
    }

    return areas;
  }

  function familyPriceAreas() {
    let areas = [];

    if (productConfig.family.prices.europe) {
      areas.push({
        name: translate('Europe'),
        icon: europeIcon,
        value: productConfig.family.prices.europe,
      });
    }

    if (productConfig.family.prices.worldwide) {
      areas.push({
        name: translate('Worldwide'),
        icon: worldIcon,
        value: productConfig.family.prices.worldwide,
      });
    }

    return areas;
  }

</script>
<dl class="choose-product">
  <div class={`choose-product__item ${ chosenProduct && ( chosenProduct === 'single' ? 'is-chosen':'is-not-chosen' )}`}>
    <Option
            name="{translate('Single')}"
            type="{translate('For 1 Person')}"
            icon={productConfig.single?.icon === 'a1' ? a1Logo:singleIcon}
            areas={singlePriceAreas()}
            checklabel="{translate('Cover for 1 person')}"
            checkid="travel-protect-single"
            checkname="product"
            checkvalue="single"
            group="product"
            on:change={handleProductChange}
    />
  </div>
  <div class={`choose-product__item ${ chosenProduct && ( chosenProduct === 'family' ? 'is-chosen':'is-not-chosen' )}`}>
    <Option
            name="{translate('Family')}"
            type="{
              translate('For up to $n1 adults and $n2 children')
              .replace('$n1', 1 + parseInt(getSetting('maxAdditionalAdults')))
              .replace('$n2', getSetting('maxAdditionalChildren'))
            }"
            icon={productConfig.family?.icon === 'a1' ? a1Logo:familyIcon}
            areas={familyPriceAreas()}
            checklabel="{translate('Cover for more people')}"
            checkid="travel-protect-family"
            checkname="product"
            checkvalue="family"
            group="product"
            on:change={handleProductChange}
    />
  </div>
</dl>
<style lang="scss" scoped>
  @use '../../_scss/tools' as *;

  .choose-product {
    $p: &;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: .25em;
    margin-block-start: var(--space-l);
    perspective: 150px;

    @include wider-than(medium) {
      gap: var(--space-xs-s);
    }

    &:where(:hover, :focus-within) {
      #{$p} {
        &__item {
          transform: translateZ(-.25em);
          opacity: .8;

          &:where(:hover, :focus-within):not(.is-chosen) {
            transform: translateZ(-.125em);
            opacity: .9;
          }
        }
      }
    }

    &__item {
      --theme-color: var(--color-accent);
      transition-property: opacity, transform, border-color;
      transition-duration: var(--animation-base-duration);
      transition-timing-function: var(--animation-base-easing);
      border: 2px solid transparent;
      border-radius: 2px;
      padding: var(--space-2xs-xs);
      display: flex;
      flex-direction: column;
      align-items: stretch;

      &.is-chosen {
        border-color: var(--theme-color);
        transform: none;
        opacity: 1;
      }

      &.is-not-chosen {
        transform: translateZ(-.5em);
        opacity: .625;
      }

      & + & {
        --theme-color: var(--color-highlight);
      }
    }
  }
</style>
