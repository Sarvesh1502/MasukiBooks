import background from "../../assets/landing-bg.jpeg";

export default function HomePage() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        backgroundColor: "#5a1f08",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          textAlign: "center",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: "60px", marginBottom: "20px" }}>
          Masukibooks
        </h1>

        <p style={{ fontSize: "20px", marginBottom: "30px" }}>
          Discover thousands of digital books instantly
        </p>

        <button
          style={{
            padding: "14px 30px",
            fontSize: "16px",
            background: "#d9813c",
            border: "none",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Explore Books
        </button>
      </div>
    </div>
  );
}