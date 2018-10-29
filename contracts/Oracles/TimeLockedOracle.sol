pragma solidity ^0.4.24;

import "tidbit-eth/contracts/Oracles/BasicOracle.sol";

contract TimeLockedOracle is BasicOracle {

  uint public unlockTime;

  constructor (uint _unlockTime, address _dataSource) public {
    require(_unlockTime > now);
    BasicOracle.initialize(_dataSource);
    unlockTime = _unlockTime;
  }

  function _setResult(bytes _result) internal {
    require(unlockTime <= now);
    super._setResult(_result);
  }

}
