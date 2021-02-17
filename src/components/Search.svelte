<script>
  import { goto } from "$lib/utils";
  import { hasura } from "$lib/api";
  import { token } from "$lib/store";
  import Select from "svelte-select";
  import Item from "$components/SearchItem";
  import ArtworkMedia from "$components/ArtworkMedia";

  const query = `query($filterText: String!) {
    searchable(args: { t: $filterText }) {
      id
      s
      type
    }
  }`;

  async function search(filterText) {
    filterText = filterText ? filterText.replace(" ", "_") : "";
    if (!filterText) return {};
    console.log("token", $token);
    return new Promise((resolve) =>
      hasura
        .headers($token ? { authorization: `Bearer ${$token}` } : undefined)
        .post({ query, variables: { filterText } })
        .json(({ data: { searchable: r } }) =>
          resolve(
            groupBy(
              r.sort((a, b) => a.s.localeCompare(b.s)),
              "type"
            )
          )
        )
    );
  }

  const go = ({ id, type, s }) => goto(`/${type}/${id ? id : s}`);

  let timer;

  var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  let text;
  let types = ["user", "artwork", "tag"];

  const debounce = (v) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      text = v;
    }, 750);
  };
</script>

<div class="relative w-full">
  <input
    type="search"
    class="lg:w-1/3 border-0 border-b-2 border-lightblue"
    placeholder="What are you looking for?"
    on:input={({ target: { value } }) => debounce(value)} />
  <i class="fas fa-search text-2xl" />

  {#await search(text) then r}
    {#if r.tag || r.artwork || r.user}
      <div class="absolute w-1/3 bg-white shadow">
        <div class="flex p-4">
          {#each r.tag || [] as o}
            <div
              class="secondary-color text-sm font-bold uppercase mr-5 cursor-pointer"
              on:click={() => go(o)}>
              #{o.s}
            </div>
          {/each}
        </div>

        {#each r.artwork || [] as o}
          <div
            on:click={() => go(o)}
            class="p-4 cursor-pointer hover:bg-green-100">
            {o.s}
          </div>
        {/each}
        {#each r.user || [] as o}
          <div
            on:click={() => go(o)}
            class="p-4 cursor-pointer hover:bg-green-100">
            {o.s}
          </div>
        {/each}
      </div>
    {/if}
  {/await}
</div>
