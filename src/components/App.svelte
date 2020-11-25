<script>
  import decode from "jwt-decode";
  import { user, token } from "$lib/store";
  import { get } from "$queries/users";
  import { api } from "$lib/api";
  import { fade } from "svelte/transition";
  import { subscription, operationStore } from "@urql/svelte";
  import { SubscriptionClient } from "subscriptions-transport-ws";
  import {
    initClient,
    defaultExchanges,
    subscriptionExchange,
  } from "@urql/svelte";

  export let segment = "";

  let url, wsUrl;
  if (import.meta.env) {
    url = import.meta.env.SNOWPACK_PUBLIC_HTTP;
    wsUrl = import.meta.env.SNOWPACK_PUBLIC_WS;
  } else {
    url = "https://la.coinos.io/hasura/v1/graphql";
    wsUrl = "wss://la.coinos.io/hasura/v1/graphql";
  }

  initClient({
    url,
    exchanges: [
      ...defaultExchanges,
      subscriptionExchange({
        forwardSubscription(operation) {
          return new SubscriptionClient(wsUrl, {
            reconnect: true,
            connectionParams: {
              headers: { authorization: `Bearer ${$token}` },
            },
          }).request(operation);
        },
      }),
    ],
    fetchOptions: () => {
      return {
        headers: { authorization: `Bearer ${$token}` },
      };
    },
  });

  let id, user$;
  $: {
    tokenUpdated($token);
    if ($token) {
      id = decode($token)["https://hasura.io/jwt/claims"]["x-hasura-user-id"];
      user$ = operationStore(get(id));
      subscription(user$, (a, b) => {
        $user = b.users_by_pk;
      });
    }
  }

  let timeout;
  let tokenUpdated = async (t) => {
    if (t) timeout = setTimeout(() => refreshToken(t), 600000);
    else clearTimeout(timeout);
  };

  let refreshToken = (t) => {
    api
      .url("/auth/token/refresh")
      .auth(`Bearer ${t}`)
      .get()
      .json((r) => {
        $token = r.jwt_token;
        window.sessionStorage.setItem("token", $token);
      });
  };
</script>

{#key segment}
  <div in:fade>
    <slot />
  </div>
{/key}
