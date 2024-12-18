import { sql } from '@vercel/postgres'
import {
  CustomerField,
  CustomersTableType,
  TransactionForm,
  TransactionsTable,
  LatestTransactionRaw,
  User,
  Revenue,
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
    const data = await sql<LatestTransactionRaw>`
      SELECT transactions.amount, customers.name, customers.image_url, customers.email, transactions.id
      FROM transactions
      JOIN customers ON transactions.customer_id = customers.id
      ORDER BY transactions.date DESC
      LIMIT 5`

    const LatestTransactions = data.rows.map((transaction) => ({
      ...transaction,
      amount: formatCurrency(transaction.amount),
    }))
    return LatestTransactions
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch the latest transactions.')
  }
}

/*
 export async function fetchCardData() {
  unstable_noStore()
  try {
    const transactionCountPromise = sql`SELECT COUNT(*) FROM transactions`
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`
    const transactionStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM transactions`

    const data = await Promise.all([ // initiate all promises at the same time, otherwise they start in a cascade.
      transactionCountPromise,
      customerCountPromise,
      transactionStatusPromise,
    ])

    const numberOftransactions = Number(data[0].rows[0].count ?? '0')
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0')
    const totalPaidtransactions = formatCurrency(data[2].rows[0].paid ?? '0')
    const totalPendingTransactions = formatCurrency(data[2].rows[0].pending ?? '0')

    return {
      numberOfCustomers,
      numberOfTransactions,
      totalPaidTransactions,
      totalPendingTransactions,
    }
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch card data.')
  }
}
 */
const ITEMS_PER_PAGE = 6

export async function fetchFilteredTransactions(query: string, currentPage: number,) {
  //unstable_noStore()
  const offset = (currentPage - 1) * ITEMS_PER_PAGE
  try {
    const transactions = await sql`
      SELECT
        transactions.id,
        transactions.value,
        transactions.tokens,
        transactions.vault,
        transactions.date,
        transactions.status,
        customers.name,
        customers.image_url
      FROM transactions
      JOIN customers ON transactions.customerid = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        transactions.vault ILIKE ${`%${query}%`} OR
        transactions.value::text ILIKE ${`%${query}%`} OR
        transactions.date::text ILIKE ${`%${query}%`} OR
        transactions.status ILIKE ${`%${query}%`}
      ORDER BY transactions.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `
    return transactions.rows
    
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch transactions.')
  }
}

export async function fetchTransactionById(id: string) {
  unstable_noStore()
  try {
    const data = await sql<TransactionForm>`
      SELECT
        transactions.id,
        transactions.customerid,
        transactions.value,
        transactions.tokens,
        transactions.vault,
        transactions.status,
        transactions.date
      FROM transactions
      WHERE transactions.id = ${id};
    `
    const transaction = data.rows.map((transaction) => ({
      ...transaction,
      // Convert amount from cents to dollars
      amount: transaction.value / 100,
    }))
    console.log("transaction", transaction)
    console.log("data", data)
    
    return transaction[0]
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch transaction.')
  }
}

export async function fetchTransactionsPages(query: string) {
  unstable_noStore()
  try {
    const count = await sql`SELECT COUNT(*)
    FROM transactions
    JOIN customers ON transactions.customerid = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      transactions.value::text ILIKE ${`%${query}%`} OR
      transactions.tokens::text ILIKE ${`%${query}%`} OR
      transactions.date::text ILIKE ${`%${query}%`} OR
      transactions.status ILIKE ${`%${query}%`}
  `
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE)
    return totalPages
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch total number of transactions.')
  }
}

export async function fetchCustomers() {
  unstable_noStore()
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
  //unstable_noStore() // se usa para busqueda, deberia funcionar bien con cache
  try {
    const data = await sql `
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(transactions.id) AS total_transactions,
		  SUM(CASE WHEN transactions.status = 'pending' THEN transactions.value ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN transactions.status = 'paid' THEN transactions.tokens ELSE 0 END) AS total_tokens
		FROM customers
		LEFT JOIN transactions ON customers.id = transactions.customerid
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `
 /*    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: Number(customer.total_pending), //valor en usd a incorporar
      total_tokens: Number(customer.total_tokens),
    })) */

      console.log(data.rows)
      return data.rows
    
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