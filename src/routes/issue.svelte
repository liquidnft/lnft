<script>
  import { onMount } from "svelte";

  let handleFiles = ({ target: { files } }) => {
    [...files].forEach(uploadFile);
  };

  let uploadFile = (file) => {
    let url = "localhost:3000/upload";
    let formData = new FormData();

    formData.append("file", file);

    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then(() => {
        console.log("done");
      })
      .catch(() => {
        console.log("bad");
      });
  };

  onMount(async () => {
    let dropArea = document.getElementById("drop-area");
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    ["dragenter", "dragover"].forEach((eventName) => {
      dropArea.addEventListener(eventName, highlight, false);
    });

    ["dragleave", "drop"].forEach((eventName) => {
      dropArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
      dropArea.classList.add("highlight");
    }

    function unhighlight(e) {
      dropArea.classList.remove("highlight");
    }

    dropArea.addEventListener("drop", handleDrop, false);

    function handleDrop(e) {
      let dt = e.dataTransfer;
      let files = dt.files;

      handleFiles({ target: { files }});
    }
  });
</script>

<style>
  #drop-area {
    border: 2px dashed #ccc;
    border-radius: 20px;
    width: 480px;
    font-family: sans-serif;
    margin: 100px auto;
    padding: 20px;
  }
  #drop-area.highlight {
    border-color: purple;
  }
  p {
    margin-top: 0;
  }
  .my-form {
    margin-bottom: 10px;
  }
  #gallery {
    margin-top: 10px;
  }
  #gallery img {
    width: 150px;
    margin-bottom: 10px;
    margin-right: 10px;
    vertical-align: middle;
  }
  .button {
    display: inline-block;
    padding: 10px;
    background: #ccc;
    cursor: pointer;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  .button:hover {
    background: #ddd;
  }
  #fileElem {
    display: none;
  }
</style>

<div id="drop_zone" on:drop={dropHandler} on:dragover={dragOverHandler}>
  <p>Drag one or more files to this Drop Zone ...</p>
</div>

<div id="drop-area">
  <form class="my-form">
    <p>
      Upload multiple files with the file dialog or by dragging and dropping
      images onto the dashed region
    </p>
    <input
      type="file"
      id="fileElem"
      multiple
      accept="image/*"
      on:change={handleFiles} />
    <label class="button" for="fileElem">Select some files</label>
  </form>
</div>
