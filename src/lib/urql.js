import decode from "jwt-decode";
import {
  initClient,
  dedupExchange,
  fetchExchange,
  subscriptionExchange,
} from "@urql/svelte";
import { SubscriptionClient } from "subscriptions-transport-ws";

let url, wsUrl;
if (import.meta && import.meta.env) {
  url = import.meta.env.SNOWPACK_PUBLIC_HTTP;
  wsUrl = import.meta.env.SNOWPACK_PUBLIC_WS;
} else {
  url = "https://la.coinos.io/v1/graphql";
  wsUrl = "wss://la.coinos.io/v1/graphql";
} 

export const setupUrql = (token) => {
  if (token && decode(token).exp * 1000 < Date.now()) token = undefined;
  initClient({
    url,
    exchanges: [
      dedupExchange,
      fetchExchange,
      subscriptionExchange({
        forwardSubscription(operation) {
          if (typeof WebSocket === "undefined") return;
          return new SubscriptionClient(wsUrl, {
            reconnect: true,
            connectionParams: {
              headers: token ? { authorization: `Bearer ${token}` } : undefined,
            },
          }).request(operation);
        },
      }),
    ],
    fetchOptions: () => {
      return {
        headers: token ? { authorization: `Bearer ${token}` } : undefined,
      };
    },
  });
};
