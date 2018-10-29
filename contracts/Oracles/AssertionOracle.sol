pragma solidity ^0.4.24;

import "../IAssertionTracker.sol";
import "./TimeLockedOracle.sol";
import "./BooleanOracle.sol";

contract AssertionOracle is TimeLockedOracle, BooleanOracle {

  IAssertionTracker public assertionTracker;
  bytes32 public assertion;

  constructor (
    IAssertionTracker _assertionTracker,
    bytes32 _assertion,
    uint _unlockTime
  )
    public
    TimeLockedOracle(_unlockTime, 0x0)
    BooleanOracle(0x0)
  {
    assertion = _assertion;
    assertionTracker = _assertionTracker;
  }

  function setResult(bytes _result) public {
    // ignores _result, gets it from assertionTracker instead
    _setBoolResult(assertionTracker.assertionPassing(assertion));
  }

  function assertionPassed() public view returns (bool) {
    return boolResult();
  }

}
