import decode from "jwt-decode";
import {
  initClient,
  dedupExchange,
  fetchExchange,
  subscriptionExchange,
} from "@urql/svelte";
import { SubscriptionClient } from "subscriptions-transport-ws";

const {
  SNOWPACK_PUBLIC_HTTP: url,
  SNOWPACK_PUBLIC_WS: wsUrl,
} = import.meta.env;

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
