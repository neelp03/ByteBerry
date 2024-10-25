<script lang="ts">
  import { uploadedFiles } from '$lib/web3Store';
  import { onMount } from 'svelte';
  let files: Array<{ hash: string; timestamp: string }> = [];

  // Fetch the uploaded files from the store
  $: uploadedFiles.subscribe((data) => {
    files = data;
  });

  // Format timestamp for display
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
</script>

<h1 class="text-3xl font-bold mb-4">Uploaded Files Dashboard</h1>

{#if files.length === 0}
  <p>No files uploaded yet.</p>
{/if}

<ul class="list-disc">
  {#each files as file (file.hash)}
    <li class="mb-4">
      <p><strong>IPFS Hash:</strong> {file.hash}</p>
      <p><strong>Upload Date:</strong> {formatDate(file.timestamp)}</p>
      <a href={`https://gateway.pinata.cloud/ipfs/${file.hash}`} target="_blank" class="text-blue-500 underline">
        View File on IPFS
      </a>
    </li>
  {/each}
</ul>
