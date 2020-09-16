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
