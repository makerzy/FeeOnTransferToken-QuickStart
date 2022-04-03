import { ethers } from "hardhat";
const { BigNumber } = ethers;

export const expandTo18 = (num: any) =>
  BigNumber.from(num).mul(BigNumber.from(10).pow(18));
export const expandToPowers = (num: any, pow: number) =>
  BigNumber.from(num).mul(BigNumber.from(10).pow(pow));
