<script>
  import { Avatar, ProgressLinear } from "$comp";
  import { formatDistanceStrict } from "date-fns";
  import Fa from "svelte-fa";
  import {
    faChevronDown,
    faChevronRight,
  } from "@fortawesome/free-solid-svg-icons";
  import { requirePassword } from "$lib/auth";
  import { psbt, user, token, commentsLimit } from "$lib/store";
  import { api, query } from "$lib/api";
  import { createComment, deleteComment } from "$queries/artworks";
  import { btc, err, confirm, info } from "$lib/utils";
  import { broadcast, sign, pay, ACCEPTED } from "$lib/wallet";
  import { session } from "$app/stores";

  export let artwork;
  export let refreshArtwork;

  let loading;

  let comment;
  let commentsToggle = "hidden";
  let amount = 1000;

  let submit = async () => {
    await requirePassword();
    loading = true;
    try {
      if (artwork.owner.id !== $user.id) {
        await pay(undefined, artwork.owner.address, amount);
        await sign();
        await broadcast();
      }
      let res = await api
        .auth(`Bearer ${$token}`)
        .url("/comment")
        .post({
          psbt: $psbt && $psbt.toBase64(),
          artwork_id: artwork.id,
          owner_id: artwork.owner_id,
          comment,
          amount,
        })
        .json();
    } catch (e) {
      err(e);
    }
    await refreshArtwork();
    comment = "";
    loading = false;
  };

  let handleDelete = async (commentId) => {
    try {
      if ((await confirm()) === ACCEPTED) {
        await query(deleteComment, { id: commentId });
        info("Comment deleted");
        await refreshArtwork();
      }
    } catch (e) {
      err(e);
    }
  };
</script>

<div class="border rounded-lg mt-12 p-4">
  <div
    class="text-2xl font-bold flex justify-between items-center cursor-pointer"
    on:click={() => {
      if (commentsToggle === "hidden") {
        commentsToggle = "block";
      } else {
        commentsToggle = "hidden";
      }
    }}
  >
    Comments <Fa
      icon={commentsToggle === "block" ? faChevronDown : faChevronRight}
    />
  </div>
  <div class="mt-4 {commentsToggle}">
    {#if !artwork.comments.length}
      <p>Be the first to leave a comment!</p>
    {/if}
    {#each artwork.comments as comment}
      <div class="flex mb-4">
        <Avatar user={comment.user} size="large" />
        <div class="ml-10">
          <div class="font-bold">
            <a href="https://www.raretoshi.com/{comment.user.username}"
              >@{comment.user.username}</a
            >
          </div>
          <div>{comment.comment}</div>
          <div class="text-sm text-gray-400">
            {formatDistanceStrict(new Date(comment.created_at), new Date())}
            ago
          </div>
          {#if $session.user.id === comment.user.id || $session.user.id === artwork.owner_id || $session.user.is_admin}
            <button
              class="text-red-500 text-xs hover:text-red-700"
              on:click={() => handleDelete(comment.id)}>Delete</button
            >
          {/if}
        </div>
      </div>
    {/each}
    {#if loading}
      <ProgressLinear />
    {:else}
      {#if $commentsLimit !== undefined && artwork.comments.length}
        <button
          class="primary-btn w-full"
          on:click={() => {
            $commentsLimit = undefined;

            refreshArtwork();
          }}>Show all</button
        >
      {/if}
      <form on:submit|preventDefault={submit}>
        <textarea
          name="name"
          rows="8"
          class="w-full mt-8 border rounded"
          bind:value={comment}
        />
        {#if ($session.user && $session.user.id !== artwork.owner_id) || !$session.user}
          <div class="relative pt-1">
            <label for="customRange1" class="form-label"
              >Owner Donation (min. 1000 sats)<br />
              Amount: <b>{amount} sats</b>
            </label>
            <input
              type="range"
              class="form-range w-full"
              id="customRange1"
              min="1000"
              step="100"
              max="100000"
              on:input={(e) => (amount = e.target.value)}
            />
          </div>
        {/if}
        <button type="submit" class="primary-btn ml-auto">Add comment</button>
      </form>
    {/if}
  </div>
</div>
