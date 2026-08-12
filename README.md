# Mini ERP + CRM Operations Portal

A full-stack ERP/CRM operations portal for wholesale and distribution businesses.

## Live Demo

### Frontend
https://mini-erp-crm-one-zeta.vercel.app/

### Backend API
https://mini-erp-crm-production-c9a2.up.railway.app/

### GitHub
https://github.com/Sheel34/mini-erp-crm

---

## Quick Navigation

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Demo Credentials](#demo-credentials)
- [API Documentation](./docs/API.md)
- [Architecture](#architecture)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)

---

# Features

## Authentication & Role-Based Access

The application supports four roles:

- Administrator
- Sales
- Warehouse
- Accounts

Authentication uses JWT tokens with bcrypt password hashing.

## Customer CRM

- Create customers
- Edit customers
- Search customers
- Customer types:
  - Retail
  - Wholesale
  - Distributor
- Customer status:
  - Lead
  - Active
  - Inactive
- GST number
- Address
- Follow-up date
- Notes
- Follow-up records

## Product Management

- Create products
- Edit products
- Search products
- SKU
- Category
- Unit price
- Current stock
- Minimum stock
- Warehouse/location
- Inventory history

## Inventory

The backend supports:

- Stock IN movements
- Stock OUT movements
- Movement reason
- User tracking
- Timestamp
- Low-stock detection
- Protection against negative stock

## Sales Challans

The backend supports:

- Customer selection
- Multiple products
- Quantities
- Automatic challan numbers
- Draft status
- Confirmation
- Cancellation
- Atomic stock deduction
- Insufficient-stock validation
- Product snapshot data

---

# Technology Stack

## Frontend

- React
- TypeScript
- Vite
- CSS

## Backend

- Node.js
- TypeScript
- Express.js
- REST API
- JWT
- bcryptjs

## Database

- PostgreSQL
- Prisma ORM

## Deployment

- Frontend: Vercel
- Backend: Railway
- Database: PostgreSQL / Neon

---

# Demo Credentials

These accounts are intended for evaluation/demo purposes.

| Role | Email | Password |
|---|---|---|
| Administrator | admin@minierp.demo | Admin@123 |
| Sales | sales@minierp.demo | Sales@123 |
| Warehouse | warehouse@minierp.demo | Warehouse@123 |
| Accounts | accounts@minierp.demo | Accounts@123 |

> These are demo credentials only and should not be reused for production systems.

---

# Architecture

```text
                 ┌─────────────────────┐
                 │       Vercel        │
                 │   React Frontend    │
                 └──────────┬──────────┘
                            │ HTTPS REST
                            ▼
                 ┌─────────────────────┐
                 │      Railway        │
                 │ Express + TypeScript│
                 └──────────┬──────────┘
                            │
                         Prisma
                            │
                            ▼
                 ┌─────────────────────┐
                 │     PostgreSQL      │
                 │ Hosted Database     │
                 └─────────────────────┘