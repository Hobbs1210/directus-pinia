import { QueryMany, Item } from '@directus/sdk'

export type Params = QueryMany<Item> &{
    [key: string]: any
}

export interface Temp {
  [key: string]: any
  [key: number]: any
}

export interface Clone {
  [key: string]: any
  [key: number]: any
}

export interface Paginated<T> {
  total: number
  limit: number
  skip: number
  data: T[]
}