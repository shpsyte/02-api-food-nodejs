import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { FastifyInstance } from 'fastify/types/instance'
import { execSync } from 'node:child_process'

describe('app', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a user ', async () => {
    await request(app.server)
      .post(`/user/create`)
      .send({
        name: 'John Doe',
        email: 'john@john.com',
      })
      .expect(201)
  })
  it('should be able to NOT create a user ', async () => {
    await request(app.server)
      .post(`/user/create`)
      .send({
        name: 'John Doe',
        email: 'john.com',
      })
      .expect(400)
  })

  it('should be able to NOT create a user if it exists ', async () => {
    await request(app.server)
      .post(`/user/create`)
      .send({
        name: 'John Doe',
        email: 'john@john.com',
      })
      .expect(201)

    await request(app.server)
      .post(`/user/create`)
      .send({
        name: 'John Doe',
        email: 'john@john.com',
      })
      .expect(400)
  })

  it('should be able to get all users ', async () => {
    await request(app.server).post(`/user/create`).send({
      name: 'John Doe',
      email: 'john@john.com',
    })

    const response = await request(app.server).get(`/user/all`)

    expect(response.body.allusers).toHaveLength(1)
    expect(response.body.allusers).toEqual([
      expect.objectContaining({
        name: 'John Doe',
        email: expect.any(String),
      }),
    ])
  })

  it('Dashboard teset', async () => {
    const reponseErr = await request(app.server)
      .get(`/user/me`)
      .set('Cookie', '')
    const { message } = reponseErr.body
    expect(message).toBe('Unauthorized')

    const reponseCreate = await request(app.server).post(`/user/create`).send({
      name: 'John Doe',
      email: 'john@john.com',
    })

    const cookies = reponseCreate.headers['set-cookie']

    const respMe = await request(app.server)
      .get(`/user/me`)
      .set('Cookie', cookies)
      .expect(200)

    const expObj = {
      user: 'John Doe',
      data: { total: 0, diet: 0, notDiet: 0, bestSequence: 0 },
    }

    expect(respMe.body).toEqual(expObj)

    const cookiesErr = [
      'sessionId=b64f737f-11dd-458d-8ed4-c17951bd29__; Max-Age=604800000; Path=/',
    ]

    let req = await request(app.server)
      .get(`/user/me`)
      .set('Cookie', cookiesErr)

    expect({
      message: 'User not found',
    }).toEqual(req.body)

    await request(app.server).post(`/food/create`).set('Cookie', cookies).send({
      name: 'Banana',
      description: 'Bananinha',
      is_diet: true,
    })

    await request(app.server).post(`/food/create`).set('Cookie', cookies).send({
      name: 'Banana',
      description: 'Bananinha',
      is_diet: false,
    })

    req = await request(app.server).get(`/user/me`).set('Cookie', cookies)
    const dash = {
      user: 'John Doe',
      data: { total: 2, diet: 1, notDiet: 1, bestSequence: 1 },
    }

    expect(dash).toEqual(req.body)
  })

  it('should be able to get all food ', async () => {
    let req = await request(app.server).post(`/user/create`).send({
      name: 'John Doe',
      email: 'j@j.com',
    })
    const cookies = req.headers['set-cookie']

    req = await request(app.server)
      .post(`/food/create`)
      .send({
        name: 'Banana',
        description: 'Bananinha',
        is_diet: true,
      })
      .set('Cookie', cookies)

    const response = await request(app.server)
      .get(`/food/all`)
      .set('Cookie', cookies)

    expect(response.body.allFoods).toHaveLength(1)

    const { id } = response.body.allFoods[0]

    req = await request(app.server).get(`/food/${id}`).set('Cookie', cookies)
    expect(req.body.food.name).toBe('Banana')
  })

  it('should be able to create a food ', async () => {
    let req = await request(app.server).post(`/user/create`).send({
      name: 'John Doe',
      email: 'j@j.com',
    })
    const cookies = req.headers['set-cookie']

    req = await request(app.server)
      .post(`/food/create`)
      .send({
        name: 'Banana',
        is_diet: true,
      })
      .set('Cookie', cookies)

    expect({
      message: 'Invalid body',
    }).toEqual(req.body)
  })

  it('should be able to delete a food ', async () => {
    let req = await request(app.server).post(`/user/create`).send({
      name: 'John Doe',
      email: 'j@j.com',
    })
    const cookies = req.headers['set-cookie']

    req = await request(app.server)
      .post(`/food/create`)
      .send({
        name: 'Banana',
        description: 'Bananinha',
        is_diet: true,
      })
      .set('Cookie', cookies)

    const { id } = req.body.food

    req = await request(app.server)
      .delete(`/food/delete/${id}`)
      .set('Cookie', cookies)

    expect({
      message: 'Food deleted',
    }).toEqual(req.body)
  })
})
