<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import Fuse from 'fuse.js';

  export let items: Array<{
    category: string;
    subcategory: string;
    searchText: string;
  }>;
  export let placeholder = 'Search...';

  const dispatch = createEventDispatcher();

  let searchTerm = '';
  let results: any[] = [];
  let showResults = false;
  let selectedIndex = -1;
  let searchInput: HTMLInputElement;
  let fuse: Fuse<any>;

  const fuseOptions = {
    keys: ['searchText'],
    threshold: 0.3,
    distance: 100
  };

  onMount(() => {
    fuse = new Fuse(items, fuseOptions);
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

  function handleSearch() {
    if (searchTerm.trim() === '') {
      results = [];
      return;
    }
    results = fuse.search(searchTerm).map(result => result.item);
    showResults = true;
    selectedIndex = -1;
  }

  function handleSelect(item: any) {
    searchTerm = `${item.category} - ${item.subcategory}`;
    dispatch('select', item);
    showResults = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!showResults) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        showResults = false;
        break;
    }
  }

  function handleClickOutside(event: MouseEvent) {
    if (searchInput && !searchInput.contains(event.target as Node)) {
      showResults = false;
    }
  }
</script>

<div class="relative">
  <input
    type="text"
    bind:value={searchTerm}
    on:input={handleSearch}
    on:keydown={handleKeydown}
    bind:this={searchInput}
    {placeholder}
    class="w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-4 pr-10 py-2"
  />

  {#if showResults && results.length > 0}
    <div class="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-blue-100 max-h-60 overflow-y-auto">
      {#each results as result, i}
        <button
          class="w-full text-left px-4 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none
            {selectedIndex === i ? 'bg-blue-50' : ''}
            {i !== results.length - 1 ? 'border-b border-gray-100' : ''}"
          on:click={() => handleSelect(result)}
        >
          <span class="font-medium text-gray-900">{result.category}</span>
          <span class="text-gray-500"> - {result.subcategory}</span>
        </button>
      {/each}
    </div>
  {:else if showResults && searchTerm.trim() !== ''}
    <div class="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-blue-100 p-4 text-gray-500">
      No results found
    </div>
  {/if}
</div>