import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { logout } from "../../features/auth/authSlice";

export default function Navbar() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav
      style={{
        background: "#4d3021ff",
        color: "white",
        padding: "16px 50px",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Center Logo */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "22px",
          fontWeight: "700",
          letterSpacing: "1px",
        }}
      >
        Masukibooks
      </div>

      {/* Right Navigation */}
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          Home
        </Link>

        {user ? (
          <button
            onClick={handleLogout}
            style={{
              border: "1px solid white",
              background: "transparent",
              padding: "6px 14px",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            style={{
              border: "1px solid white",
              padding: "6px 14px",
              borderRadius: "6px",
              color: "white",
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}