<script lang="ts">
  import VehicleForm from './lib/VehicleForm.svelte';
  import PartForm from './lib/PartForm.svelte';
  import ContactForm from './lib/ContactForm.svelte';
  import type { FormData, Vehicle, Part, Contact } from './lib/types';

  let formData: FormData = {
    vehicle: {
      brand: '',
      model: '',
      year: 0,
      version: ''
    },
    part: {
      category: '',
      subcategory: '',
      additionalInfo: '',
      images: []
    },
    contact: {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      coordinates: [0, 0]
    }
  };

  function handleVehicleUpdate(event: CustomEvent<Vehicle>) {
    formData.vehicle = event.detail;
  }

  function handlePartUpdate(event: CustomEvent<Part>) {
    formData.part = event.detail;
  }

  function handleContactUpdate(event: CustomEvent<Contact>) {
    formData.contact = event.detail;
  }

  function handleSubmit() {
    console.log('Form submitted:', formData);
    // Handle form submission
  }
</script>

<main class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
  <div class="max-w-3xl mx-auto space-y-8">
    <div class="flex flex-col items-center justify-center space-y-2 mb-8">
      <div class="w-[400px] h-[100px] relative">
        <img src="/logo.svg" alt="Logo" class="w-full h-full object-contain" />
      </div>
      <h2 class="text-xl text-accent font-medium">
        Solicitud de busqueda de repuesto
      </h2>
    </div>

    <section>
      <h2 class="text-xl font-semibold text-primary mb-4">Vehicle Information</h2>
      <VehicleForm on:update={handleVehicleUpdate} />
    </section>

    <section>
      <h2 class="text-xl font-semibold text-primary mb-4">Part Information</h2>
      <PartForm on:update={handlePartUpdate} />
    </section>

    <section>
      <h2 class="text-xl font-semibold text-primary mb-4">Contact Information</h2>
      <ContactForm on:update={handleContactUpdate} />
    </section>

    <div class="flex justify-end">
      <button
        on:click={handleSubmit}
        class="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-colors duration-200"
      >
        Submit Request
      </button>
    </div>
  </div>
</main>

<style>
  :global(body) {
    background-color: #f9fafb;
  }
</style>