import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

export default function DashboardPage() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        padding: "40px",
        background: "#f3e7df",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "900px",
          background: "white",
          borderRadius: "10px",
          padding: "40px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        }}
      >
        <h1 style={{ color: "#4d3021", marginBottom: "10px" }}>
          Welcome to your Dashboard
        </h1>

        {user && (
          <p style={{ marginBottom: "30px", color: "#555" }}>
            Logged in as <strong>{user.email}</strong>
          </p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          {/* Card 1 */}
          <div
            style={{
              padding: "20px",
              background: "#e6d5c9",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ color: "#4d3021" }}>My Books</h3>
            <p style={{ fontSize: "14px" }}>
              View and manage the books you purchased.
            </p>
          </div>

          {/* Card 2 */}
          <div
            style={{
              padding: "20px",
              background: "#e6d5c9",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ color: "#4d3021" }}>Profile</h3>
            <p style={{ fontSize: "14px" }}>
              Update your account information.
            </p>
          </div>

          {/* Card 3 */}
          <div
            style={{
              padding: "20px",
              background: "#e6d5c9",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ color: "#4d3021" }}>Orders</h3>
            <p style={{ fontSize: "14px" }}>
              Check your previous purchases.
            </p>
          </div>

          {/* Card 4 */}
          <div
            style={{
              padding: "20px",
              background: "#e6d5c9",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ color: "#4d3021" }}>Explore Books</h3>
            <p style={{ fontSize: "14px" }}>
              Browse our latest digital books.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}