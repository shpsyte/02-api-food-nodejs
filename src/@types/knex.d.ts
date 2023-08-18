// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      created_at: Date
      updated_at: Date
    }
    food: {
      id: string
      name: string
      description: string
      date: Date
      is_diet: boolean
      created_at: Date
      updated_at: Date
      user_id: string
    }
  }
}
