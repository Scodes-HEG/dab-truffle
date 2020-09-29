pragma solidity ^0.5.11;

contract ContractRegister {
  function registerContract (address _requerant, address _contract) public {
  }
}

contract Contract {
  address public created_by;
  address public updated_by;
  address public requerant;
  string public hash;
  bool public is_obsolet;
  bool public is_pending;
  ContractRegister internal register;

  constructor (address _register, address _requerant, string memory _hash) public {
    created_by = msg.sender;
    updated_by = msg.sender;
    requerant = _requerant;
    hash = _hash;
    register = ContractRegister(_register);
    register.registerContract(_requerant, address(this));
    is_obsolet = false;
    is_pending = true;
  }

  function updateHash (string memory _hash) public {
    updated_by = msg.sender;
    hash = _hash;
  }

  function setIsObsolet (bool _is_obsolet) public {
    updated_by = msg.sender;
    is_obsolet = _is_obsolet;
  }

  function setIsPending (bool _is_pending) public {
    updated_by = msg.sender;
    is_pending = _is_pending;
  }
}
