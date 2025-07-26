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


export default function Test1() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetch("/testul1.json")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setAnswered(Array(data.length).fill(null));
      });
  }, []);

  if (!questions.length) return <p>Se încarcă testul...</p>;

  const q = questions[index];
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
          marginBottom: "1.5rem",
          textDecoration: "underline",
        }}
      >
        Testul 1
      </h2>

      {finished ? (
        <>
          <p
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              backgroundColor: "#f0f9ff",
              border: "1px solid #b6e0fe",
              padding: "10px",
              borderRadius: "8px",
              color: "#0070f3",
            }}
          >
            Ai răspuns corect la {score} din {questions.length} întrebări.
          </p>

          <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "2rem" }}>
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

          <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
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
            {questions.map((q, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "1rem",
                  padding: "1rem",
                  borderRadius: "8px",
                  backgroundColor: answered[i] ? "#d1e7dd" : "#f8d7da",
                }}
              >
                <p>
                  <strong>
                    {i + 1}. {renderWithLatex(q.text)}
                  </strong>
                </p>
                <p>
                  Răspunsul tău:{" "}
                  <span style={{ fontWeight: "bold", marginRight: "2rem" }}>
                    {renderWithLatex(q.options[answered[i] === true ? q.correct : selected])}
                  </span>
                  Răspuns corect: <strong>{renderWithLatex(q.options[q.correct])}</strong>
                </p>
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
              
              <div style={{ marginBottom: "1rem" }}>
                <p
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: "0.5rem",
                    textDecoration: "underline",
                  }}
                >
                  Exercițiul {index + 1}
                </p>
                <p style={{ fontSize: "18px", fontWeight: "bold", textAlign: "left" }}>
                  {renderWithLatex(q.text)}
                </p>
              </div>
            

            {q.image && (
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                <img src={q.image} alt="Întrebare" style={{ maxWidth: "100%", maxHeight: "300px" }} />
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
              <p style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "0.5rem" }}>
                {selected === q.correct ? "Răspuns corect" : "Răspuns greșit"}
              </p>
              {q.explanation && <p>{renderWithLatex(q.explanation)}</p>}
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
                <span
                  onClick={goNext}
                  className="button-link"
                >
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
            Răspunsuri corecte {answered.filter(Boolean).length}/{questions.length}
          </p>
          <p
            style={{
              color: "black",
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
