import {
  initClient,
  dedupExchange,
  fetchExchange,
  subscriptionExchange,
} from "@urql/svelte";
import { offlineExchange } from "@urql/exchange-graphcache";
import { makeDefaultStorage } from "@urql/exchange-graphcache/default-storage";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { get } from "svelte/store";
import { role } from "$lib/store";
import { expired } from "$lib/auth";
import schema from "$lib/schema";
import { getArtworks } from "$queries/artworks";
import { getRecentActivity, getLatestPieces } from "$queries/transactions";

let url, wsUrl;
if (import.meta && import.meta.env && import.meta.env !== "production") {
  url = import.meta.env.SNOWPACK_PUBLIC_HTTP;
  wsUrl = import.meta.env.SNOWPACK_PUBLIC_WS;
} else {
  url = "https://raretoshi.com/v1/graphql";
  wsUrl = "wss://raretoshi.com/v1/graphql";
}

export const setupUrql = (token) => {
  const storage = makeDefaultStorage({
    idbName: "graphcache-v3", // The name of the IndexedDB database
    maxAge: 7, // The maximum age of the persisted data in days
  });

  const cache = offlineExchange({
    keys: {
      transactions: (data) => data.id,
      favorites_aggregate_fields: (data) => null,
      favorites_aggregate: (data) => null,
      tags: (data) => data.tag,
    },
    schema,
    storage,
    updates: {
      Mutation: {
        insert_transactions_one(result, args, cache, info) {
          cache.updateQuery({ query: getRecentActivity(20) }, (data) => {
            try {
              data.recentactivity.unshift(result.insert_transactions_one).pop();
            } catch {}
            return data;
          });

          cache.updateQuery({ query: getRecentActivity(3) }, (data) => {
            try {
              data.recentactivity.unshift(result.insert_transactions_one).pop();
            } catch {}
            return data;
          });

          cache.updateQuery({ query: getLatestPieces(3) }, (data) => {
            try {
            data.transactions[0] = result.insert_transactions_one;
            } catch {}
            return data;
          });
        },
        insert_artworks_one(result, args, cache, info) {
          cache.updateQuery({ query: getArtworks }, (data) => {
            try {
            data.artworks.push(result.insert_artworks_one);
            } catch {}
            return data;
          });
        },
      },
    },
    optimistic: {
      /* ... */
    },
  });

  if (expired(token)) token = undefined;

  initClient({
    url,
    exchanges: [
      dedupExchange,
      cache,
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
              headers: token
                ? {
                    authorization: `Bearer ${token}`,
                  }
                : undefined,
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
