import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY_LENGTH = 32
const IV_LENGTH = 16
const TAG_LENGTH = 16
const SALT_LENGTH = 64

/**
 * Get encryption key from environment
 * In production, use a proper key management service (KMS)
 */
function getEncryptionKey() {
  const key = process.env.ENCRYPTION_KEY
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set')
  }

  // Use PBKDF2 to derive a proper key from the environment variable
  const salt = crypto.createHash('sha256').update('helpgenie-salt').digest()
  return crypto.pbkdf2Sync(key, salt, 100000, KEY_LENGTH, 'sha256')
}

/**
 * Encrypt sensitive data (API keys, etc.)
 * @param {string} plaintext - The plaintext to encrypt
 * @returns {object} - Object containing encrypted data, IV, and auth tag
 */
export function encrypt(plaintext) {
  try {
    const key = getEncryptionKey()
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

    let encrypted = cipher.update(plaintext, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    const tag = cipher.getAuthTag()

    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    }
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt data')
  }
}

/**
 * Decrypt sensitive data
 * @param {string} encrypted - The encrypted data (hex)
 * @param {string} iv - The initialization vector (hex)
 * @param {string} tag - The authentication tag (hex)
 * @returns {string} - The decrypted plaintext
 */
export function decrypt(encrypted, iv, tag) {
  try {
    const key = getEncryptionKey()
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      key,
      Buffer.from(iv, 'hex')
    )

    decipher.setAuthTag(Buffer.from(tag, 'hex'))

    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Failed to decrypt data')
  }
}

/**
 * Hash sensitive data for comparison (one-way)
 * Useful for verifying if a key has changed without storing the actual key
 * @param {string} data - The data to hash
 * @returns {string} - The hashed data
 */
export function hashData(data) {
  return crypto
    .createHash('sha256')
    .update(data + process.env.ENCRYPTION_KEY)
    .digest('hex')
}
