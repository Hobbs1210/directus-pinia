import { Model } from "./service/types"

export const models: { [name: string]: any } = {}

export function registerModel(
  Model: Model, 
  store: { clientAlias: string }
): void {
  models[store.clientAlias] = models[store.clientAlias] || {}
  models[store.clientAlias][Model.modelName] = Model
}
