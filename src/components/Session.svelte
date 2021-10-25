<script>
  import { user, token } from "$lib/store";
  import { getUser } from "$queries/users";
  import { query } from "$lib/api";
  import { err, goto } from "$lib/utils";

  $: init($token);
  let init = (t) =>
    t &&
    query(getUser)
      .then((res) => {
        $user = res.currentuser[0];
      })
      .catch(err);

</script>
