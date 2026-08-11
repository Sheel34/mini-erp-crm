# Project Requirements

## 1. Project Goal

Build a web-based operations portal for a wholesale/distribution workflow.

The application will provide role-aware access to customer management,
product and inventory management, and sales challan processing.

The system should demonstrate a complete full-stack workflow rather than
only isolated CRUD screens.

---

## 2. Technology Constraints

### Backend

- Node.js
- TypeScript
- Express.js
- REST API
- PostgreSQL

### Frontend

- React
- TypeScript
- HTML
- CSS
- Responsive interface

### Supporting Requirements

- Input validation
- Appropriate HTTP status codes
- Consistent error handling
- Environment-based configuration
- GitHub repository with meaningful commits
- Project documentation
- Deployment

---

## 3. Authentication and Authorization

The system will support four application roles:

- ADMIN
- SALES
- WAREHOUSE
- ACCOUNTS

Authentication will use JWT-based login.

Authorization must be enforced by the backend.

Frontend visibility of features must not be treated as a security boundary.

### Acceptance Criteria

- [ ] User can log in with valid credentials.
- [ ] Invalid credentials are rejected.
- [ ] Protected API endpoints reject unauthenticated requests.
- [ ] Role restrictions are enforced by the backend.
- [ ] Test credentials are available for all four roles.

---

## 4. Customer Management

Customer records must support:

- Name
- Mobile number
- Email
- Business name
- Optional GST number
- Customer type
- Address
- Status
- Follow-up date
- Notes

Customer types:

- RETAIL
- WHOLESALE
- DISTRIBUTOR

Customer statuses:

- LEAD
- ACTIVE
- INACTIVE

### Required Operations

- [ ] Create customer
- [ ] Edit customer
- [ ] Search customers
- [ ] View customer details
- [ ] Add follow-up notes

---

## 5. Product and Inventory Management

Products must support:

- Product name
- SKU/code
- Category
- Unit price
- Current stock
- Minimum stock threshold
- Warehouse/location

### Required Operations

- [ ] Create product
- [ ] Edit product
- [ ] View products
- [ ] Identify products at or below the minimum stock threshold

---

## 6. Stock Movement

Inventory changes must be auditable.

Every stock movement should record:

- Product
- Quantity changed
- Movement direction
- Reason
- User responsible for the change
- Timestamp

Movement directions:

- IN
- OUT

### Acceptance Criteria

- [ ] Stock increases generate an IN movement.
- [ ] Stock decreases generate an OUT movement.
- [ ] The responsible user is recorded.
- [ ] A reason is recorded.
- [ ] The movement timestamp is stored.
- [ ] Stock history can be viewed for a product.

---

## 7. Sales Challans

A sales user must be able to create a challan for a customer containing multiple products.

Each challan should contain:

- Challan number
- Customer
- Items
- Total quantity
- Status
- Creator
- Creation date

Supported statuses:

- DRAFT
- CONFIRMED
- CANCELLED

### Required Operations

- [ ] Select a customer
- [ ] Add multiple products
- [ ] Specify quantities
- [ ] Generate challan number
- [ ] Save as draft
- [ ] Confirm challan
- [ ] Cancel challan where supported

---

## 8. Challan and Inventory Business Rules

These rules are critical.

### Draft

Creating a draft challan must not reduce inventory.

### Confirmation

Confirming a challan must:

1. Validate the challan.
2. Verify that all referenced products exist.
3. Verify that requested quantities are valid.
4. Check current stock for every item.
5. Reject the operation if any item has insufficient stock.
6. Reduce stock for all confirmed items.
7. Create corresponding OUT stock movements.
8. Mark the challan as CONFIRMED.

### Inventory Safety

Stock must never become negative through a normal application operation.

If any item has insufficient stock, the confirmation must fail without leaving partial inventory changes behind.

### Product Snapshot

Challan items must preserve the product information relevant to the transaction at the time the challan is created.

Historical challan information must not unexpectedly change when the current product record is edited later.

---

## 9. API Requirements

The backend must expose clean REST endpoints.

The API should support:

- Authentication
- Customers
- Customer follow-ups
- Products
- Stock movements
- Sales challans

### API Quality Requirements

- [ ] Request validation
- [ ] Appropriate HTTP status codes
- [ ] Consistent error responses
- [ ] Pagination where useful
- [ ] Search/filter functionality where useful
- [ ] Authentication middleware
- [ ] Role authorization middleware
- [ ] Centralized error handling

---

## 10. Frontend Requirements

The frontend should provide a clean administrative interface.

Required areas:

- [ ] Login
- [ ] Dashboard
- [ ] Customers
- [ ] Customer details
- [ ] Products
- [ ] Inventory
- [ ] Sales challans

The interface must remain usable on different screen sizes.

---

## 11. Deployment

The application must be deployable without requiring paid infrastructure.

Target deployment architecture:

- Frontend: hosted static React application
- Backend: hosted Node.js service
- Database: hosted PostgreSQL service

The final project must document:

- Server setup
- Environment variables
- Local execution
- Database setup
- Deployment procedure
- Project assumptions

---

## 12. API Testing

A Postman collection or equivalent API documentation must be included.

Important scenarios to test:

### Authentication

- [ ] Valid login
- [ ] Invalid credentials
- [ ] Missing authentication token
- [ ] Unauthorized role

### Customers

- [ ] Create
- [ ] List
- [ ] Search
- [ ] Pagination
- [ ] View details
- [ ] Update
- [ ] Add follow-up

### Products

- [ ] Create
- [ ] List
- [ ] Update
- [ ] View stock movements

### Challans

- [ ] Create draft
- [ ] Multiple products
- [ ] Confirm
- [ ] Insufficient stock
- [ ] Product snapshot
- [ ] Invalid quantity
- [ ] Invalid product
- [ ] Duplicate confirmation

---

## 13. Documentation

The final repository should contain:

- [ ] README
- [ ] Architecture explanation
- [ ] Local setup instructions
- [ ] Environment variable documentation
- [ ] Deployment instructions
- [ ] API documentation/Postman collection
- [ ] Test credentials
- [ ] Assumptions
- [ ] Known limitations

---

## 14. Optional Enhancements

These are secondary to the required functionality.

- [ ] Docker setup
- [ ] GitHub Actions
- [ ] PDF export
- [ ] Product image storage using object storage

Optional features must not delay completion of the required system.

---

## 15. Definition of Done

The project is considered ready for submission when:

- [ ] Required backend modules work.
- [ ] Required frontend flows work.
- [ ] Authentication and authorization work.
- [ ] Database relationships are correct.
- [ ] Inventory cannot become negative through challan confirmation.
- [ ] Challan confirmation is handled transactionally.
- [ ] Product snapshots work.
- [ ] API validation and errors are handled.
- [ ] API collection/documentation is included.
- [ ] Application is deployed or a complete local fallback is provided.
- [ ] README is complete.
- [ ] Git history contains meaningful logical commits.
- [ ] Known limitations are documented.