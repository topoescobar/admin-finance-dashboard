import { sql } from '@vercel/postgres'
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  MovementsTable,
  LatestInvoiceRaw,
  User,
  Revenue,
  MovementForm,
  Customer,
  TokenPriceTable,
} from './definitions'
import { formatCurrency } from './utils'
import { unstable_noStore } from 'next/cache'

//call these functions on the server side to protect the database, 
//if you need to manipulate the data call on the server and pass it as props to a child component running on the client.
export async function fetchRevenue() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  unstable_noStore()

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`

    console.log('Data fetch completed after 3 seconds.');

    return data.rows
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch revenue data.')
  }
}

export async function fetchLatestTransactions() {
  unstable_noStore()
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`

    const LatestTransactions = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }))
    return LatestTransactions
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch the latest invoices.')
  }
}

export async function fetchCardData() {
  unstable_noStore()
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`

    const data = await Promise.all([ // initiate all promises at the same time, otherwise they start in a cascade.
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ])

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0')
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0')
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0')
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0')

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    }
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch card data.')
  }
}

const ITEMS_PER_PAGE = 6
export async function fetchFilteredInvoices( query: string, currentPage: number,) {
  unstable_noStore()
  const offset = (currentPage - 1) * ITEMS_PER_PAGE
  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `
    return invoices.rows
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch invoices.')
  }
}

export async function fetchFilteredMovements(query: string, currentPage: number,) {
  unstable_noStore()
  const offset = (currentPage - 1) * ITEMS_PER_PAGE
  try {
    const movements = await sql`
      SELECT
        movements.id,
        movements.value,
        movements.tokens,
        movements.vault,
        movements.date,
        movements.status,
        customers.name,
        customers.image_url
      FROM movements
      JOIN customers ON movements.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        movements.vault ILIKE ${`%${query}%`} OR
        movements.value::text ILIKE ${`%${query}%`} OR
        movements.date::text ILIKE ${`%${query}%`} OR
        movements.status ILIKE ${`%${query}%`}
      ORDER BY movements.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `
    return movements.rows
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch movements.')
  }
}

export async function fetchInvoicesPages(query: string) {
  unstable_noStore()
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE)
    return totalPages
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch total number of invoices.')
  }
}

export async function fetchMovementById(id: string) {
  unstable_noStore()
  try {
    const data = await sql<MovementForm>`
      SELECT
        movements.id,
        movements.customer_id,
        movements.value,
        movements.tokens,
        movements.status,
        movements.date
      FROM movements
      WHERE movements.id = ${id};
    `
    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.value / 100,
    }))
    console.log("invoice", invoice)
    console.log("data", data)
    
    return invoice[0]
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch invoice.')
  }
}

export async function fetchMovementsPages(query: string) {
  unstable_noStore()
  try {
    const count = await sql`SELECT COUNT(*)
    FROM movements
    JOIN customers ON movements.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      movements.value::text ILIKE ${`%${query}%`} OR
      movements.tokens::text ILIKE ${`%${query}%`} OR
      movements.date::text ILIKE ${`%${query}%`} OR
      movements.status ILIKE ${`%${query}%`}
  `
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE)
    return totalPages
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch total number of invoices.')
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `

    const customers = data.rows
    return customers
  } catch (err) {
    console.error('Database Error:', err)
    throw new Error('Failed to fetch all customers.')
  }
}

export async function fetchFilteredCustomers(query: string) {
  unstable_noStore()
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }))

    return customers
  } catch (err) {
    console.error('Database Error:', err)
    throw new Error('Failed to fetch customer table.')
  }
}

export async function getUser(email: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`
    return user.rows[0] as User
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw new Error('Failed to fetch user.')
  }
}

export async function fetchCustomerById(id: string) {
  unstable_noStore()
  try {
    const data = await sql<Customer>`
      SELECT
        customers.id,
        customers.name,
        customers.email,
        customers.image_url
      FROM customers
      WHERE customers.id = ${id};
    `
    console.log('data customer by id', data.rows[0])
    return data.rows[0]

  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch customer by id.')
  }
}

export async function fetchTokenPrice() {
  unstable_noStore()
  try {
    const data = await sql<TokenPriceTable>`
      SELECT
        tokenprices.id,
        tokenprices.date,
        tokenprices.price,
        tokenprices.tokenname
      FROM tokenprices
      ORDER BY tokenprices.date DESC
    `
    console.log('token price fetched')
    const funds = data.rows
    return funds

  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch funds token prices.')
  }
}