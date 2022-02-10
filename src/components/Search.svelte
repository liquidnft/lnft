<script>
  import Fa from "svelte-fa";
  import { faSearch } from "@fortawesome/free-solid-svg-icons";
  import { err, go, goto } from "$lib/utils";
  import { query } from "$lib/api";
  import { results } from "$lib/store";
  import Select from "svelte-select";
  import { ArtworkMedia } from "$comp";

  export let suggest = true;

  const searchQuery = `query($filterText: String!) {
    searchable(args: { t: $filterText }) {
      id
      s
      type
    }
  }`;

  async function search(filterText) {
    filterText = filterText ? filterText.replace(" ", "_") : "";
    if (!filterText) return {};

    return new Promise((resolve) =>
      query(searchQuery, { filterText }).then(({ searchable: r }) =>
        resolve(
          groupBy(
            r.sort((a, b) => a.s.localeCompare(b.s)),
            "type"
          )
        )
      )
    );
  }

  let timer;

  var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  let debounced, text;
  let types = ["user", "artwork", "tag"];

  const debounce = (v) => {
    text = v;
    clearTimeout(timer);
    timer = setTimeout(() => {
      debounced = v;
    }, 750);
  };

  const submit = async () => {
    $results = await search(text);
    let keys = Object.keys($results);
    if (keys.length === 1 && $results[keys[0]].length === 1) {
      go($results[keys[0]][0]);
      $results = [];
    } else if (keys.length > 0) goto("/market");
    else err("Nothing matched that search string");
  };
</script>

<div class="relative w-full search">
  <form on:submit|preventDefault={submit}>
    <div class="flex">
      <input
        class="lg:w-1/3 border-0 border-b-2 rounded-none border-lightblue"
        placeholder="Search..."
        on:input={({ target: { value } }) => debounce(value)}
      />
      <div class="my-auto ml-2">
        <Fa icon={faSearch} />
      </div>
    </div>

    {#if suggest}
      {#await search(debounced) then r}
        {#if r.tag || r.artwork || r.user}
          <div class="absolute w-1/3 bg-white shadow z-10">
            <div class="flex p-4">
              {#each r.tag || [] as o}
                <div
                  class="secondary-color text-sm font-bold uppercase mr-5 cursor-pointer"
                  on:click={() => go(o)}
                >
                  #{o.s}
                </div>
              {/each}
            </div>

            {#each r.artwork || [] as o}
              <div
                on:click={() => go(o)}
                class="p-4 cursor-pointer hover:bg-green-100"
              >
                {o.s}
              </div>
            {/each}
            {#each r.user || [] as o}
              <div
                on:click={() => go(o)}
                class="p-4 cursor-pointer hover:bg-green-100"
              >
                {o.s}
              </div>
            {/each}
          </div>
        {/if}
      {/await}
    {/if}
  </form>
</div>
