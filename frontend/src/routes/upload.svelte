<script lang="ts">
  import { connectWallet, uploadFileToIPFS, storeFileOnBlockchain, web3 } from '$lib/web3Store';
  let selectedFile: File | null = null;
  let ipfsHash: string = '';
  let transactionStatus: string = '';

  const handleFileUpload = async (): Promise<void> => {
    transactionStatus = 'Uploading file to IPFS...';
    if (selectedFile) {
      ipfsHash = await uploadFileToIPFS(selectedFile);
      transactionStatus = `File uploaded! IPFS Hash: ${ipfsHash}`;

      transactionStatus = 'Storing file on blockchain...';
      await storeFileOnBlockchain(ipfsHash);
      transactionStatus = 'File hash stored on blockchain!';
    }
  };
</script>

<h1 class="text-3xl font-bold">Upload File to IPFS</h1>

<button on:click={connectWallet} class="mt-4 bg-blue-500 text-white p-2 rounded">
  Connect Wallet
</button>

{#if $web3.account}
  <p class="mt-2">Connected Account: {$web3.account}</p>

  <input type="file" on:change={(e) => selectedFile = (e.target as HTMLInputElement).files?.[0] || null} class="mt-4 border p-2" />
  <button on:click={handleFileUpload} class="mt-4 bg-green-500 text-white p-2 rounded">
    Upload to IPFS and Store on Blockchain
  </button>

  {#if ipfsHash}
    <p class="mt-4">File uploaded! IPFS Hash: {ipfsHash}</p>
  {/if}
  
  <p class="mt-4">{transactionStatus}</p>
{/if}
