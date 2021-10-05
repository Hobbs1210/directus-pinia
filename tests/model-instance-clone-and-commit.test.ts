import { createPinia } from 'pinia'
import { setupDirectusPinia } from '../src/index'
import { api } from './directus'
import { resetStores  } from './test-utils'

const pinia = createPinia()

const { defineStore, BaseModel } = setupDirectusPinia({ clients: { api } })

class Message extends BaseModel {}
const servicePath = 'messages'
const useMessagesService = defineStore({ servicePath,Model:Message })

const messagesService = useMessagesService(pinia)

const resetStore = () => resetStores(messagesService)

describe('Clone & commit', () => {
  test('can clone ', async () => {
    const message = await messagesService.create({ text: 'Quick, what is the number to 911?' })
    const clone = message.clone({ additionalData: 'a boolean is fine' })
    expect(clone).toHaveProperty('__isClone')
    expect(clone.__isClone).toBe(true)
    expect(message === clone).toBe(false)
    expect(clone).toHaveProperty('additionalData')
    expect(clone.additionalData).toBe('a boolean is fine')
  })

  test('can commit ', async () => {
    const message = await messagesService.create({ text: 'Quick, what is the number to 911?' })
    const clone = message.clone({ foo: 'bar' })
    const committed = clone.commit()

    expect(committed.foo).toBe('bar')
    expect(committed.__isClone).toBeUndefined()
  })

  test('can reset', async () => {
    const message = await messagesService.create({ text: 'Quick, what is the number to 911?' })
    const clone = message.clone({ foo: 'bar' })
    const reset = clone.clone()

    expect(reset.foo).toBeUndefined()
    expect(clone === reset).toBeTruthy()
  })
})