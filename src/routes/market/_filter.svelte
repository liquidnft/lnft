<script>
  import ToggleSwitch from "$components/ToggleSwitch";

  export let showFilters;

  let listPrice, openBid, ownedByCreator, hasSold;

  export let filter = (a) =>
    (!listPrice || a.list_price) &&
    (!openBid || a.bid[0].amount) &&
    (!ownedByCreator || a.artist_id === a.owner_id) &&
    (!hasSold || a.artist_id !== a.owner_id);
</script>

<style>
  .switch-container {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
  }

  .switch-container div {
    margin: 0px 20px 20px 0;
  }
  @media only screen and (max-width: 1023px) {
    .switch-container {
      flex-direction: column;
      display: none;
      margin-top: -10px;
    }
  }
</style>

<div class:showFilters class="switch-container w-full md:w-auto">
  <div>
    <ToggleSwitch
      id="list-price"
      label="Has list price"
      checked={listPrice}
      on:change={(e) => (listPrice = e.target.checked)} />
  </div>
  <div>
    <ToggleSwitch
      id="open-bid"
      label="Has open bid"
      checked={openBid}
      on:change={(e) => (openBid = e.target.checked)} />
  </div>
  <div>
    <ToggleSwitch
      id="owned-by-creator"
      label="Owned by creator"
      checked={ownedByCreator}
      on:change={(e) => (ownedByCreator = e.target.checked)} />
  </div>
  <div>
    <ToggleSwitch
      id="has-sold"
      label="Has sold"
      checked={hasSold}
      on:change={(e) => (hasSold = e.target.checked)} />
  </div>
</div>
