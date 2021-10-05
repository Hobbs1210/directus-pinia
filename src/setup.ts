import { BaseModel } from './service/index'
import { registerClient } from './clients'
import { defineStore, DefineStoreOptions } from './define-store'

interface SetupOptions {
    clients: { [alias: string]: any }
    idField?: string
    whitelist?: string[]
    state?: { [k: string]: any }
    getters?: { [k: string]: any }
    actions?: { [k: string]: Function }
  }

  export function setupDirectusPinia(globalOptions: SetupOptions) {
    const { clients } = globalOptions
    Object.keys(clients).forEach((name) => {
      registerClient(name, clients[name])
    })

    function defineStoreWrapper(options: DefineStoreOptions) {
        return defineStore(Object.assign({}, globalOptions, options))
      }
    
      return {
        defineStore: defineStoreWrapper,
        BaseModel,
      }
    }
    