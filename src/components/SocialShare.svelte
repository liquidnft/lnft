<script>
import Fa from "svelte-fa";
import { faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faHeart, faImage } from "@fortawesome/free-regular-svg-icons";

export let artwork; 
</script>

<div class="flex pt-4 w-full social-share">
  <div class="ml-auto" />
  {#if artwork.instagram}
    <div class="mr-8 flex">
      <div>
      <a href={artwork.instagram} target="_blank">
        <span class="uppercase mr-1">Like it</span>
      </a>
    </div>
    <div class="my-auto">
      <Fa icon={faInstagram} />
    </div>
    </div>
  {/if}
  <div class="my-auto"><a href="/"><Fa icon={faHeart} /></a></div>
</div>
