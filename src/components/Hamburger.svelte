<script>
  export let open = false;
</script>

<span
  class="text-gray-500 hover:text-gray-700 cursor-pointer border-none focus:outline-none p-0"
  class:open
  on:click={() => (open = !open)}
>
  <svg width="20" height="20">
    <line id="top" x1="0" y1="2" x2="32" y2="2" />
    <line id="middle" x1="0" y1="8" x2="32" y2="8" />
    <line id="bottom" x1="0" y1="14" x2="32" y2="14" />
  </svg>
</span>

<style>
  svg {
    min-height: 20px;
    transition: transform 0.3s ease-in-out;
    color: #2d2e32;
  }

  svg line {
    stroke: currentColor;
    stroke-width: 3;
    transition: transform 0.3s ease-in-out;
  }

  .open svg {
    transform: scale(1);
  }

  .open #top {
    transform: translate(3px, 0px) rotate(45deg);
  }

  .open #middle {
    opacity: 0;
  }

  .open #bottom {
    transform: translate(-9px, 9px) rotate(-45deg);
  }
</style>
