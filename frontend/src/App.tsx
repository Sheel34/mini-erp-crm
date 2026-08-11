import { useState } from "react";
import Login from "./pages/Login";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

function getStoredUser(): User | null {
  const stored = localStorage.getItem("user");

  if (!stored) {
    return null;
  }

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

  function handleLogin(loggedInUser: User) {
    setUser(loggedInUser);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <main className="dashboard">
      <header className="topbar">
        <div>
          <p className="eyebrow">MINI ERP</p>
          <h1>Dashboard</h1>
        </div>

        <div className="user-area">
          <span>
            {user.name} · {user.role}
          </span>

          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <section className="welcome">
        <p className="eyebrow">SIGNED IN</p>
        <h2>Welcome, {user.name}</h2>
        <p>
          Your authenticated session is connected to the Express API.
        </p>
      </section>

      <section className="dashboard-grid">
        <article>
          <span>01</span>
          <h3>Customers</h3>
          <p>Manage customer records and follow-ups.</p>
        </article>

        <article>
          <span>02</span>
          <h3>Products</h3>
          <p>Manage products, pricing and stock levels.</p>
        </article>

        <article>
          <span>03</span>
          <h3>Inventory</h3>
          <p>Track stock movements and low-stock items.</p>
        </article>

        <article>
          <span>04</span>
          <h3>Sales Challans</h3>
          <p>Create drafts and confirm stock-affecting sales.</p>
        </article>
      </section>
    </main>
  );
}

export default App;