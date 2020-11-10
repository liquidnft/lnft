<script context="module">
  export async function preload({ params }) {
    let { id } = params;

    return { id };
  }
</script>

<script>
  import Avatar from "$components/Avatar.svelte";
  import Eye from "$components/Eye.svelte";
  import Heart from "$components/Heart.svelte";
  import Card from "$components/Card.svelte";
  export let id;
  let description = "Some say the Hexagon is the Bestagon";
</script>

<div class="flex flex-wrap md:flex-no-wrap">
  <div class="text-center md:text-left flex-1">
    <h1 class="text-3xl font-black text-gray-900">{id}</h1>
    <div class="font-black mb-6">Edition 1 of 1</div>
    <div class="text-sm text-gray-600">{description}</div>
    <div class="mb-6">
      <a
        href="/tag/geometry"
        class="underline text-teal-600 text-xs">#geometry</a>
    </div>

    <button
      class="mb-2 hover:bg-teal-200 border border-black w-full uppercase text-sm font-bold py-2 px-4 rounded">Buy Now</button>
    <button class="hover:bg-teal-200 border border-black w-full uppercase text-sm font-bold py-2 px-4 rounded">Place
      a Bid</button>
  </div>
  <Card />
  <div class="flex-1">
    <div class="flex mb-6">
      <Avatar />
      <div class="ml-2 my-auto">
        <div>@asoltys</div>
        <div class="text-xs text-gray-600">Artist</div>
      </div>
    </div>
    <div class="flex mb-6">
      <Avatar />
      <div class="ml-2 my-auto">
        <div>@asoltys</div>
        <div class="text-xs text-gray-600">Owner</div>
      </div>
    </div>

    <hr class="mb-4" />
    <div class="flex mb-4">
      <div class="w-1/3 flex">
        <Heart />
      </div>
      <div class="w-2/3">
        <div>2</div>
        <div class="text-xs text-gray-600">Favorites</div>
      </div>
    </div>
    <div class="flex">
      <div class="w-1/3 flex">
        <div class="my-auto mt-3">
          <Eye />
        </div>
      </div>
      <div class="w-2/3">
        <div>6</div>
        <div class="text-xs text-gray-600">Views</div>
      </div>
    </div>
  </div>
</div>
