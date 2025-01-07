'use server'
//todas las funciones bajo 'use server' se ejecutan en el servidor y no son accesibles por el cliente.
//se usara para las funciones que modifican la BD
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { date, z } from 'zod'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import bcrypt from 'bcrypt'

//validacion usando zod
const TransactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  value: z.coerce.number(),
  tokens: z.coerce.number(),
  vault: z.string(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
  tokenprice: z.string() // lo dejo tipo string por error desde CreateTransactionForm
})

const UserSchema = z.object({ 
  email: z.string().email(),
  password: z.string().min(6),
  image_url: z.string().optional(),
})

const EditUserSchema = UserSchema.omit({ password: true })

const tokenPriceSchema = z.object({
  price: z.coerce.number(),
  tokenname: z.string(),
  date: z.string()
}) 

//omitir id que no viene en form
const FormTransactionSchema = TransactionSchema.omit({ id: true })

export async function createTransaction(formData: FormData): Promise<void> {
  
  const allFormData = Object.fromEntries(formData.entries()) //todos los datos del formulario
  const { userId, value, tokens, vault, status, date, tokenprice } = FormTransactionSchema.parse(allFormData) //data validadada
  //formatear fecha, el 2do elemento del split es la hora. en la base de datos formato (mm/dd/yyyy)
  const dateFormatted = new Date(date).toISOString().split('T')[0]
  const tokenpriceFormatted = parseFloat(tokenprice).toFixed(3)

  try {
    await sql
      `INSERT INTO transactions ( value, tokens, vault, status, date, userid, tokenprice)
      VALUES (${value}, ${tokens}, ${vault}, ${status}, ${dateFormatted}, ${userId}, ${tokenpriceFormatted})` 
  } catch (error) {
    console.log('Database Error: Failed to Create Transaction.')
    console.log(error)
    return Promise.resolve()
  }
  revalidatePath('/dashboard/transactions') //revalidar para que no use datos de cache
  redirect('/dashboard/transactions')
}

const EditTransactionSchema = TransactionSchema.omit({ tokenprice: true })
export async function updateTransaction(id: string, formData: FormData): Promise<void> {
  const allUpdateData = Object.fromEntries(formData)
  console.log('allUpdateData', allUpdateData)
  const { userId, value, tokens, vault, status, date } = EditTransactionSchema.parse(allUpdateData)  
  const dateFormatted = new Date(date).toISOString().split('T')[0]

  try {
    await sql`
      UPDATE transactions
      SET userid = ${userId}, value = ${value}, tokens = ${tokens}, vault = ${vault}, status = ${status}, date = ${dateFormatted}
      WHERE id = ${id} `
  } catch (error) {
    return
  }

  revalidatePath('/dashboard/admin-transactions')
  redirect('/dashboard/admin-transactions')
}

export async function deleteTransaction(id: string): Promise<void> {
  try {
    await sql`DELETE FROM transactions WHERE id = ${id}`
  } catch (error) {
    console.log('deleteTransaction failed',error)
    return Promise.resolve()
  }
  revalidatePath('/dashboard/transactions')
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'
        default:
          return 'Something went wrong.'
      }
    }
    throw error
  }
}

export async function register(formData: FormData) {
  const allData = Object.fromEntries(formData)
  const { email, password } = UserSchema.parse(allData)
  const hashedPassword = await bcrypt.hash(password, 10)

  const userExists = await sql`SELECT * FROM users WHERE email = ${email}`
  if (userExists.rows.length > 0) {
    throw new Error('Email registrado')
  }

  try {
    await sql `INSERT INTO users (email, password) VALUES (${email}, ${hashedPassword})`
  } catch (error) {
    console.log(error)
  }
  revalidatePath('/login')
  redirect('/login')
}

export async function updateUser(id: string, formData: FormData): Promise<void> {
  const allUpdateData = Object.fromEntries(formData)
  const {  email, image_url } = EditUserSchema.parse(allUpdateData)
  
  console.log('allUpdateData', allUpdateData)
  try {
    await sql`
      UPDATE users
      SET email = ${email}, image_url = ${image_url}
      WHERE id = ${id} `
  } catch (error) {
    return 
  }

  revalidatePath('/dashboard/admin-customers')
  redirect('/dashboard/admin-customers')
}

export async function deleteUser(id: string): Promise<void>{
  try {
    await sql`DELETE FROM users WHERE id = ${id}`
  } catch (error) {
    console.log(error)
    return
  }
  revalidatePath('/dashboard/customers')
}

export async function createTokenPrice(formData: FormData): Promise<void> {

  const allFormData = Object.fromEntries(formData.entries()) //todos los datos del formulario
  const { date, price, tokenname } = tokenPriceSchema.parse(allFormData) //data validadada
  // const date = new Date().toISOString().split('T')[0] //agregar hora automatico, el 2do elemento es la hora

  try {
    await sql
      `INSERT INTO tokenprices (date, tokenname, price)
      VALUES (${date}, ${tokenname}, ${price})`
  } catch (error) {
    console.log(error)
    return Promise.resolve()
  }
  revalidatePath('/dashboard/funds') //revalidar para que no use datos de cache
}

export async function deletePriceWithId(id: string): Promise<void> {
  try {
    await sql`DELETE FROM tokenprices WHERE id = ${id}`
  } catch (error) {
    console.log('deletePriceWithId failed' ,error)
  }
  revalidatePath('/dashboard/funds')
}