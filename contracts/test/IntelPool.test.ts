import { expect } from "chai";
import { ethers } from "hardhat";
import type { Contract } from "ethers";

describe("IntelPool", () => {
  let usdc: Contract;
  let pool: Contract;
  let creator: string;
  let contributor: string;

  beforeEach(async () => {
    const [creatorSigner, contributorSigner] = await ethers.getSigners();
    creator = await creatorSigner.getAddress();
    contributor = await contributorSigner.getAddress();

    const Mock = await ethers.getContractFactory("USDCMock");
    usdc = await Mock.deploy(creator, ethers.parseUnits("1000", 6));
    await usdc.waitForDeployment();

    const IntelPool = await ethers.getContractFactory("IntelPool");
    const now = BigInt(Math.floor(Date.now() / 1000));
    pool = await IntelPool.deploy(
      await usdc.getAddress(),
      creator,
      ethers.parseUnits("100", 6),
      now + 3600n,
      "https://placeholder",
      ethers.ZeroHash
    );
    await pool.waitForDeployment();
  });

  it("accepts contributions and unlocks", async () => {
    const [, contributorSigner] = await ethers.getSigners();
    await usdc.connect(contributorSigner).approve(pool, ethers.parseUnits("100", 6));
    await expect(pool.connect(contributorSigner).contribute(ethers.parseUnits("100", 6)))
      .to.emit(pool, "Unlocked");

    expect(await pool.unlocked()).to.equal(true);
    expect(await pool.canDecrypt(contributor)).to.equal(true);
  });

  it("allows refunds after deadline if locked", async () => {
    const [, contributorSigner] = await ethers.getSigners();
    await usdc.connect(contributorSigner).approve(pool, ethers.parseUnits("10", 6));
    await pool.connect(contributorSigner).contribute(ethers.parseUnits("10", 6));

    await ethers.provider.send("evm_increaseTime", [7200]);
    await ethers.provider.send("evm_mine", []);

    await expect(pool.connect(contributorSigner).refund()).to.emit(pool, "Refunded");
  });
});
