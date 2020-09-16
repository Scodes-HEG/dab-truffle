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
