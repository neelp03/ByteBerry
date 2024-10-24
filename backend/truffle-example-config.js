// backend/truffle-example-config.js

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ganache port
      network_id: "*",       // Any network (default: none)
    },
    // For deployment to testnets/mainnets, you can add network details here
    // e.g., for Rinkeby or Mainnet, with Infura and wallet provider
    // rinkeby: {
    //   provider: () => new HDWalletProvider('YOUR_MNEMONIC', `https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID`),
    //   network_id: 4,       // Rinkeby's network id
    //   gas: 4500000,        // Rinkeby has a lower block limit than mainnet
    //   confirmations: 2,    // # of confirmations to wait between deployments
    //   timeoutBlocks: 200,  // # of blocks before a deployment times out
    //   skipDryRun: true     // Skip dry run before migrations? (default: false for public nets)
    // }
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.0",      // Fetch exact version from solc-bin
    }
  }
};
