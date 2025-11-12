"use client";

import React, { useEffect, useState } from "react";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

/**
 * Page: Test101 (variantă completă, stil grilă)
 *
 * Se așteaptă un fișier /testul101.json (same shape as before).
 * Dacă apar erori, verifică consola din devtools pentru mesajul exact.
 */

/* Helper: render cu LaTeX inline */
function renderWithLatex(text) {
  if (!text && text !== "") return null;
  // acceptă null sau șir; păstrează newline ca <br/>
  const parts = String(text).split(/(\$[^$]+\$)/g);
  return parts.map((part, i) => {
    if (part.startsWith("$") && part.endsWith("$")) {
      const formula = part.slice(1, -1);
      return (
        <span key={i} className="latex-inline-wrapper">
          <InlineMath math={formula} />
        </span>
      );
    }
    // păstrează newline
    return (
      <span key={i} dangerouslySetInnerHTML={{ __html: part.replace(/\n/g, "<br/>") }} />
    );
  });
}

export default function TestElev() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { qIndex: { subIndex: { value, checked, score, blocked } } }
  const [finished, setFinished] = useState(false);
  const [zoomPulse, setZoomPulse] = useState(false);

  useEffect(() => {
    fetch("/testul101.json")
      .then((r) => {
        if (!r.ok) throw new Error("Nu s-a putut încărca testul (verifică path /testul101.json)");
        return r.json();
      })
      .then((data) => {
        const withNr = data.map((q, i) => ({ ...q, nr: i + 1 }));
        setQuestions(withNr);
      })
      .catch((e) => {
        console.error("Eroare la încărcare test:", e);
      });
  }, []);

  useEffect(() => {
    // pulse mic de zoom când se schimbă întrebarea (imită animația între întrebări)
    setZoomPulse(true);
    const t = setTimeout(() => setZoomPulse(false), 350);
    return () => clearTimeout(t);
  }, [index]);

  if (!questions.length) return <p style={{ textAlign: "center", padding: "2rem" }}>Se încarcă testul...</p>;

  const qCurrent = questions[index];

  const handleOptionSelect = (qIndex, subIndex, option) => {
    setAnswers((prev) => ({
      ...prev,
      [qIndex]: {
        ...(prev[qIndex] || {}),
        [subIndex]: {
          ...(prev[qIndex]?.[subIndex] || {}),
          value: option,
        },
      },
    }));
  };

  const handleCheck = (qIndex, subIndex) => {
    const sub = questions[qIndex].subitems[subIndex];
    const chosen = answers[qIndex]?.[subIndex]?.value;
    let puncte = 0;

    // Dacă barem/corect e un string sau array
    const correct = sub.corect ?? sub.correct ?? sub.cheie ?? sub.correctAnswer;
    const targetVals = Array.isArray(correct) ? correct : [correct];

    if (chosen !== undefined && chosen !== "") {
      const norm = String(chosen).trim();
      for (const v of targetVals) {
        if (v !== undefined && String(v).trim() === norm) {
          puncte = sub.punctaj ?? sub.puncte ?? 1;
          break;
        }
      }
    }

    setAnswers((prev) => ({
      ...prev,
      [qIndex]: {
        ...(prev[qIndex] || {}),
        [subIndex]: {
          ...(prev[qIndex]?.[subIndex] || {}),
          score: puncte,
          checked: true,
          blocked: true,
        },
      },
    }));
  };

  const handleDontKnow = (qIndex, subIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [qIndex]: {
        ...(prev[qIndex] || {}),
        [subIndex]: {
          ...(prev[qIndex]?.[subIndex] || {}),
          blocked: true,
          score: 0,
          value: "",
          checked: true,
        },
      },
    }));
  };

  const allSubpointsDone = questions.every((q, qIndex) =>
    q.subitems.every((sub, i) => {
      const ans = answers[qIndex]?.[i];
      return ans?.blocked || ans?.checked;
    })
  );

  const totalSubpointsRemaining = questions.reduce((acc, q, qIndex) => {
    return (
      acc +
      q.subitems.reduce((a, sub, i) => {
        const ans = answers[qIndex]?.[i];
        if (!ans?.blocked && !ans?.checked) return a + 1;
        return a;
      }, 0)
    );
  }, 0);

  const nextEx = () => {
    if (allSubpointsDone) {
      // calculează total puncte posibile și obținute
      let totalObt = 0;
      let totalPos = 0;
      questions.forEach((q, qi) => {
        q.subitems.forEach((s, si) => {
          totalPos += s.punctaj ?? s.puncte ?? 1;
          const ans = answers[qi]?.[si];
          totalObt += ans?.score ?? 0;
        });
      });
      setFinished(true);
      return;
    }

    // navigare la următoarea întrebare care are subpuncte nefinalizate
    let nextIndex = index + 1;
    if (nextIndex >= questions.length) nextIndex = 0;
    for (let i = nextIndex; i < questions.length; i++) {
      const hasRemaining = questions[i].subitems.some((sub, j) => {
        const ans = answers[i]?.[j];
        return !ans?.blocked && !ans?.checked;
      });
      if (hasRemaining) {
        setIndex(i);
        return;
      }
    }
    for (let i = 0; i < nextIndex; i++) {
      const hasRemaining = questions[i].subitems.some((sub, j) => {
        const ans = answers[i]?.[j];
        return !ans?.blocked && !ans?.checked;
      });
      if (hasRemaining) {
        setIndex(i);
        return;
      }
    }
    // dacă nu s-a găsit, rămâne pe loc
  };

  const goBack = () => (window.location.href = "/");
  const chooseAnother = () => (window.location.href = "/alege-un-test");

  const totalCorrectAnswers = (() => {
    let cnt = 0;
    questions.forEach((q, qi) => {
      q.subitems.forEach((s, si) => {
        const ans = answers[qi]?.[si];
        if (ans?.score > 0) cnt++;
      });
    });
    return cnt;
  })();

  // ===========================
  // RENDER
  // ===========================
  return (
    <div style={{ padding: "2rem", maxWidth: 900, margin: "auto", textAlign: "center" }}>
      {/* Titlu general */}
      <h2
        style={{
          fontSize: 28,
          fontWeight: 700,
          marginBottom: "1rem",
          background: "linear-gradient(90deg, #0070f3, #00c6ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          borderBottom: "2px solid #0070f3",
          display: "inline-block",
        }}
      >
        Testul 101
      </h2>

      {finished ? (
        <>
          <div
            style={{
              backgroundColor: "#d1e7dd",
              padding: "2rem",
              borderRadius: 12,
              border: "2px solid #198754",
              fontSize: 20,
              fontWeight: 700,
              textAlign: "center",
              marginTop: "1rem",
            }}
          >
            Ai obținut {totalCorrectAnswers} răspunsuri corecte din{" "}
            {questions.reduce((acc, q) => acc + q.subitems.length, 0)}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 16 }}>
            <button onClick={goBack} style={secondaryBtnStyle}>
              Înapoi la pagina principală
            </button>
            <button onClick={chooseAnother} style={secondaryBtnStyle}>
              Alege un alt test
            </button>
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              textAlign: "left",
              border: "1px solid #ccc",
              borderRadius: 12,
              padding: 20,
              marginTop: 18,
              transform: zoomPulse ? "scale(1.02)" : "scale(1)",
              transition: "transform 280ms ease",
            }}
          >
            {/* Subiectul III - centrat, bold, underline, mai mare */}
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 20, fontWeight: 800, textDecoration: "underline" }}>
                Subiectul III
              </div>
            </div>

            {/* Exercițiul */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
                Exercițiul {qCurrent.nr}
              </div>
              <div style={{ fontSize: 16, color: "#222" }}>{renderWithLatex(qCurrent.text)}</div>
            </div>

            {/* imagine */}
            {qCurrent.image && (
              <div style={{ display: "flex", justifyContent: "center", margin: "12px 0" }}>
                <img src={qCurrent.image} alt="ex" style={{ maxWidth: "100%", maxHeight: 300 }} />
              </div>
            )}

            {/* subitems */}
            {qCurrent.subitems.map((sub, i) => {
              const ans = answers[index]?.[i] || {};
              const options = sub.variante ?? sub.options ?? sub.variants ?? ["-", "-", "-", "-"];
              const pts = sub.punctaj ?? sub.puncte ?? 1;

              return (
                <div key={i} style={{ marginTop: 14 }}>
                  <p style={{ margin: 0 }}>
                    <strong>{sub.label}</strong> {renderWithLatex(sub.cerinta)}
                  </p>

                  {/* variante (carduri) */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
                    {options.map((opt, k) => {
                      const isSelected = ans.value === opt;
                      return (
                        <label
                          key={k}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: 12,
                            borderRadius: 18,
                            boxShadow: "0 6px 12px rgba(0,0,0,0.06)",
                            border: isSelected ? "2px solid #0070f3" : "1px solid #e5e7eb",
                            cursor: ans.blocked ? "default" : "pointer",
                            transition: "transform 160ms ease, background 160ms ease",
                            transform: ans.blocked ? "none" : "translateZ(0)",
                          }}
                          onMouseEnter={(e) => {
                            if (!ans.blocked) e.currentTarget.style.transform = "scale(1.02)";
                          }}
                          onMouseLeave={(e) => {
                            if (!ans.blocked) e.currentTarget.style.transform = "scale(1)";
                          }}
                        >
                          <input
                            type="radio"
                            name={`q${index}-sub${i}`}
                            value={opt}
                            checked={isSelected}
                            onChange={() => handleOptionSelect(index, i, opt)}
                            disabled={ans.blocked}
                            style={{ width: 16, height: 16 }}
                          />
                          <div style={{ textAlign: "left" }}>{renderWithLatex(opt)}</div>
                        </label>
                      );
                    })}
                  </div>

                  {/* butoane Verifică / Nu știu */}
                  <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                    <button
                      onClick={() => handleCheck(index, i)}
                      disabled={ans.blocked}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#0070f3",
                        color: "white",
                        borderRadius: 8,
                        border: "none",
                        cursor: ans.blocked ? "default" : "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Verifică
                    </button>
                    <button
                      onClick={() => handleDontKnow(index, i)}
                      disabled={ans.blocked}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        borderRadius: 8,
                        border: "none",
                        cursor: ans.blocked ? "default" : "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Nu știu răspunsul
                    </button>
                  </div>

                  {/* afișare punctaj / explicație */}
                  {ans.checked && (
                    <p style={{ marginTop: 8 }}>
                      Punctaj: {ans.score ?? 0} / {pts}p
                    </p>
                  )}
                  {ans.blocked && sub.explanation && (
                    <div style={{ marginTop: 8, padding: 8, borderRadius: 8, backgroundColor: "#d1e7dd", border: "1px solid #198754" }}>
                      <div>{renderWithLatex(sub.explanation)}</div>
                      {sub.explanationImage && (
                        <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
                          <img src={sub.explanationImage} alt="exp" style={{ maxWidth: "100%", maxHeight: 180 }} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* reminder subpuncte ramase */}
          {!allSubpointsDone && (
            <p style={{ textAlign: "center", color: "red", marginTop: 12 }}>
              Mai sunt {totalSubpointsRemaining} subpuncte de completat.
            </p>
          )}

          {/* butoane jos: Revin mai târziu (stil vechi) si buton albastru */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
            <button onClick={() => { alert("Ai marcat pentru revenire."); }} style={secondaryBtnStyle}>
              Revin mai târziu
            </button>

            <button onClick={nextEx} style={primaryBtnStyle}>
              {allSubpointsDone ? "Vezi rezultatul →" : "Mai departe →"}
            </button>
          </div>

          {/* Răspunsuri corecte stil vechi */}
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <p style={{ color: "#374151", fontSize: 14 }}>
              Răspunsuri corecte: {totalCorrectAnswers}/{questions.reduce((acc, q) => acc + q.subitems.length, 0)}
            </p>
          </div>

          {/* butoane de navigare secundare */}
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 12 }}>
            <button onClick={goBack} style={secondaryBtnStyle}>
              Înapoi la pagina principală
            </button>
            <button onClick={chooseAnother} style={secondaryBtnStyle}>
              Alege un alt test
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ====================
// Stiluri butoane (folosite inline pentru portabilitate)
// ====================
const primaryBtnStyle = {
  padding: "8px 16px",
  backgroundColor: "#00c6ff",
  color: "white",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  fontWeight: 700,
};

const secondaryBtnStyle = {
  padding: "6px 14px",
  border: "1px solid #0070f3",
  background: "white",
  color: "#0070f3",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 14,
};
