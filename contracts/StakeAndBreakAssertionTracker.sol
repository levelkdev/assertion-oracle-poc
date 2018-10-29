pragma solidity ^0.4.24;

import "./AssertionTracker.sol";
import "./StakeAndBreakAsserter.sol";

contract StakeAndBreakAssertionTracker is AssertionTracker {

  function newAsserter() public {
    address asserter = address(new StakeAndBreakAsserter(this));
    asserters[asserter] = true;
    emit AsserterCreated(asserter);
  }

}
