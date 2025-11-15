// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract IntelPool is ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;
    address public immutable creator;
    uint256 public immutable priceThreshold;
    uint256 public immutable deadline;

    string public uri;
    bytes32 public contentHash;

    bool public unlocked;
    bool public withdrawn;
    uint256 public totalRaised;

    mapping(address => uint256) public contributions;

    event Contributed(address indexed buyer, uint256 amount, uint256 totalRaised);
    event Unlocked(uint256 at, uint256 totalRaised);
    event Withdrawn(address indexed to, uint256 amount);
    event Refunded(address indexed to, uint256 amount);
    event UriUpdated(string newUri);

    constructor(
        address _token,
        address _creator,
        uint256 _priceThreshold,
        uint256 _deadline,
        string memory _uri,
        bytes32 _contentHash
    ) {
        require(_token != address(0), "token required");
        require(_creator != address(0), "creator required");
        require(_priceThreshold > 0, "threshold zero");
        require(_deadline > block.timestamp, "deadline past");

        token = IERC20(_token);
        creator = _creator;
        priceThreshold = _priceThreshold;
        deadline = _deadline;
        uri = _uri;
        contentHash = _contentHash;
    }

    function contribute(uint256 amount) external nonReentrant {
        require(block.timestamp < deadline, "expired");
        require(!unlocked, "already unlocked");
        require(amount > 0, "amount zero");

        token.safeTransferFrom(msg.sender, address(this), amount);

        contributions[msg.sender] += amount;
        totalRaised += amount;

        emit Contributed(msg.sender, amount, totalRaised);

        if (totalRaised >= priceThreshold) {
            unlocked = true;
            emit Unlocked(block.timestamp, totalRaised);
        }
    }

    function isUnlocked() external view returns (bool) {
        return unlocked;
    }

    function canDecrypt(address user) external view returns (bool) {
        return unlocked && contributions[user] > 0;
    }

    function setUri(string calldata newUri) external {
        require(msg.sender == creator, "only creator");
        require(!unlocked, "already unlocked");
        uri = newUri;
        emit UriUpdated(newUri);
    }

    function withdraw() external nonReentrant {
        require(unlocked, "not unlocked");
        require(!withdrawn, "withdrawn");

        uint256 balance = token.balanceOf(address(this));
        withdrawn = true;
        token.safeTransfer(creator, balance);

        emit Withdrawn(creator, balance);
    }

    function refund() external nonReentrant {
        require(block.timestamp >= deadline, "not expired");
        require(!unlocked, "already unlocked");

        uint256 amount = contributions[msg.sender];
        require(amount > 0, "no contribution");

        contributions[msg.sender] = 0;
        totalRaised -= amount;
        token.safeTransfer(msg.sender, amount);

        emit Refunded(msg.sender, amount);
    }
}
