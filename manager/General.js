"use strict";
const { Web3 } = require("web3");
const { sendTeleMessage } = require("../utils/telegram");
const options = {
  timeout: 30000, // ms

  clientConfig: {
    // Useful if requests are large
    // maxReceivedFrameSize: 100000000, // bytes - default: 1MiB
    // maxReceivedMessageSize: 100000000, // bytes - default: 8MiB

    // Useful to keep a connection alive
    keepalive: true,
    keepaliveInterval: -1, // ms
  },

  // Enable auto reconnection
  reconnect: {
    auto: true,
    delay: 1000, // ms
    maxAttempts: 10,
    onTimeout: false,
  },
};
const provider = new Web3.providers.WebsocketProvider(
  // "wss://mainnet.infura.io/ws/v3/bd0eea5ad04549fea3de66a1cfe62ca0",
  "wss://ethereum.publicnode.com"
  // options
);
const web3 = new Web3(provider);

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
    return sendTeleMessage(message);
  } catch (e) {
    // return false
    console.log("push err", e.message)
    throw e;
  }
};
let count = 0
const listen = async () => {
  if (count === 0) {
    sendTeleMessage("start")
  } else {
    sendTeleMessage("restart " + count)
  }
  count++
  // console.log( web3.utils.sha3('NewPublication(address,uint256,bytes32,string,string)'))
  try {
    const options = {
      reconnect: {
          auto: true,
          delay: 5000, // ms
          maxAttempts: 5,
          onTimeout: false
      },
      // topics: [
      //     web3.utils.sha3('NewPublication(address,uint256,bytes32,string,string)')
      // ],
      // fromBlock: 20027607,
      // toBlock: 'latest'
  };
    const subscription = await web3.eth.subscribe("logs");
    console.log("run");
    subscription.on('connected', nr => console.log(nr))
    subscription.on("data", (tx) => {
      console.log(tx);
      web3.eth
        .getTransactionReceipt(tx.transactionHash)
        .then(async (receipt) => {
          if (!receipt.to) {
            console.log({ receipt, tx });
            try {
              const data = await checkIsTokenContract(receipt.contractAddress);
              if (data) {
                return pushTele({ ...data, address: receipt.contractAddress });
              }
            } catch (error) {
              console.log("er", error.message)
              // throw error
            }
          }
        }).catch((e) => console.log("fail", tx.transactionHash, e.message));
    });
    // subscription.on('data', event => console.log(event))
    // subscription.on('changed', changed => console.log(changed))
    subscription.on('error', err => console.log ('error', err.message, err.stack))
    // subscription.on('connected', nr => console.log(nr))
  } catch (e) {
    // await sendTeleMessage("Stop")
    throw e;
  }
};

provider.on("connect", listen);
provider.on("disconnect", () => {
  console.log("disconnect");
});
// listen();
