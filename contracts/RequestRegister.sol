pragma solidity ^0.5.11;
pragma experimental ABIEncoderV2;

contract RequestRegister {

  event registerHasChanged(
  );

  address public created_by;
  address public updated_by;

  enum RequestStatus { Pending, Accepted, Refused }

  struct Request {
    address request_address;
    bool exists;
    RequestStatus status;
  }

  struct Requerant {
    address requerant_address;
    bool exists;
    mapping(address => Request) requests;
    address[] requests_addresses;
  }

  mapping(address => Requerant) public requerants;
  address[] public requerants_addresses;

  constructor () public {
    created_by = msg.sender;
    updated_by = msg.sender;
  }

  function setRequestStatus (address _requerantAddress, address _requestAddress, RequestStatus _status) public {
    require(isRequestExists(_requerantAddress,_requestAddress), "Request already exists");
    requerants[_requerantAddress].requests[_requestAddress].status = _status;
    emit registerHasChanged();
  }

  function registerRequest (address _requerantAddress, address _requestAddress) public {
    require(!isRequestExists(_requerantAddress,_requestAddress), "Request already exists");

    updated_by = msg.sender;
    if (!requerants[_requerantAddress].exists) {
      Requerant memory requerant;
      requerant.requerant_address = _requerantAddress;
      requerant.exists = true;
      requerant.requests_addresses = new address[](0);
      requerants[_requerantAddress] = requerant;
      requerants_addresses.push(_requerantAddress);
    }

    Request memory request;
    request.request_address = _requestAddress;
    request.exists = true;
    request.status = RequestStatus.Pending;

    requerants[_requerantAddress].requests[_requestAddress] = request;
    requerants[_requerantAddress].requests_addresses.push(_requestAddress);
    emit registerHasChanged();
  }

  function isRequestExists (address _requerantAddress, address _requestAddress) public view returns (bool) {
    if (!requerants[_requerantAddress].exists) {
      return false;
    }
    if (!requerants[_requerantAddress].requests[_requestAddress].exists) {
      return false;
    }

    return true;
  }

  function getRequests (address _requerantAddress) public view returns (address[][3] memory){
    require(requerants[_requerantAddress].exists, "Requerant doesn't exist");

    uint arrayLength = requerants[_requerantAddress].requests_addresses.length;

    uint pendingIndex = 0;
    uint acceptedIndex = 0;
    uint refusedIndex = 0;

    for (uint i = 0; i < arrayLength; i++) {
      address requestAddress = requerants[_requerantAddress].requests_addresses[i];
      Request memory request = requerants[_requerantAddress].requests[requestAddress];

      if (request.status == RequestStatus.Pending) {
          pendingIndex++;
      } else if (request.status == RequestStatus.Accepted) {
          acceptedIndex++;
      } else if (request.status == RequestStatus.Refused) {
          refusedIndex++;
      }
    }

    address[] memory pending = new address[](pendingIndex);
    address[] memory accepted = new address[](acceptedIndex);
    address[] memory refused = new address[](refusedIndex);
    pendingIndex = 0;
    acceptedIndex = 0;
    refusedIndex = 0;

    for (uint i = 0; i < arrayLength; i++) {
      address requestAddress = requerants[_requerantAddress].requests_addresses[i];
      Request memory request = requerants[_requerantAddress].requests[requestAddress];

      if (request.status == RequestStatus.Pending) {
          pending[pendingIndex] = requestAddress;
          pendingIndex++;
      } else if (request.status == RequestStatus.Accepted) {
          accepted[acceptedIndex] = requestAddress;
          acceptedIndex++;
      } else if (request.status == RequestStatus.Refused) {
          refused[refusedIndex] = requestAddress;
          refusedIndex++;
      }
    }

    return [pending, accepted, refused];
  }
}
