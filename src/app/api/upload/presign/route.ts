import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getStorage, GCS_BUCKET, GCS_BASE_URL } from '@/lib/gcs'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { filename, contentType, experienceId, destinationId, size } = body as {
    filename: string
    contentType: string
    experienceId?: string
    destinationId?: string
    size?: number
  }

  if (!filename || !contentType) {
    return NextResponse.json(
      { error: 'filename and contentType are required' },
      { status: 400 }
    )
  }

  if (!experienceId && !destinationId) {
    return NextResponse.json(
      { error: 'experienceId or destinationId is required' },
      { status: 400 }
    )
  }

  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json({ error: 'Tipo de archivo no permitido' }, { status: 400 })
  }

  if (size && size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'Imagen demasiado grande (máx 10 MB)' }, { status: 400 })
  }

  const ext = filename.split('.').pop()?.toLowerCase() ?? 'jpg'

  // Build GCS key based on context
  let key: string
  if (destinationId) {
    key = `destinations/${destinationId}/${crypto.randomUUID()}.${ext}`
  } else {
    key = `experiences/${experienceId}/${crypto.randomUUID()}.${ext}`
  }

  const [presignedUrl] = await getStorage()
    .bucket(GCS_BUCKET)
    .file(key)
    .getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 5 * 60 * 1000, // 5 min
      contentType,
    })

  const publicUrl = `${GCS_BASE_URL}/${key}`

  return NextResponse.json({ presignedUrl, key, publicUrl })
}
