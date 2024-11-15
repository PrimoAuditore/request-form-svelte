<script lang="ts">
  export let message: string;
  export let type: 'success' | 'error' = 'success';
</script>

<div
  class="fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white
    {type === 'success' ? 'bg-accent' : 'bg-red-600'}
    transition-opacity duration-300"
>
  {message}
</div>