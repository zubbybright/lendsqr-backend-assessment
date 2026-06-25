# Security Assessment & API Review Report

## Overview

This document describes the security considerations, API protection mechanisms, and failure handling strategies implemented in the Lendsqr Wallet Service. The application was built using Node.js, TypeScript, Express, KnexJS, and MySQL while following the assessment requirement of using a simplified (faux) authentication mechanism.

---

# Security Assessment

## Securing API Endpoints

Wallet operations are protected using an authentication middleware. Every protected endpoint requires an `Authorization` header in the following format:

```
Authorization: Bearer <user_id>
```

The middleware validates the header format, verifies that the supplied user exists in the database, and attaches the authenticated user to the request before allowing access to the requested resource.

Although this is a simplified authentication mechanism, it demonstrates route protection and authorization while remaining within the scope of the assessment.

---

## Authentication and Authorization

The assessment explicitly states that a full authentication system is not required. Therefore, a lightweight authentication approach was implemented.

The authentication middleware performs the following checks:

* Validates the Authorization header.
* Extracts the user identifier.
* Confirms that the user exists.
* Rejects unauthenticated requests with the appropriate HTTP status code.
* Makes the authenticated user available throughout the request lifecycle.

Only authenticated users are allowed to perform wallet operations such as funding, withdrawing, and transferring funds.

---

## Input Validation

All incoming request payloads are validated using **Zod** before reaching the business logic.

Validation includes:

* Required fields
* Email format validation
* Minimum password length
* Positive monetary amounts
* Required transfer recipient information

Invalid requests are rejected immediately with descriptive validation errors.

This prevents malformed or invalid data from reaching the service and database layers.

---

## Password Security

Passwords are never stored in plain text.

Before persisting a user record, passwords are hashed using **bcrypt**. Only the hashed password is stored in the database.

This ensures that even if the database were compromised, user passwords would not be directly exposed.

---

## Karma Blacklist Verification

Before onboarding a new user, the application verifies the supplied email address against the Lendsqr Adjutor Karma blacklist.

If a matching record is found, registration is rejected immediately.

This satisfies one of the primary functional requirements of the assessment while demonstrating secure integration with an external verification service.

---

## Database Protection

The application uses KnexJS to communicate with MySQL.

Using parameterized queries through Knex helps reduce the risk of SQL injection attacks by preventing user input from being directly concatenated into SQL statements.

---

## Transaction Integrity

Financial operations are executed within database transactions.

Transactions are used during:

* User registration (user creation + wallet creation)
* Wallet funding
* Wallet withdrawal
* Wallet transfers

If any operation within a transaction fails, the entire transaction is rolled back to prevent partial updates and maintain data consistency.

This guarantees that wallet balances and transaction records remain synchronized.

---

## Production Security Improvements

If this application were deployed to production, the following additional security measures would be implemented:

* JWT-based authentication
* Refresh token rotation
* HTTPS enforcement
* Role-based authorization
* Rate limiting
* Request logging and audit trails
* API versioning
* Account lockout after repeated failed authentication attempts
* Secrets management using a secure vault
* Monitoring and alerting for suspicious activities

---

# Failure Handling & Debugging Assessment

## Error Handling

The application uses centralized error handling middleware to provide consistent API responses.

Known application errors return meaningful HTTP status codes, while unexpected exceptions return a generic internal server error response.

This approach prevents sensitive implementation details from being exposed to API consumers while maintaining a consistent error format.

---

## Debugging and Issue Diagnosis

Application issues are diagnosed through:

* Meaningful HTTP status codes
* Consistent error messages
* Centralized exception handling
* Automated integration tests using Jest and Supertest

These mechanisms make it easier to reproduce issues and identify the source of failures during development.

---

## Logging and Monitoring

For this assessment, application errors are logged to the console during development.

In a production environment, a centralized logging solution such as Winston or Pino, combined with monitoring platforms such as Grafana, Datadog, or CloudWatch, would be used to collect logs, monitor application health, and trigger alerts when failures occur.

---

## Example Failure Scenario

A common failure scenario is a user attempting to transfer more funds than are available in their wallet.

The application handles this by:

1. Retrieving the sender's wallet.
2. Verifying the available balance.
3. Rejecting the request if the balance is insufficient.
4. Returning an appropriate error response.
5. Preventing any database updates.

Because the transfer process is executed inside a database transaction, no partial debit or credit operations can occur.

This preserves both financial integrity and transactional consistency.

---

# Conclusion

The implementation focuses on secure request validation, protected API endpoints, safe password storage, transactional consistency, and structured error handling while remaining within the scope of the assessment.

Although a simplified authentication mechanism was used as permitted by the assessment requirements, the overall architecture was designed with production best practices in mind and can be extended to support a full authentication and authorization system with minimal architectural changes.
