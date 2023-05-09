<svg class="spinner" aria-hidden="true" viewBox="0 0 50 50"><circle class="path" stroke="currentcolor" cx="25" cy="25" r="20" fill="none" stroke-width="7"></circle></svg>
<style lang="scss" scoped>
  .spinner {
    animation: spinner-rotate 2s linear infinite;
    z-index: 2;
    display: block;
    width: 1em;
    height: 1em;

    .path {
      stroke-linecap: round;
      animation: spinner-dash 1.5s ease-in-out infinite;
    }

    @keyframes spinner-rotate {
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes spinner-dash {
      0% {
        stroke-dasharray: 1, 150;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -35;
      }
      100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -124;
      }
    }
  }
</style>
