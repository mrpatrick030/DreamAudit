// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Treasury {
    address public owner;

    event Received(address indexed from, uint256 amount);
    event Withdrawn(address indexed to, uint256 amount);

    constructor(address _owner) {
        owner = _owner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    // Receive fees
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    fallback() external payable {
        emit Received(msg.sender, msg.value);
    }

    // Withdraw funds from treasury
    function withdraw(uint256 amount, address payable to) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        (bool success, ) = to.call{value: amount}("");
        require(success, "Transfer failed");
        emit Withdrawn(to, amount);
    }

    // Update owner
    function setOwner(address _newOwner) external onlyOwner {
        owner = _newOwner;
    }

    // Check balance
    function balance() external view returns (uint256) {
        return address(this).balance;
    }
}