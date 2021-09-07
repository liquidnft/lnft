<script>
  import Button from "$styleguide/components/Button.svelte";
  import Card   from "$styleguide/components/Card.svelte";
  import Navbar from "$styleguide/components/Navbar.svelte";
  import Logo   from "$styleguide/components/Logo.svelte";
  import Search   from "$styleguide/components/Search.svelte";

  const mockedArtwork = {
    "id"                : "cee17ab7-c8c9-43bf-88c4-31655be704a3",
    "asset"             : "feccb03e641f374c2dc88d8922c598cf691deda7b2cda465229cac4bffec1276",
    "edition"           : 56,
    "editions"          : 100,
    "title"             : "Happy Easter Egg",
    "description"       : "Happy Easter Egg",
    "artist_id"         : "975011c4-53c4-4fb2-824b-11c5460524e0",
    "owner_id"          : "975011c4-53c4-4fb2-824b-11c5460524e0",
    "filename"          : "QmT6Yi17EiwPVVA9n4CQpFQ246vhwwo75KVbrZDH1gq86A",
    "filetype"          : "image/gif",
    "favorited"         : false,
    "list_price"        : 10000,
    "reserve_price"     : 10000,
    "last_active"       : "2021-08-17T13:24:02.752026+00:00",
    "created_at"        : "2021-08-17T12:50:48.220333+00:00",
    "auction_start"     : null,
    "auction_end"       : null,
    "list_price_tx"     : "cHNldP8BAHcCAAAAAAF0AA0GX42peoEEMn7NlPblzmUbI2JMA35fdD8oOWyDwwAAAAAA/////wEBJbJRBw4pyhkEPPM8zXMk4t2rA+zErgted8T8Dlz2yVoBAAAAAAAAJxAAF6kUJChX4Mxmg4rihIt4xdGu+xKk1U+HAAAAAAABAP0gAgIAAAABAmg1lzA8ghTcVXJxA+Z+Vjvb9EwXB8zxTg2D7VL64ddYAgAAABcWABRLxDvODKYPnyqARFAsICohqvMzCf////8evUQNgNcL360/OBS/7qHsmuEXEiCO0bolls2StS5SOgEAAAAXFgAUS8Q7zgymD58qgERQLCAqIarzMwn/////AwF2Euz/S6ycImWkzbKn7R1pz5jFIomNyC1MNx9kPrDM/gEAAAAAAAAAAQAXqRSf139QXS8H5XQQ9tL+jMzb99ErWocBJbJRBw4pyhkEPPM8zXMk4t2rA+zErgted8T8Dlz2yVoBAAAAAAL65MgAF6kUJChX4Mxmg4rihIt4xdGu+xKk1U+HASWyUQcOKcoZBDzzPM1zJOLdqwPsxK4LXnfE/A5c9slaAQAAAAAAAABkAAAAAAAAAAACRzBEAiA0iKPkhAqQuMfnWS+rMqaTk/mVYlf3W5kAEL3BAkdgDwIgPU+2ovz8z3fPKo+yW2CRol3WzmYeJ/qc4mWGISro07cBIQN0dkd+YGpi3l2YIhGzfAcogfT1waP46FSRz5Z5rHBTnQAAAAJIMEUCIQCejVNwAVCKSaTAsFMNCpM9iUGQq3W4eN9wcDj2VRqJUQIgeU1sbXI6WPxOj36EB7lxV/MKQ01NSl2bm4vgJu5MIeUBIQN0dkd+YGpi3l2YIhGzfAcogfT1waP46FSRz5Z5rHBTnQAAAAAAAAAiAgN0dkd+YGpi3l2YIhGzfAcogfT1waP46FSRz5Z5rHBTnUgwRQIhAPjO+U+9p1ZZsP+J+5DlNpEJSDl9lTYzvgRxBNGl4uKyAiAVKiuCrV1aShJYU3HqGzUnZ4pwXNaYisYrFIE39CEcxoMBAwSDAAAAAQQiACAYMMsUol7aCEYTeDaenQobe+43XdN0fU0LwocUegy3gAEFR1IhA3R2R35gamLeXZgiEbN8ByiB9PXBo/joVJHPlnmscFOdIQPDciu0Jg+MRJ/I8malg0jZlBCiYJb7qE+xXB1m2Gj4e1KuAAA=",
    "asking_asset"      : "5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225",
    "bid_increment"     : 10000,
    "extension_interval": null,
    "max_extensions"    : null,
    "royalty"           : null,
    "slug"              : "happy-easter-egg-56-cee17",
    "is_physical"       : false,
    "instagram"         : null,
    "ticker"            : "HEEBC",
    "views"             : 23,
    "transferred_at"    : null,
    "owner"             : {
      "id"        : "975011c4-53c4-4fb2-824b-11c5460524e0",
      "username"  : "ihor-million",
      "avatar_url": "QmcbyjMMT5fFtoiWRJiwV8xoiRWJpSRwC6qCFMqp7EXD4Z",
      "address"   : "XEeRW9goqwGkwFPcQZYUQaUtEshDksQmBZ",
      "pubkey"    : "tpubDGBYmnq9UpvaZfBViGnwrhP4je2myi53oeiHcc7Eatb2AtN8JXhPmUbAKU9ZAzXTJ9uja3TfEgseUuoLVuyVjySzpQTSL9Fp9Cva1438UCQ",
      "__typename": "users"
    },
    "artist"            : {
      "id"        : "975011c4-53c4-4fb2-824b-11c5460524e0",
      "address"   : "XEeRW9goqwGkwFPcQZYUQaUtEshDksQmBZ",
      "username"  : "ihor-million",
      "avatar_url": "QmcbyjMMT5fFtoiWRJiwV8xoiRWJpSRwC6qCFMqp7EXD4Z",
      "__typename": "users"
    },
    "bid"               : [
      {
        "id"        : "c7cedf32-89cf-4205-9d8f-b7d5a93bec72",
        "user"      : {
          "id"        : "400eb769-2de6-41c8-8f0d-d3255f503479",
          "username"  : "test1",
          "__typename": "users"
        },
        "amount"    : 15000,
        "__typename": "transactions"
      }
    ],
    "tags"              : [
      {
        "tag"       : "egg",
        "__typename": "tags"
      }
    ],
    "__typename"        : "artworks"
  };
</script>

<h1 class="mx-auto max-w-5xl my-16">
    This is a style-guide
</h1>

<h3 class="my-8 mx-auto max-w-5xl mt-32">Button</h3>
<div class="mx-auto max-w-5xl p-5 mx-0 my-8 border-gray-200 border rounded-lg">
    <div class="mb-8">
        <h4 class="text-gray-400 text-base mb-8">Button default</h4>
        <Button>Default</Button>
    </div>
    <div class="mb-8">
        <h4 class="text-gray-400 text-base mb-8">Button default (:hovered)</h4>
        <Button hover>Default</Button>
    </div>
    <div class="mt-8">
        <h4 class="text-gray-400 text-base mb-8">Button primary</h4>
        <Button primary>Default</Button>
    </div>
    <div class="mt-8">
        <h4 class="text-gray-400 text-base mb-8">Button primary (:hovered)</h4>
        <Button primary hover>Default</Button>
    </div>
</div>

<h3 class="my-8 mx-auto max-w-5xl mt-32">Card</h3>
<div class="mx-auto max-w-5xl p-5 mx-0 my-8 border-gray-200 border rounded-lg">
    <div class="mb-8 max-w-xs">
        <h4 class="text-gray-400 text-base mb-8">Card default (xs)</h4>
        <Card artwork={mockedArtwork}/>
    </div>
    <div class="mb-8 max-w-sm">
        <h4 class="text-gray-400 text-base mb-8">Card default (sm)</h4>
        <Card artwork={mockedArtwork}/>
    </div>

    <div class="mb-8 max-w-md">
        <h4 class="text-gray-400 text-base mb-8">Card default (md)</h4>
        <Card artwork={mockedArtwork}/>
    </div>
</div>

<h3 class="my-8 max-w-5xl mx-auto mt-32">Logo</h3>
<div class="box max-w-5xl mx-auto p-5 mx-0 my-8 border-gray-200 border rounded-lg">
    <div class="mb-8">
        <h4 class="text-gray-400 text-base mb-8">Logo normal</h4>
        <div class="p-24 bg-black flex items-center justify-center">
            <Logo class="w-32"/>
        </div>
    </div>
    <div class="mb-8">
        <h4 class="text-gray-400 text-base mb-8">Logo graphic</h4>
        <div class="flex items-center justify-center">
            <Logo graphic class="w-6"/>
        </div>
    </div>

    <div class="mb-8">
        <h4 class="text-gray-400 text-base mb-8">Logo white</h4>
        <div class="p-8 flex items-center justify-center">
            <Logo white class="w-32"/>
        </div>
    </div>
</div>

<h3 class="my-8 max-w-5xl mx-auto mt-32">Splash</h3>
<div class="box max-w-5xl mx-auto p-5 mx-0 my-8 border-gray-200 border rounded-lg">
    <div class="mb-8">
        <h4 class="text-gray-400 text-base mb-8">Splash used for social sharing</h4>
        <img src="/branding/splash.png" class="w-full max-w-xl"/>
    </div>
</div>

<h3 class="my-8 max-w-5xl mx-auto mt-32">Search</h3>
<div class="mx-auto box p-5 mx-0 my-8 border-gray-200 border rounded-lg">
    <div class="mb-8">
        <h4 class="mx-auto max-w-2xl text-gray-400 text-base mb-8">Search</h4>
        <div class="max-w-4xl mx-auto px-32 p-4 bg-black h-48 flex items-center">
            <Search />
        </div>
    </div>
    <div class="mb-8">
        <h4 class="mx-auto max-w-2xl text-gray-400 text-base mb-8">Search (focused)</h4>
        <div class="max-w-4xl mx-auto px-32 p-4 bg-black h-48 flex items-center">
            <Search focused/>
        </div>
    </div>
</div>

<h3 class="my-8 max-w-5xl mx-auto mt-32">Navbar</h3>
<div class="mx-auto box p-5 mx-0 my-8 border-gray-200 border rounded-lg">
    <div class="mb-8">
        <h4 class="mx-auto max-w-7xl text-gray-400 text-base mb-8">Header default</h4>
        <Navbar />
    </div>
    <div class="mb-8 max-w-5xl mx-auto">
        <h4 class="text-gray-400 text-base mb-8">Header tablet</h4>
        <Navbar mobileScreen/>
    </div>
    <div class="mb-8 max-w-lg mx-auto">
        <h4 class="text-gray-400 text-base mb-8">Header mobile</h4>
        <Navbar mobileScreen/>
    </div>
</div>
