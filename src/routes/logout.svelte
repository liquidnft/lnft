<script context="module">
  import { get } from "$lib/api";
  export async function load({ fetch, session }) {
    try {
      await get("/auth/logout").res();
    } catch (e) {
      console.log(e);
    }

    return {
      status: 302,
      redirect: "/login",
    };
  }
</script>

<script>
</script>
