<script>
  export let artwork;
</script>

<div class="w-full lg:w-1/3 md:px-4 lg:px-6 mb-6">
  <a href={`/artwork/${artwork.id}`}>
    <div class="bg-white hover:shadow-xl">
      <div class="">
        <img
          src={`/api/storage/o/public/${artwork.filename}`}
          alt=""
          class="w-full border-white border-8" />
      </div>
      <div class="px-4 py-4 md:px-10">
        <h1 class="font-bold text-lg">{artwork.title}</h1>
        <div class="flex pt-8">
          <div class="1/2 flex-1">
            <div>10.3 BTC</div>
            <div class="w-1/2 text-sm font-medium">List Price</div>
          </div>
          <div class="1/2 flex-1">
            <div>10.3 BTC</div>
            <div class="text-sm font-medium">Current bid by @asoltys</div>
          </div>
        </div>
      </div>
    </div>
  </a>
</div>
