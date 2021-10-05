import { createPinia } from 'pinia'
import { setupDirectusPinia } from '../src/index'
import { api } from './directus'
import { resetStores } from './test-utils'

const pinia = createPinia()
const { defineStore, BaseModel } = setupDirectusPinia({ clients: { api } })

const servicePath = 'messages'
class Message extends BaseModel {}

const useMessages = defineStore({ servicePath, Model: Message })
const messagesStore = useMessages(pinia)

const reset = () => resetStores(messagesStore)

describe('Model Instances', () => {
    beforeEach(() => reset())
    afterEach(() => reset())

    test('creating an instance does NOT add it to the messagesStore', () => {
        const message = new Message({ id: 0, text: 'this is a test' })

        expect(messagesStore.itemsById[0]).toBeUndefined()
        expect(messagesStore.tempsById[0]).toBeUndefined()
    })

    test('calling instance.addToStore() adds it to itemsById when the data contains an id', () => {
        const message = new Message({ id: 0, text: 'this is a test' })

        message.addToStore()

        expect(messagesStore.itemsById[0]).toBeTruthy()
    })

    test('calling instance.addToStore() adds it to tempsById when the record contains no id', () => {
        const message = new Message({ text: 'this is a test' })

        message.addToStore()
        expect(messagesStore.itemsById[0]).toBeUndefined()
        expect(Object.keys(messagesStore.tempsById)).toHaveLength(1)
    })
})
