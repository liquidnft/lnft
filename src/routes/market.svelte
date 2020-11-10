<script>
  import Card from "$components/Card";

  import { gql } from "$components/api";
  import { token } from "$components/store";

  let title;
  let description;

  let params = {
    query: `mutation insert_single_artwork($object: artworks_insert_input!) {
  insert_artworks_one(object: $object) {
  id
  }
  }`,
    variables: {
      object: {
        title: "Article 1",
        description: "Sample article content",
        owner_id: "10b2de5b-0ba6-4da7-b2ba-b665175a51cb",
        artist_id: "10b2de5b-0ba6-4da7-b2ba-b665175a51cb",
      },
    },
  };
</script>

<div>
  <h1 class="text-2xl font-black text-gray-900 pb-6 px-6 md:px-12">Market</h1>
</div>
<div class="flex flex-wrap px-6">
  <Card />
  <Card />
</div>
