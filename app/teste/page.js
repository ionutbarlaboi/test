"use client";

import { useRouter } from "next/navigation";

export default function ListaTeste() {
  const router = useRouter();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "2rem" }}>
        Alege un test
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
        <button
          onClick={() => router.push("/test1")}
          style={{
            padding: "12px 28px",
            border: "2px solid #0070f3",
            borderRadius: "8px",
            backgroundColor: "white",
            color: "#0070f3",
            fontWeight: "600",
            cursor: "pointer",
            width: "200px"
          }}
        >
          Testul 1
        </button>
        {/* Pe viitor adăugăm și Testul 2, 3, etc. */}
      </div>
    </div>
  );
}
