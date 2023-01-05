const Doctive = artifacts.require("./Doctive.sol");

module.exports = async (deployer, network, accounts) => {  
    await deployer.deploy(Doctive);
  };
  