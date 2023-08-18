import { FastifyInstance } from 'fastify'
import { knex } from '../infra/database'
import { z } from 'zod'
import crypto from 'node:crypto'
import { checkSessionUser } from '../middleware/check-userid-exists'

export default async function (app: FastifyInstance) {
  app.get('/all', async () => {
    const allusers = await knex('users').select('*')

    return { allusers }
  })

  app.post('/create', async (request, reply) => {
    const userSchema = z.object({
      name: z.string().min(3).max(255),
      email: z.string().email(),
    })

    const parse = userSchema.safeParse(request.body)

    if (!parse.success) {
      return reply
        .status(400)
        .send({ message: 'Invalid data', data: parse.error })
    }

    const { name, email } = parse.data

    // check if user already exists
    const userExists = await knex('users').where({ email }).first()

    if (userExists) {
      return reply.status(400).send({ message: 'User already exists' })
    }

    const user = await knex('users')
      .insert({
        id: crypto.randomUUID(),
        name,
        email,
      })
      .returning('id')

    reply.cookie('sessionId', user[0].id, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    })

    return reply.status(201).send({ message: 'User created', data: user })
  })

  app.get(
    '/me',
    {
      preHandler: [checkSessionUser],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const user = await knex('users').where({ id: sessionId }).first()

      if (!user) {
        return { message: 'User not found' }
      }

      const allFoods = await knex('food').where({
        user_id: sessionId,
      })

      // calculate best sequence of is_diet
      let bestSequenceCountOfIsDiet = 0
      let currentSequenceCountOfIsDiet = 0

      for (const food of allFoods) {
        if (food.is_diet) {
          currentSequenceCountOfIsDiet++
        } else {
          if (currentSequenceCountOfIsDiet > bestSequenceCountOfIsDiet) {
            bestSequenceCountOfIsDiet = currentSequenceCountOfIsDiet
          }
        }
      }

      return {
        user: user.name,
        data: {
          total: allFoods.length,
          diet: allFoods.filter((food) => food.is_diet).length,
          notDiet: allFoods.filter((food) => !food.is_diet).length,
          bestSequence: bestSequenceCountOfIsDiet,
        },
      }
    },
  )
}
