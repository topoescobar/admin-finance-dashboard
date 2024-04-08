'use server'
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
//todas las funciones bajo 'use server' se ejecutan en el servidor y no son accesibles por el cliente.

//validacion usando zod
const InvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
})
//omitimos el id y la fecha que no vienen en el form
const InvoiceFormSchema = InvoiceSchema.omit({ id: true, date: true })
export async function createInvoice(formData: FormData) {
  // const allFormData = Object.fromEntries(formData.entries()) //todos los datos del formulario
  const rawFormData = {
    customerId: formData.get('customerId'), //names de los campos del formulario
    amount: formData.get('amount'),
    status: formData.get('status'),
  }
  const { customerId, amount, status } = InvoiceFormSchema.parse(rawFormData) //data validadada
  const amountInCents = amount * 100
  const date = new Date().toISOString().split('T')[0] //el 2do elemento es la hora

  //subir a DB
  await sql
   `INSERT INTO invoices (customer_id, amount, status, date) 
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`
  revalidatePath('/dashboard/invoices') //revalidar para que no use datos de cache
  redirect('/dashboard/invoices')
}

const UpdateInvoice = InvoiceSchema.omit({ id: true,  date: true,})
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({ //extract data and validate with zod-parse
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  })

  const amountInCents = amount * 100

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `

  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`
  revalidatePath('/dashboard/invoices')
}