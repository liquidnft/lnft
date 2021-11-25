<script>
  export let url, title, img;
</script>

<a href="{url}" on:click|preventDefault={change}>
  <div class="p-4 rounded h-48 m-8 w-52">
    <img src="{img}" class="w-24 mx-auto" />
    {title}
  </div>
</a>
