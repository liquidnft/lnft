<script>
  import branding from '$lib/branding';
</script>

<div class="bg-black px-2 mt-24">
  <div class="container footer mx-auto flex flex-wrap text-white pt-12">
    <div
      class="flex flex-col text-sm w-full lg:w-2/4 mb-10 order-last lg:order-first">
      <a href="/"><img src="/branding/logo-white.svg" alt="logo" class="w-48" /></a>
      <p class="mt-4">&copy;2021 {branding.projectName}</p>
      <div class="flex items-center mt-12">
        <p class="pr-3">Powered by:</p>
        <img src="/liquid_logo.svg" alt="liquid network logo" />
      </div>
    </div>
    <div class="w-full lg:w-1/4 mb-10">
      <h4 class="font-bold mb-4">Follow US</h4>
      <ul class="list-none">
        <li class="mb-2"><a target="_blank" href="{branding.urls.external.twitter}">Twitter</a></li>
        <li class="mb-2"><a target="_blank" href="{branding.urls.external.telegram}">Telegram</a></li>
        <li class="mb-2"><a target="_blank" href="{branding.urls.external.blog}">Blog</a></li>
      </ul>
    </div>
    <div class="w-full lg:w-1/4 mb-10">
      <h4 class="font-bold mb-4">Help</h4>
      <ul class="list-none">
        <li class="mb-2">
          <a href="https://blockstream.com/liquid/">The Liquid Network</a>
        </li>
        <li class="mb-2"><a href="mailto:support@raretoshi">Support</a></li>
        <li class="mb-2"><a href="/privacy-policy">Privacy Policy</a></li>
        <li class="mb-2">
          <a href="/terms-and-conditions">Terms of Service</a>
        </li>
        <li class="mb-2"><a href="/faq">FAQs</a></li>
      </ul>
    </div>
  </div>
</div>
