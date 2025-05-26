"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TestPage() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const loadTest = async () => {
      const res = await fetch("/testul1.json");
      const data = await res.json();
      setQuestions(data);
    };
    loadTest();
  }, []);

  if (!questions.length) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Se încarcă testul...</p>;
  }

  const currentQuestion = questions[current];
  const isAnswered = answered[current] !== undefined;
  const allAnswered = Object.keys(answered).length === questions.length;

  const handleAnswer = (index) => {
    if (isAnswered) return;
    const isCorrect = index === currentQuestion.correct;
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


  const scorCorect = Object.entries(answered).filter(([idx, val]) =>
    questions[parseInt(idx)].correct === val).length;

  if (finished) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h2 style={{ fontSize: "28px", color: "green" }}>
          Ai răspuns corect la {scorCorect} din {questions.length} întrebări.
        </h2>

        <div style={{ marginTop: "2rem" }}>
          <button onClick={() => location.reload()} style={{ marginRight: "1rem", textDecoration: "underline" }}>
            Reia testul
          </button>
          <Link href="/alege-test">
            <button style={{ textDecoration: "underline" }}>Alege un alt test</button>
          </Link>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <Link href="/">
            <button style={{ fontSize: "14px" }}>Înapoi la pagina principală</button>
          </Link>
        </div>

        <p style={{ fontWeight: "bold", marginTop: "3rem" }}>Iată cum ai răspuns:</p>
        <div style={{ textAlign: "left", margin: "auto", maxWidth: "600px" }}>
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
      <p style={{ fontWeight: "bold" }}>
        {current + 1}. {currentQuestion.text}
      </p>

      {currentQuestion.image && (
        <img src={currentQuestion.image} alt="Întrebare" style={{ maxWidth: "100%", margin: "1rem 0" }} />
      )}

      {currentQuestion.options.map((opt, i) => (
        <button
          key={i}
          onClick={() => handleAnswer(i)}
          style={{
            display: "block",
            width: "100%",
            textAlign: "left",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "8px",
            border: "1px solid #ccc",
            backgroundColor:
              selected === null
                ? "#fff"
                : i === currentQuestion.correct
                ? "#d1e7dd"
                : selected === i
                ? "#f8d7da"
                : "#fff"
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
          {currentQuestion.explanationImage && (
            <img src={currentQuestion.explanationImage} alt="Explicație" style={{ maxWidth: "100%", marginTop: "1rem" }} />
          )}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
        {!isAnswered && (
          <button
            onClick={handleRevin}
            style={{
              color: "#0070f3",
              textDecoration: "underline",
              background: "none",
              border: "none",
              cursor: "pointer"
            }}
          >
            Revin mai târziu →
          </button>
        )}

        {isAnswered && (
          <button
            onClick={allAnswered ? () => setFinished(true) : () => {
              let next = current + 1;
              while (next < questions.length && answered[next] !== undefined) next++;
              if (next < questions.length) {
                setCurrent(next);
                setSelected(null);
                setShowExplanation(false);
              } else {
                setFinished(true);
              }
            }}
            style={{
              color: "#0070f3",
              textDecoration: "underline",
              background: "none",
              border: "none",
              cursor: "pointer",
              marginLeft: "auto"
            }}
          >
            {allAnswered ? "Vezi rezultatul" : "Întrebarea următoare →"}
          </button>
        )}
      </div>

      <p style={{ textAlign: "center", marginTop: "2rem", color: "green", fontWeight: "bold" }}>
        Corecte: {scorCorect}/{questions.length}
      </p>

      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <Link href="/">
          <button style={{ fontSize: "14px" }}>Înapoi la pagina principală</button>
        </Link>
      </div>
    </div>
  );
}
