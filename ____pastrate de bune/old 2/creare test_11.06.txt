"use client";
import { useState, useEffect } from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

export default function AdminPage() {
  const [testName, setTestName] = useState("testul1");
  const [questions, setQuestions] = useState([]);

  // Încarcă testul salvat din localStorage la încărcarea paginii
  useEffect(() => {
    const savedTest = localStorage.getItem("savedTest");
    if (savedTest) {
      try {
        const parsed = JSON.parse(savedTest);
        if (parsed.testName && Array.isArray(parsed.questions)) {
          setTestName(parsed.testName);
          setQuestions(parsed.questions);
        }
      } catch {}
    }
  }, []);

  // Salvează testul curent în localStorage (apelat de butonul "Salvează test")
  const handleSave = () => {
    localStorage.setItem(
      "savedTest",
      JSON.stringify({ testName, questions })
    );
    alert("Testul a fost salvat local.");
  };


   
  function renderLatex(text) {
  const parts = text.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          return <BlockMath key={index}>{part.slice(2, -2)}</BlockMath>;
        } else if (part.startsWith('$') && part.endsWith('$')) {
          return <InlineMath key={index}>{part.slice(1, -1)}</InlineMath>;
        } else {
          const lines = part.split('\n');
          return lines.map((line, lineIndex) => (
            <span key={`${index}-${lineIndex}`}>
              {line}
              {lineIndex < lines.length - 1 && <br />}
            </span>
          ));
        }
      })}
    </>
   );
 }




  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        options: ["", "", "", ""],
        correct: 0,
        explanation: "",
        image: null,
        explanationImage: null,
      },
    ]);
  };

  const handleUpdateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleUpdateOption = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleDelete = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleExport = () => {
    const json = JSON.stringify(questions, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${testName}.json`;
    a.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = JSON.parse(event.target.result);
        if (Array.isArray(content)) {
          setQuestions(content);
        } else {
          alert("Fișierul JSON nu este un array de întrebări valid.");
        }
      } catch (err) {
        alert("Eroare la citirea fișierului JSON.");
      }
    };
    reader.readAsText(file);
  };

  const handleImageChange = (index, field, file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const updated = [...questions];
      updated[index][field] = reader.result;
      setQuestions(updated);
    };
    reader.readAsDataURL(file);
  };

  // Șterge imaginea la enunț sau la explicație
  const handleRemoveImage = (index, field) => {
    const updated = [...questions];
    updated[index][field] = null;
    setQuestions(updated);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h1
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "1rem" }}
      >
        Admin - Creare Test
      </h1>

      <label style={{ fontWeight: "bold" }}>Nume test (fără spații):</label>
      <input
        value={testName}
        onChange={(e) => setTestName(e.target.value)}
        style={{
          display: "block",
          marginBottom: "1.5rem",
          border: "1px solid black",
          padding: "6px",
          width: "100%",
        }}
      />

      <input
        type="file"
        accept=".json"
        onChange={handleImport}
        style={{
          marginBottom: "1rem",
          padding: "6px",
          fontSize: "14px",
          border: "1px solid #ccc",
        }}
      />

      <button
        onClick={handleExport}
        style={{
          marginRight: "1rem",
          padding: "6px 12px",
          fontSize: "14px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Exportă test
      </button>

      <button
        onClick={handleSave}
        style={{
          padding: "6px 12px",
          fontSize: "14px",
          backgroundColor: "#00a600",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Salvează test (fără export)
      </button>

      {questions.map((q, index) => (
        <div
          key={index}
          style={{
            border: "2px solid #0070f3",
            padding: "1rem",
            marginTop: "1.5rem",
            borderRadius: "8px",
            background: "#f9fafe",
          }}
        >
          <label style={{ fontWeight: "bold" }}>
            Enunț întrebare {index + 1}:
          </label>
          <textarea
            value={q.text}
            onChange={(e) => handleUpdateQuestion(index, "text", e.target.value)}
            style={{
              width: "100%",
              border: "1px solid black",
              marginBottom: "0.5rem",
              padding: "6px",
            }}
          />
          <div style={{ marginBottom: "1rem" }}>{renderLatex(q.text)}</div>

          <label style={{ fontWeight: "bold" }}>Imagine întrebare:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageChange(index, "image", e.target.files[0])
            }
            style={{ marginBottom: "0.5rem", display: "block" }}
          />
          {q.image && (
            <div
              style={{
                textAlign: "center",
                marginBottom: "1rem",
                position: "relative",
              }}
            >
              <img src={q.image} alt="Întrebare" style={{ maxWidth: "100%" }} />
              <button
                onClick={() => handleRemoveImage(index, "image")}
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  cursor: "pointer",
                }}
                title="Șterge imaginea"
              >
                &times;
              </button>
            </div>
          )}

          <label style={{ fontWeight: "bold" }}>Variante de răspuns:</label>
          {q.options.map((opt, i) => (
            <div key={i} style={{ marginBottom: "0.5rem" }}>
              <input
                value={opt}
                onChange={(e) => handleUpdateOption(index, i, e.target.value)}
                style={{
                  width: "80%",
                  border: "1px solid black",
                  padding: "4px",
                  marginRight: "1rem",
                }}
              />
              <input
                type="radio"
                checked={q.correct === i}
                onChange={() => handleUpdateQuestion(index, "correct", i)}
              />
              <div>{renderLatex(opt)}</div>
            </div>
          ))}

          <label style={{ fontWeight: "bold" }}>Explicație:</label>
          <textarea
            value={q.explanation}
            onChange={(e) =>
              handleUpdateQuestion(index, "explanation", e.target.value)
            }
            style={{
              width: "100%",
              border: "1px solid black",
              marginBottom: "0.5rem",
              padding: "6px",
            }}
          />
          <div style={{ marginBottom: "1rem" }}>{renderLatex(q.explanation)}</div>

          <label style={{ fontWeight: "bold" }}>Imagine explicație:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageChange(index, "explanationImage", e.target.files[0])
            }
            style={{ marginBottom: "0.5rem", display: "block" }}
          />
          {q.explanationImage && (
            <div
              style={{
                textAlign: "center",
                marginBottom: "1rem",
                position: "relative",
              }}
            >
              <img
                src={q.explanationImage}
                alt="Explicație"
                style={{ maxWidth: "100%" }}
              />
              <button
                onClick={() => handleRemoveImage(index, "explanationImage")}
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  cursor: "pointer",
                }}
                title="Șterge imaginea"
              >
                &times;
              </button>
            </div>
          )}

          <button
            onClick={() => handleDelete(index)}
            style={{ color: "red", marginTop: "0.5rem" }}
          >
            Șterge întrebarea
          </button>
        </div>
      ))}

      {/* Butonul de adăugat întrebare mutat jos, după toate întrebările */}
      <button
        onClick={handleAddQuestion}
        style={{
          marginTop: "2rem",
          padding: "10px 16px",
          fontSize: "16px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        + Adaugă întrebare
      </button>
    </div>
  );
}
