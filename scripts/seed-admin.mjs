/**
 * Creates the admin account for checho5364@gmail.com / 123456!
 * Uses the exact same scrypt hash as @better-auth/utils/password.
 *
 * Run:
 *   node --env-file-if-exists=/vercel/share/.env.project scripts/seed-admin.mjs
 */

import pg from 'pg'
import { randomUUID } from 'node:crypto'
import { hashPassword } from '../node_modules/.pnpm/@better-auth+utils@0.4.2/node_modules/@better-auth/utils/dist/password.mjs'

const { Client } = pg

const EMAIL = 'checho5364@gmail.com'
const NAME = 'Sergio (Admin)'
const PASSWORD = '123456!'

const client = new Client({ connectionString: process.env.DATABASE_URL })

async function main() {
  await client.connect()

  // 1. Find or create better-auth user
  let userRes = await client.query('SELECT id FROM "user" WHERE email = $1', [EMAIL])
  let userId

  if (userRes.rows.length === 0) {
    userId = randomUUID()
    await client.query(
      `INSERT INTO "user" (id, name, email, "emailVerified", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, true, NOW(), NOW())`,
      [userId, NAME, EMAIL]
    )
    console.log('[seed] Created user:', userId)
  } else {
    userId = userRes.rows[0].id
    console.log('[seed] User already exists:', userId)
  }

  // 2. Hash password using same algorithm as better-auth
  const hashedPassword = await hashPassword(PASSWORD)

  // 3. Find or create credential account
  const accRes = await client.query(
    'SELECT id FROM account WHERE "userId" = $1 AND "providerId" = $2',
    [userId, 'credential']
  )

  if (accRes.rows.length === 0) {
    await client.query(
      `INSERT INTO account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
       VALUES ($1, $2, 'credential', $3, $4, NOW(), NOW())`,
      [randomUUID(), userId, userId, hashedPassword]
    )
    console.log('[seed] Created credential account')
  } else {
    await client.query(
      'UPDATE account SET password = $1, "updatedAt" = NOW() WHERE id = $2',
      [hashedPassword, accRes.rows[0].id]
    )
    console.log('[seed] Updated credential password')
  }

  // 4. Find or create profile with admin role
  // Profile may exist by email from a previous attempt with a different user_id
  const profByEmail = await client.query('SELECT id, user_id FROM profiles WHERE email = $1', [EMAIL])

  if (profByEmail.rows.length === 0) {
    await client.query(
      `INSERT INTO profiles (id, user_id, full_name, email, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 'admin', NOW(), NOW())`,
      [randomUUID(), userId, NAME, EMAIL]
    )
    console.log('[seed] Created admin profile')
  } else {
    // Update existing profile to link to this user_id and set admin role
    await client.query(
      `UPDATE profiles SET role = 'admin', user_id = $1, updated_at = NOW() WHERE email = $2`,
      [userId, EMAIL]
    )
    console.log('[seed] Updated existing profile to admin role')
  }

  console.log('[seed] Done! Login at /login with:')
  console.log('  Email:    ', EMAIL)
  console.log('  Password: ', PASSWORD)
}

main()
  .catch((e) => { console.error('[seed] Error:', e); process.exit(1) })
  .finally(() => client.end())
