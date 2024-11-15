<script lang="ts">
  import Select from 'svelte-select';
  import type { Part } from './types';
  import { createEventDispatcher } from 'svelte';
  import FuzzySearch from './components/FuzzySearch.svelte';
  import ImageUpload from './components/ImageUpload.svelte';

  const dispatch = createEventDispatcher();

  let part: Part = {
    category: '',
    subcategory: '',
    additionalInfo: '',
    images: []
  };

  // TODO: Replace with API calls
  const categories = [
    'Engine',
    'Transmission',
    'Suspension',
    'Brakes',
    'Electrical',
    'Body',
    'Interior'
  ].map(c => ({ value: c, label: c }));

  let subcategories: any[] = [];

  const subcategoriesByCategory: { [key: string]: string[] } = {
    'Engine': ['Engine Block', 'Pistons', 'Cylinder Head', 'Timing Belt', 'Oil Pump', 'Gaskets'],
    'Transmission': ['Gearbox', 'Clutch', 'Torque Converter', 'Differential', 'Drive Shaft'],
    'Suspension': ['Shock Absorbers', 'Springs', 'Control Arms', 'Bushings', 'Struts'],
    'Brakes': ['Brake Pads', 'Rotors', 'Calipers', 'Master Cylinder', 'Brake Lines'],
    'Electrical': ['Battery', 'Alternator', 'Starter', 'ECU', 'Sensors', 'Wiring'],
    'Body': ['Bumpers', 'Doors', 'Hood', 'Fenders', 'Mirrors', 'Lights'],
    'Interior': ['Seats', 'Dashboard', 'Carpet', 'Steering Wheel', 'Console']
  };

  // Create a flat list of all parts with their categories for fuzzy search
  const allParts = Object.entries(subcategoriesByCategory).flatMap(([category, items]) =>
    items.map(item => ({
      category,
      subcategory: item,
      searchText: `${category} ${item}`
    }))
  );

  function handleCategoryChange(event: CustomEvent) {
    const selectedCategory = event.detail?.value;
    if (selectedCategory) {
      part.category = selectedCategory;
      updateSubcategories(selectedCategory);
      handleChange();
    }
  }

  function updateSubcategories(category: string) {
    subcategories = (subcategoriesByCategory[category] || []).map(s => ({ value: s, label: s }));
    part.subcategory = '';
  }

  function handleChange() {
    dispatch('update', part);
  }

  function handleFuzzySelection(event: CustomEvent) {
    const selection = event.detail;
    if (selection) {
      part.category = selection.category;
      updateSubcategories(selection.category);
      part.subcategory = selection.subcategory;
      handleChange();
    }
  }

  function handleImagesChange(event: CustomEvent) {
    part.images = event.detail.images;
    handleChange();
  }
</script>

<div class="space-y-6 bg-white p-6 rounded-lg shadow-lg border border-blue-100">
  <div class="mb-8">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Quick Search
    </label>
    <FuzzySearch
      items={allParts}
      on:select={handleFuzzySelection}
      placeholder="Search for any part, category, or subcategory..."
    />
  </div>

  <div class="grid grid-cols-1 gap-6">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Category
      </label>
      <Select
        items={categories}
        bind:value={part.category}
        on:change={handleCategoryChange}
        placeholder="Select category"
        isSearchable={true}
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Subcategory
      </label>
      <Select
        items={subcategories}
        bind:value={part.subcategory}
        on:change={handleChange}
        placeholder="Select subcategory"
        isSearchable={true}
        disabled={!part.category}
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Additional Information
      </label>
      <textarea
        bind:value={part.additionalInfo}
        on:input={handleChange}
        class="w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        rows="4"
        placeholder="Enter additional details about the part..."
      ></textarea>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Images
      </label>
      <ImageUpload
        bind:images={part.images}
        on:change={handleImagesChange}
      />
    </div>
  </div>
</div>

<style>
  :global(.svelte-select) {
    --background: white;
    --border: rgb(147, 197, 253);
    --border-focused: rgb(59, 130, 246);
    --border-radius: 0.375rem;
    --height: 2.5rem;
    --padding: 0.5rem;
  }
</style>