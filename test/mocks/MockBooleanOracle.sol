pragma solidity ^0.4.24;

import "../../contracts/Oracles/BooleanOracle.sol";

contract MockBooleanOracle is BooleanOracle {

  constructor (address _dataSource) public BooleanOracle(_dataSource) { }

  function setBoolResult(bool _result) public {
    _setBoolResult(_result);
  }

}
