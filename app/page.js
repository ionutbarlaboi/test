"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [showAbout, setShowAbout] = useState(false);
  const [lang, setLang] = useState("ro");

  useEffect(() => {
    const storedLang = localStorage.getItem("lang");
    if (storedLang) {
      setLang(storedLang);
    }
  }, []);

  // --- Ajustări ușor de modificat ---
  const cartoonWidth = 400;
  const cartoonHeight = 200;
  const buttonsGap = 50;
  const buttonsMarginTop = 24;
  const buttonsMarginBottom = 24;
  const startButtonMarginTop = 20;
  const startButtonMarginBottom = 24;

  // --- Text multilingv ---
  const text = {
    ro: {
      about: "Despre",
      start: "Hai să începem",
      modalTitle: "Despre aplicație",
      modalContent:
        "Aplicație pentru teste grilă de matematică, destinată elevilor de gimnaziu. Oferă feedback imediat și învățare interactivă.",
    },
    en: {
      about: "About",
      start: "Let's start",
      modalTitle: "About the app",
      modalContent:
        "Quiz app for middle school students. Offers instant feedback and interactive learning.",
    },
  };

  // Facebook URL
  const facebookUrl = "https://www.facebook.com/ionut.barlaboi";

  return (
    <>
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

      <main
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          boxSizing: "border-box",
          paddingLeft: 16,
          paddingRight: 16,
          textAlign: "center",
        }}
      >
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
          {/* Buton Despre */}
          <button
            onClick={() => setShowAbout(true)}
            style={{
              padding: "6px 14px",
              fontSize: "0.75rem",
              fontWeight: 500,
              borderRadius: 6,
              border: "2px solid #0070f3",
              backgroundColor: "white",
              color: "#0070f3",
              cursor: "pointer",
              userSelect: "none",
              width: "120px",
              whiteSpace: "nowrap",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {/* fără icon aici, doar text */}
            {text[lang].about}
          </button>

          {/* Buton Facebook */}
          <button
            onClick={() => window.open(facebookUrl, "_blank")}
            style={{
              padding: "6px 14px",
              fontSize: "0.75rem",
              fontWeight: 500,
              borderRadius: 6,
              border: "2px solid #0070f3",
              backgroundColor: "white",
              color: "#0070f3",
              cursor: "pointer",
              userSelect: "none",
              width: "120px",
              whiteSpace: "nowrap",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "6px",
            }}
            aria-label="Facebook"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#0070f3"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              aria-hidden="true"
            >
              <path d="M22.675 0h-21.35C.6 0 0 .6 0 1.337v21.326C0 23.4.6 24 1.325 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.794.142v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.59l-.467 3.622h-3.123V24h6.116c.725 0 1.325-.6 1.325-1.337V1.337C24 .6 23.4 0 22.675 0z" />
            </svg>
            Facebook
          </button>
        </div>

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
          {text[lang].start}
        </button>
      </main>

      {/* Overlay simplu Despre (fără modal) */}
      {showAbout && (
        <div
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
            cursor: "pointer",
          }}
          aria-modal="true"
          role="dialog"
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
              textAlign: "left",
              cursor: "default",
            }}
          >
            <h2>{text[lang].modalTitle}</h2>
            <p style={{ marginTop: 12, lineHeight: 1.5 }}>
              {text[lang].modalContent}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
