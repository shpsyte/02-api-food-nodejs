import { FastifyInstance } from 'fastify'
import { knex } from '../infra/database'
import { z } from 'zod'
import crypto from 'node:crypto'
import { checkSessionUser } from '../middleware/check-userid-exists'

export default async function (app: FastifyInstance) {
  app.addHook('preHandler', checkSessionUser)

  app.get('/all', async (req) => {
    const userSession = req.cookies.sessionId
    const allFoods = await knex('food')
      .where({ user_id: userSession })
      .select('*')

    return {
      allFoods,
    }
  })

  app.get('/:id', async (req) => {
    const userSession = req.cookies.sessionId
    const paramsSchema = z.object({
      id: z.string(),
    })
    const { id } = paramsSchema.parse(req.params)

    const food = await knex('food')
      .where({ user_id: userSession, id })
      .first()
      .select('*')

    return {
      food,
    }
  })

  app.post('/create', async (req) => {
    const userSession = req.cookies.sessionId
    const foodSchema = z.object({
      name: z.string(),
      description: z.string(),
      is_diet: z.boolean(),
    })

    const parse = foodSchema.safeParse(req.body)

    if (!parse.success) {
      return {
        message: 'Invalid body',
      }
    }

    const { name, description, is_diet } = parse.data

    const id = crypto.randomUUID()
    const food = await knex('food')
      .insert({
        id,
        name,
        description,
        date: new Date(),
        is_diet,
        user_id: userSession,
      })
      .returning('*')

    return {
      food,
    }
  })

  app.delete('/delete/:id', async (req) => {
    // get id from params
    const paramsSchema = z.object({
      id: z.string(),
    })
    const { id } = paramsSchema.parse(req.params)

    // delete food
    await knex('food').where({ id }).delete()
    return {
      message: 'Food deleted',
    }
  })

  app.put('/update/:id', async (req) => {
    // get id from params
    const paramsSchema = z.object({
      id: z.string(),
    })
    const { id } = paramsSchema.parse(req.params)

    const session = req.cookies.sessionId

    // get body from request
    const foodSchema = z.object({
      name: z.string(),
      description: z.string(),
      is_diet: z.boolean(),
    })

    //  validate body
    const parse = foodSchema.safeParse(req.body)
    if (!parse.success) {
      return {
        message: 'Invalid body',
      }
    }

    const { name, description, is_diet } = parse.data

    // get food from database
    const food = await knex('food').where({ id }).first()

    // validate if th food belongs to the user
    if (!food) {
      return {
        message: 'Food not found',
      }
    }

    if (food.user_id !== session) {
      return {
        message: 'Unauthorized',
      }
    }

    // update food
    const updateFood = await knex('food')
      .where({ id })
      .update({
        name,
        description,
        is_diet,
      })
      .returning('*')

    // return food
    return {
      updateFood,
    }
  })
}
