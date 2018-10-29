pragma solidity ^0.4.24;

import "../../contracts/IAssertionTracker.sol";

contract MockAssertionTracker is IAssertionTracker {

  mapping(bytes32 => address) public failedAssertionSenders;

  function newAsserter() public { }

  function setAssertionFailed(bytes32 assertion, address sender) public {
    failedAssertionSenders[assertion] = sender;
  }

  function isAsserter(address asserter) public view returns (bool) {
    return true;
  }

  function assertionPassing(bytes32 assertion) public view returns (bool) {
    return failedAssertionSenders[assertion] == 0x0;
  }

}
