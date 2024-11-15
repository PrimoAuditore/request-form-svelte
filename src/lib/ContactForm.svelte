<script lang="ts">
  import { onMount } from 'svelte';
  import type { Contact } from './types';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let contact: Contact = {
    fullName: '',
    phone: '',
    email: '',
    address: '',
    coordinates: [-33.4489, -70.6693] // Santiago, Chile coordinates
  };

  let map: any;
  let marker: any;
  let mapElement: HTMLElement;
  let searchInput: HTMLInputElement;
  let searching = false;

  onMount(async () => {
    const L = await import('leaflet');
    
    map = L.default.map(mapElement).setView(contact.coordinates, 13);
    L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    
    marker = L.default.marker(contact.coordinates, { draggable: true }).addTo(map);
    
    marker.on('dragend', (event: any) => {
      const position = event.target.getLatLng();
      contact.coordinates = [position.lat, position.lng];
      handleChange();
    });

    return () => {
      if (map) {
        map.remove();
      }
    };
  });

  async function searchAddress() {
    if (!contact.address) return;
    
    searching = true;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(contact.address)}`);
      const data = await response.json();
      
      if (data && data[0]) {
        const { lat, lon } = data[0];
        contact.coordinates = [parseFloat(lat), parseFloat(lon)];
        map.setView([lat, lon], 16);
        marker.setLatLng([lat, lon]);
      }
    } catch (error) {
      console.error('Error searching address:', error);
    } finally {
      searching = false;
    }
  }

  function validateChileanPhone(phone: string): boolean {
    const phoneRegex = /^\+56[9][0-9]{8}$/;
    return phoneRegex.test(phone);
  }

  function handleChange() {
    dispatch('update', contact);
  }

  function handlePhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    if (!value.startsWith('56')) {
      value = '56' + value;
    }
    
    if (value.length > 0) {
      value = '+' + value;
    }
    
    contact.phone = value;
    handleChange();
  }
</script>

<div class="space-y-6 bg-white p-6 rounded-lg shadow-lg border border-blue-100">
  <div class="grid grid-cols-1 gap-6">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Full Name
      </label>
      <input
        type="text"
        bind:value={contact.fullName}
        on:input={handleChange}
        class="w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        placeholder="Enter your full name"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Phone Number
      </label>
      <input
        type="tel"
        bind:value={contact.phone}
        on:input={handlePhoneInput}
        class="w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500
          {!validateChileanPhone(contact.phone) && contact.phone ? 'border-red-500' : ''}"
        placeholder="+56912345678"
      />
      {#if !validateChileanPhone(contact.phone) && contact.phone}
        <p class="text-red-500 text-sm mt-1">Please enter a valid Chilean phone number (+56912345678)</p>
      {/if}
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Email
      </label>
      <input
        type="email"
        bind:value={contact.email}
        on:input={handleChange}
        class="w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        placeholder="Enter your email"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Address
      </label>
      <div class="flex gap-2">
        <input
          type="text"
          bind:value={contact.address}
          bind:this={searchInput}
          on:input={handleChange}
          class="flex-1 rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter your address"
        />
        <button
          on:click={searchAddress}
          disabled={!contact.address || searching}
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {searching ? 'Searching...' : 'Search'}
        </button>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Location
      </label>
      <div bind:this={mapElement} class="h-64 w-full rounded-md border border-blue-200"></div>
    </div>
  </div>
</div>

<svelte:head>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
  <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
</svelte:head>