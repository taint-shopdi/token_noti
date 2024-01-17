"use strict";
const { Web3 } = require("web3");
const { sendTeleMessage } = require("../utils/telegram");

const web3 = new Web3(
  new Web3.providers.WebsocketProvider("wss://ethereum.publicnode.com")
);
const test = async () => {
  // const [blockNum, count] = await Promise.all([
  //   web3.eth.getBlockNumber(),
  //   web3.eth.getBlockTransactionCount()
  // ])
  const blockNum = await web3.eth.getBlockNumber();
  const count = await web3.eth.getBlockTransactionCount(blockNum);
  const arr = Array.from(Array(Number(count)).keys());
  const receipts = await Promise.all(
    arr.map(async (i) => {
      const tx = await web3.eth.getTransactionFromBlock(blockNum, i);
      return web3.eth.getTransactionReceipt(tx.hash);
    })
  );
  console.log(receipts);
  console.log(count);
  // const tx = await web3.eth.getTransactionFromBlock("blockNum", i)
  // console.log(tx)
  // const receipt = await web3.eth.getTransactionReceipt(tx.hash)
  // console.log(receipt)
};

// test()

// web3.eth.subscribe("newBlockHeaders", {}, function (error, result) {
//     if (!error) {
//       console.log(result);

//       return;
//     }

//     console.error(error);
//   })
const ERC20Abi = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_spender",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_from",
        type: "address",
      },
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
      {
        name: "_spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
];
const checkIsTokenContract = async (contractAddress) => {
  try {
    const contract = new web3.eth.Contract(ERC20Abi, contractAddress);
    const [name, decimals, symbol] = await Promise.all([
      contract.methods.name().call(),
      contract.methods.decimals().call(),
      contract.methods.symbol().call(),
    ]);
    console.log({ name, decimals, symbol });
    return { name, decimals, symbol };
  } catch (error) {
    console.log(contractAddress, false);

    return false;
  }
};

const pushTele = async ({ name, symbol, decimals, address }) => {
  try {
    const message = `
Deployed: ${name} ${symbol}

CA: ${address}

🔗 Code (https://etherscan.io/address/${address})
_______________
`;
    await sendTeleMessage(message);
  } catch (e) {
    // return false
    throw e;
  }
};

const listen = async () => {
  try {
    const subscription = await web3.eth.subscribe("logs");
    console.log("run")
    subscription.on("data", (tx) => {
      web3.eth
        .getTransactionReceipt(tx.transactionHash)
        .then(async (receipt) => {
          if (!receipt.to) {
            console.log({ receipt, tx });
            try {
              const data = await checkIsTokenContract(receipt.contractAddress);
              if (data) {
                await pushTele({ ...data, address: receipt.contractAddress });
              }
            } catch (error) {
              // throw error
            }
          }
        });
    });
  } catch (e) {
    throw e;
  }
};

listen();
