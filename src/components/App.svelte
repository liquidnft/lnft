<script>
  import { onMount } from "svelte";
  import decode from "jwt-decode";
  import { user, token } from "$lib/store";
  import { getUser } from "$queries/users";
  import { api } from "$lib/api";
  import { fade } from "svelte/transition";
  import {
    initClient,
    defaultExchanges,
    subscriptionExchange,
    mutation,
    subscription,
    operationStore,
  } from "@urql/svelte";
  import { SubscriptionClient } from "subscriptions-transport-ws";
  import { update } from "$queries/users";

  let url = "http://localhost:8080/v1/graphql";
  let wsUrl = "ws://localhost:8080/v1/graphql";

  initClient({
    url,
    exchanges: [
      ...defaultExchanges,
      subscriptionExchange({
        forwardSubscription(operation) {
          if (typeof WebSocket === "undefined") return;
          return new SubscriptionClient(wsUrl, {
            reconnect: true,
            connectionParams: {
              headers: $token ? { authorization: `Bearer ${$token}` } : undefined,
            },
          }).request(operation);
        },
      }),
    ],
    fetchOptions: () => {
      return {
        headers: $token ? { authorization: `Bearer ${$token}` } : undefined,
      };
    },
  });

  let id, getUser$;
  $: {
    tokenUpdated($token);
    if ($token) {
      id = decode($token)["https://hasura.io/jwt/claims"]["x-hasura-user-id"];
      getUser$ = operationStore(getUser(id));
      subscription(getUser$, (a, b) => {
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

<div in:fade>
  <slot />
</div>
