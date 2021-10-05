import { Model, ServiceOptions, ServiceGetters } from './types'
import { Params } from '../types'

export function getters(options: ServiceOptions): ServiceGetters {
    return {
        service() {
            const client = options.clients[this.clientAlias || options.clientAlias]
            if (!client) {
              throw new Error(
                `There is no registered Directus Client named '${this.clientAlias}'. You need to provide one in the 'defineStore' options.`
              )
            }
            return client.items(this.servicePath)
        },
        Model() {
            return options.Model
        },
        itemIds() {
            return Object.keys(this.itemsById)
        },
        items() {
            return Object.values(this.itemsById)
        },
        tempIds() {
            return Object.keys(this.tempsById)
        },
        temps() {
            return Object.values(this.tempsById)
        },
        cloneIds() {
            return Object.keys(this.clonesById)
        },
        clones() {
            return Object.values(this.clonesById)
        },

        ...options.getters,
    }
}