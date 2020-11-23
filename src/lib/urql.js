import {
  initClient,
  defaultExchanges,
  subscriptionExchange,
} from "@urql/svelte";
import { SubscriptionClient } from "subscriptions-transport-ws";

let url, wsUrl;
if (import.meta.env) {
  url = import.meta.env.SNOWPACK_PUBLIC_HTTP;
  wsUrl = import.meta.env.SNOWPACK_PUBLIC_WS;
} else {
  url = "https://la.coinos.io/hasura/v1/graphql";
  wsUrl = "wss://la.coinos.io/hasura/v1/graphql";
}

export default (token) =>
  initClient({
    url,
    exchanges: [
      ...defaultExchanges,
      subscriptionExchange({
        forwardSubscription(operation) {
          return new SubscriptionClient(wsUrl, {
            reconnect: true,
            connectionParams: {
              headers: { authorization: token ? `Bearer ${token}` : "" },
            },
          }).request(operation);
        },
      }),
    ],
    fetchOptions: () => {
      return {
        headers: { authorization: token ? `Bearer ${token}` : "" },
      };
    },
  });
