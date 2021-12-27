<script>
  import { dev } from "$lib/utils";
  export let metadata;
</script>

<svelte:head>
  <title>{metadata.title}</title>
  <meta property="og:title" content={metadata.title} />
  <meta name="twitter:title" content={metadata.title} />

  <meta property="og:type" content="website" />
  <meta property="og:description" content={metadata.description} />
  <meta name="description" content={metadata.description} />

  <meta name="keywords" content={metadata.keywords} />

  {#if metadata.image}
    <meta property="og:image" content={metadata.image} />
    <meta name="twitter:image" content={metadata.image} />
  {/if}

  {#if metadata.video}
    <meta property="og:video" content={metadata.video} />
    <meta name="twitter:video" content={metadata.video} />
  {/if}

  <meta property="og:url" content={metadata.url} />
  <meta name="twitter:card" content={metadata.twitter.card} />
  <meta name="twitter:site" content={metadata.twitter.site} />
  <meta name="twitter:creator" content={metadata.twitter.creator} />

  {#if !dev}
  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=G-DJNPT2CQXL"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());

    gtag("config", "G-DJNPT2CQXL");
  </script>

  <script>
    (function (h, o, t, j, a, r) {
      h.hj =
        h.hj ||
        function () {
          (h.hj.q = h.hj.q || []).push(arguments);
        };
      h._hjSettings = { hjid: 2706575, hjsv: 6 };
      a = o.getElementsByTagName("head")[0];
      r = o.createElement("script");
      r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");
  </script>
{/if}
</svelte:head>
