const NETWORK = 3;
const IDENTIFIER = 'requerant_dab_contract_register';
// const ADDRESS = '0xeeF56E97E315cD2c2c3151Da9e30ceeC8e813c40';
const COMPILER = '0.5.11';
const ABI = [
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "_requerant",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_contract",
        "type": "address"
      }
    ],
    "name": "registerContract",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "created_by",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "address",
        "name": "_requerant",
        "type": "address"
      }
    ],
    "name": "getContracts",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "requerants",
    "outputs": [
      {
        "internalType": "address",
        "name": "requerant_address",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "updated_by",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

const SMARTCONTRACT = `
pragma solidity ^0.5.11;

contract ContractRegister {

  address public created_by;
  address public updated_by;

  struct Requerant {
    address requerant_address;
    bool exists;
    address[] contracts;
  }
  mapping(address => Requerant) public requerants;

  constructor () public {
    created_by = msg.sender;
    updated_by = msg.sender;
  }

  function getContracts (address _requerant) public view returns (address[] memory) {
      if (!requerants[_requerant].exists) {
          return new address[](0);
      }

      return requerants[_requerant].contracts;
  }

  function registerContract (address _requerant, address _contract) public {
    updated_by = msg.sender;
    if (!requerants[_requerant].exists) {
        Requerant memory requerant;
        requerant.requerant_address = _requerant;
        requerant.exists = true;
        requerants[_requerant] = requerant;
    }

    requerants[_requerant].contracts.push(_contract);
  }
}

`;

export default {
  network: NETWORK,
  abi: ABI,
  compiler: COMPILER,
  smartcontract: SMARTCONTRACT,
  identifier: IDENTIFIER,
}
