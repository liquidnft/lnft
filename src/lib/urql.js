import {
  initClient,
  dedupExchange,
  fetchExchange,
  subscriptionExchange,
} from "@urql/svelte";
import { authExchange } from "@urql/exchange-auth";
import { offlineExchange } from "@urql/exchange-graphcache";
import { makeDefaultStorage } from "@urql/exchange-graphcache/default-storage";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { get } from "svelte/store";
import { role, token } from "$lib/store";
import { expired } from "$lib/auth";
import schema from "$lib/schema";
import { getUser } from "$queries/users";
import { getArtworks } from "$queries/artworks";
import { getRecentActivity, getLatestPieces } from "$queries/transactions";
import { makeOperation } from "@urql/core";

let url, wsUrl;
if (import.meta && import.meta.env && import.meta.env !== "production") {
  url = import.meta.env.SNOWPACK_PUBLIC_HTTP;
  wsUrl = import.meta.env.SNOWPACK_PUBLIC_WS;
} else {
  url = "https://bid2.nftglee.com/v1/graphql";
  wsUrl = "wss://bid2.nftglee.com/v1/graphql";
}

export const setupUrql = async () => {
  return new Promise((resolve) => {
    const storage = makeDefaultStorage({
      idbName: "raretoshi", // The name of the IndexedDB database
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
          update_users_by_pk(result, args, cache, info) {
            cache.updateQuery({ query: getUser }, (data) => {
              try {
                data.currentuser[0] = {
                  ...data.currentuser[0],
                  ...result.update_users_by_pk,
                };
              } catch {}
              return data;
            });
          },
          insert_transactions_one(result, args, cache, info) {
            cache.updateQuery({ query: getRecentActivity(20) }, (data) => {
              try {
                data.recentactivity
                  .unshift(result.insert_transactions_one)
                  .pop();
              } catch {}
              return data;
            });

            cache.updateQuery({ query: getRecentActivity(3) }, (data) => {
              try {
                data.recentactivity.unshift(result.insert_transactions_one);
                data.recentactivity.pop();
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
        optimistic: {
          /* ... */
        },
      },
    });

    if (expired(get(token))) token.set(undefined);

    let subscriptionOptions = {
      forwardSubscription(operation) {
        if (typeof WebSocket === "undefined") return;
        return new SubscriptionClient(wsUrl, {
          reconnect: true,
          reconnectionAttempts: 5,
          minTimeout: 5000,
          inactivityTimeout: 60000,
          lazy: true,
          connectionParams() {
            let t = get(token);
            return {
              headers: t
                ? {
                    authorization: `Bearer ${t}`,
                  }
                : undefined,
            };
          },
        }).request(operation);
      },
    };

    const getAuth = async ({ authState, mutate }) => {
      if (!authState) {
        const token = window.sessionStorage.getItem("token");
        resolve();
        return token ? { token } : null;
      }

      return null;
    };

    const addAuthToOperation = ({ authState, operation }) => {
      const token = window.sessionStorage.getItem("token");
      if (operation.query)
        if (!authState || !authState.token) {
          return operation;
        }

      const fetchOptions =
        typeof operation.context.fetchOptions === "function"
          ? operation.context.fetchOptions()
          : operation.context.fetchOptions || {};

      return makeOperation(operation.kind, operation, {
        ...operation.context,
        fetchOptions: {
          ...fetchOptions,
          headers: {
            ...fetchOptions.headers,
            Authorization: `Bearer ${token}`,
          },
        },
      });
    };

    initClient({
      url,
      exchanges: [
        dedupExchange,
        cache,
        authExchange({
          getAuth,
          addAuthToOperation,
        }),
        fetchExchange,
        subscriptionExchange(subscriptionOptions),
      ],
      requestPolicy: "cache-and-network",
    });
  });
};
