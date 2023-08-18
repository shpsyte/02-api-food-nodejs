import { FastifyRequest, FastifyReply } from 'fastify'

export async function checkSessionUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const session = request.cookies.sessionId

  console.log(`User session: ${session} => ${request.url}`)

  if (!session) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }
  console.log(`User session: ${session} => ${request.url}`)
}
