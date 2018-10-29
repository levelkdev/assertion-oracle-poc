pragma solidity ^0.4.24;

interface IAssertionTracker {
  event AssertionFailed(bytes32 assertion, address sender);
  event AsserterCreated(address asserter);
  function newAsserter() public;
  function setAssertionFailed(bytes32 assertion, address sender);
  function isAsserter(address asserter) public view returns (bool);
  function assertionPassing(bytes32 assertion) public view returns (bool);
}
