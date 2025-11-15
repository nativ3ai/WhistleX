import { expect } from "chai";
import { ethers } from "hardhat";

describe("IntelPoolFactory", () => {
  it("deploys pools", async () => {
    const [deployer] = await ethers.getSigners();
    const Mock = await ethers.getContractFactory("USDCMock");
    const usdc = await Mock.deploy(await deployer.getAddress(), ethers.parseUnits("1000", 6));
    await usdc.waitForDeployment();

    const Factory = await ethers.getContractFactory("IntelPoolFactory");
    const factory = await Factory.deploy(await usdc.getAddress());
    await factory.waitForDeployment();

    const now = BigInt(Math.floor(Date.now() / 1000));
    const tx = await factory.createPool(
      await usdc.getAddress(),
      ethers.parseUnits("100", 6),
      now + 3600n,
      "https://placeholder",
      ethers.ZeroHash,
      "Test Pool"
    );
    const receipt = await tx.wait();
    const event = receipt?.logs?.find((log) => log.fragment?.name === "PoolCreated");

    expect(event).to.not.equal(undefined);
  });
});
