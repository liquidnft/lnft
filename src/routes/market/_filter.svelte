<script>
  import { onMount } from "svelte";
  import { ToggleSwitch } from "$comp";
  import { filterCriteria as fc } from "$lib/store";

  export let showFilters;
</script>

<div class:showFilters class="hidden w-full space-y-4">
  <div>
    <ToggleSwitch
      id="list-price"
      label="Has list price"
      checked={$fc.listPrice}
      on:change={(e) => ($fc.listPrice = e.target.checked)}
    />
  </div>
  <div>
    <ToggleSwitch
      id="open-bid"
      label="Has open bid"
      checked={$fc.openBid}
      on:change={(e) => ($fc.openBid = e.target.checked)}
    />
  </div>
  <div>
    <ToggleSwitch
      id="owned-by-creator"
      label="Owned by creator"
      checked={$fc.ownedByCreator}
      on:change={(e) => ($fc.ownedByCreator = e.target.checked)}
    />
  </div>
  <div>
    <ToggleSwitch
      id="has-sold"
      label="Has sold"
      checked={$fc.hasSold}
      on:change={(e) => ($fc.hasSold = e.target.checked)}
    />
  </div>
  <div>
    <ToggleSwitch
      id="is-physical"
      label="Physical artwork"
      checked={$fc.isPhysical}
      on:change={(e) => ($fc.isPhysical = e.target.checked)}
    />
  </div>
  <div>
    <ToggleSwitch
      id="has-royalties"
      label="Has royalties"
      checked={$fc.hasRoyalties}
      on:change={(e) => ($fc.hasRoyalties = e.target.checked)}
    />
  </div>
</div>

<style>
  .showFilters {
    display: block !important;
    width: 100%;
  }
</style>
