import { Model, ServiceOptions, ServiceActions, AnyData,RequestType } from './types'
import { Params} from '../types'
import {getArray,getId,getTempId,keyBy,assignTempId,cleanData,restoreTempIds,getAnyId} from '../utils'
import fastCopy from 'fast-copy'
import { ManyItems, Item, ID} from '@directus/sdk'

export function actions(options: ServiceOptions): ServiceActions {
    return {

        addToStore(data: AnyData) {
            return this.addOrUpdate(data)
        },
        addOrUpdate(data: AnyData) {
            const { items, isArray } = getArray(data)
            const { idField, autoRemove } = this

            // Assure each item is an instance
            items.forEach((item: any, index: number) => {
                if (!(item instanceof options.Model)) {
                    const classes = { [this.servicePath]: options.Model }
                    items[index] = new classes[this.servicePath](item)
                }
            })

            // Move items with both __tempId and idField from tempsById to itemsById
            const withBoth = items.filter((i: any) => getId(i) != null && getTempId(i) != null)
            withBoth.forEach((item: any) => {
                const id = getId(item)
                const existingTemp = this.tempsById[item.__tempId]
                if (existingTemp) {
                    this.itemsById[id] = existingTemp
                    Object.assign(this.itemsById[id], item)
                    delete this.tempsById[item.__tempId]
                    delete this.itemsById[id].__tempId
                }
                delete item.__tempId
            })

            // Save items that have ids
            const withId = items.filter((i: any) => getId(i) != null)
            const itemsById = keyBy(withId)
            Object.assign(this.itemsById, itemsById)

            // Save temp items
            const temps = items.filter((i: any) => getId(i) == null).map((i: any) => assignTempId(i))
            const tempsById = keyBy(temps, (i: any) => i.__tempId)
            Object.assign(this.tempsById, tempsById)

            return isArray ? items : items[0]
    
        },
        clearAll() {
            this.itemsById = {}
            this.tempsById = {}
            this.clonesById = {}
        },
        create(data: any, params: Params) {
            const { idField, tempIdField } = this
            params = fastCopy(params) || {}

            this.setPendingById(getId(data) || data[tempIdField], 'create', true)

            return this.service.createMany(cleanData(data), params)
            .then((response: ManyItems<Item>) => {
                return this.addOrUpdate(restoreTempIds(data, response.data))
            })
            .catch((error: Error) => {
                return Promise.reject(error)
            })
            .finally(() => {
                this.setPendingById(getId(data) || data[tempIdField], 'create', false)
            })

        },
        update(id: ID, data: any, params: Params) {
            params = fastCopy(params) || {}

            this.setPendingById(id, 'update', true)

            return this.service
            .updateOne(id, cleanData(data), params)
            .then((data: any) => {
                return this.addOrUpdate(data)
            })
            .catch((error: Error) => {
                return Promise.reject(error)
            })
            .finally(() => {
                this.setPendingById(id, 'update', false)
            })
        },

        setPendingById(id: string | number, method: RequestType, val: boolean) {
        },
        clone(item: any, data = {}) {
            const placeToStore = item.__tempId != null ? 'tempsById' : 'itemsById'
            const id = getAnyId(item)
            const originalItem = this[placeToStore][id]
            const existing = this.clonesById[getAnyId(item)]
            if(existing){
                const readyToReset = Object.assign(existing, originalItem, data)
                Object.keys(readyToReset).forEach((key) => {
                    if (!originalItem.hasOwnProperty(key)) {
                        delete readyToReset[key]
                    }
                })
                return readyToReset
            }
            else{
                const clone = fastCopy(originalItem)
                Object.defineProperty(clone, '__isClone', {
                    value: true,
                    enumerable: false,
                })
                Object.assign(clone, data)

                this.clonesById[id] = clone
                return this.clonesById[id]
            }
        },
        commit(item: any) {
            const id = getAnyId(item)
            if (id != null) {
                const placeToStore = item.__tempId != null ? 'tempsById' : 'itemsById'
                this[placeToStore][id] = fastCopy(this.clonesById[id])
                return this.itemsById[id]
            }
        },
    }
}