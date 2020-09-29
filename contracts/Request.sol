import "./RequestRegister.sol";

contract Request {
  address public created_by;
  address public updated_by;
  address public requerant;
  string public hash;
  RequestRegister internal register;

  constructor (address _register, address _requerant, string memory _hash) public {
    created_by = msg.sender;
    updated_by = msg.sender;
    requerant = _requerant;
    hash = _hash;
    register = RequestRegister(_register);
    register.registerRequest(_requerant, address(this));
  }

  function updateHash (string memory _hash) public {
    updated_by = msg.sender;
    hash = _hash;
  }

  function setStatus (RequestRegister.RequestStatus _status) public {
    register.setRequestStatus(requerant, address(this), _status);
  }
}
