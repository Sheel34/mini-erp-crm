import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type Customer = {
  id: string;
  name: string;
  mobile: string;
  email?: string | null;
  businessName: string;
  gstNumber?: string | null;
  customerType: string;
  address: string;
  status: string;
  followUpDate?: string | null;
  notes?: string | null;
};

const API = "http://localhost:5000/api";

function authHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
    "Content-Type": "application/json",
  };
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    businessName: "",
    gstNumber: "",
    customerType: "RETAIL",
    address: "",
    status: "LEAD",
    followUpDate: "",
    notes: "",
  });

  async function loadCustomers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API}/customers`, {
        headers: authHeaders(),
      });

      if (!response.ok) {
        throw new Error("Unable to load customers");
      }

      const result = await response.json();
      setCustomers(Array.isArray(result) ? result : result.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load customers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  function resetForm() {
    setForm({
      name: "",
      mobile: "",
      email: "",
      businessName: "",
      gstNumber: "",
      customerType: "RETAIL",
      address: "",
      status: "LEAD",
      followUpDate: "",
      notes: "",
    });
    setEditing(null);
  }

  function startEdit(customer: Customer) {
    setEditing(customer);
    setForm({
      name: customer.name,
      mobile: customer.mobile,
      email: customer.email ?? "",
      businessName: customer.businessName,
      gstNumber: customer.gstNumber ?? "",
      customerType: customer.customerType,
      address: customer.address,
      status: customer.status,
      followUpDate: customer.followUpDate
        ? customer.followUpDate.slice(0, 10)
        : "",
      notes: customer.notes ?? "",
    });
    setShowForm(true);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();

    try {
      setError("");

      const url = editing
        ? `${API}/customers/${editing.id}`
        : `${API}/customers`;

      const response = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          ...form,
          email: form.email || undefined,
          gstNumber: form.gstNumber || undefined,
          followUpDate: form.followUpDate
            ? new Date(form.followUpDate).toISOString()
            : undefined,
          notes: form.notes || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to save customer");
      }

      resetForm();
      setShowForm(false);
      await loadCustomers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save customer");
    }
  }

  const filtered = customers.filter((customer) => {
    const value = search.toLowerCase();

    return (
      customer.name.toLowerCase().includes(value) ||
      customer.mobile.toLowerCase().includes(value) ||
      customer.businessName.toLowerCase().includes(value) ||
      customer.email?.toLowerCase().includes(value)
    );
  });

  return (
    <section className="module">
      <div className="module-header">
        <div>
          <p className="eyebrow">CRM</p>
          <h2>Customers</h2>
          <p>Manage customers, business information and follow-ups.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add customer
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="toolbar">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name, mobile or business..."
        />
        <span>{filtered.length} customers</span>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={submit}>
          <div className="form-header">
            <h3>{editing ? "Edit customer" : "New customer"}</h3>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
            >
              Cancel
            </button>
          </div>

          <div className="form-grid">
            <input
              required
              placeholder="Customer name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              required
              placeholder="Mobile"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              required
              placeholder="Business name"
              value={form.businessName}
              onChange={(e) =>
                setForm({ ...form, businessName: e.target.value })
              }
            />

            <input
              placeholder="GST number"
              value={form.gstNumber}
              onChange={(e) =>
                setForm({ ...form, gstNumber: e.target.value })
              }
            />

            <select
              value={form.customerType}
              onChange={(e) =>
                setForm({ ...form, customerType: e.target.value })
              }
            >
              <option value="RETAIL">Retail</option>
              <option value="WHOLESALE">Wholesale</option>
              <option value="DISTRIBUTOR">Distributor</option>
            </select>

            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="LEAD">Lead</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>

            <input
              type="date"
              value={form.followUpDate}
              onChange={(e) =>
                setForm({ ...form, followUpDate: e.target.value })
              }
            />

            <input
              className="full"
              required
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />

            <textarea
              className="full"
              placeholder="Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <button className="primary-button" type="submit">
            {editing ? "Save changes" : "Create customer"}
          </button>
        </form>
      )}

      <div className="table-card">
        {loading ? (
          <p className="empty">Loading customers...</p>
        ) : filtered.length === 0 ? (
          <p className="empty">No customers found.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Business</th>
                  <th>Mobile</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Follow-up</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <strong>{customer.name}</strong>
                      <small>{customer.email}</small>
                    </td>
                    <td>{customer.businessName}</td>
                    <td>{customer.mobile}</td>
                    <td>{customer.customerType}</td>
                    <td>
                      <span className={`status ${customer.status.toLowerCase()}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td>
                      {customer.followUpDate
                        ? new Date(customer.followUpDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td>
                      <button onClick={() => startEdit(customer)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
