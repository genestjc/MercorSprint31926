// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@thirdweb-dev/contracts/base/ERC721Base.sol";
import "@thirdweb-dev/contracts/extension/PermissionsEnumerable.sol";

/**
 * @title MembershipPass
 * @notice NYT/WaPo-style recurring membership, on-chain.
 *
 *   • One non-transferable ERC-721 per reader (soulbound).
 *   • Each token carries an `expiresAt` timestamp.
 *   • Stripe's `invoice.paid` webhook calls `extend(tokenId, 30 days)`
 *     via a backend wallet holding MINTER_ROLE.
 *   • Paywall checks `isActive(reader)` — a single on-chain read.
 *
 *   No users table. The chain is the subscription ledger.
 *   Conforms to the spirit of ERC-5643 (Subscription NFT).
 */
contract MembershipPass is ERC721Base, PermissionsEnumerable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// seconds added per billing cycle — 30 days
    uint64 public constant PERIOD = 30 days;

    /// tokenId => unix expiry
    mapping(uint256 => uint64) public expiresAt;

    /// wallet => tokenId (0 = none). One pass per wallet.
    mapping(address => uint256) public passOf;

    event SubscriptionUpdate(uint256 indexed tokenId, uint64 expiresAt);

    constructor(
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    ) ERC721Base(_defaultAdmin, _name, _symbol, _royaltyRecipient, _royaltyBps) {
        _setupRole(DEFAULT_ADMIN_ROLE, _defaultAdmin);
        _setupRole(MINTER_ROLE, _defaultAdmin);
    }

    /* -------------------------------------------------------- */
    /*  Mint / extend                                           */
    /* -------------------------------------------------------- */

    /// @notice Mint a new pass and grant the first period.
    /// Called once per reader — subsequent cycles use `extend`.
    function mintPass(address to) external onlyRole(MINTER_ROLE) returns (uint256 id) {
        require(passOf[to] == 0, "already has pass");
        id = nextTokenIdToMint();
        _safeMint(to, 1);
        passOf[to] = id;
        _extend(id, PERIOD);
    }

    /// @notice Extend an existing pass by one period.
    /// Stripe webhook calls this on every `invoice.paid`.
    function extend(uint256 tokenId) external onlyRole(MINTER_ROLE) {
        require(_exists(tokenId), "no such pass");
        _extend(tokenId, PERIOD);
    }

    /// @notice Mint if the wallet has no pass, otherwise extend. Idempotent.
    function grantPeriod(address to) external onlyRole(MINTER_ROLE) {
        uint256 id = passOf[to];
        if (id == 0) {
            id = nextTokenIdToMint();
            _safeMint(to, 1);
            passOf[to] = id;
        }
        _extend(id, PERIOD);
    }

    function _extend(uint256 tokenId, uint64 secs) internal {
        uint64 current = expiresAt[tokenId];
        uint64 base = current > block.timestamp ? current : uint64(block.timestamp);
        uint64 next = base + secs;
        expiresAt[tokenId] = next;
        emit SubscriptionUpdate(tokenId, next);
    }

    /* -------------------------------------------------------- */
    /*  Reads — what the paywall calls                          */
    /* -------------------------------------------------------- */

    function isActive(address holder) external view returns (bool) {
        uint256 id = passOf[holder];
        return id != 0 && expiresAt[id] > block.timestamp;
    }

    function expiresAtFor(address holder) external view returns (uint64) {
        return expiresAt[passOf[holder]];
    }

    /* -------------------------------------------------------- */
    /*  Soulbound — block transfers                             */
    /* -------------------------------------------------------- */

    function _beforeTokenTransfers(
        address from,
        address to,
        uint256 startId,
        uint256 qty
    ) internal virtual override {
        // allow mint (from == 0) and burn (to == 0), block wallet-to-wallet
        require(from == address(0) || to == address(0), "soulbound");
        super._beforeTokenTransfers(from, to, startId, qty);
    }
}
