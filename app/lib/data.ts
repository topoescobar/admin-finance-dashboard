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
  Investment,
  InvestmentTable,
  News
} from './definitions'
import { formatCurrency } from './utils'
import { unstable_noStore } from 'next/cache'
import { unstable_cache as cache } from 'next/cache'


//CONFIG
const ITEMS_PER_PAGE = 20 //items for pagination

//call these functions on the server side to protect the database, without 'use server' It is agnostic
//if you need to manipulate the data call on the server and pass it as props to a child component running on the client.

export async function fetchLatestTransactions() {
  try {
    const data = await sql<LatestTransactionRaw>`
      SELECT transactions.id, transactions.value, users.image_url, users.email
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
      SELECT COALESCE(SUM(tokens), 0) AS total_tokens
      FROM transactions
      WHERE userid = ${userid} and VAULT = 'FCA'`
    const totalTokensPromiseFCD = sql`
      SELECT COALESCE(SUM(tokens), 0) AS total_tokens
      FROM transactions
      WHERE userid = ${userid} and VAULT = 'FCD'`
    const valueStatusPromise = sql`
      SELECT 
        SUM(CASE WHEN vault = 'FCA' AND status = 'executed' THEN value ELSE 0 END) AS "executedValueFCA",
        SUM(CASE WHEN vault = 'FCA' AND status = 'pending' THEN value ELSE 0 END) AS "pendingValueFCA",
        SUM(CASE WHEN vault = 'FCD' AND status = 'executed' THEN value ELSE 0 END) AS "executedValueFCD",
        SUM(CASE WHEN vault = 'FCD' AND status = 'pending' THEN value ELSE 0 END) AS "pendingValueFCD"
      FROM transactions WHERE userid = ${userid}`

    const data = await Promise.all([ // initiate all promises at the same time, otherwise they start in a cascade.
      totalTokensPromiseFCA, //data[0]
      totalTokensPromiseFCD, //data[1]
      valueStatusPromise,   //data[2]
    ])
    return {
      totalTokensFCA: Number(data[0].rows[0].total_tokens) ?? 0,
      totalTokensFCD: Number(data[1].rows[0].total_tokens) ?? 0,
      executedValueFCA: Number(data[2].rows[0].executedValueFCA) ?? 0,
      pendingValueFCA: Number(data[2].rows[0].pendingValueFCA) ?? 0,
      executedValueFCD: Number(data[2].rows[0].executedValueFCD) ?? 0,
      pendingValueFCD: Number(data[2].rows[0].pendingValueFCD) ?? 0,
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
        transactions.notes,
        users.email,
        users.image_url
      FROM transactions
      JOIN users ON transactions.userid = users.id
      WHERE
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
        transactions.tokenprice,
        transactions.status,
        transactions.date,
        transactions.userid,
        transactions.notes
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
  try {
    const data = await sql<UserField>`
      SELECT
        id,
        email
      FROM users
      ORDER BY email ASC
    `
    return data.rows

  } catch (err) {
    console.error('Database Error:', err)
    throw new Error('Failed to fetch all users.')
  }
}

export async function fetchUsersInvestment(query: string) {
  try {
    const investmentData = await sql<InvestmentTable>`
      SELECT 
        u.id,
        u.email,
        u.image_url,
        COALESCE(SUM(t.tokens) FILTER (WHERE t.vault = 'FCA'), 0) AS fca_tokens,
        COALESCE(SUM(t.value) FILTER (WHERE t.vault = 'FCA'), 0) AS fca_deposited_usd,
        COALESCE(SUM(t.tokens) FILTER (WHERE t.vault = 'FCD'), 0) AS fcd_tokens,
        COALESCE(SUM(t.value) FILTER (WHERE t.vault = 'FCD'), 0) AS fcd_deposited_usd
      FROM users u
      LEFT JOIN transactions t ON u.id = t.userid
      WHERE
        u.email ILIKE ${`%${query}%`} OR
        u.id::text ILIKE ${`%${query}%`}
      GROUP BY u.id, u.email, u.image_url;
    `
    return investmentData.rows

  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch customer investment data..')
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
    LIMIT 2
    `
    const FCAprice = Number(data.rows[0].price)
    const FCDprice = Number(data.rows[1].price)

    return { FCAprice, FCDprice }

  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch last token prices.')
  }
}
//funcion para dejar cacheado el ultimo precio para todos los usuarios
export const cachedLastPrices = cache(fetchLastTokensPrices, ['tokenprices'], {
  revalidate: 3600, // 1 hour
  tags: ['tokenprices'],
})

export async function fetchUserTransactions(query: string, currentPage: number, userid: string) {
  console.log('fetchUserTransactions', query, currentPage, userid)
  const offset = (currentPage - 1) * ITEMS_PER_PAGE
  try {
    const transactions = await sql<UserTransaction> `
      SELECT
        transactions.id,
        transactions.value,
        transactions.tokens,
        transactions.vault,
        transactions.date,
        transactions.status,
        transactions.notes
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

export async function fetchLastNews() {
  try {
    const data = await sql<News>`
      SELECT
        news.id,
        news.title,
        news.content
      FROM news
      ORDER BY news.id DESC
      LIMIT 3
    `
    return data.rows

  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch last news.')
  }
}