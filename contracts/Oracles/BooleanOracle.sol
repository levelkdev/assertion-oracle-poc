pragma solidity ^0.4.24;

import "tidbit-eth/contracts/Oracles/BasicOracle.sol";

contract BooleanOracle is BasicOracle {

  constructor (address _dataSource) public {
    BasicOracle.initialize(_dataSource);
  }

  function boolResult() public view returns (bool) {
    require(isResultSet(0x0), "The result has not been set.");
    return bytesToUint(result) == 1;
  }

  function _setResult(bytes _result) internal {
    require(bytesToUint(_result) == 0 || bytesToUint(_result) == 1, "result must be 0 or 1");
    super._setResult(_result);
  }

  function _setBoolResult(bool _result) internal {
    uint x = _result ? 1 : 0;
    _setResult(uintToBytes(x));
  }

  function bytesToUint(bytes b) private pure returns (uint) {
    uint number;
    for(uint i = 0; i < b.length; i++){
      number = number + uint(b[i]) * (2 ** (8 * (b.length - (i + 1))));
    }
    return number;
  }

  function uintToBytes(uint x) private pure returns (bytes b) {
    b = new bytes(32);
    assembly { mstore(add(b, 32), x) }
  }

}
