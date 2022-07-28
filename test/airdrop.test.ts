import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { beforeEach, describe } from "mocha";
import { expandToPowers } from "./utils/bignumber";
chai.use(solidity);
let accounts: SignerWithAddress[],
  wallet: SignerWithAddress,
  other0: SignerWithAddress,
  other1: SignerWithAddress,
  other2: SignerWithAddress,
  other3: SignerWithAddress,
  other4: SignerWithAddress,
  other5: SignerWithAddress,
  other6: SignerWithAddress;
let airdrop: Contract, token: Contract;

const domain = (verifyingContract: string) => ({
  name: "Airdrop",
  version: "1.0.1",
  chainId: 31337,
  verifyingContract,
});

const types = {
  ClaimAirdrop: [
    { name: "account", type: "address" },
    { name: "amount", type: "uint256" },
    { name: "token", type: "address" },
    { name: "nonce", type: "uint256" },
  ],
};

describe("Transactions", () => {
  beforeEach("Transaction", async () => {
    accounts = await ethers.getSigners();
    [wallet, other0, other1, other2, other3, other4, other5, other6] = accounts;
    const Airdrop = await ethers.getContractFactory("MoonKingClaim", wallet);
    const Token = await ethers.getContractFactory("TBD", wallet);
    const Router = await ethers.getContractFactory("UniswapV2Router02", wallet);
    const Factory = await ethers.getContractFactory("UniswapV2Factory", wallet);
    const Weth = await ethers.getContractFactory("WETH9", wallet);
    const factory = await Factory.deploy(wallet.address);
    const weth = await Weth.deploy();

    const router = await Router.deploy(factory.address, weth.address);
    token = await Token.deploy(router.address, wallet.address, other0.address);
    airdrop = await Airdrop.deploy();
    await Promise.all([token.deployed(), airdrop.deployed()]);
  });

  describe("Airdrop", async () => {
    it("deploy", async () => {
      expect(await token.owner()).to.equal(wallet.address);
      expect(await airdrop.owner()).to.equal(wallet.address);
    });

    it("Add token, claim, and withdraw", async () => {
      await Promise.all([
        token.approve(airdrop.address, expandToPowers(10, 18)),
        token.transfer(other0.address, expandToPowers(1, 18)),
      ]);
      await expect(
        airdrop
          .connect(other0)
          .addClaimableToken(token.address, expandToPowers(10, 10), true)
      ).to.revertedWith("Ownable: caller is not the owner");
      await expect(
        airdrop.addClaimableToken(token.address, expandToPowers(10, 10), true)
      )
        .to.emit(airdrop, "AddClaimable")
        .withArgs(token.address, expandToPowers(10, 10));

      const value = {
        account: other0.address,
        amount: expandToPowers(1, 10).toString(),
        token: token.address,
        nonce: 1,
      };

      const sig = await wallet._signTypedData(
        domain(airdrop.address),
        types,
        value
      );
      await expect(
        airdrop.claimAirdrop(
          other1.address,
          value.amount,
          value.token,
          value.nonce,
          sig
        )
      ).to.be.revertedWith("invalid sig");
      await token.enableTrading();
      await expect(
        airdrop.claimAirdrop(
          value.account,
          value.amount,
          value.token,
          value.nonce,
          sig
        )
      )
        .to.emit(airdrop, "Claimed")
        .withArgs(value.account, value.amount);
      await expect(
        airdrop.claimAirdrop(
          value.account,
          value.amount,
          value.token,
          value.nonce,
          sig
        )
      ).to.be.revertedWith("used nonce|claimed|!claimable");
      expect(await airdrop.balanceClaimable(token.address)).to.equal(
        expandToPowers(9, 10)
      );
    });
  });
});
