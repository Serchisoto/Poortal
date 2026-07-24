import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import prisma from './prisma'
import { sendPasswordResetEmail, sendVerificationEmail } from './email'

const appURL =
  process.env.BETTER_AUTH_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.V0_RUNTIME_URL) ??
  'http://localhost:3000'

const trustedOrigins = [
  appURL,
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined,
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined,
  process.env.V0_RUNTIME_URL,
  'http://localhost:3000',
  // Wildcard patterns for v0 and Vercel preview domains
  '*.vercel.run',
  '*.vusercontent.net',
  '*.vercel.app',
].filter(Boolean) as string[]

export const auth = betterAuth({
  baseURL: appURL,
  trustedOrigins,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({ toEmail: user.email, toName: user.name ?? null, resetUrl: url })
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({ toEmail: user.email, toName: user.name ?? null, verifyUrl: url })
    },
    autoSignInAfterVerification: true,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'tourist',
        required: false,
      },
    },
  },
})
