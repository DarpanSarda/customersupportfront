import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key-change-this'
)

export async function getUserFromToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload
  } catch (error) {
    return null
  }
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload
  } catch (error) {
    return null
  }
}

// Helper for API routes - verifies auth and returns user or error response
export async function requireAuth(request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return Response.json(
      { error: 'Unauthorized - No token provided' },
      { status: 401 }
    )
  }

  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload
  } catch (error) {
    return Response.json(
      { error: 'Unauthorized - Invalid token' },
      { status: 401 }
    )
  }
}
