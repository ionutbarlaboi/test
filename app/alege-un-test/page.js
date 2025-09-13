"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SelectTestPage() {
  const router = useRouter();
  const [tests, setTests] = useState([]);

  useEffect(() => {
    async function fetchTests() {
      try {
        const res = await fetch("/api/tests");
        if (res.ok) {
          const data = await res.json();
          const sorted = data.sort((a, b) => {
            const numA = parseInt(a.replace("test", ""), 10);
            const numB = parseInt(b.replace("test", ""), 10);
            return numA - numB;
          });

          setTests(sorted);
        } else {
          setTests([]);
        }
      } catch {
        setTests([]);
      }
    }
    fetchTests();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        overflowY: "auto",
        backgroundImage: "url('/background_gol.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        paddingTop: "2rem",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          padding: "1rem",
          maxWidth: "600px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "2rem",
            color: "#fff",
            textShadow: "0 0 6px rgba(0,0,0,0.7)",
          }}
        >
          Alege un test
        </h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "2rem",
          }}
        >
          {tests.length > 0 ? (
            tests.map((test) => (
              <button
                key={test}
                onClick={() => router.push(`/${test}`)}
                style={{
                  width: "30%",
                  padding: "8px",
                  fontSize: "15px",
                  borderRadius: "6px",
                  border: "2px solid #0070f3",
                  background: "white",
                  color: "#0070f3",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {`Testul ${test.replace("test", "")}`}
              </button>
            ))
          ) : (
            <p
              style={{
                color: "#fff",
                textShadow: "0 0 6px rgba(0,0,0,0.7)",
              }}
            >
              Nu există teste disponibile.
            </p>
          )}
        </div>

        {process.env.NODE_ENV === "development" && (
          <div style={{ marginTop: "2rem" }}>
            <button
              onClick={() => router.push("/creare")}
              style={{
                fontSize: "14px",
                marginBottom: "0.5rem",
                padding: "5px 10px",
                border: "1px solid gray",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Creare / modificare teste
            </button>
          </div>
        )}

        <div style={{ marginTop: "4rem" }}>
          <button
            onClick={() => router.push("/")}
            style={{
              fontSize: "14px",
              border: "1px solid #0070f3",
              background: "white",
              color: "#0070f3",
              padding: "5px 10px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Înapoi la pagina principală
          </button>
        </div>
      </div>
    </div>
  );
}
