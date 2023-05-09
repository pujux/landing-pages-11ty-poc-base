<script lang="ts">
  import {createEventDispatcher, getContext, onDestroy, onMount} from "svelte";
  import Spinner from "./Spinner.svelte";

  const translate = getContext('translate');
  const dispatch = createEventDispatcher();

  export let open: boolean = false;
  export let loading: boolean = false;
  export let nobuttons: boolean = false;
  export let headline: string;
  export let hideDeclineButton: boolean = false;

  let ref;
  let portal;
  let body;

  function handleDeny() {
    //open = false;
    body.classList.toggle('has-modal-open', open);
    dispatch('denied');
  }

  function handleAccept() {
    //open = false;
    body.classList.toggle('has-modal-open', open);
    dispatch('accepted');
  }

  onMount( () => {
    body = document.body;
    portal = document.createElement("div");
    portal.className = "modal-portal";

    body.appendChild(portal);
    portal.appendChild(ref);
  } )

  onDestroy( () => {
    document.body.removeChild(portal);
    body.classList.toggle('has-modal-open', false);
  } )

  $: body && body.classList.toggle('has-modal-open', open);
</script>
<div bind:this={ref}>
  {#if open}
    <div class="modal-backdrop">
      <div class="modal">
        {#if headline}<h2 class="modal__headline">{headline}</h2>{/if}
        {#if loading}
          <div class="modal__spinner"><Spinner /></div>
        {/if}
        <div class="modal__content">
          <slot />
        </div>
        {#if !nobuttons}
          <div class="modal__controls">
            {#if !hideDeclineButton}
              <slot name="button-decline">
                <button class="button vers--outline" type="button" on:click={handleDeny}>{translate('No, thanks.')}</button>
              </slot>
            {/if}
            <slot name="button-accept">
              <button class="button" type="button" on:click={handleAccept}>{translate('Ok - proceed')}</button>
            </slot>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
<style lang="scss" scoped>
  :global(body.has-modal-open) {
    overflow: hidden;
  }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: radial-gradient(hsl(0 0% 0% / 0.25), hsl(0 0% 0% / 0.75));

    @supports (backdrop-filter: blur(1px)) {
      backdrop-filter: blur(5px);
    }
  }

  .modal {
    position: absolute;
    inset-block-start: 50%;
    inset-inline-start: 50%;
    transform: translate(-50%, -50%);
    width: min(100% - var(--site-padding), 450px);
    padding: var(--space-l-xl);
    background-color: #fff;
    box-shadow: 0px 3px 6px hsl(0 0% 0% / 0.29);
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    gap: var(--space-l-xl);

    &__headline {
      font-family: var(--font-headlines);
      font-size: var(--step-2);
      text-transform: none;
      margin: 0;
      font-weight: 550;
      color: var(--color-accent);
      text-align: center;
    }

    &__spinner {
      align-self: center;
      font-size: var(--space-l-xl);
      color: var(--color-highlight);
    }

    &__content {
      text-align: center;

      :global(> * + *) {
        margin-block-start: 1em;
      }

      :global(code) {
        width: 100%;
        text-align: start;
        display: block;
        background-color: var(--color-light-grey);
        border-radius: 4px;
        padding: var(--space-xs-s);
        line-height: 1.15;

        :global(pre) {
          margin: 0;
          white-space: pre-wrap;
        }
      }
    }

    &__controls {
      display: flex;
      gap: var(--space-s-m);
    }
  }
</style>
