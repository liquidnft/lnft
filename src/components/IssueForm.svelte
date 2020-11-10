<script>
  let title;
  let description;

  let issue = (e) => {
    console.log(e);
  };

  </script>
    <form
      class="w-full md:w-1/2 mb-6"
      on:submit|preventDefault={issue}
      autocomplete="off">
      <div class="flex flex-col mb-4">
        <input placeholder="Title" bind:value={title} />
      </div>
      <div class="flex flex-col mb-4">
        <textarea placeholder="Description" bind:value={description} />
      </div>
      <div class="flex flex-col mb-4">
        <Multiselect />
      </div>
      <div class="flex">
        <button
          on:click|preventDefault={issue}
          class="block bg-teal-400 hover:bg-teal-dark text-white uppercase text-lg mx-auto p-4 rounded flex-1">Submit</button>
      </div>
    </form>
