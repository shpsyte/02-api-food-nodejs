import { knex as Setup, Knex } from 'knex'
import { env } from './../../env/'

export const config: Knex.Config = {
  client: env.DB_CLIENT,
  connection: {
    filename: env.DB_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './src/infra/database/migrations',
  },
}

export const knex = Setup(config)
