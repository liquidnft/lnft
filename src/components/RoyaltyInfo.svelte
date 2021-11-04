<script>
  import Fa from "svelte-fa";
  import { faGem } from "@fortawesome/free-regular-svg-icons";
  export let artwork;
</script>

{#if artwork.royalty_recipients.length}
  <span class="tooltip">
    <i class="text-midblue text-xl">
      <Fa icon={faGem} />
    </i>
    <div class="tooltip-text bg-gray-100 shadow ml-4 rounded">
      <h3>List price without royalties:</h3>
      <ul>
        {#if artwork.royalty_recipients.length}
          {#each artwork.royalty_recipients as recipient}
            <li>{recipient.name}: {recipient.amount}%</li>
          {/each}
        {/if}
      </ul>
    </div>
  </span>
{/if}

<style>
  .tooltip {
    cursor: pointer;
    display: inline-block;
    vertical-align: middle;
    padding-left: 5px;
  }
  .tooltip .tooltip-text {
    display: none;
    padding: 15px;
    position: absolute;
    z-index: 100;
    width: 350px;
    font-style: normal;
  }
  .tooltip:hover .tooltip-text {
    display: block;
  }
  h3 {
    font-size: 1rem;
    line-height: 1.3rem;
  }
  ul {
    list-style-type: disc;
    padding-left: 2rem;
  }
</style>
