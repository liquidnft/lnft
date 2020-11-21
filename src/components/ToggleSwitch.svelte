<script>
  export let id;
  export let label;
</script>

<style>
  .toggle-checkbox:checked {
    @apply right-0 border-green-400;
    right: 0;
  }
  .toggle-checkbox:checked + .toggle-label {
    @apply bg-green-400;
  }
</style>

<div
  class="relative inline-block w-10 mr-2 align-middle select-none ease-in cursor-pointer">
  <input
    type="checkbox"
    name="toggle"
    id={id}
    class="toggle-checkbox absolute p-0 block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer outline-none" />
  <label
    for={id}
    class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer" />
</div>
<label for={id}>{label}</label>
