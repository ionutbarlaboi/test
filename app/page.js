"use client";

import Image from "next/image";

export default function HomePage() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      {/* Butoane sus */}
      <div style={{ display: "flex", justifyContent: "center", gap: "4rem", marginBottom: "1.5rem" }}>
        <button style={{ fontWeight: "bold" }}>Despre</button>
        <button style={{ fontWeight: "bold" }}>English</button>
      </div>

      {/* Imagine */}
      <Image
        src="/math-cartoon.jpg"
        alt="Caricatură matematică"
        width={500}
        height={300}
        style={{ margin: "0 auto" }}
      />

      {/* Buton Hai să începem */}
      <button
        onClick={() => window.location.href = "/teste"}
        style={{
          marginTop: "2rem",
          padding: "12px 28px",
          fontSize: "18px",
          border: "2px solid #0070f3",
          borderRadius: "8px",
          backgroundColor: "white",
          color: "#0070f3",
          cursor: "pointer"
        }}
      >
        Hai să începem
      </button>
    </div>
  );
}
