import { ethers } from "hardhat";

type DeployArgs = {
  token: string;
};

async function main() {
  const { token } = parseArgs();
  const factoryFactory = await ethers.getContractFactory("IntelPoolFactory");
  const factory = await factoryFactory.deploy(token);
  await factory.waitForDeployment();

  console.log(`IntelPoolFactory deployed at ${await factory.getAddress()}`);
}

function parseArgs(): DeployArgs {
  const token = process.env.USDC_ADDRESS;
  if (!token) {
    throw new Error("USDC_ADDRESS env variable must be set");
  }
  return { token };
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
