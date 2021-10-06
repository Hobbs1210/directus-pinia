import { Model, ServiceOptions, ServiceGetters,ServiceStore } from './types'
import { Params } from '../types'
import { ID } from '@directus/sdk'
import { unref } from 'vue'
import fastCopy from 'fast-copy'
var _ =require('lodash')

export function getters(options: ServiceOptions): ServiceGetters {
    return {
        service() {
            const client = options.clients[this.clientAlias || options.clientAlias]
            if (!client) {
              throw new Error(
                `There is no registered Directus Client named '${this.clientAlias}'. You need to provide one in the 'defineStore' options.`
              )
            }
            return client.items((this as unknown as ServiceStore).servicePath)
        },
        Model() {
            return options.Model
        },
        itemIds() {
            return Object.keys((this as unknown as ServiceStore).itemsById)
        },
        items() {
            return Object.values((this as unknown as ServiceStore).itemsById)
        },
        tempIds() {
            return Object.keys((this as unknown as ServiceStore).tempsById)
        },
        temps() {
            return Object.values((this as unknown as ServiceStore).tempsById)
        },
        cloneIds() {
            return Object.keys((this as unknown as ServiceStore).clonesById)
        },
        clones() {
            return Object.values((this as unknown as ServiceStore).clonesById)
        },
        
        ...options.getters,
    }
}