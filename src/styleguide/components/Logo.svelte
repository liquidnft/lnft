<script>
    export let graphic;
    export let white;
</script>

{#if graphic}
    <img src="/branding/logo-graphic.png" alt="logo" class="{$$props.class}"/>
{:else if white}
    <img src="/branding/logo-white.svg" alt="logo" class="{$$props.class}"/>
{:else}
    <img src="/branding/logo.png" alt="logo" class="{$$props.class}"/>
{/if}
