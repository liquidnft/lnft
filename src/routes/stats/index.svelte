<script>
    import { onMount } from "svelte";
    import { pub } from "$lib/api";
    import { token } from "$lib/store";
    import { getUserStats, getArtworksStats, getArtistsStats } from "$queries/stats";

    let usersCount = 0;

    const loadStats = async () => {
        const date = '2021-10-10'

        let userResult = await pub($token)
            .post({
                query: getUserStats(date),
            })
            .json();

        userResult.forEach(el => usersCount += el.users);

        let artworkResult = await pub($token)
            .post({
                query: getArtworksStats(date),
            })
            .json();

        let artistsResult = await pub($token)
            .post({
                query: getArtistsStats(date),
            })
            .json();
    }

    onMount(async () => {
        loadStats();
    });
</script>

<style>
    /* styles go here */
</style>

<div class="container mx-auto mt-20">
    <h2 class="mb-10">User Stats</h2>

    Number of users: {usersCount}

    Number of artists

    Number of NFTs minted
</div>
