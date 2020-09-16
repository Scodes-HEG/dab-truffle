var Oracle = artifacts.require("Oracle");
var Contract = artifacts.require("Admins");
var id = 'admins';

module.exports = async function(deployer) {

  await Promise.all([
    deployer.deploy(Oracle, {overwrite: false}),
    deployer.deploy(Contract),
  ]);

  instances = await Promise.all([
    Oracle.deployed(),
    Contract.deployed()
  ])

  oracleInst = instances[0];
  newInst = instances[1];

  await oracleInst.write(id, newInst.address)
};
