import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <nav
      style={{
        background: "#4d3021",
        padding: "16px 50px",
        color: "white",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        position: "relative"
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          fontWeight: "700",
          fontSize: "22px"
        }}
      >
        Masukibooks
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <motion.div whileHover={{ y: -2 }}>
          <Link style={{ color: "white", textDecoration: "none" }} to="/">
            Home
          </Link>
        </motion.div>

        <motion.div whileHover={{ y: -2 }}>
          <Link style={{ color: "white", textDecoration: "none" }} to="/login">
            Login
          </Link>
        </motion.div>
      </div>
    </nav>
  );
}