pragma solidity ^0.4.24;

import "./IAssertionTracker.sol";

contract AssertionTracker is IAssertionTracker {

  mapping(address => bool) asserters;
  mapping(bytes32 => address) failedAssertionSenders;

  function newAsserter() public;

  modifier onlyAsserter() {
    require(isAsserter(msg.sender));
    _;
  }

  function setAssertionFailed(bytes32 assertion, address sender) public onlyAsserter {
    failedAssertionSenders[assertion] = sender;
  }

  function isAsserter(address asserter) public view returns (bool) {
    return asserters[asserter];
  }

  function assertionPassing(bytes32 assertion) public view returns (bool) {
    return failedAssertionSenders[assertion] == 0x0;
  }

}
