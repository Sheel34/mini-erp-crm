# System Architecture

## 1. Overview

The application follows a client-server architecture.

The frontend is responsible for presenting operational workflows to
users, while the backend exposes REST APIs and contains the business
rules required to keep the system consistent.

PostgreSQL is used as the persistent data store.

## 2. High-Level Architecture

```text
┌─────────────────────┐
│    React Frontend   │
│                     │
│  Login / Dashboard  │
│  Customers          │
│  Products           │
│  Inventory          │
│  Challans           │
└──────────┬──────────┘
           │
           │ HTTPS / REST
           ▼
┌─────────────────────┐
│   Express Backend   │
│                     │
│ Routes              │
│ Middleware          │
│ Controllers         │
│ Services            │
│ Validation          │
└──────────┬──────────┘
           │
           │ Prisma
           ▼
┌─────────────────────┐
│     PostgreSQL      │
│                     │
│ Users               │
│ Customers           │
│ Products            │
│ Stock Movements     │
│ Sales Challans      │
│ Challan Items       │
│ Follow-ups          │
└─────────────────────┘