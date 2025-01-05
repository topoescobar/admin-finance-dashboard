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
  Transaction,
  UserTransaction,
} from './definitions'
import { formatCurrency } from './utils'
import { unstable_noStore } from 'next/cache'

//CONFIG
const ITEMS_PER_PAGE = 6 //items for pagination

//call these functions on the server side to protect the database, without 'use server' It is agnostic
//if you need to manipulate the data call on the server and pass it as props to a child component running on the client.
export async function fetchRevenue() {

  try {
    const data = await sql<Revenue>`SELECT * FROM revenue`
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

 export async function fetchCardData(userid: string) {
  try {
    const totalTokensPromiseFCA = sql`
      SELECT SUM(tokens) AS total_tokens
      FROM transactions
      WHERE userid = ${userid} and VAULT = 'FCA'`
    const totalTokensPromiseFCD = sql`
      SELECT SUM(tokens) AS total_tokens
      FROM transactions
      WHERE userid = ${userid} and VAULT = 'FCD'`
    const transactionStatusPromise = sql`
      SELECT 
        SUM(CASE WHEN vault = 'FCA' AND status = 'paid' THEN value ELSE 0 END) AS "sumDepositsFCA",
        SUM(CASE WHEN vault = 'FCA' AND status = 'pending' THEN value ELSE 0 END) AS "sumPendingFCA",
        SUM(CASE WHEN vault = 'FCD' AND status = 'paid' THEN value ELSE 0 END) AS "sumDepositsFCD",
        SUM(CASE WHEN vault = 'FCD' AND status = 'pending' THEN value ELSE 0 END) AS "sumPendingFCD"
      FROM transactions WHERE userid = ${userid}`

    const data = await Promise.all([ // initiate all promises at the same time, otherwise they start in a cascade.
      totalTokensPromiseFCA,
      totalTokensPromiseFCD,
      transactionStatusPromise,
    ])
    console.log('fetching card data...')
    return {
      totalTokensFCA: Number(data[0].rows[0].total_tokens) ?? 0,
      totalTokensFCD: Number(data[1].rows[0].total_tokens) ?? 0,
      totalDepositsFCA: Number(data[2].rows[0].sumDepositsFCA) ?? 0,
      totalPendingFCA: Number(data[2].rows[0].sumPendingFCA) ?? 0,
      totalDepositsFCD: Number(data[2].rows[0].sumDepositsFCD) ?? 0,
      totalPendingFCD: Number(data[2].rows[0].sumPendingFCD) ?? 0,
    }
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch card data.')
  }
}

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
    return data.rows[0]

  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch customer by id.')
  }
}

export async function fetchTokenPrice() {
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
    const funds = data.rows
    return funds

  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch funds token prices.')
  }
}

export async function fetchLastTokensPrices() {
  try {
    const data = await sql<TokenPriceTable>`
    SELECT tokenname, price, date
    FROM tokenprices
    WHERE (tokenname = 'FCA' AND date = (SELECT MAX(date) FROM tokenprices WHERE tokenname = 'FCA'))
    OR (tokenname = 'FCD' AND date = (SELECT MAX(date) FROM tokenprices WHERE tokenname = 'FCD'))
    ORDER BY tokenname ASC
    `
    const FCAprice = Number(data.rows[0].price) 
    const FCDprice = Number(data.rows[1].price)

    return { FCAprice, FCDprice }

  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch last token prices.')
  }
}

export async function fetchUserTransactions(query: string, currentPage: number, userid: string) {
  console.log('fetchUserTransactions',query, currentPage, userid)
  const offset = (currentPage - 1) * ITEMS_PER_PAGE
  try {
    const transactions = await sql<UserTransaction> `
      SELECT
        transactions.id,
        transactions.value,
        transactions.tokens,
        transactions.vault,
        transactions.date,
        transactions.status
      FROM transactions
      WHERE
        transactions.userid = ${userid}
      ORDER BY transactions.date DESC
      `
      // LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset} *retiro temporal de paginacion
    return transactions.rows

  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch user transactions.')
  }
}

export async function fetchUserTxPages(query: string, userid: string) {
  try {
    const count = await sql`
    SELECT COUNT(*)
    FROM transactions
    WHERE 
      transactions.userid = ${userid} AND
      transactions.date::text ILIKE ${`%${query}%`} OR
      transactions.status ILIKE ${`%${query}%`} OR
      transactions.vault ILIKE ${`%${query}%`}
      
  `
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE)
    return totalPages
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch total number of transactions.')
  }
}