<script>
  import {
    initClient,
    defaultExchanges,
    subscriptionExchange,
  } from "@urql/svelte";

  let url = "http://localhost:8080/v1/graphql";
  let wsUrl = "ws://localhost:8080/v1/graphql";

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
    })
  ;
</script>
