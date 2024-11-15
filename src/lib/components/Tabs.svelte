<script lang="ts">
  export let tabs: Array<{ id: string; label: string }>;
  export let activeTab: string;
</script>

<div class="border-b border-blue-200">
  <nav class="-mb-px flex space-x-8" aria-label="Tabs">
    {#each tabs as tab}
      <button
        class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
          {activeTab === tab.id
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
        aria-current={activeTab === tab.id ? 'page' : undefined}
        on:click={() => activeTab = tab.id}
      >
        {tab.label}
      </button>
    {/each}
  </nav>
</div>