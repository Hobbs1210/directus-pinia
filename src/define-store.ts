import { makeServiceStore} from './service/index'
import { defineStore as definePiniaStore, Pinia, Store } from 'pinia'
import { Directus, TypeMap } from '@directus/sdk'
import { registerModel } from './models'
import { registerClient } from './clients'

export interface DefineStoreOptions {
    servicePath: string
    Model?: any
    idField?: '_id' | string
    id?: string
    clientAlias?: 'api' | string
    clients?: { [alias: string]: Directus<TypeMap> }
    whitelist?: string[]
    state?: { [k: string]: any }
    getters?: { [k: string]: Function }
    actions?: { [k: string]: Function }
  }

  export function defineStore(options: DefineStoreOptions) {
    const defaults = {
        clients: {},
        clientAlias: 'api',
        servicePath: '',
        idField: '_id',
        whitelist: [],
        state: {},
        getters: {},
        actions: {},
      }
      options = Object.assign({}, defaults, options)
      const clients: any = options.clients
      const actions: any = options.actions
      const clientAlias = options.clientAlias || 'api'
      const {
        servicePath,
        idField,
        whitelist,
        state,
        getters,
      } = options
      let isInitialized = false

      Object.keys(clients).forEach((name) => {
        registerClient(name, clients[name])
      })

    if (!options.Model.modelName) {
        options.Model.modelName = options.Model.name
    }

      // Create and initialize the Pinia store.
    const storeOptions: any = makeServiceStore({
        storeId: options.id || `service.${options.servicePath}`,
        idField: options.idField || idField || 'id',
        clientAlias,
        servicePath,
        clients,
        Model: options.Model,
        state,
        getters,
        actions,
        whitelist,
    })
    function useStore(pinia?: Pinia): any {
        const useStoreDefinition = definePiniaStore(storeOptions)
        const initializedStore: Store = useStoreDefinition(pinia)

        if (!isInitialized)
        {
            isInitialized = true

            Object.assign(options.Model, {
                store: initializedStore,
                pinia,
                servicePath: options.servicePath,
                idField: options.idField || idField,
                clients,
                // Bind `this` in custom actions to the store.
                ...Object.keys(actions).reduce((boundActions: any, key: string) => {
                    const fn = (actions as any)[key]
                    boundActions[key] = fn.bind(initializedStore)
                    return boundActions
                },{}),
            })

            const client = clients[clientAlias]
            if (!client) {
                throw new Error(
                    `There is no registered Directus Client named '${clientAlias}'. You need to provide one in the 'defineStore' options.`
                )
            }
            registerModel(options.Model, initializedStore as any)
        }
        return initializedStore
    }
    return useStore
  }