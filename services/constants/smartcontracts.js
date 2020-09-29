import ORACLE from './oracle'
import DAB from './dab'
import ADMINS from './admins'
import REQUERANTS from './requerants'
import REQUERANT_DAB_CONTRACT_REGISTER from './requerant_dab_contract_register'
import REQUERANT_DAB_CONTRACT from './requerant_dab_contract'
import REQUEST_REGISTER from './request_register'
import REQUEST from './request'

let sm = {};
sm.oracle = ORACLE.smartcontract;
sm.dab = DAB.smartcontract;
sm.admins = ADMINS.smartcontract;
sm.requerants = REQUERANTS.smartcontract;
sm.requerant_dab_contract_register = REQUERANT_DAB_CONTRACT_REGISTER.smartcontract;
sm.requerant_dab_contract = REQUERANT_DAB_CONTRACT.smartcontract;
sm.request_register = REQUEST_REGISTER.smartcontract;
sm.request = REQUEST.smartcontract;

export default sm;
