import { AnyData, ModelInstanceOptions,ServiceStore } from './types'
import { models } from '../models'
import { Pinia } from 'pinia'

export class BaseModel {
    static store:ServiceStore
    static pinia:Pinia 
    static servicePath:string
    static idField: string 

    public __isClone!: boolean

    constructor(data: AnyData, options: ModelInstanceOptions = {}) {
        const { store, instanceDefaults, setupInstance } = this.constructor as typeof BaseModel
        Object.assign(this, instanceDefaults(data, { models, store }))
        Object.assign(this, setupInstance(data, { models, store }))
        this.__isClone = !!options.clone
        return this
    }

    public static instanceDefaults(data: AnyData, models: { [name: string]: any }) {
        return data
    }
    public static setupInstance(data: AnyData, models: { [name: string]: any }) {
        return data
    }
    public static addToStore(data?: any) {
        return (this.store as any).addToStore(data)
    }
    
    public clone(data: AnyData = {}): this {
        const { store } = this.constructor as typeof BaseModel
        return (store as any).clone(this, data)
    }
    public addToStore() {
        const { store }: { store: any } = this.constructor as typeof BaseModel
        return store.addToStore(this)
    }
    
    public commit(): this {
        const { idField, store } = this.constructor as typeof BaseModel
        if (this.__isClone)
        {
            return (store as any).commit(this)
        }
        else{
            throw new Error('You cannot call commit on a non-copy')
        }
    }
}