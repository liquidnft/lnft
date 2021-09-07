<script>
  import Fa from "svelte-fa";
  import { faSearch } from "@fortawesome/free-solid-svg-icons";
  import { err, go, goto } from "$lib/utils";
  import { hasura } from "$lib/api";
  import { results, token } from "$lib/store";
  import Select from "svelte-select";
  import Item from "$components/SearchItem";
  import ArtworkMedia from "$components/ArtworkMedia";

  export let focused;
  export let suggest = true;

  //@todo move to queries
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

<style lang="scss">
  @import "../theme.scss";

  .search {
    border: $search--border;
    transition: $search--transition;
    input {
      transition: $search--transition;
      &::placeholder {
        transition: $search--transition;
      }
    }
    :global(svg path) {
      transition: $search--transition;
    }
  }

  .focus {
    border: $search--focus--border;
    input {
      color: $search--focus--color;
      &::placeholder {
        color: $search--focus--placeholder--color;
      }
    }
    :global(svg path) {
      fill: $search--focus--icon--color;
    }
  }

  .search.focused,.search:focus-within {
    @extend .focus;
  }

  input {
    font-family: $search--font-family;
    font-size: $search--font-size;
    width: 80%;
    border: none;
    background: none;
    padding: 0.5rem 1.2rem;
    color: $search--color;
    &::placeholder {
      color: $search--placeholder--color;
    }
  }

  :global(.fa-search) {
    font-size: 1.2rem;
  }

  input:focus {
    outline: none;
  }

  :global(svg path) {
    fill: $search--icon--color;
  }
</style>

<div class="relative w-full search rounded-full {$$props.class}" class:focused>
  <form on:submit|preventDefault={submit}>
    <div class="flex justify-start">
      <div class="my-auto ml-4">
        <Fa icon={faSearch} />
      </div>
      <input
        class="lg:w-1/3 border-0 border-b-2 rounded-none border-lightblue flex-1"
        placeholder="Search..."
        on:input={({ target: { value } }) => debounce(value)} />
    </div>

    {#if suggest}
      {#await search(debounced) then r}
        {#if r.tag || r.artwork || r.user}
          <div class="absolute w-1/3 bg-white shadow z-10">
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
    {/if}
  </form>
</div>
