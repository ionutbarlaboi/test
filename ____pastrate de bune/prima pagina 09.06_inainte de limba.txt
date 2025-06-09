"use client";

import Image from "next/image";
import { useState } from "react";

export default function HomePage() {
  const [showAbout, setShowAbout] = useState(false);
  const [showLangSelector, setShowLangSelector] = useState(false);

  // --- Ajustări ușor de modificat ---
  const cartoonWidth = 400;      // lățime imagine cartoon (px)
  const cartoonHeight = 200;     // înălțime imagine cartoon (px)
  const buttonsGap = 50;         // spațiu orizontal între butoane (px)
  const buttonsMarginTop = 24;
  const buttonsMarginBottom = 24;
  const startButtonMarginTop = 20;
  const startButtonMarginBottom = 24;

  return (
    <>
      {/* Fundal imagine pe tot ecranul */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: "url('/background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />

      {/* Container principal */}
      <main
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden", // fără scroll
          boxSizing: "border-box",
          paddingLeft: 16,
          paddingRight: 16,
          textAlign: "center",
        }}
      >
        {/* Butoane sus (Despre / Limbi) */}
        <div
          style={{
            display: "flex",
            gap: `${buttonsGap}px`,
            marginTop: `${buttonsMarginTop}px`,
            marginBottom: `${buttonsMarginBottom}px`,
            justifyContent: "center",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <button
            onClick={() => setShowAbout(true)}
            style={{
              padding: "6px 14px",         // mai îngust, dar suficient
              fontSize: "0.75rem",
              fontWeight: 500,
              borderRadius: 6,
              border: "2px solid #0070f3",
              backgroundColor: "white",
              color: "#0070f3",
              cursor: "pointer",
              userSelect: "none",
              width: "auto",                // evită întinderea completă
              whiteSpace: "nowrap",        // nu permite text pe două rânduri
            }}
          >
            Despre
          </button>

          <button
            onClick={() => setShowLangSelector(true)}
            style={{
              padding: "6px 14px",         // mai îngust, dar suficient
              fontSize: "0.75rem",
              fontWeight: 500,
              borderRadius: 6,
              border: "2px solid #0070f3",
              backgroundColor: "white",
              color: "#0070f3",
              cursor: "pointer",
              userSelect: "none",
              width: "auto",                // evită întinderea completă
              whiteSpace: "nowrap",        // nu permite text pe două rânduri
            }}
          >
            Limbi
          </button>
        </div>

        {/* Imagine cartoon */}
        <div
          style={{
            width: `${cartoonWidth}px`,
            height: `${cartoonHeight}px`,
            marginBottom: `${startButtonMarginTop}px`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src="/math-cartoon.jpg"
            alt="Caricatură matematică"
            width={cartoonWidth}
            height={cartoonHeight}
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        {/* Buton Hai să începem */}
        <button
          onClick={() => (window.location.href = "/alege-un-test")}
          style={{
            padding: "12px 28px",
            fontSize: "1.1rem",
            border: "3px solid #0070f3",
            borderRadius: 10,
            backgroundColor: "white",
            color: "#0070f3",
            cursor: "pointer",
            userSelect: "none",
            maxWidth: "280px",
            width: "100%",
            marginBottom: `${startButtonMarginBottom}px`,
          }}
        >
          Hai să începem
        </button>
      </main>

      {/* Modal Despre */}
      {showAbout && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setShowAbout(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: 8,
              maxWidth: "400px",
              width: "100%",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowAbout(false)}
              aria-label="Închide"
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "#444",
              }}
            >
              ×
            </button>
            <h2>Despre aplicație</h2>
            <p style={{ marginTop: 12, lineHeight: 1.5 }}>
              Aplicație pentru teste grilă de matematică, destinată elevilor de gimnaziu. Oferă feedback imediat și învățare interactivă.
            </p>
          </div>
        </div>
      )}

      {/* Modal Selector Limbi */}
      {showLangSelector && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setShowLangSelector(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: 8,
              maxWidth: "320px",
              width: "100%",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowLangSelector(false)}
              aria-label="Închide"
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "#444",
              }}
            >
              ×
            </button>
            <h2>Selectează limba</h2>
            <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
              <li style={{ padding: "0.5rem 0", cursor: "pointer" }}>Română</li>
              <li style={{ padding: "0.5rem 0", cursor: "pointer" }}>English</li>
              <li style={{ padding: "0.5rem 0", cursor: "pointer" }}>Franceză</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
