'use server'

import { z } from 'zod'

//todas las funciones bajo 'use server' se ejecutan en el servidor y no son accesibles por el cliente.

const createInvoiceFormSchema = z.object({
  
})
export async function createInvoice(formData: FormData) {
  const rawFormData = {
    customerId: formData.get('customerId'), //names de los campos del formulario
    amount: formData.get('amount'),
    status: formData.get('status'),
  }

  // const allFormData = Object.fromEntries(formData.entries()) //todos los datos del formulario
}