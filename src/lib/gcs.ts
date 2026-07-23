import { Storage } from '@google-cloud/storage'

export const GCS_BUCKET = process.env.GCS_BUCKET!
export const GCS_BASE_URL = `https://storage.googleapis.com/${process.env.GCS_BUCKET}`

let _storage: Storage | null = null

export function getStorage(): Storage {
  if (!_storage) {
    const credentials = JSON.parse(
      Buffer.from(process.env.GCS_SERVICE_ACCOUNT_KEY_B64!, 'base64').toString('utf8')
    )
    _storage = new Storage({ credentials })
  }
  return _storage
}
