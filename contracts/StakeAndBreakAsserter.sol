pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./IAssertionTracker.sol";
import "./StakeAndBreak.sol";

contract StakeAndBreakAsserter is StakeAndBreak {
  using SafeMath for uint;

  address public depositIncrementsSenderBalance_FailedAssertionSender;

  IAssertionTracker assertionTracker;

  constructor (IAssertionTracker _assertionTracker) public {
    assertionTracker = _assertionTracker;
  }

  event AssertDepositIncrementsSenderBalance(bool passed, address sender, uint value, uint initialBalance, uint finalBalance);

  event AssertWithdrawTransfersExpectedAmount(bool passed, address sender, uint withdrawAmount, uint initialBalance, uint finalBalance);

  function assertDepositIncrementsSenderBalance()
    public
    payable
    returns (bool passed)
  {
    passed = true;
    uint initialBalance = stakes[msg.sender];
    deposit();
    uint finalBalance = stakes[msg.sender];
    if (finalBalance < initialBalance || finalBalance.sub(initialBalance) != msg.value) {
      assertionTracker.setAssertionFailed(keccak256("assertDepositIncrementsSenderBalance"), msg.sender);
      passed = false;
    }
    emit AssertDepositIncrementsSenderBalance(passed, msg.sender, msg.value, initialBalance, finalBalance);
  }

  function assertWithdrawTransfersExpectedAmount(uint withdrawAmount)
    public
    returns (bool passed)
  {
    passed = true;
    uint initialBalance = this.balance;
    withdraw(withdrawAmount);
    uint finalBalance = this.balance;
    if (initialBalance.sub(finalBalance) != withdrawAmount) {
      assertionTracker.setAssertionFailed(keccak256("assertWithdrawTransfersExpectedAmount"), msg.sender);
      passed = false;
    }
    emit AssertWithdrawTransfersExpectedAmount(passed, msg.sender, withdrawAmount, initialBalance, finalBalance);
  }

}
