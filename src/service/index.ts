import { ServiceOptions } from './types'
import { BaseModel } from './base-model'
import { state } from './state'
import { actions } from './actions'
import { getters } from './getters'

export { BaseModel }

export function makeServiceStore(options: ServiceOptions) {
    return {
      id: options.storeId,
      state: state(options),
      getters: getters(options),
      actions: actions(options),
    }
  }