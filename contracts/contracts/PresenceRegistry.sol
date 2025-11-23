// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PresenceRegistry {
    event PresenceMarked(address indexed by, bytes32 indexed nullifier);

    mapping(bytes32 => bool) public seen;

    function markPresent(bytes32 nullifier) external {
        require(!seen[nullifier], "already marked");
        seen[nullifier] = true;
        emit PresenceMarked(msg.sender, nullifier);
    }
}
