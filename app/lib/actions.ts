'use server'
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { date, z } from 'zod'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import bcrypt from 'bcrypt'

//todas las funciones bajo 'use server' se ejecutan en el servidor y no son accesibles por el cliente.

//validacion usando zod
const MovementSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  value: z.coerce.number(),
  tokens: z.coerce.number(),
  vault: z.string(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
}) 

const RegisterSchema = z.object({ //user
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(4),
  customerId: z.string().optional(), 
})

const UserSchema = z.object({ //customer
  id: z.string(),
  name: z.string().min(4),
  email: z.string().email().optional(),
  image_url: z.string().optional(),
})

const tokenPriceSchema = z.object({
  price: z.coerce.number(),
  tokenname: z.string(),
  date: z.string()
}) 

//omitir id que no viene en form
const FormMovementSchema = MovementSchema.omit({ id: true })
const FormUserSchema = UserSchema.omit({ id: true })
export async function createMovement(formData: FormData) {

  const allFormData = Object.fromEntries(formData.entries()) //todos los datos del formulario
  const { customerId, value, tokens, vault, status, date } = FormMovementSchema.parse(allFormData) //data validadada
  // const date = new Date().toISOString().split('T')[0] //agregar hora automatico, el 2do elemento es la hora

  try {
    //subir a DB
    await sql
      `INSERT INTO movements (customer_id, value, tokens, status, date, vault)
      VALUES (${customerId}, ${value}, ${tokens}, ${status}, ${date}, ${vault})`
  } catch (error) {
    console.log(error)
    return {
      message: 'Database Error: Failed to Create Invoice.',
    }
  }
  revalidatePath('/dashboard/transactions') //revalidar para que no use datos de cache
  redirect('/dashboard/transactions')
}

export async function updateMovement(id: string, formData: FormData) {
  const allUpdateData = Object.fromEntries(formData)
  const { customerId, value, tokens, status, date } = FormMovementSchema.parse(allUpdateData)  
  
  try {
    await sql`
      UPDATE movements
      SET customer_id = ${customerId}, value = ${value}, tokens = ${tokens}, status = ${status}, date = ${date}
      WHERE id = ${id} `
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' }
  }

  revalidatePath('/dashboard/transactions')
  redirect('/dashboard/transactions')
}

export async function deleteMovement(id: string) {
  try {
    await sql`DELETE FROM movements WHERE id = ${id}`
  } catch (error) {
    console.log(error)
    return { message: 'Database Error: Failed to Delete Invoice.' }
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
  const { email, username, password } = RegisterSchema.parse(allData)
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await sql `INSERT INTO users (email, name, password) VALUES (${email}, ${username}, ${hashedPassword})`
  } catch (error) {
    console.log(error)
  }
  revalidatePath('/login')
  redirect('/login')
}

export async function createCustomer(formData: FormData) {

  const rawData = {
    name: formData.get('name'),
    email: formData.get('email') ,
    image_url: formData.get('image_url') ,
  }

  const { name, email, image_url } = FormUserSchema.parse(rawData) //data validadada
  
  try {
    //subir a DB
    await sql
      `INSERT INTO customers ( name, email, image_url)
      VALUES (${name}, ${email}, ${image_url})`
  } catch (error) {
    console.log(error)
    return {
      message: 'Database Error: Failed to Create User.',
    }
  }
  revalidatePath('/dashboard/customers') //revalidar para que no use datos de cache
  redirect('/dashboard/customers')
}

export async function deleteCustomer(id: string) {
  try {
    await sql`DELETE FROM customers WHERE id = ${id}`
  } catch (error) {
    console.log(error)
    return { message: 'Database Error: Failed to Delete customer.' }
  }
  revalidatePath('/dashboard/customers')
}

export async function updateCustomer(id: string, formData: FormData) {
  const allUpdateData = Object.fromEntries(formData)
  const { name, email, image_url } = FormUserSchema.parse(allUpdateData)

  try {
    await sql`
      UPDATE customers
      SET name = ${name}, email = ${email}, image_url = ${image_url}
      WHERE id = ${id} `
  } catch (error) {
    return { message: 'Database Error: Failed to Update Customer.' }
  }

  revalidatePath('/dashboard/customers')
  redirect('/dashboard/customers')
}

export async function createTokenPrice(formData: FormData) {

  const allFormData = Object.fromEntries(formData.entries()) //todos los datos del formulario
  const { date, price, tokenname } = tokenPriceSchema.parse(allFormData) //data validadada
  // const date = new Date().toISOString().split('T')[0] //agregar hora automatico, el 2do elemento es la hora

  try {
    await sql
      `INSERT INTO tokenprices (date, tokenname, price)
      VALUES (${date}, ${tokenname}, ${price})`
  } catch (error) {
    console.log(error)
    return {
      message: 'Database Error: Failed to Create token price.',
    }
  }
  revalidatePath('/dashboard/funds') //revalidar para que no use datos de cache
  // redirect('/dashboard/transactions')
}

export async function deletePriceWithId(id: string) {
  try {
    await sql`DELETE FROM tokenprices WHERE id = ${id}`
  } catch (error) {
    console.log(error)
    return { message: 'Database Error: Failed to Delete token price.' }
  }
  revalidatePath('/dashboard/funds')
}