const NETWORK = 3;
const IDENTIFIER = 'dab';
// const ADDRESS = '0x3b5cf6b6eed1c436bbcbde4127ba523b709ec1a0';
const COMPILER = '0.5.9+commit.e560f70d.Emscripten.clang';
const ABI = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "_hash",
        "type": "string"
      }
    ],
    "name": "acceptProposal",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_newHash",
        "type": "string"
      }
    ],
    "name": "addProposal",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_currentHash",
        "type": "string"
      },
      {
        "name": "_newHash",
        "type": "string"
      }
    ],
    "name": "updateHash",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
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
    "inputs": [
      {
        "indexed": false,
        "name": "hash",
        "type": "string"
      }
    ],
    "name": "hashUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "hash",
        "type": "string"
      }
    ],
    "name": "newProposal",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "hash",
        "type": "string"
      }
    ],
    "name": "proposalAccepted",
    "type": "event"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "created_by",
    "outputs": [
      {
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
    "name": "currentHash",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "numberOfProposals",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
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
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "proposalIds",
    "outputs": [
      {
        "name": "",
        "type": "string"
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
pragma solidity ^0.5.9;

contract Shared_Table {

  address public created_by;
  address public updated_by;
  string public currentHash;

  struct proposal {
    address proposer;
    bool exists;
    string previousHash;
  }
  mapping(string => proposal) internal proposals;
  string[] public proposalIds;

  event hashUpdated(
    string hash
  );

  event newProposal(
    string hash
  );

  event proposalAccepted(
    string hash
  );

  constructor () public {
    created_by = msg.sender;
  }

  //// To accept a proposal
  function acceptProposal(string memory _hash) public returns (bool) {
    require(proposals[_hash].exists, "This proposal doesn't exist");
    //require(proposals[_hash].proposer != msg.sender, "You can't accept your own proposal");
    require(keccak256(abi.encodePacked(proposals[_hash].previousHash)) == keccak256(abi.encodePacked(currentHash)), "You can't accept an out of date proposal !");

    emit proposalAccepted(_hash);

    bool updated = updateHash(proposals[_hash].previousHash, _hash);
    if (updated) {
        delete proposalIds;
    }

    return true;
  }

  //// To add a new proposal
  function addProposal(string memory _newHash) public returns (bool) {
    require(!(proposals[_newHash].exists && keccak256(abi.encodePacked(proposals[_newHash].previousHash)) == keccak256(abi.encodePacked(currentHash))), "This proposal already exist");

    proposals[_newHash] = proposal({proposer: msg.sender, exists: true, previousHash: currentHash});
    proposalIds.push(_newHash);

    emit newProposal(_newHash);

    return true;
  }

  function numberOfProposals() public view returns (uint) {
      uint arrayLength = proposalIds.length;

      return arrayLength;
  }

  //// To update a the current hash without the proposal part
  function updateHash(string memory _currentHash, string memory _newHash) public returns (bool) {
    require(keccak256(abi.encodePacked(_currentHash)) == keccak256(abi.encodePacked(currentHash)), "Your current version is not up-to-date, concurrency problem ?");

    currentHash = _newHash;
    updated_by = msg.sender;
    emit hashUpdated(currentHash);

    return true;
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
