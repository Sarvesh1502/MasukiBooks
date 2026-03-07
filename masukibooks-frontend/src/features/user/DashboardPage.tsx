import { motion } from "framer-motion";
import type { RootState } from "../../app/store";
import { useSelector } from "react-redux";

export default function DashboardPage() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div
      style={{
        padding: "40px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px"
      }}
    >
      <motion.div
        whileHover={{ scale: 1.03 }}
        style={{
          padding: "25px",
          borderRadius: "10px",
          background: "#e6d5c9"
        }}
      >
        Welcome {user?.email}
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.03 }}
        style={{
          padding: "25px",
          borderRadius: "10px",
          background: "#e6d5c9"
        }}
      >
        Your Books
      </motion.div>
    </div>
  );
}