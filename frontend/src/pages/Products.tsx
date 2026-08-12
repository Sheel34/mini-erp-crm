import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitPrice: number | string;
  currentStock: number;
  minimumStock: number;
  warehouse: string;
};

const API =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

function authHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
    "Content-Type": "application/json",
  };
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    unitPrice: "",
    minimumStock: "0",
    warehouse: "",
  });

  async function loadProducts() {
    try {
      setError("");

      const response = await fetch(`${API}/products`, {
        headers: authHeaders(),
      });

      if (!response.ok) {
        throw new Error("Unable to load products");
      }

      const result = await response.json();
      setProducts(result.data ?? result.products ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load products");
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function createProduct(event: FormEvent) {
    event.preventDefault();

    try {
      setError("");

      const response = await fetch(`${API}/products`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          name: form.name,
          sku: form.sku,
          category: form.category,
          unitPrice: Number(form.unitPrice),
          minimumStock: Number(form.minimumStock),
          warehouse: form.warehouse,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to create product");
      }

      setForm({
        name: "",
        sku: "",
        category: "",
        unitPrice: "",
        minimumStock: "0",
        warehouse: "",
      });

      setShowForm(false);
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create product");
    }
  }

  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase();

    return (
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  });

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">INVENTORY MASTER</p>
          <h1>Products</h1>
          <p>Manage products, pricing and stock levels.</p>
        </div>

        <button onClick={() => setShowForm((value) => !value)}>
          {showForm ? "Cancel" : "+ Add product"}
        </button>
      </section>

      {error && <p className="error">{error}</p>}

      {showForm && (
        <form className="form-card" onSubmit={createProduct}>
          <h2>New product</h2>

          <input
            required
            placeholder="Product name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            required
            placeholder="SKU"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
          />

          <input
            required
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <input
            required
            type="number"
            min="0"
            step="0.01"
            placeholder="Unit price"
            value={form.unitPrice}
            onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
          />

          <input
            type="number"
            min="0"
            placeholder="Minimum stock"
            value={form.minimumStock}
            onChange={(e) =>
              setForm({ ...form, minimumStock: e.target.value })
            }
          />

          <input
            required
            placeholder="Warehouse"
            value={form.warehouse}
            onChange={(e) => setForm({ ...form, warehouse: e.target.value })}
          />

          <button type="submit">Create product</button>
        </form>
      )}

      <section className="content-card">
        <div className="toolbar">
          <input
            placeholder="Search name, SKU or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span>{filteredProducts.length} products</span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Warehouse</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => {
                const lowStock =
                  product.currentStock <= product.minimumStock;

                return (
                  <tr key={product.id}>
                    <td>
                      <strong>{product.name}</strong>
                    </td>
                    <td>{product.sku}</td>
                    <td>{product.category}</td>
                    <td>₹{Number(product.unitPrice).toFixed(2)}</td>
                    <td>
                      <span className={lowStock ? "stock-low" : "stock-ok"}>
                        {product.currentStock}
                      </span>
                    </td>
                    <td>{product.warehouse}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <p className="empty">No products found.</p>
          )}
        </div>
      </section>
    </main>
  );
}