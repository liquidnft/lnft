<script>
  import { secret } from "./store";
  let input = '';
  let submit = () => ($secret = input);
</script>

  <form on:submit={submit} class="mt-4">
    <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Secret" bind:value={input} />

    <button class="border shadow px-4 bg-blue-400" type="submit">Submit</button>
  </form>
