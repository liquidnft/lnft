<script>
    import {onMount} from "svelte";
    import {pub} from "$lib/api";
    import {token} from "$lib/store";
    import Fa from "svelte-fa";
    import {faSpinner} from "@fortawesome/free-solid-svg-icons";

    export let title;
    export let query;

    let isLoading = true;
    let count = 0;

    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    startDate = startDate.toISOString().split('T')[0];

    let endDate = new Date();
    endDate.setDate(endDate.getDate());
    endDate = endDate.toISOString().split('T')[0];

    const loadStats = async () => {
        count = 0;
        isLoading = true;

        let result = await pub($token)
            .post({
                query: query(startDate, endDate),
            })
            .json();
        result.data.userstats.forEach(el => count += el.users || el.artworks);
        isLoading = false;
    }

    onMount(async () => {
        loadStats();
    });
</script>

<style>
    .card {
        @apply w-96 h-48 bg-white m-4 p-4 rounded-2xl flex flex-col flex-wrap;
        box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;
    }

    .counter {
        @apply mt-auto font-bold text-3xl text-blue-900;
    }
</style>

<div class="card">
    <div class="font-bold mb-2">{title}</div>
    <div class="text-xs flex items-center">
        <input bind:value={startDate} on:change={loadStats} class="p-2" type="date"/>
        <span class="mx-4">-</span>
        <input bind:value={endDate} on:change={loadStats} class="p-2" type="date"/>
    </div>

    {#if !isLoading}
        <div class="counter">
            {count}
        </div>
    {:else}
        <div class="flex mt-auto">
            <Fa icon={faSpinner} class="animate-spin"/>
        </div>
    {/if}
</div>
