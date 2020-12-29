import {
  initClient,
  dedupExchange,
  fetchExchange,
  subscriptionExchange,
} from "@urql/svelte";
import { SubscriptionClient } from "subscriptions-transport-ws";

const url = "http://localhost:8080/v1/graphql";
const wsUrl = "ws://localhost:8080/v1/graphql";

export const setupUrql = (token) => {
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
              headers: token
                ? { authorization: `Bearer ${token}` }
                : undefined,
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
