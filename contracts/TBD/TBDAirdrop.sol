// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "../access/Ownable.sol";
import "../libraries/SafeERC20.sol";
import "../libraries/SignatureHelper.sol";

contract MoonKingClaim is Ownable{

    using SafeERC20 for IERC20;

    bytes32 public immutable DOMAIN_SEPARATOR;
    IERC20 public token;
    mapping(uint256 =>bool) public usedNonce;
    mapping(address => mapping(address=>bool)) public claimed; // user => token => true
        
    bytes32 public constant DOMAIN_TYPEHASH =keccak256(
            "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
        );
        
    bytes32 public constant CLAIM_AIRDROP_TYPEHASH = keccak256(
            "ClaimAirdrop(address account,uint256 amount,uint256 nonce)"
            );

    constructor(IERC20 _token){
        DOMAIN_SEPARATOR = keccak256(
                abi.encode(
                    DOMAIN_TYPEHASH,
                    keccak256(bytes("Airdrop")),
                    keccak256(bytes("1.0.1")),
                    block.chainid,
                    address(this)
                )
            );
        token= _token;
    }

    function setClaimableToken(IERC20 _token) external{
        onlyOwner();
        token= _token;
    }

    function withdrawLeftover()external {
        onlyOwner();
        token.safeTransfer(owner(), token.balanceOf(address(this)));
    }

    event Claimed(address account, uint256 amount);
    function claimAirdrop(address account, uint256 amount,uint256 nonce,bytes calldata signature) external {
        bytes32 hashStruct = keccak256(abi.encode(CLAIM_AIRDROP_TYPEHASH, account, amount, nonce));
        require(SignatureHelper.verify(owner(), DOMAIN_SEPARATOR, hashStruct,signature),"invalid sig");
        require(!usedNonce[nonce] && !claimed[account][address(token)], "used nonce or claimed");
        usedNonce[nonce] = claimed[account][address(token)] = true;
        token.safeTransfer(account, amount);
        emit Claimed(account, amount);
    }

}
