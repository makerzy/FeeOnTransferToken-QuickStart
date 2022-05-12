import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai from "chai";
import { deployContract, solidity } from "ethereum-waffle";
import { Contract, ethers } from "ethers";
import hre, { waffle } from "hardhat";
import { beforeEach, describe } from "mocha";
import TBDContract from "../artifacts/contracts/TBD/TBDToken.sol/TBD.json";
import FactoryContract from "../artifacts/contracts/Uniswap/Core.sol/UniswapV2Factory.json";
import PairContract from "../artifacts/contracts/Uniswap/Core.sol/UniswapV2Pair.json";
import RouterContract from "../artifacts/contracts/Uniswap/Router.sol/UniswapV2Router02.json";
import WETHContract from "../artifacts/contracts/Uniswap/WETH.sol/WETH9.json";
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

let Factory: Contract,
  Router: Contract,
  Tbd: Contract,
  Weth: Contract,
  Pair: Contract,
  time: string,
  firstPair: string;

const provider = waffle.provider;
beforeEach("Tranx", async () => {
  accounts = await hre.ethers.getSigners();
  [wallet, other0, other1, other2, other3, other4, other5, other6] = accounts;
  Factory = await deployContract(wallet, FactoryContract, [wallet.address]);
  Weth = await deployContract(wallet, WETHContract, []);
  Router = await deployContract(wallet, RouterContract, [
    Factory.address,
    Weth.address,
  ]);
  Tbd = await deployContract(wallet, TBDContract, [
    Router.address,
    wallet.address,
    other0.address,
  ]);
  firstPair = await Factory.getPair(Weth.address, Tbd.address);
  Pair = new ethers.Contract(firstPair, PairContract.abi, wallet);
  time = (Math.floor(new Date().getTime() / 1000.0) + 10).toString();
});

describe("TBD Token", () => {
  /* it("deploy", async () => {
    expect(await Tbd.owner()).to.equal(wallet.address);
    expect(await Tbd.uniswapV2Router()).to.equal(Router.address);
    const firstPair = await Factory.getPair(Weth.address, Tbd.address);
    expect(await Tbd.uniswapV2Pair()).to.equal(firstPair);
    expect(await Router.WETH()).to.equal(Weth.address);
    expect(await Router.factory()).to.equal(Factory.address);
  }); */
  /* it("approves", async () => {
    await expect(Tbd.approve(other1.address, expandTo18(20)))
      .to.emit(Tbd, "Approval")
      .withArgs(wallet.address, other1.address, expandTo18(20));
    await expect(
      Tbd.connect(other1).transferFrom(
        wallet.address,
        other1.address,
        expandTo18(20)
      )
    )
      .to.emit(Tbd, "Transfer")
      .withArgs(wallet.address, other1.address, expandTo18(20));
    expect(await Tbd.balanceOf(other1.address)).to.equal(expandTo18(20));
  }); */
  /* it("transfer", async () => {
    await expect(Tbd.transfer(other1.address, expandTo18(2)))
      .to.emit(Tbd, "Transfer")
      .withArgs(wallet.address, other1.address, expandTo18(2));
    expect(await Tbd.balanceOf(other1.address)).to.equal(expandTo18(2));
  }); */
  /* it("Add liquidity & enable Trading", async () => {
    await Promise.all([
      Tbd.approve(Router.address, expandTo18(1000_000)),
      Router.addLiquidityETH(
        Tbd.address,
        expandTo18(1000_000),
        0,
        0,
        wallet.address,
        time,
        { value: expandTo18(6) }
      ),
      Tbd.enableTrading(),
    ]);
    expect(await Tbd.swapEnabled()).to.be.true;
    expect(await Tbd.tradingActive()).to.be.true;
  }); */
  /* it("swaps, in and out", async () => {
    // console.log("INIT_CODE_PAIR_HASH: ", await Factory.INIT_CODE_PAIR_HASH());
    await Tbd.approve(Router.address, expandTo18(1000_0000));
    await Router.addLiquidityETH(
      Tbd.address,
      expandTo18(1000_000),
      0,
      0,
      wallet.address,
      time,
      { value: expandTo18(6) }
    );
    await expect(
      Router.swapExactETHForTokensSupportingFeeOnTransferTokens(
        0,
        [Weth.address, Tbd.address],
        wallet.address,
        time,
        { value: expandTo18(2) }
      )
    ).to.emit(Pair, "Swap");

    await expect(
      Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
        expandTo18(500),
        10,
        [Tbd.address, Weth.address],
        wallet.address,
        time
      )
    ).to.emit(Pair, "Swap");
  }); */
  /* it("removeLimits", async () => {
    await Tbd.removeLimits();
    expect(await Tbd.limitsInEffect()).to.be.false;
  }); */
  /* it("disable transfer delay", async () => {
    await Tbd.disableTransferDelay();
    expect(await Tbd.transferDelayEnabled()).to.be.false;
  }); */
  /*  it("updateSwapTokensAtAmount", async () => {
    await Tbd.updateSwapTokensAtAmount(expandTo18(840_000));
    expect(await Tbd.swapTokensAtAmount()).to.equal(expandTo18(840_000));
  }); */
  /* it("updateMaxTxnAmount", async () => {
    await Tbd.updateMaxTxnAmount(1_000_000);
    expect(await Tbd.maxTransactionAmount()).to.equal(expandTo18(1_000_000));
  }); */
  /*  it("updateMaxWalletAmount", async () => {
    await Tbd.updateMaxWalletAmount(5_200_000);
    expect(await Tbd.maxWallet()).to.equal(expandTo18(5_200_000));
  }); */
  /*  it("excludeFromMaxTransaction", async () => {
    await Tbd.excludeFromMaxTransaction(other1.address, true);
    expect(await Tbd._isExcludedMaxTransactionAmount(other1.address)).to.be
      .true;
  }); */
  /* it("updateSwapEnabled", async () => {
    await Tbd.updateSwapEnabled(false);
    expect(await Tbd.swapEnabled()).to.be.false;
  }); */
  /* it("updateBuyFees", async () => {
    await Tbd.updateBuyFees(2, 2, 3);
    expect(await Tbd.buyMarketingFee()).to.equal(2);
    expect(await Tbd.buyLiquidityFee()).to.equal(2);
    expect(await Tbd.buyDevFee()).to.equal(3);
    expect(await Tbd.buyTotalFees()).to.equal(7);
  }); */
  /* it("updateSellFees", async () => {
    await Tbd.updateSellFees(2, 2, 3);
    expect(await Tbd.sellMarketingFee()).to.equal(2);
    expect(await Tbd.sellLiquidityFee()).to.equal(2);
    expect(await Tbd.sellDevFee()).to.equal(3);
    expect(await Tbd.sellTotalFees()).to.equal(7);
  }); */
  /* it("setAutomatedMarketMakerPair", async () => {
    await Tbd.setAutomatedMarketMakerPair(other3.address, true);
    expect(await Tbd.automatedMarketMakerPairs(other3.address)).to.be.true;
  }); */
  /*  it("updateMarketingWallet", async () => {
    await Tbd.updateMarketingWallet(other6.address);
    expect(await Tbd.marketingWallet()).to.equal(other6.address);
  }); */
  /*   it("updateDevWallet", async () => {
    await Tbd.updateDevWallet(other6.address);
    expect(await Tbd.devWallet()).to.equal(other6.address);
  }); */
  /* it("isExcludedFromFees", async () => {
    await Tbd.excludeFromFees(other4.address, true);
    expect(await Tbd.isExcludedFromFees(other4.address)).to.be.true;
  }); */
  /*  it("setAutoLPBurnSettings", async () => {
    await Tbd.setAutoLPBurnSettings(1000, 500, true);
    expect(await Tbd.lpBurnFrequency()).to.equal(1000);
    expect(await Tbd.percentForLPBurn()).to.equal(500);
    expect(await Tbd.lpBurnEnabled()).to.be.true;
  }); */
});
