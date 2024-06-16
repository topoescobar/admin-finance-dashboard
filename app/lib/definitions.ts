// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
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

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestTransaction = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestTransactionRaw = Omit<LatestTransaction, 'amount'> & {
  amount: number;
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

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_transactions: number;
  total_pending: string;
  total_tokens: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type TransactionForm = {
  id: string
  customer_id: string
  value: number
  tokens: number
  status: 'pending' | 'paid'
  date: Date
}

export type TokenPriceTable = {
  id: string
  date: Date,
  tokenname: string,
  price: number
}

export type StatusColorType = {
  [key: string]: string
  Organic: string
  Sponsored: string
}