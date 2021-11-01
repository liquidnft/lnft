<script>
  export let showDetails = true;

</script>

<style>
  .card {
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    overflow: hidden;
  }

  .animated-bg {
    background-image: linear-gradient(
      to right,
      #f6f7f8 0%,
      #edeef1 10%,
      #f6f7f8 20%,
      #f6f7f8 100%
    );
    background-size: 200% 100%;
    animation: bgPos 1s linear infinite;
  }

  @keyframes bgPos {
    0% {
      background-position: -20% 0;
    }

    100% {
      background-position: -150% 0;
    }
  }

</style>

  <div
    class="{showDetails ? 'card' : ''} bg-white flex flex-col justify-between h-full"
    in:fade>
  {#if showDetails}
    <div class="p-4">
      <h3 class="animated-bg animated-bg-text" id="title">&nbsp;</h3>
      <h3 class="animated-bg animated-bg-text" id="title">&nbsp;</h3>
      <h3 class="animated-bg animated-bg-text" id="title">&nbsp;</h3>
    </div>
  {/if}
</div>
