'use server'
import { auth } from '@/auth'
import { sql } from '@vercel/postgres'

export async function getUserData() {
   const authData = await auth()
      try {
         const user = await sql`SELECT users.id, users.email, users.role 
         FROM users WHERE email=${authData?.user?.email}`
         return user.rows[0]
      } catch (error) {
         console.error('Failed to fetch user:', error)
         throw new Error('Failed to fetch user.')
      }
}