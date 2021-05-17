<script>
  export let showDetails = true;
</script>

<style>
  .card {
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    overflow: hidden;
  }

  .card-header {
    height: 350px;
  }

  .card-content {
    background-color: #fff;
    padding: 30px;
  }

  .card-content h3 {
    margin-bottom: 10px;
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

<div class="card">
  <div class="card-header animated-bg" id="header">&nbsp;</div>
  {#if showDetails}
    <div class="card-content">
      <h3 class="card-title animated-bg animated-bg-text" id="title">&nbsp;</h3>
      <h3 class="card-title animated-bg animated-bg-text" id="title">&nbsp;</h3>
      <h3 class="card-title animated-bg animated-bg-text" id="title">&nbsp;</h3>
    </div>
  {/if}
</div>
