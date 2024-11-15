<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let images: string[] = [];
  export let maxImages = 4;
  export let maxSizeInMB = 5;

  const dispatch = createEventDispatcher();
  let dragOver = false;
  let fileInput: HTMLInputElement;
  let error = '';

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      processFiles(Array.from(input.files));
    }
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    dragOver = false;
    
    if (event.dataTransfer?.files) {
      processFiles(Array.from(event.dataTransfer.files));
    }
  }

  async function processFiles(files: File[]) {
    error = '';
    const remainingSlots = maxImages - images.length;
    
    if (files.length > remainingSlots) {
      error = `You can only upload ${remainingSlots} more image${remainingSlots === 1 ? '' : 's'}`;
      return;
    }

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        error = 'Only JPG, PNG and WebP images are allowed';
        continue;
      }

      if (file.size > maxSizeInMB * 1024 * 1024) {
        error = `Images must be smaller than ${maxSizeInMB}MB`;
        continue;
      }

      try {
        const base64 = await readFileAsBase64(file);
        images = [...images, base64];
        dispatch('change', { images });
      } catch (err) {
        console.error('Error processing image:', err);
        error = 'Error processing image';
      }
    }

    if (fileInput) {
      fileInput.value = '';
    }
  }

  function readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function removeImage(index: number) {
    images = images.filter((_, i) => i !== index);
    dispatch('change', { images });
  }
</script>

<div class="space-y-4">
  {#if images.length < maxImages}
    <div
      class="relative border-2 border-dashed rounded-lg p-4 text-center
        {dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
        transition-colors duration-200"
      on:dragenter|preventDefault={() => dragOver = true}
      on:dragleave|preventDefault={() => dragOver = false}
      on:dragover|preventDefault
      on:drop|preventDefault={handleDrop}
    >
      <input
        type="file"
        bind:this={fileInput}
        on:change={handleFileSelect}
        accept="image/jpeg,image/png,image/webp"
        multiple
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div class="space-y-2">
        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div class="text-sm text-gray-600">
          <label class="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
            <span>Upload images</span>
          </label>
          <p class="pl-1">or drag and drop</p>
        </div>
        <p class="text-xs text-gray-500">
          PNG, JPG, WebP up to {maxSizeInMB}MB
        </p>
      </div>
    </div>
  {/if}

  {#if error}
    <p class="text-red-500 text-sm">{error}</p>
  {/if}

  {#if images.length > 0}
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {#each images as image, i}
        <div class="relative group aspect-square">
          <img
            src={image}
            alt="Uploaded preview"
            class="w-full h-full object-cover rounded-lg"
          />
          <button
            class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            on:click={() => removeImage(i)}
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>