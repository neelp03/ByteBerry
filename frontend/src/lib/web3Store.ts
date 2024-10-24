import { writable } from 'svelte/store';

// Extend the Window interface to include the ethereum property
declare global {
  interface Window {
    ethereum: any;
  }
}
import Web3 from 'web3';
import { create } from 'ipfs-http-client';

// Define types for the store data
type Web3Store = {
  web3: Web3 | null;
  account: string | null;
  contract: any | null; // Replace 'any' with your contract's type once it's deployed
};

// Initialize stores with writable
export const web3 = writable<Web3Store>({ web3: null, account: null, contract: null });

// IPFS setup
const ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' });

export const connectWallet = async (): Promise<void> => {
  if (window.ethereum) {
    const web3Instance = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const accounts = await web3Instance.eth.getAccounts();
    web3.update((store) => ({ ...store, account: accounts[0], web3: web3Instance }));

    // Load and initialize your smart contract here once deployed
    // const contractABI = ...;
    // const contractAddress = ...;
    // const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
    // web3.update((store) => ({ ...store, contract: contractInstance }));
  } else {
    alert('Please install MetaMask!');
  }
};

// Upload file to IPFS and return the hash
export const uploadFileToIPFS = async (file: File): Promise<string> => {
  const result = await ipfs.add(file);
  return result.path; // Returns the IPFS hash
};
