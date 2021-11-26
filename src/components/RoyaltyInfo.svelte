<script>
  import RoyaltyRecipient from "$components/RoyaltyRecipient.svelte";
  import Fa from "svelte-fa";
  import { faGem } from "@fortawesome/free-regular-svg-icons";
  import {
    faChevronUp,
    faChevronDown,
  } from "@fortawesome/free-solid-svg-icons";
  export let artwork;
  let show;

</script>

<div class="mb-6">
  <div class="text-xs cursor-pointer mb-2" on:click={() => (show = !show)}>
    <div class="flex">
      <i class="text-midblue text-xs mr-1 my-auto">
        <Fa icon={faGem} />
      </i>
      <div class="my-auto">Royalties</div>
      <div class="my-auto ml-1">
        <Fa icon={show ? faChevronUp : faChevronDown} />
      </div>
    </div>
  </div>
  {#if show}
    <ul>
      {#if artwork.royalty_recipients.length}
        {#each artwork.royalty_recipients as recipient}
          <RoyaltyRecipient
            editable={false}
            askingAsset={artwork.asking_asset}
            {recipient}
          />
        {/each}
      {/if}
    </ul>
  {/if}
</div>
