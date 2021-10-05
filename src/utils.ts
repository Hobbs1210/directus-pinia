import stringify from 'fast-json-stable-stringify'
import ObjectID from 'bson-objectid'
import fastCopy from 'fast-copy'
var _ = require('lodash')

function stringifyIfObject(val: any): string | any {
    if (typeof val === 'object' && val != null) {
      return val.toString()
    }
    return val
}

export function getId(item: any, idField?: string) {
    if (!item) return
    if ((idField && item[idField] != null) || item.hasOwnProperty(idField)) {
      return stringifyIfObject(item[idField as string])
    }
    if (item.id != null || item.hasOwnProperty('id')) {
      return stringifyIfObject(item.id)
    }
    if (item._id != null || item.hasOwnProperty('_id')) {
      return stringifyIfObject(item._id)
    }
}
export function getTempId(item: any) {
    if (item?.__tempId != null || item?.hasOwnProperty('__tempId')) {
      return stringifyIfObject(item.__tempId)
    }
}
export function getAnyId(item: any) {
    return getId(item) != null ? getId(item) : getTempId(item)
}

export function keyBy(items: any, fn: Function = (i: any) => getId(i)) {
    return items.reduce((all: any, current: any) => {
      const id = fn(current)
      all[id] = current
      return all
    }, {})
}


export function assignTempId(item: any) {
    const newId = new ObjectID().toHexString()
    item.__tempId = newId
    return item
}

export function getArray(data: any) {
    const isArray = Array.isArray(data)
    return { items: isArray ? data : [data], isArray }
}

export function cleanData(data: any) {
    const { items, isArray } = getArray(data)
    const cleaned = items.map((item: any) => _.omit(item, '__isClone', '__tempId'))
  
    return isArray ? cleaned : cleaned[0]
}

export function useCleanData(data: any) {
    const { items, isArray } = getArray(data)
    const cleaned = items.map((item: any) => fastCopy(item))
  
    return isArray ? cleaned : cleaned[0]
}

export function restoreTempIds(data: any, resData: any) {
    const { items: sourceItems, isArray } = getArray(data)
    const { items: responseItems } = getArray(resData)
  
    responseItems.forEach((item: any, index: number) => {
      const tempId = sourceItems[index].__tempId
      if (tempId) {
        item.__tempId = tempId
      }
    })
  
    return isArray ? responseItems : responseItems[0]
  }

