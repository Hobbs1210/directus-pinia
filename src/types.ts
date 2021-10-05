import { QueryMany, Item } from '@directus/sdk'

export type Params = QueryMany<Item> &{
    [key: string]: any
  }
  