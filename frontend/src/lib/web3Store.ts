import { writable } from 'svelte/store';
import Web3 from 'web3';
import axios from 'axios';
import FileStorageContract from '../../../backend/build/contracts/FileStorage.json'; // ABI from Truffle build
import { Buffer } from 'buffer'; // Import Buffer

// Import config values
import { PINATA_API_KEY, PINATA_SECRET_KEY, CONTRACT_ADDRESS } from './config';

// Extend the window object to include the Ethereum provider
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: Array<any> }) => Promise<any>;
    };
  }
}

// Type definitions for the Web3 store
type Web3Store = {
  web3: Web3 | null;
  account: string | null;
  contract: any | null;
};

// Initialize stores with writable
export const web3 = writable<Web3Store>({
  web3: null,
  account: null,
  contract: null
});

// IPFS setup with Pinata authentication (using axios for manual request)
export const uploadFileToIPFS = async (file: File): Promise<string> => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const data = new FormData();
  data.append('file', file);

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY
      }
    });
    return response.data.IpfsHash; // Return the IPFS hash
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error('Failed to upload file to IPFS');
  }
};

// Connect MetaMask wallet
export const connectWallet = async (): Promise<void> => {
  if (window.ethereum) {
    try {
      const web3Instance = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3Instance.eth.getAccounts();
      web3.update((store) => ({ ...store, account: accounts[0], web3: web3Instance }));

      // Load and initialize the deployed contract
      const contractInstance = new web3Instance.eth.Contract(
        FileStorageContract.abi,
        CONTRACT_ADDRESS
      );
      web3.update((store) => ({ ...store, contract: contractInstance }));

      console.log('Wallet connected:', accounts[0]);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect MetaMask wallet');
    }
  } else {
    alert('Please install MetaMask to interact with this dApp!');
  }
};

// Store file hash on the blockchain
export const storeFileOnBlockchain = async (fileHash: string): Promise<void> => {
  web3.subscribe(async (store) => {
    if (store.contract && store.account) {
      try {
        await store.contract.methods.uploadFile(fileHash)
          .send({ from: store.account })
          .on('transactionHash', (hash: string) => {
            console.log('Transaction Hash:', hash);
          })
          .on('receipt', (receipt: any) => {
            console.log('Transaction Receipt:', receipt);
          });
      } catch (error) {
        console.error('Blockchain storage error:', error);
        throw new Error('Failed to store file hash on blockchain');
      }
    } else {
      console.error('Web3 or contract not initialized');
      throw new Error('Please connect your wallet and try again');
    }
  });
};
