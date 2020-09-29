const NETWORK = 3;
const IDENTIFIER = 'admins';
// const ADDRESS = '0xc6e22856a730faa6d5e314c51b006dea0a3cdcc2';
const COMPILER = '0.5.11';
const ABI = [
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "removeAdmin",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "isAdmin",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "string",
        "name": "_oldHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_newHash",
        "type": "string"
      }
    ],
    "name": "updateHash",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "addAdmin",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
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
    "inputs": [],
    "name": "numberOfAdmin",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "requestHash",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "string",
        "name": "_oldHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_newHash",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "addAdminAndUpdateHash",
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
    "anonymous": false,
    "inputs": [],
    "name": "listUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "hash",
        "type": "string"
      }
    ],
    "name": "hashUpdated",
    "type": "event"
  }
];

const SMARTCONTRACT = `
pragma solidity ^0.5.10;

contract Admins {

  address public created_by;
  string public requestHash;
  int public numberOfAdmin;

  struct user {
    bool is_admin;
  }
  mapping(address => user) internal admins;

  event listUpdated();

  event hashUpdated(
    string hash
  );

  constructor () public {
    created_by = msg.sender;
    admins[created_by] = user({is_admin: true});
    numberOfAdmin++;
  }

  function addAdmin(address _user) public {
    require(admins[msg.sender].is_admin, "Call is not an admin, only admins can add admins");
    require(!admins[_user].is_admin, "User already an admin");

    admins[_user] = user({is_admin: true});
    numberOfAdmin++;
    emit listUpdated();
  }

  function removeAdmin(address _user) public {
    require(admins[msg.sender].is_admin, "Current user is not an admin, only admins can remove admins");
    require(admins[_user].is_admin, "User is not an admin");
    require(numberOfAdmin > 1, "If you remove this admin there won't be any admin left !");

    admins[_user] = user({is_admin: false});
    numberOfAdmin--;
    emit listUpdated();
  }

  function isAdmin(address _user) public view returns (bool) {
    if (!admins[_user].is_admin) {
      return false;
    }

    return true;
  }

  function updateHash(string memory _oldHash, string memory _newHash) public {
    require(keccak256(abi.encodePacked(_oldHash)) == keccak256(abi.encodePacked(requestHash)), "Problem of list synchronoicity, you don't have the last version and maybe writing on new changes");
    requestHash = _newHash;
    emit hashUpdated(requestHash);
  }

  function addAdminAndUpdateHash(string memory _oldHash, string memory _newHash, address _user) public {
    updateHash(_oldHash, _newHash);
    addAdmin(_user);
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
