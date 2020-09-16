var Oracle = artifacts.require("Oracle");
var Admins = artifacts.require("Admins");
var Dab = artifacts.require("Dab");
var Requerants = artifacts.require("Requerants");
var ContractRegister = artifacts.require("ContractRegister");
var RequestRegister = artifacts.require("RequestRegister");

module.exports = async function(deployer) {

  await Promise.all([
    deployer.deploy(Oracle, {overwrite: false}),
    deployer.deploy(Admins),
    deployer.deploy(Dab),
    deployer.deploy(Requerants),
    deployer.deploy(ContractRegister),
    deployer.deploy(RequestRegister),
  ]);

  instances = await Promise.all([
    Oracle.deployed(),
    Admins.deployed(),
    Dab.deployed(),
    Requerants.deployed(),
    ContractRegister.deployed(),
    RequestRegister.deployed(),
  ])

  oracleInst = instances[0];

  await Promise.all([
      oracleInst.write('admins', instances[1].address),
      oracleInst.write('dab', instances[2].address),
      oracleInst.write('requerants', instances[3].address),
      oracleInst.write('requerant_dab_contract_register', instances[4].address),
      oracleInst.write('request_register', instances[5].address),
    ])
};
