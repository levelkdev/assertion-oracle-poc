pragma solidity ^0.4.24;

import "./StakeAndBreakAsserter.sol";
import "./BadBoy.sol";

contract BadBoyAssertionBreaker is BadBoy {

  StakeAndBreakAsserter stakeAndBreakAsserter;

  constructor (
    StakeAndBreak _stakeAndBreak,
    uint _withdrawAmount
  ) 
    public
    payable
    BadBoy(_stakeAndBreak, _withdrawAmount)
  {
    stakeAndBreakAsserter = StakeAndBreakAsserter(_stakeAndBreak);
  }

  function assertWithdrawTransfersExpectedAmount(uint withdrawAmount) public {
    stakeAndBreakAsserter.assertWithdrawTransfersExpectedAmount(withdrawAmount);
  }

}
