<script>
  import branding from '$lib/branding';
  import Logo from '$styleguide/components/Logo.svelte';
</script>

<style lang="scss">
  .colored-border {
    &:before {
      content: "";
      display: block;
      position: absolute;
      left: 0;
      top: -20px;
      right: 0;
      height: 20px;
      z-index: 10;
      background: #fa7900; /* Old browsers */
      background: linear-gradient(90deg,  #fa7900 0%, #df36b4 43%, #0063ea 77%, #00eaaf 100%);
    }
}
</style>

<div class="bg-black px-2 colored-border relative">
  <div class="container footer mx-auto flex flex-wrap text-white pt-12">
    <div
      class="flex flex-col text-sm w-full lg:w-2/4 mb-10 order-last lg:order-first p-2">
      <div class="flex items-center">
        <div>
          <a href="/"><Logo class="w-24"/></a>
          <p class="mt-2 text-sm">&copy;2021 {branding.projectName}</p>
        </div>
        <div class="border-l border-gray-800 pl-4 ml-4 h-full items-center flex">
          <div>
            The only marketplace for <br/><p class="font-bold">NFT experiences</p>
          </div>
        </div>
      </div>
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
