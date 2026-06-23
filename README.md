# Lendsqr Backend Assessment
Backend Wallet Service built with Node.js, TypeScript, KnexJS, and MySQL for the Lendsqr Backend Engineering Assessment.

## Overview
This project implements a wallet service that allows users to:

- Create an account
- Fund their wallet
- Transfer funds to other users
- Withdraw funds
- Prevent onboarding of users found in the Lendsqr Adjutor Karma blacklist

## Features

- User onboarding
- Wallet creation
- Wallet funding
- Wallet transfers
- Wallet withdrawals
- Karma blacklist verification
- Faux token authentication
- Transaction management
- Unit testing

## Architecture
*To be completed*

## Database Design
The application uses a relational database design with three core entities: Users, Wallets, and Transactions.

### Users
The users table stores account information for registered users.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| first_name | VARCHAR | User's first name |
| last_name | VARCHAR | User's last name |
| email | VARCHAR | Unique email address |
| phone | VARCHAR | Unique phone number |
| password_hash | VARCHAR | Hashed password |
| created_at | TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | Record update timestamp |
### Wallets
Each user is assigned a single wallet upon successful onboarding.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| user_id | BIGINT | Foreign key to users table |
| balance | DECIMAL(15,2) | Current wallet balance |
| created_at | TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | Record update timestamp |
### Transactions
The transactions table serves as the wallet ledger and stores all wallet activities.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| wallet_id | BIGINT | Foreign key to wallets table |
| transaction_type | VARCHAR | Transaction category |
| amount | DECIMAL(15,2) | Transaction amount |
| reference | VARCHAR | Unique transaction reference |
| related_wallet_id | BIGINT | Related wallet for transfer operations |
| status | VARCHAR | Transaction status |
| description | TEXT | Transaction description |
| created_at | TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | Record update timestamp |
### Transaction Types
The following transaction types are supported:

- FUND
- WITHDRAWAL
- TRANSFER_SENT
- TRANSFER_RECEIVED

### Relationships

- A User has one Wallet (1:1)
- A Wallet belongs to one User
- A Wallet can have many Transactions (1:M)
- A Transaction belongs to one Wallet

This design provides a clear audit trail for all wallet activities and supports transactional consistency during money movement operations.

## ER Diagram
*To be completed*

## API Documentation

### Authentication

#### Login

```
POST /api/auth/login
```
Authenticates a user and returns a token used for subsequent requests.

### Users

#### Create User

```
POST /api/users
```
Creates a new user account after validating that the user is not present on the Lendsqr Adjutor Karma blacklist. A wallet is automatically created for successful registrations.

### Wallet

#### Fund Wallet

```
POST /api/wallets/fund
```
Adds funds to the authenticated user's wallet.

#### Transfer Funds

```
POST /api/wallets/transfer
```
Transfers funds from the authenticated user's wallet to another user's wallet.

#### Withdraw Funds

```
POST /api/wallets/withdraw
```
Withdraws funds from the authenticated user's wallet.

#### Get Wallet Balance

```
GET /api/wallets/balance
```
Returns the current balance of the authenticated user's wallet.

#### Get Transaction History

```
GET /api/wallets/transactions
```
Returns all transactions associated with the authenticated user's wallet.

Detailed request and response examples will be added as implementation progresses.

## Authentication Strategy
The assessment requirements specify that a full authentication system is not required. Therefore, a simplified token-based authentication approach is used.

### Registration
Users register with:

- First name
- Last name
- Email address
- Phone number
- Password

Passwords are hashed before being stored in the database.

### Login
Users authenticate using their email address and password.

Upon successful authentication, the API returns a token which is used to access protected endpoints.

Example:

```
Authorization: Bearer user-1
```

### Protected Routes
The following endpoints require authentication:

- Fund Wallet
- Transfer Funds
- Withdraw Funds
- Get Wallet Balance
- Get Transaction History

An authentication middleware validates the token, identifies the user, and attaches the authenticated user's information to the request.

This simplified authentication approach satisfies the assessment requirements while keeping the implementation lightweight and focused on wallet functionality.

## Transaction Strategy
*To be completed*

## Security Considerations
*To be completed*

## Testing
*To be completed*

## Setup Instructions
*To be completed*

## Deployment
*To be completed*