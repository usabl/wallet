pragma solidity ^0.4.16;

contract Counter {
  uint count;

  constructor() public {
    count = 1;
  }

  function increment() public {
    count = count + 1;
  }

  function get() public view returns (uint) {
    return count;
  }
}