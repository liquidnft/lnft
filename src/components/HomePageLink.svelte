<script>
  export let url, title, img;

</script>

<style>
  div:hover {
    color: #83e68d;
  }

</style>

<a href={url}>
  <div class="rounded m-8"><img src={img} class="w-24 mx-auto" alt={title} /> {title}</div>
</a>
