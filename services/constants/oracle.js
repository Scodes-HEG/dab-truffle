const NETWORK = 3;
const ADDRESS = '0x49f532d72d04acbd219cb44e88f9e272d1abdff7';
const COMPILER = '0.5.10+commit.5a6ea5b1.Emscripten.clang';
const ABI = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "_identifier",
        "type": "string"
      },
      {
        "name": "_pointer",
        "type": "address"
      }
    ],
    "name": "write",
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
        "name": "_identifier",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "_pointer",
        "type": "address"
      }
    ],
    "name": "writeRegister",
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
    "inputs": [
      {
        "name": "_identifier",
        "type": "string"
      }
    ],
    "name": "read",
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
pragma solidity ^0.5.10;

contract Oracle {

  address public created_by;

  struct record {
    address created_by;
    address updated_by;
    address pointer;
    bool exists;
  }
  mapping(string => record) internal register;

   event writeRegister(
    string _identifier,
    address _pointer
  );

  constructor () public {
    created_by = msg.sender;
  }

  function write(string memory _identifier, address _pointer) public returns (bool) {

      address creator = msg.sender;
      if (register[_identifier].exists) {
          creator = register[_identifier].created_by;
      }
      register[_identifier] = record({pointer: _pointer, exists: true, updated_by: msg.sender, created_by: creator});
      emit writeRegister(_identifier, _pointer);

      return true;
  }

  function read(string memory _identifier) public view returns (address) {
        require(register[_identifier].exists, "This record is empty");

        return register[_identifier].pointer;
  }
}
`;

export default {
  network: NETWORK,
  address: ADDRESS,
  abi: ABI,
  compiler: COMPILER,
  smartcontract: SMARTCONTRACT
}
