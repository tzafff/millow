// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  // Setup accounts
  //const [buyer, seller, inspector, lender] = await ethers.getSigners();

  const [wallet] = await ethers.getSigners();
  //  Deploy Real Estate
  const RealEstate = await hre.ethers.getContractFactory("RealEstate");
  const realEstate = await RealEstate.deploy();
  await realEstate.deployed();

  console.log(`Deployed Real Estate Contract at: ${realEstate.address}`);
  console.log("Minting 3 properties...\n");

  for (let i = 0; i < 3; i++) {
    const transaction = await realEstate
      .connect(wallet)
      .mint(
        `https://ipfs.io/ipfs/QmQVcpsjrA6cr1iJjZAodYwmPekYgbnXGo4DFubJiLc2EB/${
          i + 1
        }.json`
      );
    await transaction.wait();
  }

  const Escrow = await ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(
    realEstate.address,
    wallet.address,
    wallet.address,
    wallet.address
  );
  await escrow.deployed();

  console.log(`Deployed Escrow Contract at: ${escrow.address}`);

  for(let i = 0; i < 3; i++) {
    //  Approve properties...
    let transaction = await realEstate.connect(wallet).approve(escrow.address, i + 1)
    await transaction.wait()
  }

  // Listing properties...
  transaction = await escrow.connect(wallet).list(1, wallet.address, tokens(0.0000015), tokens(10))
  await transaction.wait()

  transaction = await escrow.connect(wallet).list(2, wallet.address, tokens(0.0000015), tokens(5))
  await transaction.wait()

  transaction = await escrow.connect(wallet).list(3, wallet.address, tokens(0.0000015), tokens(5))
  await transaction.wait()

  console.log(`Finished.`)


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
