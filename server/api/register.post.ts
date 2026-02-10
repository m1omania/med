import { nanoid } from 'nanoid'

interface RegisterBody {
  email: string
}

const mockUsers = new Map<string, { id: string; email: string }>()

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as RegisterBody
  const email = body?.email?.trim()
  if (!email) {
    throw createError({ statusCode: 400, message: 'Email обязателен' })
  }
  let user = mockUsers.get(email.toLowerCase())
  if (!user) {
    user = { id: nanoid(10), email: email.toLowerCase() }
    mockUsers.set(email.toLowerCase(), user)
  }
  return {
    id: user.id,
    email: user.email,
    plan: null,
  }
})
