<script>
    export let username;
    export let price;
    export let artworkName;
    export let title;
</script>

<div class="w-full md:w-1/2 lg:w-1/3 px-6 mb-10">
    <div class="box-shadow rounded-lg">
        <img src="/placeholder.jpg" alt="logo" class="mb-5 w-full mt-7 rounded-t-lg">
        <div class="p-4">
            <div class="flex justify-between mb-4">
                <h3 class="text-xl font-bold">{artworkName}</h3>
                <p>{price}</p>
            </div>
            <div class="flex">
                <img src="/placeholder.jpg" alt="logo" class="h-16 w-16 rounded-full mr-5">
                <div>
                    <p class="mt-2">{username}</p>
                    <p class="text-sm text-gray-500">{title}</p>
                </div>
            </div>
        </div>
    </div>
</div>