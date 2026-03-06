import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return Response.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return Response.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return Response.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password_hash: hashedPassword
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return Response.json(
        { error: 'Failed to create user', details: error.message },
        { status: 500 }
      )
    }

    // Return user without password_hash
    const { password_hash, ...userWithoutPassword } = newUser

    return Response.json(
      {
        message: 'User created successfully',
        user: userWithoutPassword
      },
      { status: 201 }
    )

  } catch (error) {
    console.log('Register error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
