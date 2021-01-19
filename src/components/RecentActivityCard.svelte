<script>
    export let name;
    export let time;
    export let title;
</script>

<div class="w-full md:w-1/2 lg:w-1/3 px-6 mb-10">
    <img src="/placeholder.jpg" alt="logo" class="mb-5 w-full mt-3 rounded-lg box-shadow">
    <p class="text-gray-500 mb-3">By {name}&nbsp;  |  &nbsp;{time} ago</p>
    <p>{title}</p>
</div>