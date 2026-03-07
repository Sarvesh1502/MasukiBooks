import { motion } from "framer-motion";
import type { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Book, Order } from "../../types/book";
import { fetchBooks } from "../../services/booksService";
import { fetchOrders } from "../../services/orderService";

const quickLinks = [
  { to: "/catalog", icon: "📚", label: "Browse Catalog", desc: "Search and discover books" },
  { to: "/cart", icon: "🛒", label: "Shopping Cart", desc: "View items in your cart" },
  { to: "/orders", icon: "📦", label: "My Orders", desc: "Track your order history" },
  { to: "/profile", icon: "👤", label: "Profile", desc: "Manage your account" },
];

export default function DashboardPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [books, setBooks] = useState<Book[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [bookList, orderList] = await Promise.all([
          fetchBooks(),
          user ? fetchOrders(user.id) : Promise.resolve([]),
        ]);
        setBooks(bookList);
        setOrders(orderList);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [user]);

  const recentOrders = orders.slice(0, 3);

  return (
    <div
      style={{
        padding: "30px 40px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: "25px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #4d3021 0%, #7a5035 100%)",
          color: "#fff",
        }}
      >
        <h2>Welcome back, {user?.fullName || user?.email}!</h2>
        <p style={{ marginTop: "8px", opacity: 0.9 }}>
          Ready for your next great read? Browse our catalog or check your orders.
        </p>
      </motion.div>

      {/* Quick Links */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "14px",
        }}
      >
        {quickLinks.map((link, i) => (
          <motion.div
            key={link.to}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={link.to}
              style={{
                display: "block",
                padding: "20px",
                borderRadius: "12px",
                background: "#f5ede8",
                textDecoration: "none",
                color: "#4d3021",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span style={{ fontSize: "28px" }}>{link.icon}</span>
              <h4 style={{ marginTop: "8px" }}>{link.label}</h4>
              <p style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>{link.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "14px" }}>
        <div style={{ background: "#e6d5c9", borderRadius: "10px", padding: "18px", textAlign: "center" }}>
          <p style={{ fontSize: "26px", fontWeight: 700, color: "#4d3021" }}>{books.length}</p>
          <p style={{ fontSize: "13px", color: "#666" }}>Books Available</p>
        </div>
        <div style={{ background: "#e6d5c9", borderRadius: "10px", padding: "18px", textAlign: "center" }}>
          <p style={{ fontSize: "26px", fontWeight: 700, color: "#4d3021" }}>{cartItems.length}</p>
          <p style={{ fontSize: "13px", color: "#666" }}>Items in Cart</p>
        </div>
        <div style={{ background: "#e6d5c9", borderRadius: "10px", padding: "18px", textAlign: "center" }}>
          <p style={{ fontSize: "26px", fontWeight: 700, color: "#4d3021" }}>{orders.length}</p>
          <p style={{ fontSize: "13px", color: "#666" }}>Total Orders</p>
        </div>
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div style={{ background: "#f5ede8", borderRadius: "12px", padding: "22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h3 style={{ color: "#4d3021" }}>Recent Orders</h3>
            <Link to="/orders" style={{ color: "#4d3021", fontSize: "14px" }}>View all →</Link>
          </div>
          {recentOrders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px",
                background: "#fff",
                borderRadius: "8px",
                marginBottom: "8px",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div>
                <span style={{ fontWeight: 600, color: "#4d3021" }}>#{order.id.slice(0, 8)}</span>
                <span style={{ fontSize: "13px", color: "#666", marginLeft: "10px" }}>
                  {order.items?.length ?? 0} items
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontWeight: 600, color: "#4d3021" }}>₹{order.total}</span>
                <span style={{
                  fontSize: "12px",
                  marginLeft: "10px",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  background: order.status === "delivered" ? "#e8f5e9" : "#fff3e0",
                  color: order.status === "delivered" ? "#2e7d32" : "#e65100",
                  textTransform: "capitalize",
                }}>
                  {order.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Recommended Books */}
      {!loading && books.length > 0 && (
        <div style={{ background: "#f5ede8", borderRadius: "12px", padding: "22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h3 style={{ color: "#4d3021" }}>Recommended for You</h3>
            <Link to="/catalog" style={{ color: "#4d3021", fontSize: "14px" }}>Browse all →</Link>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "14px",
            }}
          >
            {books.slice(0, 4).map((book) => (
              <Link
                key={book.id}
                to={`/book/${book.id}`}
                style={{
                  background: "#fff",
                  borderRadius: "10px",
                  padding: "14px",
                  textDecoration: "none",
                  color: "inherit",
                  border: "1px solid #e0d0c5",
                }}
              >
                <h4 style={{ color: "#4d3021", marginBottom: "4px" }}>{book.title}</h4>
                <p style={{ fontSize: "13px", color: "#666" }}>by {book.author}</p>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: "#4d3021" }}>₹{book.price}</span>
                  <span style={{ color: "#f5a623", fontSize: "13px" }}>
                    {"★".repeat(Math.round(book.ratingAvg))}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}