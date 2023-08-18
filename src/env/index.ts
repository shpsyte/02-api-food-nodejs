import { config } from 'dotenv'

import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const schema = z.object({
  PORT: z.coerce.number().default(3333),
  HOST: z.string().default('localhost'),
  NODE_ENV: z.string().default('development'),
  DB_CLIENT: z.string().default('sqlite3'),
  DB_URL: z.string().default('localhost'),
})

const _env = schema.safeParse(process.env)

if (!_env.success) {
  throw new Error('Invalid environment variables')
}

export const env = _env.data
