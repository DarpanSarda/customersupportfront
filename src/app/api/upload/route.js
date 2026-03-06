import { supabase } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']

// Extract file path from Supabase Storage URL
function extractFilePath(url) {
  if (!url) return null
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    // Path format: /storage/v1/object/public/bucket-name/path/to/file
    const objectIndex = pathParts.indexOf('public')
    if (objectIndex !== -1 && pathParts.length > objectIndex + 2) {
      return pathParts.slice(objectIndex + 2).join('/')
    }
  } catch {
    return null
  }
  return null
}

// Generate safe filename
function generateSafeFilename(originalFilename) {
  const timestamp = Date.now()
  const sanitized = originalFilename
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return `${timestamp}-${sanitized}`
}

export async function POST(request) {
  // Verify authentication
  const authResult = await requireAuth(request)
  if (authResult instanceof Response) {
    return authResult // Error response
  }

  const user = authResult

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return Response.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return Response.json(
        { success: false, error: `File too large. Max ${MAX_FILE_SIZE / (1024 * 1024)}MB.` },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json(
        { success: false, error: 'Invalid file type. Allowed: PNG, JPEG, WebP, SVG.' },
        { status: 400 }
      )
    }

    // Get old URL to delete if replacing
    const oldUrl = formData.get('oldUrl')
    if (oldUrl) {
      const oldPath = extractFilePath(oldUrl)
      if (oldPath) {
        await supabase.storage.from('chatbot-assets').remove([oldPath])
      }
    }

    // Generate file path: userId/filename
    const filename = generateSafeFilename(file.name)
    const filePath = `${user.userId}/${filename}`

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('chatbot-assets')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return Response.json(
        { success: false, error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('chatbot-assets')
      .getPublicUrl(filePath)

    return Response.json({
      success: true,
      url: urlData.publicUrl,
      path: filePath
    })

  } catch (error) {
    console.error('Upload API error:', error)
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
