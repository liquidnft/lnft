<script>
    export let title = "No Title";
</script>

<div class={$$props.class || ""}>
    <div class="text-md text-black font-semibold">{ title }</div>
    <slot/>
</div>
