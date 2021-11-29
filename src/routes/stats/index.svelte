<script>
    import {getUserStats, getArtworksStats, getArtistsStats} from "$queries/stats";
    import StatCard from './card.svelte';
</script>

<style>
</style>

<div class="container mx-auto mt-20">
    <h2 class="mb-10">User Stats</h2>

    <div class="flex flex-wrap -mx-4">
        <StatCard query={getUserStats} title="Number of users"/>
        <StatCard query={getArtworksStats} title="Number of artworks"/>
        <StatCard query={getArtistsStats} title="Number of artists"/>
    </div>
</div>
