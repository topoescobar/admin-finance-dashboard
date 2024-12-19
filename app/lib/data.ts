import { sql } from '@vercel/postgres'
import {
  CustomersTableType,
  TransactionForm,
  TransactionsTable,
  LatestTransactionRaw,
  User,
  Revenue,
  TokenPriceTable,
  UserField,
} from './definitions'
import { formatCurrency } from './utils'
import { unstable_noStore } from 'next/cache'

//call these functions on the server side to protect the database, 
//if you need to manipulate the data call on the server and pass it as props to a child component running on the client.
export async function fetchRevenue() {
  unstable_noStore()  // This is equivalent to in fetch(..., {cache: 'no-store'}).

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 2000));

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
      SELECT transactions.id, transactions.value, users.username, users.image_url, users.email
      FROM transactions
      JOIN users ON transactions.userid = users.id
      ORDER BY transactions.date DESC
      LIMIT 5`

    const latestTransactions = data.rows.map((invoice) => ({
      ...invoice,
      value: formatCurrency(invoice.value),
    }))
    return latestTransactions
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch the latest transactions.')
  }
}

/* fetchCardData
 export async function fetchCardData() {
  unstable_noStore()
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM transactions`
    const customerCountPromise = sql`SELECT COUNT(*) FROM users`
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN value ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN value ELSE 0 END) AS "pending"
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
        users.username,
        users.image_url
      FROM transactions
      JOIN users ON transactions.userid = users.id
      WHERE
        users.username ILIKE ${`%${query}%`} OR
        users.email ILIKE ${`%${query}%`} OR
        transactions.vault ILIKE ${`%${query}%`} OR
        transactions.date::text ILIKE ${`%${query}%`} OR
        transactions.status ILIKE ${`%${query}%`}
      ORDER BY transactions.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `
    console.log(transactions.rows)
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
        transactions.value,
        transactions.tokens,
        transactions.vault,
        transactions.status,
        transactions.date,
        transactions.userid
      FROM transactions
      WHERE transactions.id = ${id};
    `
    const transaction = data.rows.map((transaction) => ({
      ...transaction,
      // Convert amount from cents to dollars
      amount: transaction.value / 100,
    }))
    
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
    JOIN users ON transactions.userid = users.id
    WHERE
      users.username ILIKE ${`%${query}%`} OR
      users.email ILIKE ${`%${query}%`} OR
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

export async function fetchUsers() {
  unstable_noStore()
  try {
    const data = await sql<UserField>`
      SELECT
        id,
        username
      FROM users
      ORDER BY username ASC
    `
    return data.rows

  } catch (err) {
    console.error('Database Error:', err)
    throw new Error('Failed to fetch all users.')
  }
}

export async function fetchFilteredUsers(query: string) {
  //unstable_noStore() // se usa para busqueda, deberia funcionar bien con cache
  try {
    const data = await sql`
		SELECT
		  users.id,
		  users.username,
		  users.email,
		  users.image_url,
		  COUNT(transactions.id) AS total_transactions,
		  SUM(CASE WHEN transactions.status = 'pending' THEN transactions.value ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN transactions.status = 'paid' THEN transactions.tokens ELSE 0 END) AS total_tokens
		FROM users
    LEFT JOIN transactions ON users.id = transactions.userid
		WHERE
		  users.username ILIKE ${`%${query}%`} OR
      users.email ILIKE ${`%${query}%`}
		GROUP BY users.id, users.username, users.email, users.image_url 
		ORDER BY users.username ASC
	  `// Todos los campos usados en SELECT deben estar en el GROUP BY

    /*    const customers = data.rows.map((customer) => ({
         ...customer,
         total_pending: Number(customer.total_pending), //valor en usd a incorporar
         total_tokens: Number(customer.total_tokens),
       })) */

    return data.rows

  } catch (err) {
    console.error('Database Error:', err)
    throw new Error('Failed to fetch customer table.')
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

export async function fetchUserById(id: string) {
  unstable_noStore()
  try {
    const data = await sql<User>`
      SELECT
        users.id,
        users.username,
        users.email,
        users.image_url
      FROM users
      WHERE users.id = ${id};
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