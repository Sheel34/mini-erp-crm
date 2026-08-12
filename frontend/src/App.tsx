import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import { apiRequest } from "./api/client";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type Module =
  | "dashboard"
  | "customers"
  | "products"
  | "inventory"
  | "challans";

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

interface Customer {
  id: string;
  name: string;
  mobile: string;
  email?: string | null;
  businessName: string;
  customerType: string;
  status: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitPrice: number | string;
  currentStock: number;
  minimumStock: number;
  warehouse: string;
}

interface Challan {
  id: string;
  challanNumber: string;
  status: "DRAFT" | "CONFIRMED" | "CANCELLED";
}

function App() {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [module, setModule] = useState<Module>("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const stored = localStorage.getItem("theme");
    return stored === "light" ? "light" : "dark";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  function handleLogin(loggedInUser: User) {
    setUser(loggedInUser);
    setModule("dashboard");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
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

  const roleLabel =
    user.role === "ADMIN"
      ? "Administrator"
      : user.role === "SALES"
      ? "Sales"
      : user.role === "WAREHOUSE"
      ? "Warehouse"
      : user.role === "ACCOUNTS"
      ? "Accounts"
      : user.role;

  function navigate(nextModule: Module) {
    setModule(nextModule);
    setMobileNavOpen(false);
  }

  const pageTitles: Record<Module, string> = {
    dashboard: "Dashboard",
    customers: "Customers",
    products: "Products",
    inventory: "Inventory",
    challans: "Sales Challans",
  };

  return (
    <div className={`app-shell role-${user.role.toLowerCase()}`}>
      {mobileNavOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileNavOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-top">
          <button
            className="mobile-close"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation"
          >
            ×
          </button>

          <button
            className="brand"
            onClick={() => navigate("dashboard")}
            aria-label="Go to dashboard"
          >
            <span className="brand-mark">M</span>
            <span className="brand-text">
              <strong>MINI</strong>
              <span>ERP / CRM</span>
            </span>
          </button>

          <div className="workspace-label">WORKSPACE</div>

          <nav className="sidebar-nav">
            <button
              className={module === "dashboard" ? "nav-item active" : "nav-item"}
              onClick={() => navigate("dashboard")}
            >
              <span className="nav-icon">⌂</span>
              <span>Dashboard</span>
            </button>

            {canSeeCustomers && (
              <button
                className={
                  module === "customers" ? "nav-item active" : "nav-item"
                }
                onClick={() => navigate("customers")}
              >
                <span className="nav-icon">◎</span>
                <span>Customers</span>
              </button>
            )}

            {canSeeProducts && (
              <button
                className={
                  module === "products" ? "nav-item active" : "nav-item"
                }
                onClick={() => navigate("products")}
              >
                <span className="nav-icon">◇</span>
                <span>Products</span>
              </button>
            )}

            {canSeeInventory && (
              <button
                className={
                  module === "inventory" ? "nav-item active" : "nav-item"
                }
                onClick={() => navigate("inventory")}
              >
                <span className="nav-icon">▦</span>
                <span>Inventory</span>
              </button>
            )}

            {canSeeChallans && (
              <button
                className={
                  module === "challans" ? "nav-item active" : "nav-item"
                }
                onClick={() => navigate("challans")}
              >
                <span className="nav-icon">▤</span>
                <span>Sales Challans</span>
              </button>
            )}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-user-card">
            <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div className="sidebar-user-info">
              <strong>{user.name}</strong>
              <span>{roleLabel}</span>
            </div>
            <span className="online-dot" />
          </div>

          <button className="logout-button" onClick={handleLogout}>
            <span>↪</span>
            Sign out
          </button>
        </div>
      </aside>

      <div className="content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation"
            >
              ☰
            </button>
            <div>
              <p className="eyebrow">MINI ERP / CRM</p>
              <h1>{pageTitles[module]}</h1>
            </div>
          </div>

          <div className="topbar-right">
            <div className="role-indicator">
              <span className="role-indicator-dot" />
              <span>{roleLabel}</span>
            </div>

            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? "☀" : "☾"}
            </button>

            <div className="topbar-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {module === "dashboard" && (
          <Dashboard
            user={user}
            canSeeCustomers={canSeeCustomers}
            canSeeProducts={canSeeProducts}
            canSeeInventory={canSeeInventory}
            canSeeChallans={canSeeChallans}
            navigate={navigate}
          />
        )}

        {module === "customers" && <Customers />}

        {module === "products" && <Products />}

        {module === "inventory" && (
          <PlaceholderModule
            eyebrow="WAREHOUSE"
            title="Inventory"
            description="Track stock movements, stock health and warehouse activity."
            icon="▦"
          />
        )}

        {module === "challans" && (
          <PlaceholderModule
            eyebrow="SALES OPERATIONS"
            title="Sales Challans"
            description="Create drafts, manage line items and confirm stock-affecting sales."
            icon="▤"
          />
        )}
      </div>
    </div>
  );
}

type DashboardProps = {
  user: User;
  canSeeCustomers: boolean;
  canSeeProducts: boolean;
  canSeeInventory: boolean;
  canSeeChallans: boolean;
  navigate: (module: Module) => void;
};

function Dashboard({
  user,
  canSeeCustomers,
  canSeeProducts,
  canSeeInventory,
  canSeeChallans,
  navigate,
}: DashboardProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    stockUnits: 0,
    openChallans: 0,
  });

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);

      let customerCount = 0;
      let productCount = 0;
      let totalStock = 0;
      let openChallanCount = 0;

      if (canSeeCustomers) {
        try {
          const response = await apiRequest<{
            data: Customer[];
            pagination: {
              page: number;
              limit: number;
              total: number;
              totalPages: number;
            };
          }>("/customers?limit=1");

          customerCount = response.pagination.total;
        } catch (error) {
          console.error("Failed to fetch customer count:", error);
        }
      }

      if (canSeeProducts || canSeeInventory) {
        try {
          const response = await apiRequest<{
            data: Product[];
          }>("/products");

          const products = Array.isArray(response.data)
            ? response.data
            : [];

          productCount = products.length;

          totalStock = products.reduce(
            (sum, product) => sum + Number(product.currentStock || 0),
            0
          );
        } catch (error) {
          console.error("Failed to fetch product data:", error);
        }
      }

      if (canSeeChallans) {
        try {
          const response = await apiRequest<{
            data: Challan[];
          }>("/challans");

          const challans = Array.isArray(response.data)
            ? response.data
            : [];

          openChallanCount = challans.filter(
            (challan) => challan.status === "DRAFT"
          ).length;
        } catch (error) {
          console.error("Failed to fetch challan data:", error);
        }
      }

      setStats({
        customers: customerCount,
        products: productCount,
        stockUnits: totalStock,
        openChallans: openChallanCount,
      });

      setLoading(false);
    }

    fetchDashboardData();
  }, [canSeeCustomers, canSeeProducts, canSeeInventory, canSeeChallans]);

  const visibleModules = [
    canSeeCustomers,
    canSeeProducts,
    canSeeInventory,
    canSeeChallans,
  ].filter(Boolean).length;

  return (
    <main className="dashboard-content">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">OVERVIEW / TODAY</p>
          <h2>
            Good to see you,
            <br />
            <span>{user.name}</span>
          </h2>
          <p className="hero-description">
            Manage customers, products, inventory and sales operations from one
            connected workspace.
          </p>
        </div>
        <div className="hero-orb">
          <div className="hero-orb-inner">
            <span>{visibleModules}</span>
            <small>modules</small>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard
          label="Customers"
          value={loading ? "…" : stats.customers.toString()}
          detail={canSeeCustomers ? "Database total" : "N/A"}
          trend="neutral"
          visible={canSeeCustomers}
        />
        <StatCard
          label="Products"
          value={loading ? "…" : stats.products.toString()}
          detail={canSeeProducts ? "Catalogue total" : "N/A"}
          trend="neutral"
          visible={canSeeProducts}
        />
        <StatCard
          label="Stock units"
          value={loading ? "…" : stats.stockUnits.toLocaleString()}
          detail={canSeeInventory ? "Current stock" : "N/A"}
          trend="neutral"
          visible={canSeeInventory}
        />
        <StatCard
          label="Open challans"
          value={loading ? "…" : stats.openChallans.toString()}
          detail={canSeeChallans ? "Draft challans" : "N/A"}
          trend="neutral"
          visible={canSeeChallans}
        />
      </section>

      <section className="dashboard-lower">
        <div className="panel activity-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">ACTIVITY</p>
              <h3>Recent activity</h3>
            </div>
            <span className="live-badge">
              <span />
              Ready
            </span>
          </div>
          <div className="activity-list">
            <div className="empty">
              No recent activity to display.
            </div>
          </div>
        </div>

        <div className="panel quick-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">SHORTCUTS</p>
              <h3>Quick actions</h3>
            </div>
          </div>
          <div className="quick-actions">
            {canSeeCustomers && (
              <button onClick={() => navigate("customers")}>
                <span className="quick-icon">◎</span>
                <span>
                  <strong>Customers</strong>
                  <small>Manage CRM</small>
                </span>
                <b>→</b>
              </button>
            )}
            {canSeeProducts && (
              <button onClick={() => navigate("products")}>
                <span className="quick-icon">◇</span>
                <span>
                  <strong>Products</strong>
                  <small>Manage catalogue</small>
                </span>
                <b>→</b>
              </button>
            )}
            {canSeeInventory && (
              <button onClick={() => navigate("inventory")}>
                <span className="quick-icon">▦</span>
                <span>
                  <strong>Inventory</strong>
                  <small>Stock movements</small>
                </span>
                <b>→</b>
              </button>
            )}
            {canSeeChallans && (
              <button onClick={() => navigate("challans")}>
                <span className="quick-icon">▤</span>
                <span>
                  <strong>Sales Challans</strong>
                  <small>Create a challan</small>
                </span>
                <b>→</b>
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  detail,
  trend,
  visible,
}: {
  label: string;
  value: string;
  detail: string;
  trend: "up" | "warning" | "neutral";
  visible: boolean;
}) {
  if (!visible) return null;
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <span className={`stat-dot ${trend}`} />
      </div>
      <strong>{value}</strong>
      <span className="stat-detail">{detail}</span>
    </article>
  );
}

function PlaceholderModule({
  eyebrow,
  title,
  description,
  icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <main className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </section>
      <section className="coming-soon">
        <div className="coming-soon-icon">{icon}</div>
        <p className="eyebrow">MODULE</p>
        <h2>{title} workspace</h2>
        <p>
          The backend workflow is already available. The operational interface
          is being connected to it next.
        </p>
      </section>
    </main>
  );
}

export default App;