<script>
  import Avatar from '$components/Avatar';
  import { user } from '$lib/store';
  </script>

<div class="flex flex-wrap mb-4">
  <Avatar src={$user.avatar_url} />
  <div class="ml-2">
    <div>
      @asoltys placed a bid for 7.3 BTC on
      <a href="#">The Soothsayer</a>
    </div>
    <div class="uppercase font-medium text-gray-600 text-sm">
      18 minutes ago
    </div>
  </div>
</div>
