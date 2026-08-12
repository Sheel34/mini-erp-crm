\# 🚀 Mini ERP + CRM API



> Production REST API for the Mini ERP \& CRM Operations Portal.



\*\*Base URL:\*\*  

\[`https://mini-erp-crm-production-c9a2.up.railway.app/api`](https://mini-erp-crm-production-c9a2.up.railway.app/api)



\*\*Frontend:\*\*  

\[`https://mini-erp-crm-one-zeta.vercel.app`](https://mini-erp-crm-one-zeta.vercel.app)



\---



\## 📋 Table of Contents



\- \[Authentication](#authentication)

\- \[API Root](#api-root)

\- \[Health Check](#health-check)

\- \[Customers](#customers)

\- \[Products](#products)

\- \[Inventory](#inventory)

\- \[Sales Challans](#sales-challans)

\- \[Roles \& Authorization](#roles--authorization)

\- \[HTTP Status Codes](#http-status-codes)

\- \[Example Authentication Flow](#example-authentication-flow)

\- \[Demo Accounts](#demo-accounts)

\- \[Production Endpoints](#production-endpoints)



\---



\## 🔐 Authentication



Protected endpoints require a \*\*JWT access token\*\*.  

Include it in the `Authorization` header:



```http

Authorization: Bearer <JWT\_TOKEN>

```



Tokens are issued by the login endpoint and are valid for the configured token lifetime.



\---



\## 🏠 API Root



\### `GET /api`



Returns basic API information.



\*\*Response:\*\*



```json

{

&#x20; "name": "Mini ERP CRM API",

&#x20; "version": "1.0.0"

}

```



\---



\## 💚 Health Check



\### `GET /api/health`



Checks API availability and database connectivity.



\*\*Example response:\*\*



```json

{

&#x20; "status": "ok",

&#x20; "database": "connected"

}

```



\*\*Production URL:\*\*  

\[`https://mini-erp-crm-production-c9a2.up.railway.app/api/health`](https://mini-erp-crm-production-c9a2.up.railway.app/api/health)



\---



\## 🔑 Authentication Endpoints



\### Register



\*\*`POST /api/auth/register`\*\*  

Creates a new user.



\*\*Request body:\*\*



```json

{

&#x20; "name": "Demo User",

&#x20; "email": "demo@example.com",

&#x20; "password": "Password@123"

}

```



> Password must contain at least 8 characters.



\*\*Response (201 Created):\*\*



```json

{

&#x20; "user": {

&#x20;   "id": "USER\_ID",

&#x20;   "name": "Demo User",

&#x20;   "email": "demo@example.com",

&#x20;   "role": "SALES",

&#x20;   "createdAt": "..."

&#x20; }

}

```



\---



\### Login



\*\*`POST /api/auth/login`\*\*  

Authenticates a user and returns a JWT token.



\*\*Request:\*\*



```json

{

&#x20; "email": "sales@minierp.demo",

&#x20; "password": "Sales@123"

}

```



\*\*Response:\*\*



```json

{

&#x20; "token": "JWT\_TOKEN",

&#x20; "user": {

&#x20;   "id": "USER\_ID",

&#x20;   "name": "Demo Sales",

&#x20;   "email": "sales@minierp.demo",

&#x20;   "role": "SALES"

&#x20; }

}

```



\---



\### Current User



\*\*`GET /api/auth/me`\*\*  

Returns the currently authenticated user.



> 🔒 \*\*Authentication required.\*\*



\*\*Response:\*\*



```json

{

&#x20; "user": {

&#x20;   "id": "USER\_ID",

&#x20;   "name": "Demo Sales",

&#x20;   "email": "sales@minierp.demo",

&#x20;   "role": "SALES",

&#x20;   "createdAt": "..."

&#x20; }

}

```



\---



\## 👥 Customers



All customer endpoints require authentication.



\### Create Customer



\*\*`POST /api/customers`\*\*



\*\*Required fields:\*\*  

`name`, `mobile`, `businessName`, `customerType`, `address`



\*\*Optional fields:\*\*  

`email`, `gstNumber`, `status`, `followUpDate`, `notes`



\*\*Request:\*\*



```json

{

&#x20; "name": "Rahul Sharma",

&#x20; "mobile": "9876543210",

&#x20; "email": "rahul@example.com",

&#x20; "businessName": "Sharma Traders",

&#x20; "gstNumber": "24ABCDE1234F1Z5",

&#x20; "customerType": "WHOLESALE",

&#x20; "address": "Vadodara, Gujarat",

&#x20; "status": "ACTIVE",

&#x20; "followUpDate": "2026-08-20",

&#x20; "notes": "Regular wholesale customer"

}

```



\*\*Response (201 Created):\*\*



```json

{

&#x20; "customer": { /\* ... \*/ }

}

```



\---



\### List \& Search Customers



\*\*`GET /api/customers`\*\*



Returns a paginated customer list.



| Parameter | Description | Default |

|-----------|-------------|---------|

| `page`    | Page number | 1       |

| `limit`   | Results per page (max 100) | 10 |

| `search`  | Searches name, business name, and mobile | — |



\*\*Example:\*\*  

`GET /api/customers?page=1\&limit=10\&search=rahul`



\*\*Response:\*\*



```json

{

&#x20; "data": \[ /\* customers \*/ ],

&#x20; "pagination": {

&#x20;   "page": 1,

&#x20;   "limit": 10,

&#x20;   "total": 0,

&#x20;   "totalPages": 0

&#x20; }

}

```



\---



\### Get Customer



\*\*`GET /api/customers/:id`\*\*



Returns a customer and associated follow-up records.



> 🔒 \*\*Authentication required.\*\*



\---



\### Update Customer



\*\*`PUT /api/customers/:id`\*\*



Supports updating:  

`name`, `mobile`, `email`, `businessName`, `gstNumber`, `customerType`, `address`, `status`, `followUpDate`, `notes`.



> 🔒 \*\*Authentication required.\*\*



\---



\### Delete Customer



\*\*`DELETE /api/customers/:id`\*\*



> 🔒 \*\*Authentication required.\*\*



\*\*Response:\*\* `204 No Content`



\---



\### Add Customer Follow-up



\*\*`POST /api/customers/:id/follow-ups`\*\*



\*\*Request:\*\*



```json

{

&#x20; "note": "Call customer regarding next order",

&#x20; "followUpDate": "2026-08-20"

}

```



Both fields are required.



> 🔒 \*\*Authentication required.\*\*



\*\*Response (201 Created):\*\*



```json

{

&#x20; "followUp": { /\* ... \*/ }

}

```



\---



\## 📦 Products



All product endpoints require authentication.



\### Create Product



\*\*`POST /api/products`\*\*



\*\*Required fields:\*\*  

`name`, `sku`, `category`, `unitPrice`, `minimumStock`, `warehouse`



\*\*Request:\*\*



```json

{

&#x20; "name": "Industrial Cable",

&#x20; "sku": "CAB-001",

&#x20; "category": "Electrical",

&#x20; "unitPrice": 1250,

&#x20; "minimumStock": 10,

&#x20; "warehouse": "Main Warehouse"

}

```



> `unitPrice` and `minimumStock` cannot be negative.



\*\*Response (201 Created):\*\*



```json

{

&#x20; "product": { /\* ... \*/ }

}

```



\---



\### List \& Search Products



\*\*`GET /api/products`\*\*



| Parameter | Description |

|-----------|-------------|

| `search`  | Searches product name, SKU, and category |



\*\*Example:\*\*  

`GET /api/products?search=cable`



\---



\### Get Product



\*\*`GET /api/products/:id`\*\*



Returns product information and up to the 20 most recent stock movements.



\---



\### Update Product



\*\*`PUT /api/products/:id`\*\*



Supports updating:  

`name`, `category`, `unitPrice`, `minimumStock`, `warehouse`.



> ⚠️ The SKU is \*\*not\*\* changed by this endpoint.



\---



\### Delete Product



\*\*`DELETE /api/products/:id`\*\*



Deletes a product only if it has:

\- no current stock

\- no inventory movement history

\- no sales challan transactions



\*\*Response:\*\* `204 No Content`  



\*\*If product has history/transactions:\*\*  

`409 Conflict`



\---



\## 📊 Inventory



All inventory endpoints require authentication.



\### Create Stock Movement



\*\*`POST /api/inventory/movements`\*\*



> 🔒 \*\*Allowed roles:\*\* `ADMIN`, `WAREHOUSE`



\*\*Request:\*\*



```json

{

&#x20; "productId": "PRODUCT\_ID",

&#x20; "quantity": 20,

&#x20; "type": "IN",

&#x20; "reason": "New stock received"

}

```



\*\*Movement types:\*\* `IN` or `OUT`



\- Quantity must be a positive integer.

\- `IN` increases current stock; `OUT` decreases it.

\- `OUT` is rejected if stock is insufficient.

\- Stock update and movement creation occur \*\*inside a database transaction\*\*.



\---



\### Movement History



\*\*`GET /api/inventory/movements`\*\*



Optional query parameter: `productId`



\*\*Example:\*\*  

`GET /api/inventory/movements?productId=PRODUCT\_ID`



Returns the latest 100 movements.



\---



\### Low Stock



\*\*`GET /api/inventory/low-stock`\*\*



Returns products where `currentStock <= minimumStock`.



\---



\## 🧾 Sales Challans



All challan endpoints require authentication.



\### Create Draft Challan



\*\*`POST /api/challans`\*\*



> 🔒 \*\*Allowed roles:\*\* `ADMIN`, `SALES`



\*\*Request:\*\*



```json

{

&#x20; "customerId": "CUSTOMER\_ID",

&#x20; "items": \[

&#x20;   {

&#x20;     "productId": "PRODUCT\_ID",

&#x20;     "quantity": 2

&#x20;   }

&#x20; ]

}

```



\- At least one item is required.

\- Each quantity must be a positive integer.

\- The API generates a unique challan number and stores product information as a snapshot on each challan item.



\---



\### List Challans



\*\*`GET /api/challans`\*\*



Returns sales challans with customer and item information.



\---



\### Get Challan



\*\*`GET /api/challans/:id`\*\*



Returns a specific sales challan including customer, items, and product snapshot information.



\---



\### Confirm Challan



\*\*`POST /api/challans/:id/confirm`\*\*



Confirms a draft sales challan and deducts stock.



> 🔒 \*\*Allowed roles:\*\* `ADMIN`, `SALES`, `WAREHOUSE`



\*\*Confirmation behavior:\*\*

\- Verifies the challan exists and is in `DRAFT` status.

\- Verifies it contains items.

\- Checks stock availability for every item.

\- Deducts stock.

\- Creates corresponding `OUT` stock movements.

\- Changes challan status to `CONFIRMED`.



> ⚠️ The operation is \*\*transactional\*\*. If any item has insufficient stock, the entire transaction fails without partial changes.



\---



\### Cancel Challan



\*\*`POST /api/challans/:id/cancel`\*\*



Cancels a draft sales challan.



> 🔒 \*\*Allowed roles:\*\* `ADMIN`, `SALES`



Only draft challans can be cancelled.



\---



\## 🛡️ Roles \& Authorization



| Role       | Purpose |

|------------|---------|

| `ADMIN`    | Full administrative access |

| `SALES`    | Customer and sales operations |

| `WAREHOUSE`| Product and inventory operations |

| `ACCOUNTS` | Customer / accounts‑related operations |



Protected endpoints enforce role restrictions server‑side using authorization middleware.



\---



\## 📬 HTTP Status Codes



| Code | Meaning |

|------|---------|

| `200` | Request successful |

| `201` | Resource created |

| `204` | Resource successfully deleted |

| `400` | Invalid request or business validation failure |

| `401` | Authentication required or invalid credentials |

| `403` | Insufficient permissions |

| `404` | Resource not found |

| `409` | Resource / business‑rule conflict |

| `500` | Internal server error |

| `503` | Database unavailable (health check) |



\---



\## 🔄 Example Authentication Flow



\### 1. Login



```http

POST /api/auth/login

Content-Type: application/json



{

&#x20; "email": "sales@minierp.demo",

&#x20; "password": "Sales@123"

}

```



\### 2. Receive JWT



```json

{

&#x20; "token": "JWT\_TOKEN"

}

```



\### 3. Call a protected endpoint



```http

GET /api/customers

Authorization: Bearer JWT\_TOKEN

```



\---



\## 👤 Demo Accounts



These accounts are provided for evaluation.



| Role       | Email                         | Password      |

|------------|-------------------------------|---------------|

| Admin      | `admin@minierp.demo`          | `Admin@123`   |

| Sales      | `sales@minierp.demo`          | `Sales@123`   |

| Warehouse  | `warehouse@minierp.demo`      | `Warehouse@123` |

| Accounts   | `accounts@minierp.demo`       | `Accounts@123` |



All accounts are verified against the deployed production API.



\---



\## 🌐 Production Endpoints



| Resource     | URL |

|--------------|-----|

| Frontend     | \[`https://mini-erp-crm-one-zeta.vercel.app`](https://mini-erp-crm-one-zeta.vercel.app) |

| API          | \[`https://mini-erp-crm-production-c9a2.up.railway.app/api`](https://mini-erp-crm-production-c9a2.up.railway.app/api) |

| API Root     | \[`https://mini-erp-crm-production-c9a2.up.railway.app/api`](https://mini-erp-crm-production-c9a2.up.railway.app/api) |

| Health       | \[`https://mini-erp-crm-production-c9a2.up.railway.app/api/health`](https://mini-erp-crm-production-c9a2.up.railway.app/api/health) |

| Repository   | \[`https://github.com/Sheel34/mini-erp-crm`](https://github.com/Sheel34/mini-erp-crm) |



\---



> ✨ \*\*Built with precision for the Mini ERP + CRM Operations Portal.\*\*  

> \*This documentation is maintained alongside the codebase.\*

