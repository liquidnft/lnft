<script>
    export let username;
    export let time;
    export let price;
</script>

<div class="w-full md:w-1/2 lg:w-1/3 px-6 mb-10">
    <div class="flex">
        <img src="/placeholder.jpg" alt="logo" class="h-16 w-16 rounded-full mr-5">
        <div>
            <p class="mt-2"><span class="secondary-color">{username} </span>placed a bid for <span>{price}</span></p>
            <p class="text-sm">{time} ago [view tx]</p>
        </div>
    </div>
    <img src="/placeholder.jpg" alt="logo" class="mb-5 w-full mt-7 rounded-lg box-shadow">
</div>