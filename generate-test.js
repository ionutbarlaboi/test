// generate-test.js
const fs = require("fs");
const path = require("path");

const testName = process.argv[2]; // ex: test3

if (!testName || !/^[a-zA-Z0-9_-]+$/.test(testName)) {
  console.error("Te rog să introduci un nume valid pentru test (ex: test3)");
  process.exit(1);
}

const folderPath = path.join("app", testName);
const filePath = path.join(folderPath, "page.js");

if (fs.existsSync(filePath)) {
  console.error("Testul există deja:", testName);
  process.exit(1);
}

fs.mkdirSync(folderPath, { recursive: true });

const jsonFile = `/testul${testName.replace(/[^\d]/g, "") || "X"}.json`;

const content = `\
"use client";
import { useEffect, useState } from "react";

export default function ${testName.charAt(0).toUpperCase() + testName.slice(1)}() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetch("${jsonFile}")
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
      <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "1.5rem" }}>
        ${testName.toUpperCase()}
      </h2>

      {finished ? (
        <>
          <p style={{
            fontSize: "20px",
            fontWeight: "bold",
            backgroundColor: "#f0f9ff",
            border: "1px solid #b6e0fe",
            padding: "10px",
            borderRadius: "8px",
            color: "#0070f3"
          }}>
            Ai răspuns corect la {score} din {questions.length} întrebări.
          </p>
          <button onClick={() => window.location.href = "/"} style={{ marginTop: "2rem" }}>
            Înapoi la pagina principală
          </button>
        </>
      ) : (
        <>
          <p><strong>{index + 1}. {q.text}</strong></p>

          {q.image && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
              <img src={q.image} alt="Întrebare" style={{ maxWidth: "100%" }} />
            </div>
          )}

          <div>
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selected !== null || answered[index] !== null}
                style={{
                  display: "block",
                  width: "100%",
                  marginBottom: "0.5rem",
                  padding: "10px",
                  border: "1px solid #ccc",
                  backgroundColor:
                    selected === i
                      ? i === q.correct
                        ? "#d1e7dd"
                        : "#f8d7da"
                      : "white"
                }}
              >
                {opt}
              </button>
            ))}
          </div>

          {selected !== null && (
            <div style={{ marginTop: "1rem" }}>
              <p style={{ fontWeight: "bold", color: selected === q.correct ? "green" : "red" }}>
                {selected === q.correct ? "Răspuns corect" : "Răspuns greșit"}
              </p>
              <p>{q.explanation}</p>
              {q.explanationImage && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                  <img src={q.explanationImage} alt="Explicație" style={{ maxWidth: "100%" }} />
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: "2rem", textAlign: "right" }}>
            {selected === null ? (
              answered.filter((a) => a === null).length > 1 ? (
                <span
                  onClick={goNext}
                  style={{ textDecoration: "underline", color: "#0070f3", cursor: "pointer" }}
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
                style={{ textDecoration: "underline", color: "#0070f3", cursor: "pointer" }}
              >
                {answered.every((a) => a !== null)
                  ? "Vezi rezultatul →"
                  : "Întrebarea următoare →"}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
`;

fs.writeFileSync(filePath, content);
console.log(`Testul ${testName} a fost creat în ${filePath}`);
