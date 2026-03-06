import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key-change-this'
)

async function createToken(user) {
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    name: user.name
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET)

  return token
}

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = await createToken(user)

    // Return user without password_hash
    const { password_hash, ...userWithoutPassword } = user

    return Response.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
