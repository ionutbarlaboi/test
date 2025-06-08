"use client";

import { useState } from "react";

export default function UploadPage() {
  const [fileContent, setFileContent] = useState(null);
  const [error, setError] = useState(null);
  const [generatedCode, setGeneratedCode] = useState("");

  function renderWithLatex(text) {
    // Folosit în codul generat, dar aici doar placeholder
    // Nu folosește nimic la upload, e copiat în page.js generat.
    return text;
  }

  const handleFileChange = (e) => {
    setError(null);
    setGeneratedCode("");
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      setError("Fișierul trebuie să fie în format JSON.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (!Array.isArray(json)) {
          setError("JSON-ul trebuie să fie un array de întrebări.");
          return;
        }
        // validare întrebări elementare
        for (let i = 0; i < json.length; i++) {
          const q = json[i];
          if (
            typeof q.text !== "string" ||
            !Array.isArray(q.options) ||
            q.options.length !== 4 ||
            typeof q.correct !== "number" ||
            q.correct < 0 ||
            q.correct > 3
          ) {
            setError(`Structura întrebării ${i + 1} este invalidă.`);
            return;
          }
        }
        setFileContent(json);
        generatePageJSX(json);
      } catch (ex) {
        setError("Fișier JSON invalid: " + ex.message);
      }
    };
    reader.readAsText(file);
  };

  const generatePageJSX = (questions) => {
    // Construieste string-ul cu codul complet pentru pagina page.js a testului nou
    const code = `"use client";

import { useState, useEffect } from "react";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

function renderWithLatex(text) {
  if (!text) return null;
  const parts = text.split(/(\\$[^\\$]+\\$)/g);
  return parts.map((part, index) => {
    if (part.startsWith("$") && part.endsWith("$")) {
      const formula = part.slice(1, -1);
      return <InlineMath key={index} math={formula} />;
    }
    return <span key={index}>{part}</span>;
  });
}

export default function TestNew() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setQuestions(${JSON.stringify(questions)});
    setAnswered(Array(${questions.length}).fill(null));
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
        Testul Nou
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

          <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "2rem" }}>
            <p style={{ textDecoration: "underline", cursor: "pointer", color: "#0070f3" }} onClick={() => window.location.href = "/alege-un-test"}>Alege un alt test</p>
            <p style={{ textDecoration: "underline", cursor: "pointer", color: "#0070f3" }} onClick={() => window.location.reload()}>Reia testul</p>
          </div>

          <button style={{ marginTop: "1.5rem", padding: "6px 14px", border: "1px solid #0070f3", background: "white", color: "#0070f3", borderRadius: "6px", cursor: "pointer", fontSize: "14px" }} onClick={() => window.location.href = "/"}>Înapoi la pagina principală</button>

          <div style={{ textAlign: "left", marginTop: "2rem" }}>
            <p style={{ fontWeight: "bold" }}>Iată cum ai răspuns:</p>
            {questions.map((question, i) => (
              <div key={i} style={{
                marginBottom: "1rem",
                padding: "10px",
                borderRadius: "8px",
                backgroundColor: answered[i] ? "#d1e7dd" : "#f8d7da"
              }}>
                <p><strong>{renderWithLatex(i + 1 + ". " + question.text)}</strong></p>
                <p>
                  Răspunsul tău: <strong>{answered[i] !== null ? renderWithLatex(question.options[answered[i] ? question.correct : null]) : "Fără răspuns"}</strong><br/>
                  Răspuns corect: <strong>{renderWithLatex(question.options[question.correct])}</strong>
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <p style={{ fontSize: "18px", fontWeight: "bold", textAlign: "center" }}>
            {index + 1}. {renderWithLatex(q.text)}
          </p>

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
                  width: "50%",
                  fontSize: "20px",
                  marginBottom: "0.5rem",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  backgroundColor:
                    selected === i
                      ? i === q.correct
                        ? "#d1e7dd"
                        : "#f8d7da"
                      : "white"
                }}
              >
                {renderWithLatex(opt)}
              </button>
            ))}
          </div>

          {selected !== null && (
            <div style={{ marginTop: "1rem" }}>
              <p style={{ fontWeight: "bold", color: selected === q.correct ? "green" : "red" }}>
                {selected === q.correct ? "Răspuns corect" : "Răspuns greșit"}
              </p>
              {q.explanation && (
                <p style={{ marginTop: "0.5rem" }}>{renderWithLatex(q.explanation)}</p>
              )}
              {q.explanationImage && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                  <img src={q.explanationImage} alt="Explicație" style={{ maxWidth: "100%", maxHeight: "300px" }} />
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: "2rem", textAlign: "right" }}>
            {selected === null ? (
              answered.filter((a) => a === null).length > 1 ? (
                <span onClick={goNext} style={{ textDecoration: "underline", color: "#0070f3", cursor: "pointer" }}>
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

          <p style={{ marginTop: "1rem", color: "green", fontWeight: "bold", textAlign: "center" }}>
            Răspunsuri corecte {answered.filter(Boolean).length}/{questions.length}
          </p>
          <p style={{ color: "black", fontSize: "14px", textAlign: "center", marginTop: "-0.3rem" }}>
            Mai sunt {answered.filter((a) => a === null).length} întrebări fără răspuns
          </p>

          <button
            onClick={() => window.location.href = "/"}
            style={{
              marginTop: "1rem",
              padding: "6px 14px",
              border: "1px solid #0070f3",
              background: "white",
              color: "#0070f3",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            Înapoi la pagina principală
          </button>
        </>
      )}
    </div>
  );
}
`;

    setGeneratedCode(code);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "auto" }}>
      <h1>Încarcă un test în format JSON</h1>
      <input type="file" accept=".json" onChange={handleFileChange} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {fileContent && <p style={{ color: "green" }}>Fișier JSON încărcat cu succes!</p>}

      {generatedCode && (
        <>
          <h2>Codul generat pentru pagina testului</h2>
          <textarea
            readOnly
            style={{ width: "100%", height: "500px", fontFamily: "monospace", whiteSpace: "pre-wrap" }}
            value={generatedCode}
          />
          <p>
            Copiază acest cod într-un fișier <code>page.js</code> nou în folderul testului dorit (ex: <code>app/test2/page.js</code>).
          </p>
        </>
      )}
    </div>
  );
}
