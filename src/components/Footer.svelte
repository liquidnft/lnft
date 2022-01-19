<script>
  import branding from "$lib/branding";
  import Fa from "svelte-fa";
  import {
    faFacebook,
    faInstagramSquare,
    faTelegramPlane,
    faDiscord,
    faTwitter,
  } from "@fortawesome/free-brands-svg-icons";
  import { faRss } from "@fortawesome/free-solid-svg-icons";
</script>

<div class="bg-black px-2 mt-24">
  <div class="container footer mx-auto flex flex-wrap text-white pt-12">
    <div
      class="flex flex-col text-sm w-full lg:w-2/4 mb-10 order-last lg:order-first"
    >
      <a href="/"><img src="/logo-white.svg" alt="logo" class="w-48" /></a>
      <p class="mt-4">&copy;2021 {branding.projectName}</p>
      <div class="flex items-center mt-12">
        <p class="pr-3">Powered by:</p>
        <img src="/liquid_logo.svg" alt="liquid network logo" />
      </div>
    </div>
    <div class="w-full lg:w-1/4 mb-10">
      <h4 class="font-bold mb-4">Join Us</h4>
      <ul class="list-none">
        <li class="mb-2">
          <a
            target="_blank"
            href={branding.urls.external.blog}
            class="flex items-center"
            ><div class="w-6"><Fa icon={faRss} /></div>
            <span class="ml-1">Blog</span></a
          >
        </li>
        <li class="mb-2">
          <a
            target="_blank"
            href={branding.urls.external.twitter}
            class="flex items-center"
            ><div class="w-6"><Fa icon={faTwitter} /></div>
            <span class="ml-1">Twitter</span></a
          >
        </li>
        <li class="mb-2">
          <a
            target="_blank"
            href={branding.urls.external.discord}
            class="flex items-center"
            ><div class="w-6"><Fa icon={faDiscord} /></div>
            <span class="ml-1">Discord</span></a
          >
        </li>
        <li class="mb-2">
          <a
            target="_blank"
            href={branding.urls.external.telegram}
            class="flex items-center"
            ><div class="w-6"><Fa icon={faTelegramPlane} /></div>
            <span class="ml-1">Telegram</span></a
          >
        </li>
        <li class="mb-2">
          <a
            target="_blank"
            href={branding.urls.external.instagram}
            class="flex items-center"
            ><div class="w-6"><Fa icon={faInstagramSquare} /></div>
            <span class="ml-1">Instagram</span></a
          >
        </li>
        <li class="mb-2">
          <a
            target="_blank"
            href={branding.urls.external.facebook}
            class="flex items-center"
            ><div class="w-6"><Fa icon={faFacebook} /></div>
            <span class="ml-1">Facebook</span></a
          >
        </li>
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
