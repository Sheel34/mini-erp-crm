import { useState } from "react";
import Login from "./pages/Login";
import Customers from "./pages/Customers";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type Module = "dashboard" | "customers" | "products" | "inventory" | "challans";

function getStoredUser(): User | null {
  const stored = localStorage.getItem("user");

  if (!stored) return null;

  try {
    return JSON.parse(stored) as User;
  } catch {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return null;
  }
}

function App() {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [module, setModule] = useState<Module>("dashboard");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const canSeeCustomers =
    user.role === "ADMIN" ||
    user.role === "SALES" ||
    user.role === "ACCOUNTS";

  const canSeeProducts =
    user.role === "ADMIN" || user.role === "WAREHOUSE";

  const canSeeInventory =
    user.role === "ADMIN" || user.role === "WAREHOUSE";

  const canSeeChallans =
    user.role === "ADMIN" ||
    user.role === "SALES" ||
    user.role === "ACCOUNTS";

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span>MINI</span>
          <strong>ERP</strong>
        </div>

        <nav>
          <button
            className={module === "dashboard" ? "active" : ""}
            onClick={() => setModule("dashboard")}
          >
            Dashboard
          </button>

          {canSeeCustomers && (
            <button
              className={module === "customers" ? "active" : ""}
              onClick={() => setModule("customers")}
            >
              Customers
            </button>
          )}

          {canSeeProducts && (
            <button
              className={module === "products" ? "active" : ""}
              onClick={() => setModule("products")}
            >
              Products
            </button>
          )}

          {canSeeInventory && (
            <button
              className={module === "inventory" ? "active" : ""}
              onClick={() => setModule("inventory")}
            >
              Inventory
            </button>
          )}

          {canSeeChallans && (
            <button
              className={module === "challans" ? "active" : ""}
              onClick={() => setModule("challans")}
            >
              Sales Challans
            </button>
          )}
        </nav>

        <div className="sidebar-user">
          <strong>{user.name}</strong>
          <span>{user.role}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <div className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">MINI ERP / CRM</p>
            <h1>
              {module === "dashboard"
                ? "Dashboard"
                : module === "customers"
                  ? "Customers"
                  : module === "products"
                    ? "Products"
                    : module === "inventory"
                      ? "Inventory"
                      : "Sales Challans"}
            </h1>
          </div>

          <div className="user-area">
            <span>{user.name}</span>
            <span className="role-pill">{user.role}</span>
          </div>
        </header>

        {module === "dashboard" && (
          <section className="dashboard-content">
            <div className="welcome">
              <p className="eyebrow">OVERVIEW</p>
              <h2>Welcome back, {user.name}</h2>
              <p>
                Manage customers, products, inventory and sales operations
                from one workspace.
              </p>
            </div>

            <div className="dashboard-grid">
              {canSeeCustomers && (
                <button onClick={() => setModule("customers")}>
                  <span>01</span>
                  <h3>Customers</h3>
                  <p>Manage customer records and follow-ups.</p>
                </button>
              )}

              {canSeeProducts && (
                <button onClick={() => setModule("products")}>
                  <span>02</span>
                  <h3>Products</h3>
                  <p>Manage products, pricing and stock levels.</p>
                </button>
              )}

              {canSeeInventory && (
                <button onClick={() => setModule("inventory")}>
                  <span>03</span>
                  <h3>Inventory</h3>
                  <p>Track stock movements and low-stock items.</p>
                </button>
              )}

              {canSeeChallans && (
                <button onClick={() => setModule("challans")}>
                  <span>04</span>
                  <h3>Sales Challans</h3>
                  <p>Create drafts and confirm stock-affecting sales.</p>
                </button>
              )}
            </div>
          </section>
        )}

        {module === "customers" && <Customers />}

        {module === "products" && (
          <section className="module">
            <div className="module-header">
              <div>
                <p className="eyebrow">CATALOG</p>
                <h2>Products</h2>
              </div>
            </div>
            <div className="empty-module">
              Product management is next.
            </div>
          </section>
        )}

        {module === "inventory" && (
          <section className="module">
            <div className="module-header">
              <div>
                <p className="eyebrow">WAREHOUSE</p>
                <h2>Inventory</h2>
              </div>
            </div>
            <div className="empty-module">
              Inventory management is next.
            </div>
          </section>
        )}

        {module === "challans" && (
          <section className="module">
            <div className="module-header">
              <div>
                <p className="eyebrow">SALES</p>
                <h2>Sales Challans</h2>
              </div>
            </div>
            <div className="empty-module">
              Challan management is next.
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default App;
