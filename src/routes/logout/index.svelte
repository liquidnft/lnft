<script context="module">
  import { post } from "$lib/api";
  export async function load({ fetch, session }) {
    await post("/auth/logout", {}, fetch).res();
    if (session) delete session.user;
    return {
      status: 302,
      redirect: "/login",
    };
  }
</script>
