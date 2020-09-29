import dab from '~/models/dab.js'
import admins from '~/models/admins.js'
import requerants from '~/models/requerants.js'
import requerant_contract_register from '~/models/requerant_contract_register.js'
import request_register from '~/models/request_register.js'

export default (context, inject) => {

  const model = {
    dab: dab(context),
    admins: admins(context),
    requerants: requerants(context),
    requerant_contract_register: requerant_contract_register(context),
    request_register: request_register(context),
  }

  inject('model', model)
}
