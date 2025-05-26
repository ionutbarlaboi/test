"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import questions from "../../public/testul1.json";

export default function Test1Page() {
  const [current, setCurrent] = useState(0);
  const [answered, setAnswered] = useState({});
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[current];
  const isAnswered = answered[current] !== undefined;
  const allAnswered = Object.keys(answered).length === questions.length;

  const handleAnswer = (index) => {
    if (isAnswered) return;
    setAnswered({ ...answered, [current]: index });
    setSelected(index);
    setShowExplanation(true);
  };
  const handleRevin = () => {
    let next = current + 1;
    while (next < questions.length && answered[next] !== undefined) {
      next++;
    }
    if (next < questions.length) {
      setCurrent(next);
      setSelected(null);
      setShowExplanation(false);
    }
  };

  const scorCorect = Object.entries(answered).filter(
    ([idx, val]) => questions[parseInt(idx)].correct === val
  ).length;

  if (finished) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h2 style={{ fontSize: "28px", color: "green" }}>
          Ai răspuns corect la {scorCorect} din {questions.length} întrebări.
        </h2>

        <div style={{ marginTop: "2rem" }}>
          <button onClick={() => location.reload()} style={{ marginRight: "1rem", textDecoration: "underline", color: "#0070f3" }}>
            Reia testul
          </button>
          <Link href="/alege-test">
            <button style={{ textDecoration: "underline", color: "#0070f3" }}>Alege un alt test</button>
          </Link>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <Link href="/">
            <button style={{ fontSize: "14px" }}>Înapoi la pagina principală</button>
          </Link>
        </div>

        <p style={{ fontWeight: "bold", fontSize: "18px", marginTop: "2rem" }}>Iată cum ai răspuns:</p>
        <div style={{ textAlign: "left", margin: "auto", maxWidth: "700px" }}>
          {questions.map((q, i) => {
            const userAnswer = answered[i];
            return (
              <div key={i} style={{ marginBottom: "1rem" }}>
                <strong>{i + 1}. {q.text}</strong>
                <p>
                  Răspunsul tău:
                  <span style={{
                    color: userAnswer === q.correct ? "green" : "red",
                    marginLeft: "5px",
                    fontWeight: "bold"
                  }}>{q.options[userAnswer]}</span>
                  {" | "} Răspuns corect:
                  <span style={{ marginLeft: "5px" }}>{q.options[q.correct]}</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "2rem" }}>
      <h2 style={{ textAlign: "center", fontSize: "28px", fontWeight: "bold", marginBottom: "1rem" }}>
        Testul 1
      </h2>

      <p style={{ textAlign: "center", fontWeight: "bold" }}>
        {current + 1}. {currentQuestion.text}
      </p>

      {currentQuestion.options.map((opt, i) => (
        <button
          key={i}
          onClick={() => handleAnswer(i)}
          style={{
            display: "block",
            width: "100%",
            margin: "10px 0",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            backgroundColor:
              selected === null
                ? "#fff"
                : i === currentQuestion.correct
                ? "#d1e7dd"
                : selected === i
                ? "#f8d7da"
                : "#fff",
            textAlign: "center",
          }}
        >
          {opt}
        </button>
      ))}

      {showExplanation && (
        <div style={{ backgroundColor: "#f9f9f9", padding: "1rem", borderRadius: "8px", marginTop: "1rem" }}>
          <p style={{ color: selected === currentQuestion.correct ? "green" : "red", fontWeight: "bold" }}>
            {selected === currentQuestion.correct ? "Răspuns corect" : "Răspuns greșit"}
          </p>
          <p style={{ color: "#000" }}>{currentQuestion.explanation}</p>
        </div>
      )}
      <div style={{ marginTop: "2rem", textAlign: "right" }}>
        {!isAnswered && (
          <button
            onClick={handleRevin}
            style={{
              background: "none",
              border: "none",
              color: "#0070f3",
              cursor: "pointer",
              textDecoration: "underline",
              fontWeight: "bold"
            }}
          >
            Revin mai târziu →
          </button>
        )}

        {isAnswered && !allAnswered && (
          <button
            onClick={() => {
              let next = current + 1;
              while (next < questions.length && answered[next] !== undefined) {
                next++;
              }
              if (next < questions.length) {
                setCurrent(next);
                setSelected(null);
                setShowExplanation(false);
              } else {
                setFinished(true);
              }
            }}
            style={{
              background: "none",
              border: "none",
              color: "#0070f3",
              cursor: "pointer",
              textDecoration: "underline",
              fontWeight: "bold"
            }}
          >
            Întrebarea următoare →
          </button>
        )}

        {isAnswered && allAnswered && current === questions.length - 1 && (
          <button
            onClick={() => setFinished(true)}
            style={{
              background: "none",
              border: "none",
              color: "#0070f3",
              cursor: "pointer",
              textDecoration: "underline",
              fontWeight: "bold"
            }}
          >
            Vezi rezultatul →
          </button>
        )}
      </div>

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <Link href="/">
          <button style={{ fontSize: "14px" }}>Înapoi la pagina principală</button>
        </Link>
      </div>
    </div>
  );
}
