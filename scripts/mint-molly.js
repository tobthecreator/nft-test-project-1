require("dotenv").config()
const contract = require('../artifacts/contracts/my-nft.sol/TylerNFT1.json')

console.log(contract);
console.log(JSON.stringify(contract.abi));
const ALCHEMY_URL = process.env.ALCHEMY_URL;
const METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY;
const METAMASK_PUBLIC_KEY = process.env.METAMASK_PUBLIC_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(ALCHEMY_URL)

const contractAddress = "0xde4ef7C2a52A5093180c1CD9C5dE6BCbd96a2D0d";
const mollyContract = new web3.eth.Contract(contract.abi, contractAddress);

const mintMollyNFT = async () => {
    const nonce = await web3.eth.getTransactionCount(METAMASK_PUBLIC_KEY, 'latest');

    const tx = {
        'from': METAMASK_PUBLIC_KEY,
        'to': contractAddress,
        'nonce': nonce,
        'gas': 500000,
        'data': mollyContract.methods.mintNFT(METAMASK_PUBLIC_KEY, 'https://gateway.pinata.cloud/ipfs/QmdLTfgq6dcLUEhe69zqsTxNqAZv5uA2g7qBFXLfsby3yC').encodeABI()
      };

      const signPromise = web3.eth.accounts.signTransaction(tx, METAMASK_PRIVATE_KEY)
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            )
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            )
          }
        }
      )
    })
    .catch((err) => {
      console.log(" Promise failed:", err)
    })
}

mintMollyNFT();