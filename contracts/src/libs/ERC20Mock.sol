// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";

contract USDCMock is ERC20Mock {
    constructor(address initialHolder, uint256 initialSupply)
        ERC20Mock("USD Coin", "USDC", initialHolder, initialSupply)
    {}
}
