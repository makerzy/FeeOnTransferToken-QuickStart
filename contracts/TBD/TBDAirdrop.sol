// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "../access/Ownable.sol";
import "../libraries/SafeERC20.sol";
import "../libraries/SignatureHelper.sol";

contract MoonKingClaim is Ownable {
    /**
     * GitHub         https://github.com/makerzy
     * Twitter        https://twitter.com/makerz_dev
     * Telegram       https://t.me/@mayboyo2
     */

    using SafeERC20 for IERC20;

    bytes32 public immutable DOMAIN_SEPARATOR;
    mapping(address => mapping(uint256 => bool)) public usedNonce; // token => uint256 => true
    mapping(address => mapping(address => bool)) public claimed; // user => token => true
    mapping(address => bool) public claimable; // claimable token => bool
    mapping(address => uint256) public balanceClaimable; // available balance of a claimable token

    address public authSigner;

    bytes32 public constant DOMAIN_TYPEHASH =
        keccak256(
            "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
        );

    bytes32 public constant CLAIM_AIRDROP_TYPEHASH =
        keccak256(
            "ClaimAirdrop(address account,uint256 amount,address token,uint256 nonce)"
        );

    constructor(address _authSigner) {
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                DOMAIN_TYPEHASH,
                keccak256(bytes("Airdrop")),
                keccak256(bytes("1.0.1")),
                block.chainid,
                address(this)
            )
        );

        authSigner = _authSigner;
    }

    function updateSigner(address signatory) external {
        onlyOwner();
        authSigner = signatory;
    }

    event AddClaimable(address token, uint256 amount);

    function addClaimableToken(
        address _token,
        uint256 supply,
        bool state
    ) external {
        onlyOwner();
        if (supply > 0)
            IERC20(_token).safeTransferFrom(msg.sender, address(this), supply);
        claimable[_token] = state;
        balanceClaimable[_token] = supply;
        emit AddClaimable(_token, supply);
    }

    function withdrawToken(address token, uint256 amount) external {
        onlyOwner();
        IERC20(token).safeTransfer(owner(), amount);
    }

    event Claimed(address account, uint256 amount);

    function claimAirdrop(
        address account,
        uint256 amount,
        address token,
        uint256 nonce,
        bytes calldata signature
    ) external {
        bytes32 hashStruct = keccak256(
            abi.encode(CLAIM_AIRDROP_TYPEHASH, account, amount, token, nonce)
        );
        require(
            SignatureHelper.verify(
                owner(),
                DOMAIN_SEPARATOR,
                hashStruct,
                signature
            ) ||
                SignatureHelper.verify(
                    authSigner,
                    DOMAIN_SEPARATOR,
                    hashStruct,
                    signature
                ),
            "invalid sig"
        );
        require(
            !usedNonce[token][nonce] && !claimed[account][token],
            "used nonce|claimed|!claimable"
        );
        require(
            claimable[token] && balanceClaimable[token] >= amount,
            "!claimable"
        );
        usedNonce[token][nonce] = claimed[account][token] = true;
        balanceClaimable[token] -= amount;
        IERC20(token).safeTransfer(account, amount);
        emit Claimed(account, amount);
    }
}
