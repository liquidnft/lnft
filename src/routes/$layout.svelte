<style>
  button {
    @apply p-4 mx-2;
  }
</style>

<div class="flex p-4">
  <h1 class="flex-auto my-auto text-teal-600 text-lg">
    <a href="/">Liquid Art</a>
  </h1>
  <div class="flex-grow-1">
    <button><a href="/market">Market</a></button>
    <button><a href="/activity">Activity</a></button>
    <button><a href="/issue">Issue</a></button>
    <button><a href="/login">Sign In</a></button>
  </div>
</div>

<main class="p-4">
  <slot />
</main>
