<script>
  export let artwork;
</script>

<div class="w-full lg:w-1/2 md:px-4 lg:px-6">
  <a href="/artwork/hexagon">
    <div class="bg-white hover:shadow-xl">
      <div class="">
        <img
          src="https://images.pexels.com/photos/956999/milky-way-starry-sky-night-sky-star-956999.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
          alt=""
          class="h-56 w-full border-white border-8" />
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
