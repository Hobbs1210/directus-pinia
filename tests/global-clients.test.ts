import { createPinia } from 'pinia'
import { setupDirectusPinia, clients } from '../src/index'
import { api } from './directus'

const pinia = createPinia()

describe('Global Clients', () => {
  test('calling setup adds the clients by key name', () => {
    const { defineStore, BaseModel } = setupDirectusPinia({ clients: { api } })
    expect(clients.api).toBeDefined()
  })
})