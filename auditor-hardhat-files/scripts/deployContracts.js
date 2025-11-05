const hre = require("hardhat");

async function main() {
  console.log("\n🚀 Starting DreamAudit + Treasury Deployment...\n");

  // STEP 1: SET DEPLOYER
  const [deployer] = await hre.ethers.getSigners();

  console.log("👤 Deployer:", deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "native token\n");

  // STEP 2: SET PARAMETERS
  const SYSTEM_WALLET = "0x82aD97bEf0b7E17b1D30f56e592Fc819E1eeDAfc";
  const FEE = hre.ethers.parseEther("0.1"); // Example fee = 0.1 native token (STT)

  console.log("⚙️ Deployment Parameters:");
  console.log("   System Wallet:", SYSTEM_WALLET);
  console.log("   Audit Fee:", hre.ethers.formatEther(FEE), "native token\n");

  // STEP 3: DEPLOY TREASURY
  console.log("🏦 Deploying Treasury...");
  const Treasury = await hre.ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy(SYSTEM_WALLET);
  await treasury.waitForDeployment();
  const TREASURY_ADDRESS = await treasury.getAddress();
  console.log("✅ Treasury deployed at:", TREASURY_ADDRESS);

  // STEP 4: DEPLOY DREAMAUDIT
  console.log("\n📜 Deploying DreamAudit...");
  const DreamAudit = await hre.ethers.getContractFactory("DreamAudit");
  const dreamAudit = await DreamAudit.deploy(SYSTEM_WALLET, TREASURY_ADDRESS, FEE);
  await dreamAudit.waitForDeployment();
  const DREAM_AUDIT_ADDRESS = await dreamAudit.getAddress();
  console.log("✅ DreamAudit deployed at:", DREAM_AUDIT_ADDRESS);

  // STEP 5: VERIFY DEPLOYMENT VALUES
  console.log("\n🔍 Verifying on-chain configuration...");
  const onChainSystem = await dreamAudit.systemWallet();
  const onChainTreasury = await dreamAudit.treasury();
  const onChainFee = await dreamAudit.fee();
  const treasuryOwner = await treasury.owner();

  console.log("\n✅ Verification Results:");
  console.log("----------------------------");
  console.log("DreamAudit.systemWallet: ", onChainSystem);
  console.log("DreamAudit.treasury:     ", onChainTreasury);
  console.log("DreamAudit.fee:          ", hre.ethers.formatEther(onChainFee), "native token");
  console.log("Treasury.owner:          ", treasuryOwner);
  console.log("----------------------------");

  if (
    onChainSystem === SYSTEM_WALLET &&
    onChainTreasury === TREASURY_ADDRESS &&
    treasuryOwner === SYSTEM_WALLET
  ) {
    console.log("\n🎯 Configuration check passed! Deployment successful ✅\n");
  } else {
    console.log("\n⚠️ Warning: On-chain values do not match expected parameters. Please review.\n");
  }

  // STEP 6: OUTPUT SUMMARY
  console.log("📦 Deployment Summary:");
  console.log("----------------------------");
  console.log("Deployer:       ", deployer.address);
  console.log("System Wallet:  ", SYSTEM_WALLET);
  console.log("Treasury:       ", TREASURY_ADDRESS);
  console.log("DreamAudit:     ", DREAM_AUDIT_ADDRESS);
  console.log("Fee per Audit:  ", hre.ethers.formatEther(FEE), "native token");
  console.log("----------------------------\n");

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

  // deployment code
// npx hardhat run scripts/deployContracts.js --network somniaTestnet