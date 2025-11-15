// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IntelPool} from "./IntelPool.sol";

contract IntelPoolFactory {
    event PoolCreated(
        address indexed pool,
        address indexed creator,
        address token,
        uint256 priceThreshold,
        uint256 deadline,
        string uri,
        bytes32 contentHash,
        string title
    );

    address public immutable baseToken;

    constructor(address _baseToken) {
        baseToken = _baseToken;
    }

    function createPool(
        address token,
        uint256 priceThreshold,
        uint256 deadline,
        string calldata uri,
        bytes32 contentHash,
        string calldata title
    ) external returns (address pool) {
        require(token != address(0), "token required");
        require(priceThreshold > 0, "threshold zero");
        require(deadline > block.timestamp, "deadline past");
        require(bytes(uri).length > 0, "uri required");
        require(bytes(title).length > 0, "title required");

        IntelPool intelPool = new IntelPool(
            token,
            msg.sender,
            priceThreshold,
            deadline,
            uri,
            contentHash
        );

        emit PoolCreated(
            address(intelPool),
            msg.sender,
            token,
            priceThreshold,
            deadline,
            uri,
            contentHash,
            title
        );

        return address(intelPool);
    }
}
