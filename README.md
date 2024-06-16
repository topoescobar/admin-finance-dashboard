## Next.js

Aplicacion con **next.js 14**, usando server actions para las peticiones al backend

## Crear tablas
El archivo seed de la carpeta scripts permite crear tablas con datos genéricos, el comando esta configurado en package.json, ejecutable con 
```
npm seed
```
o query a la BD
```sql
CREATE TABLE Customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    image_url TEXT
);

CREATE TABLE Users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    username VARCHAR(255) NOT NULL,
    customerId UUID, 
    CONSTRAINT fk_customer
      FOREIGN KEY(customerId) 
      REFERENCES Customers(id)
);

CREATE TABLE Transactions (
    id SERIAL PRIMARY KEY,
    customerId UUID NOT NULL,
    value NUMERIC(10, 2) NOT NULL,
    tokens NUMERIC(10, 2) NOT NULL,
    vault VARCHAR(255) NOT NULL,
    status VARCHAR(10) NOT NULL, 
    date DATE NOT NULL,
    CONSTRAINT fk_customer
      FOREIGN KEY(customerId) 
      REFERENCES Customers(id)
);

```

## ERD para la base de datos
```mermaid
erDiagram
    CUSTOMERS {
        string id PK
        string name
        string email
        string image_url
    }

    USERS {
        int id PK
        string customerId FK
        string email
        string password
        string username
    }

    TransactionS {
        string id PK
        string customerId FK
        number value
        number tokens
        string vault
        string status
        timestamp date
    }

    CUSTOMERS ||--|| USERS : "has"
    CUSTOMERS ||--o{ TransactionS : "makes"
```
