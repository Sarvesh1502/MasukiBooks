import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { Book } from "../../types/book";

interface BookCardProps {
  book: Book;
  onAddToCart?: (bookId: string) => void;
  added?: boolean;
}

export default function BookCard({ book, onAddToCart, added }: BookCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
      style={{
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid #e0d0c5",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Cover */}
      <div
        style={{
          height: "180px",
          background: book.coverUrl
            ? `url(${book.coverUrl}) center/cover`
            : "linear-gradient(135deg, #e6d5c9 0%, #c7aa99 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#4d3021",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        {!book.coverUrl && book.title}
      </div>

      <div style={{ padding: "14px", flex: 1, display: "flex", flexDirection: "column" }}>
        <Link
          to={`/book/${book.id}`}
          style={{
            color: "#4d3021",
            fontWeight: 600,
            fontSize: "16px",
            textDecoration: "none",
            marginBottom: "4px",
          }}
        >
          {book.title}
        </Link>
        <p style={{ fontSize: "13px", color: "#666", marginBottom: "4px" }}>
          by {book.author}
        </p>
        <p style={{ fontSize: "12px", color: "#999", marginBottom: "8px" }}>
          {book.category} • {book.language}
        </p>

        {/* Rating */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px" }}>
          <span style={{ color: "#f5a623", fontSize: "14px" }}>
            {"★".repeat(Math.round(book.ratingAvg))}
            {"☆".repeat(5 - Math.round(book.ratingAvg))}
          </span>
          <span style={{ fontSize: "12px", color: "#999" }}>
            ({book.ratingCount})
          </span>
        </div>

        <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 700, color: "#4d3021", fontSize: "18px" }}>
            ₹{book.price}
          </span>
          {onAddToCart && (
            <button
              onClick={() => onAddToCart(book.id)}
              style={{
                padding: "6px 14px",
                borderRadius: "6px",
                border: "none",
                background: added ? "#2e7d32" : "#4d3021",
                color: "#fff",
                cursor: "pointer",
                fontSize: "13px",
                transition: "background 0.2s",
              }}
            >
              {added ? "✓ Added" : "Add to Cart"}
            </button>
          )}
        </div>

        {book.stock < 10 && book.stock > 0 && (
          <p style={{ fontSize: "11px", color: "#c62828", marginTop: "4px" }}>
            Only {book.stock} left!
          </p>
        )}
        {book.stock === 0 && (
          <p style={{ fontSize: "11px", color: "#c62828", marginTop: "4px" }}>
            Out of stock
          </p>
        )}
      </div>
    </motion.div>
  );
}