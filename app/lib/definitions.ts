// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// These types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  image_url: string;
  role: string;
};

export type Transaction = {
  id: string;
  customer_id: string;
  value: number;
  tokens: number;
  vault: string;
  date: Date;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type UserTransaction = Omit<Transaction, 'customer_id'>

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestTransaction = {
  id: string;
  value: string;
  username: string;
  image_url: string;
  email: string;
};

// The database returns a number for value, but we later format it to a string with the formatCurrency function
export type LatestTransactionRaw = Omit<LatestTransaction, 'value'> & {
  value: number;
};

export type TransactionsTable = {
  id: string
  customer_id: string
  name: string
  email: string
  date: string
  value: number
  tokens: number
  status: 'pending' | 'paid'
}

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_transactions: number;
  total_pending: number;
  total_paid: number;
  total_tokens: number;
};
export type FormattedCustomersTable = { //revisar ya no seria necesaria
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_transactions: number;
  total_pending: number;
  total_tokens: number;
};

export type UserField = {
  id: string;
  username: string;
};

export type TransactionForm = {
  id: string
  value: number
  tokens: number
  vault: string
  status: 'pending' | 'paid'
  date: Date
  userid: string
}

export type TokenPriceTable = {
  id: string
  date: Date,
  tokenname: string,
  price: number
}

export type TokenPriceHistory = {
  id: string
  date: string,
  tokenname: string,
  price: number
}


export type StatusColorType = {
  [key: string]: string
  Organic: string
  Sponsored: string
}