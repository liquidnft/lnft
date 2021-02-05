<script>
  import { goto } from "$lib/utils";
  import { hasura } from "$lib/api";
  import { token } from "$lib/store";
  import Select from "svelte-select";
  import Item from "$components/SearchItem";

  const query = `query($filterText: String!) {
    searchable(args: { t: $filterText }) {
      id
      s
      type
    }
  }`;

  async function loadOptions(filterText) {
    filterText = filterText ? filterText.replace(" ", "_") : "";
    return new Promise((resolve) =>
      hasura
        .headers({ authorization: `Bearer ${$token}` })
        .post({ query, variables: { filterText } })
        .json(({ data: { searchable: arr } }) =>
          resolve(arr.sort((a, b) => a.s.localeCompare(b.s)))
        )
    );
  }

  const groupBy = (item) => item.group;
  const optionIdentifier = "id";
  const getOptionLabel = (option) => option.s;
  const getSelectionLabel = (option) => option.s;

  const go = ({ detail: { id, type, s } }) => goto(`/${type}/${id ? id : s}`);
</script>

<Select
  containerStyles="border: 0"
  inputStyles="border-top: 0; outline: none; border-bottom: 2px solid lightblue"
  {loadOptions}
  {optionIdentifier}
  {getSelectionLabel}
  {getOptionLabel}
  placeholder="What are you looking for?"
  on:select={go} />
