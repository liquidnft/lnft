import {
  initClient,
  dedupExchange,
  fetchExchange,
  subscriptionExchange,
} from "@urql/svelte";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { get } from "svelte/store";
import { role } from "$lib/store";
import { expired } from "$lib/auth";

let url, wsUrl;
if (import.meta && import.meta.env && import.meta.env !== "production") {
  url = import.meta.env.SNOWPACK_PUBLIC_HTTP;
  wsUrl = import.meta.env.SNOWPACK_PUBLIC_WS;
} else {
  url = "https://raretoshi.com/v1/graphql";
  wsUrl = "wss://raretoshi.com/v1/graphql";
}

export const setupUrql = (token) => {
  if (expired(token)) token = undefined;
  
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
            reconnectionAttempts: 5,
            minTimeout: 5000,
            inactivityTimeout: 60000,
            lazy: true,
            connectionParams: {
              headers: token ? { authorization: `Bearer ${token}` } : undefined,
            },
          }).request(operation);
        },
      }),
    ],
    fetchOptions: () => {
      return {
        headers: token
          ? {
              authorization: `Bearer ${token}`,
              ["X-Hasura-Role"]: get(role),
            }
          : undefined,
      };
    },
  });
};
