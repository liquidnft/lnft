<script>
  export let filtered;

  let sortCriteria;
  $: update(sortCriteria);
  let update = () => (filtered = filtered.sort(sort));

  let sort = (a, b) =>
    ({
      active:
        new Date(b.last_active) - new Date(a.last_active) ||
        new Date(b.created_at) - new Date(a.created_at),
      lowest: a.list_price - b.list_price,
      highest: b.list_price - a.list_price,
      newest: new Date(b.created_at) - new Date(a.created_at),
      oldest: new Date(a.created_at) - new Date(b.created_at),
    }[sortCriteria]);
</script>

<style>
  @media only screen and (max-width: 500px) {
    .sort-container {
      margin: 0;
      margin-bottom: 20px;
    }
    select {
      padding: 0;
      background: none;
    }
  }
</style>

<div class="sort-container">
  <select class="rounded-full bg-gray-100 px-8" bind:value={sortCriteria}>
    <option value="active">Recently active</option>
    <option value="lowest">Lowest price</option>
    <option value="highest">Highest price</option>
    <option value="newest">Newest</option>
    <option value="oldest">Oldest</option>
  </select>
</div>
