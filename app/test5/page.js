"use client";

import { useState, useEffect } from "react";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

function renderWithLatex(text) {
  if (!text) return null;
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, index) => {
    if (part.startsWith("$") && part.endsWith("$")) {
      const formula = part.slice(1, -1);
      return (
        <span key={index} className="latex-inline-wrapper">
          <InlineMath math={formula} />
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export default function Test5() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
  fetch("/testul5.json")
    .then((res) => res.json())
    .then((data) => {
      const combinedQuestions = [
        ...data.I.map((q, idx) => ({ ...q, subiect: "I", nr: idx + 1 })),
        ...data.II.map((q, idx) => ({ ...q, subiect: "II", nr: idx + 1 })),
      ];
      setQuestions(combinedQuestions);
      setAnswered(Array(combinedQuestions.length).fill(null));
    })
    .catch((e) => console.error("Eroare la încărcare test:", e));
}, []);

  if (!questions.length) return <p>Se încarcă testul...</p>;

  const q = questions[index];
  const subiectText = q.subiect ? `Subiectul ${q.subiect}` : ""; // Ex: "Subiectul I"

  const handleAnswer = (i) => {
    if (selected !== null || answered[index] !== null) return;
    const isCorrect = i === q.correct;
    setSelected(i);
    const updated = [...answered];
    updated[index] = isCorrect;
    setAnswered(updated);
    if (isCorrect) setScore((s) => s + 1);
  };

  const next = () => {
    const nextUnanswered = answered.findIndex((a, i) => a === null && i !== index);
    if (nextUnanswered !== -1) {
      setIndex(nextUnanswered);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  const goNext = () => {
    const total = questions.length;
    for (let i = 1; i < total; i++) {
      const nextIndex = (index + i) % total;
      if (answered[nextIndex] === null) {
        setIndex(nextIndex);
        setSelected(null);
        return;
      }
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "auto", textAlign: "center" }}>
      <h2
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "1rem",
          background: "linear-gradient(90deg, #0070f3, #00c6ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "pulse 2s infinite",
          textAlign: "center",
          borderBottom: "2px solid #0070f3",
          display: "inline-block",
        }}
      >
        Testul 5
      </h2>

      {finished ? (
        <>
          {(() => {
            const percentage = (score / questions.length) * 100;
            let message = "";
            let bgColor = "";
            if (percentage === 100) {
              message = "💪 Perfect! Ești un campion!";
              bgColor = "#d1e7dd"; // verde deschis
            } else if (percentage > 80) {
              message = "🎉 Foarte bine! Mai e puțin! ";
              bgColor = "#e0f2ff"; // albastru foarte deschis
            } else if (percentage > 50) {
              message = "🙂 E bine! Continuă să exersezi!";
              bgColor = "#fff3cd"; // galben
            } else {
              message = "⚠️ Nu renunța! Exersează mai mult și vei reuși!";
              bgColor = "#f8d7da"; // roșu deschis
            }

            return (
              <div
                style={{
                  backgroundColor: bgColor,
                  padding: "16px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  textAlign: "center",
                  marginBottom: "2rem",
                }}
              >
                <p
                  style={{
                    fontSize: "22px",
                    fontWeight: "bold",
                    color: "black",
                    marginBottom: "0.5rem",
                  }}
                >
                  {message}
                </p>
                <p style={{ fontSize: "16px", color: "black" }}>
                  Ai răspuns corect la {score} din {questions.length} întrebări.
                </p>
              </div>
            );
          })()}

          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
            }}
          >
            <p
              style={{ textDecoration: "underline", cursor: "pointer", color: "#0070f3" }}
              onClick={() => (window.location.href = "/alege-un-test")}
            >
              Alege un alt test
            </p>
            <p
              style={{ textDecoration: "underline", cursor: "pointer", color: "#0070f3" }}
              onClick={() => window.location.reload()}
            >
              Reia testul
            </p>
          </div>

          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <button
              style={{
                padding: "6px 14px",
                border: "1px solid #0070f3",
                background: "white",
                color: "#0070f3",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
              }}
              onClick={() => (window.location.href = "/")}
            >
              Înapoi la pagina principală
            </button>
            <button
              style={{
                padding: "6px 14px",
                border: "1px solid #0070f3",
                background: "white",
                color: "#0070f3",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
              }}
              onClick={() => (window.location.href = "/alege-un-test")}
            >
              Alege un alt test
            </button>
          </div>

          <div style={{ textAlign: "left", marginTop: "2rem" }}>
            <p style={{ fontWeight: "bold" }}>Iată cum ai răspuns:</p>
            

              {["I", "II"].map((sub) => (
               <div key={sub}>
                <p style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "1rem", marginTop: "2rem" }}>
                  Subiectul {sub}
                </p>
                {questions
                  .filter((q) => q.subiect === sub)
                  .map((q, i) => {
                    const realIndex = questions.findIndex(
                     (qq) => qq.subiect === sub && qq.nr === q.nr
                    );
                    return (
                     <div
                      key={realIndex}
                      style={{
                       marginBottom: "1rem",
                       padding: "1rem",
                       borderRadius: "8px",
                       backgroundColor: answered[realIndex] ? "#d1e7dd" : "#f8d7da",
                      }}
                     >
                      <p>
                       {q.nr}. {renderWithLatex(q.text)}
                      </p>
                      <p style={{ marginBottom: "0.2rem", fontWeight: "normal" }}>
                        <strong>Răspunsul tău:</strong>{" "}
                        <span style={{ fontWeight: "normal", fontWeight: "normal" }}>
                          {renderWithLatex(
                            q.options[answered[realIndex] === true ? q.correct : selected]
                          )}
                        </span>
                      </p>
                      <p style={{ marginTop: 0 }}>
                        <strong>Răspuns corect:</strong>{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {renderWithLatex(q.options[q.correct])}
                        </span>
                      </p>
                    </div>
                    );
                   })}
                 </div>
              ))}


          </div>
        </>
      ) : (
        <>
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "1.5rem",
              marginBottom: "1.5rem",
              textAlign: "left",
            }}
          >
            {/* Afișare subiect, centrat */}
            {subiectText && (
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "23px",
                  marginTop: "0",
                  marginBottom: "0.8rem",
                  textAlign: "center",
                  textDecoration: "underline",
                }}
              >
                {subiectText}
              </p>
            )}

            {/* Exercițiul X aliniat stanga */}
            <div style={{ marginBottom: "1rem" }}>
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  textAlign: "left",
                  marginBottom: "0.5rem",
                  textDecoration: "underline",
                }}
              >
                Exercițiul {q.nr}
              </p>
              <p style={{ fontSize: "18px", textAlign: "left" }}>
                {renderWithLatex(q.text)}
              </p>
            </div>

            {q.image && (
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                <img
                  src={q.image}
                  alt="Întrebare"
                  style={{ maxWidth: "100%", maxHeight: "300px" }}
                />
              </div>
            )}

            <div>
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null || answered[index] !== null}
                  style={{
                    display: "inline-block",
                    width: "48%",
                    fontSize: "20px",
                    marginBottom: "0.5rem",
                    marginRight: i % 2 === 0 ? "4%" : "0",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    backgroundColor:
                      selected === i
                        ? i === q.correct
                          ? "#d1e7dd"
                          : "#f8d7da"
                        : "white",
                    cursor: selected === null && answered[index] === null ? "pointer" : "default",
                    textAlign: "center",
                  }}
                >
                  {renderWithLatex(opt)}
                </button>
              ))}
            </div>
          </div>

          {selected !== null && (
            <div
              style={{
                marginTop: "1rem",
                borderRadius: "10px",
                padding: "1rem",
                backgroundColor: selected === q.correct ? "#d1e7dd" : "#f8d7da",
                border: `1px solid ${selected === q.correct ? "#198754" : "#d6336c"}`,
                color: selected === q.correct ? "#198754" : "#d6336c",
                fontWeight: "600",
                textAlign: "left",
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "0.5rem" }}>
                {selected === q.correct ? "Răspuns corect" : "Răspuns greșit"}
              </div>
              {q.explanation && (
                <div 
                  style={{ 
                    whiteSpace: "pre-wrap", 
                    fontWeight: "normal", 
                    overflowWrap: "break-word",
                    wordBreak: "break-word",
                  }}>{renderWithLatex(q.explanation)}
                </div>
              )}
              {q.explanationImage && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                  <img
                    src={q.explanationImage}
                    alt="Explicație"
                    style={{ maxWidth: "100%", maxHeight: "300px" }}
                  />
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: "2rem", textAlign: "right" }}>
            {selected === null ? (
              answered.filter((a) => a === null).length > 1 ? (
                <span onClick={goNext} className="button-link">
                  Revin mai târziu →
                </span>
              ) : null
            ) : (
              <span
                onClick={() => {
                  const nextIndex = index + 1;
                  if (answered.every((a) => a !== null)) {
                    setFinished(true);
                  } else if (nextIndex < questions.length && answered[nextIndex] === null) {
                    setIndex(nextIndex);
                    setSelected(null);
                  } else {
                    next();
                  }
                }}
                className="button-link"
              >
                {answered.every((a) => a !== null) ? "Vezi rezultatul →" : "Întrebarea următoare →"}
              </span>
            )}
          </div>

          <p
            style={{
              marginTop: "1rem",
              color: "green",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: "16px",
            }}
          >
            Răspunsuri corecte {answered.filter(Boolean).length}
          </p>
          <p
            style={{
              color: "red",
              fontSize: "14px",
              textAlign: "center",
              marginTop: "-0.3rem",
              marginBottom: "1.5rem",
            }}
          >
            Mai sunt {answered.filter((a) => a === null).length} întrebări fără răspuns
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <button
              onClick={() => (window.location.href = "/")}
              style={{
                padding: "6px 14px",
                border: "1px solid #0070f3",
                background: "white",
                color: "#0070f3",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                minWidth: "150px",
              }}
            >
              Înapoi la pagina principală
            </button>
            <button
              onClick={() => (window.location.href = "/alege-un-test")}
              style={{
                padding: "6px 14px",
                border: "1px solid #0070f3",
                background: "white",
                color: "#0070f3",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                minWidth: "150px",
              }}
            >
              Alege un alt test
            </button>
          </div>
        </>
      )}
    </div>
  );
}
