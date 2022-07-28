import hre from "hardhat";
import { expandTo18 } from "../test/utils/bignumber"

async function main() {

  const uni_router ="0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
  const mWallet ="0x0dcf02728f1162eCB512B0D73fc9eE3F57FeeD8E"
  const dWallet ="0x713D8DFc3151F737bA4d1894F547850Af1229Aef"
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
  const MoonKing = await hre.ethers.getContractFactory("MOONKING");
  const moonking = await MoonKing.deploy(uni_router,mWallet,dWallet);
  await moonking.deployed()
  const MoonKingClaim = await hre.ethers.getContractFactory("MoonKingClaim");
  const claimable = await MoonKingClaim.deploy();
  await claimable.deployed(); 
  console.log("Completed deploying")
  const approve = await  moonking.approve(claimable.address, expandTo18(10_000_000));
  console.log("sending transaction")
  await approve.wait()
  const enableTrading =await  moonking.enableTrading();
  await enableTrading.wait()
  console.log("Still sending transaction")
  const excld = await  moonking.excludeFromMaxTransaction(claimable.address,true);
  console.log("Almost done")
  await excld.wait()
  const excldfees = await  moonking.excludeFromFees(claimable.address,true);
  console.log("Just excluded from fees")
  await excldfees.wait()

  await claimable.addClaimableToken(moonking.address, expandTo18(5_000_000), true)
  console.log("All transaction done!")
/* 0x0158e262F936eD52F0C06ed70765581977478F0c */
/* 0xBd2b05C4a3feFD45277EDc6FC11f1D7aCd933f97 */
  console.log("MoonKing deployed to:", `https://rinkeby.etherscan.io/address/${moonking.address}`);
  console.log("MoonKingClaim deployed to:", `https://rinkeby.etherscan.io/address/${claimable.address}`);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
