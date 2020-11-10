<script context="module">
  export async function preload({ params }) {
    let { id } = params;

    return { id };
  }
</script>

<script>
  import Avatar from "$components/Avatar";
  export let id;
</script>

<div class="flex">
  <div>
    <h1 class="text-3xl font-black text-gray-900">{id}</h1>
    <div class="font-black mb-6">Edition 1 of 1</div>
    <div class="text-sm text-gray-600">{description}</div>
    <div>
      <a
        href="/tag/geometry"
        class="underline text-teal-600 text-xs">#geometry</a>
    </div>
  </div>
  <Card />
  <div>
    <div class="flex mb-auto">
      <Avatar />
      <div class="my-auto">
        <div>@asoltys</div>
        <div class="text-xs text-gray-600">Artist</div>
      </div>
    </div>
    <div class="flex mb-auto">
      <Avatar />
      <div class="my-auto">
        <div>@asoltys</div>
        <div class="text-xs text-gray-600">Owner</div>
      </div>
    </div>
  </div>
</div>
