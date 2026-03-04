import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import background from "../../assets/login-pattern.jpeg";

export default function SignupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    console.log(name, email, password);
    navigate("/login");
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
        <h2 style={{ textAlign: "center", color: "#4d3021" }}>
          Sign Up
        </h2>

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #b89f8f",
          }}
        />

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
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #b89f8f",
          }}
        />

        <button
          onClick={handleSignup}
          style={{
            padding: "10px",
            background: "#4d3021",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Sign Up
        </button>

        <p style={{ textAlign: "center", fontSize: "14px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#4d3021", fontWeight: "600" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}