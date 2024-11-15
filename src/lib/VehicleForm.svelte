<script lang="ts">
  import Select from 'svelte-select';
  import type { Vehicle } from './types';
  import { createEventDispatcher } from 'svelte';
  import { searchByPlate, fetchBrands, fetchModels, fetchVersions } from './api/vehicleApi';
  import Tabs from './components/Tabs.svelte';
  import Toast from './components/Toast.svelte';

  const dispatch = createEventDispatcher();

  let activeTab = 'plate';
  const tabs = [
    { id: 'plate', label: 'License Plate' },
    { id: 'manual', label: 'Manual Entry' }
  ];

  let licensePlate = '';
  let vehicle: Vehicle = {
    brand: '',
    model: '',
    year: 0,
    version: ''
  };

  let loading = false;
  let error = '';
  let showToast = false;
  let toastMessage = '';
  let toastType: 'success' | 'error' = 'success';

  let brands: any[] = [];
  let models: any[] = [];
  let versions: any[] = [];
  
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => ({
    value: currentYear - i,
    label: (currentYear - i).toString()
  }));
  console.log(yearOptions)

  async function loadBrands() {
    try {
      brands = await fetchBrands();
    } catch (err) {
      console.error('Failed to load brands:', err);
      showErrorToast('Failed to load vehicle brands');
    }
  }

  async function updateModels(brand: string) {
    try {
      models = await fetchModels(brand);
    } catch (err) {
      console.error('Failed to load models:', err);
      showErrorToast('Failed to load vehicle models');
    }
    vehicle.model = '';
    vehicle.year = 0;
    vehicle.version = '';
  }

  async function updateVersions(brand: string, model: string) {
    try {
      versions = await fetchVersions(brand, model);
    } catch (err) {
      console.error('Failed to load versions:', err);
      showErrorToast('Failed to load vehicle versions');
    }
    vehicle.version = '';
  }

  function showSuccessToast(message: string) {
    toastMessage = message;
    toastType = 'success';
    showToast = true;
    setTimeout(() => showToast = false, 3000);
  }

  function showErrorToast(message: string) {
    toastMessage = message;
    toastType = 'error';
    showToast = true;
    setTimeout(() => showToast = false, 3000);
  }

  function validateLicensePlate(plate: string): boolean {
    // Basic validation for Chilean license plates
    const plateRegex = /^[A-Z]{2}[A-Z0-9]{2}[0-9]{2}$/;
    return plateRegex.test(plate.toUpperCase());
  }

  async function searchByLicensePlate() {
    if (!validateLicensePlate(licensePlate)) {
      showErrorToast('Please enter a valid license plate number');
      return;
    }

    loading = true;
    error = '';
    
    try {
      const data = await searchByPlate(licensePlate.toUpperCase());
      
      if (!data) {
        throw new Error('No vehicle data received');
      }

      // Update vehicle information
      console.log(data)
      vehicle = {
        brand: data.brand || '',
        model: data.model || '',
        year: data.year || 0
      };
      // Load related data for dropdowns
      await loadBrands();
      if (vehicle.brand) {
        await updateModels(vehicle.brand);
      }

      vehicle = {
        brand: data.brand || '',
        model: data.model || '',
        year: data.year || 0
      };

      if (vehicle.model) {
        await updateVersions(vehicle.brand, vehicle.model);
      }

      vehicle = {
        brand: data.brand || '',
        model: data.model || '',
        year: ''+data.year || 0
      };
      console.log(vehicle)
      activeTab = 'manual';
      showSuccessToast('Vehicle information found and loaded!');
      dispatch('update', vehicle);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch vehicle information';
      console.error('Search error:', errorMessage);
      showErrorToast(errorMessage);
    } finally {
      loading = false;
    }
  }

  function handleBrandChange(event: CustomEvent) {
    const selectedBrand = event.detail?.value;
    if (selectedBrand) {
      vehicle.brand = selectedBrand;
      updateModels(selectedBrand);
      handleChange();
    }
  }

  function handleModelChange(event: CustomEvent) {
    const selectedModel = event.detail?.value;
    if (selectedModel) {
      vehicle.model = selectedModel;
      updateVersions(vehicle.brand, selectedModel);
      handleChange();
    }
  }

  function handleChange() {
    console.log(vehicle.year);
  
    dispatch('update', vehicle);
  }

  // Load initial brands
  loadBrands();
</script>

<div class="space-y-6 bg-white p-6 rounded-lg shadow-lg border border-primary/10">
  <Tabs {tabs} bind:activeTab />

  {#if activeTab === 'plate'}
    <div class="license-plate-section">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        License Plate
      </label>
      <div class="flex gap-2">
        <input
          type="text"
          bind:value={licensePlate}
          class="flex-1 rounded-md"
          placeholder="Enter license plate (e.g., ABCD12)"
          disabled={loading}
          maxlength="6"
        />
        <button
          on:click={searchByLicensePlate}
          class="btn-primary px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !licensePlate}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      {#if error}
        <p class="text-red-500 text-sm mt-2">{error}</p>
      {/if}
    </div>
  {:else}
    <div class="grid grid-cols-1 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Brand
        </label>
        <Select
          items={brands}
          bind:value={vehicle.brand}
          on:change={handleBrandChange}
          placeholder="Select brand"
          isSearchable={true}
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Model
        </label>
        <Select
          items={models}
          bind:value={vehicle.model}
          on:change={handleModelChange}
          placeholder="Select model"
          isSearchable={true}
          disabled={!vehicle.brand}
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Year
        </label>
        <Select
          items={yearOptions}
          bind:value={vehicle.year}
          on:change={handleChange}
          placeholder="Select year"
          disabled={!vehicle.model}
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Version
        </label>
        <Select
          items={versions}
          bind:value={vehicle.version}
          on:change={handleChange}
          placeholder="Select version"
          isSearchable={true}
          disabled={!vehicle.year}
        />
      </div>
    </div>
  {/if}
</div>

{#if showToast}
  <Toast message={toastMessage} type={toastType} />
{/if}

<style>
  :global(.svelte-select) {
    --background: white;
    --border: rgb(17, 31, 81, 0.2);
    --border-focused: rgb(25, 206, 218);
    --border-radius: 0.375rem;
    --height: 2.5rem;
    --padding: 0.5rem;
  }
</style>
