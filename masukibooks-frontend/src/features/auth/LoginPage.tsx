import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./authSlice";
import { useNavigate, Link } from "react-router-dom";
import background from "../../assets/login-pattern.jpeg";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const user = {
      id: 1,
      email: email,
      role: "ROLE_USER",
    };

    dispatch(setUser(user));
    localStorage.setItem("token", "fake-jwt-token");

    navigate("/dashboard");
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          width: "360px",
          padding: "35px",
          background: "#e6d5c9",
          borderRadius: "10px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#4d3021" }}>Login</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #b89f8f",
          }}
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #b89f8f",
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            padding: "10px",
            background: "#4d3021",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Login
        </button>

        <p style={{ textAlign: "center", fontSize: "14px" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#4d3021", fontWeight: "600" }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}