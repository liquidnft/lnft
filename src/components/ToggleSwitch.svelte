<script>
  export let id;
  export let label;
  export let checked = false;

</script>

<style lang="scss">
  .toggle-checkbox:checked {
    @apply right-0;
    border: 1px solid #6ed8e0;
    right: 0;
  }
  .toggle-checkbox:checked + .toggle-label {
    @apply bg-blue;
  }

</style>

<div class="relative inline-block w-10 mr-2 align-middle select-none ease-in">
  <input
    type="checkbox"
    name="toggle"
    {id}
    class="toggle-checkbox absolute p-0 block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer outline-none"
    bind:checked
    on:change />
  <label
    for={id}
    class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer" />
</div>
<label for={id} class="cursor-pointer">{label}</label>
