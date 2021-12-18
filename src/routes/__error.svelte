<script context="module">
  export function load({ error, status }) {
    console.log(error, status);
    return {
      props: {
        title: `${status}: ${error.message}`,
      },
    };
  }
</script>

<div class="container mx-auto sm:justify-between mt-10 md:mt-20">
  <div class="mx-auto">
    <h2 class="mb-10">Something went wrong</h2>
    <a href="/"> <button class="primary-btn"> Return to homepage</button></a>
  </div>
</div>
