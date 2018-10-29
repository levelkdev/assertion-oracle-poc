pragma solidity ^0.4.24;

contract StakeAndBreak {

	mapping(address => uint) public stakes;

	function deposit() public payable {
		stakes[msg.sender] += msg.value;
	}

	function withdraw(uint amount) {
		require(stakes[msg.sender] >= amount);
		require(msg.sender.call.value(amount)());
		stakes[msg.sender] -= amount;
	}

}
