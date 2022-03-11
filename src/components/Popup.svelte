<script>
  import { faTimes } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";

  export let dismissible = false;
  export let text = "";

  let visible = true;
  const togglePopup = () => (visible = !visible);
</script>

<div
  class={`container mx-auto flex justify-between py-2 band ${
    !visible ? "hidden" : ""
  }`}
>
  <p class="bodyText text-center w-full">
    {@html text}
  </p>
  {#if dismissible}
    <span on:click|preventDefault={togglePopup} class="close">
      <Fa icon={faTimes} />
    </span>
  {/if}
</div>

<style>
  .band {
    color: white;
    background-color: #3ba5ac;
    box-shadow: 0 1px 5px rgb(0 0 0 / 18%);
    border-radius: 10px;
    margin-top: 10px;
  }
  .band.hidden {
    display: none;
  }
  .close {
    cursor: pointer;
    padding-top: 7px;
    padding-left: 10px;
  }

  .bodyText > :global(a) {
    text-decoration: underline;
  }
</style>
