import fastify from 'fastify'
import user from './routes/user'
import cookie from '@fastify/cookie'
import food from './routes/food'
const app = fastify()

app.register(cookie)
app.register(user, {
  prefix: '/user',
})

app.register(food, {
  prefix: '/food',
})

export { app }
