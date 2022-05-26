import Store from 'electron-store'
import { JSONSchemaType } from 'ajv'
import { InstallData } from '../common/types'
// Define your schema in TS
// This is essentially the shape/spec of your store
export type SchemaType = {
  installs: InstallData[]
}
// Define your schema per the ajv/JSON spec
// But you also need to create a mirror of that spec in TS
// And use the type here
const schema: JSONSchemaType<SchemaType> = {
  type: 'object',
  properties: {
    installs: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          version: { type: 'string' },
          path: { type: 'string' },
          type: { type: 'string' },
          tags: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        required: ['path', 'tags', 'type', 'version'],
      },
    },
  },
  required: ['installs'],
}
// We define the keys we'll be using to access the store
// This is basically the top-level properties in the object
// But electron-store supports dot notation, so feel free to set deeper keys
// We set the type like this so when we use `store.get()`
// It'll use the actual keys from store and infer the data type
export const STORE_KEYS: { [key: string]: keyof SchemaType } = {
  INSTALLS: 'installs',
  // PREFERENCES: 'preferences',
  // PROJECTS: 'projects',
}
// Create new store with schema
// And make sure to pass in schema TS types
// If you don't do this, when you use `store.get/set`, the return type will be unknown.
// Not sure why this has lint error. But get/set methods return proper types so...
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const store = new Store<SchemaType>({ schema })
export default store