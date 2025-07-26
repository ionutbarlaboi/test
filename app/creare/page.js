"use client";

import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";


export default function TestEditorWithSections() {
  const [testName, setTestName] = useState("Test");
  const [sections, setSections] = useState({ I: [], II: [] });

  // funcție pentru randare LaTeX, presupun că ai deja

function renderLatex(text) {
  const parts = text.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("$$") && part.endsWith("$$")) {
          return <BlockMath key={index}>{part.slice(2, -2).trim()}</BlockMath>;
        } else if (part.startsWith("$") && part.endsWith("$")) {
          return <InlineMath key={index}>{part.slice(1, -1).trim()}</InlineMath>;
        } else {
          const lines = part.split("\n");
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

  const handleAddQuestion = (section) => {
    setSections((prev) => ({
      ...prev,
      [section]: [
        ...prev[section],
        {
          text: "",
          options: ["", "", "", ""],
          correct: 0,
          explanation: "",
          image: null,
          explanationImage: null,
        },
      ],
    }));
  };

  const handleUpdateQuestion = (section, index, field, value) => {
    const updated = [...sections[section]];
    updated[index][field] = value;
    setSections((prev) => ({ ...prev, [section]: updated }));
  };

  const handleUpdateOption = (section, qIndex, optIndex, value) => {
    const updated = [...sections[section]];
    updated[qIndex].options[optIndex] = value;
    setSections((prev) => ({ ...prev, [section]: updated }));
  };

  const handleDelete = (section, index) => {
    const updated = [...sections[section]];
    updated.splice(index, 1);
    setSections((prev) => ({ ...prev, [section]: updated }));
  };

  const handleImageChange = (section, index, field, file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const updated = [...sections[section]];
      updated[index][field] = reader.result;
      setSections((prev) => ({ ...prev, [section]: updated }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (section, index, field) => {
    const updated = [...sections[section]];
    updated[index][field] = null;
    setSections((prev) => ({ ...prev, [section]: updated }));
  };


  const handleExport = () => {
    const addSubiectFields = (questions, label) =>
      questions.map((q) => ({ ...q, subiect: label }));

    const combined = {
      I: addSubiectFields(sections.I, "I"),
      II: addSubiectFields(sections.II, "II"),
    };

    const json = JSON.stringify(combined, null, 2);
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
        if (
          content.I &&
          Array.isArray(content.I) &&
          content.II &&
          Array.isArray(content.II)
        ) {
          setSections(content);
        } else {
          alert("Fișierul JSON nu este structurat corect cu secțiuni I și II.");
        }
      } catch {
        alert("Eroare la citirea fișierului JSON.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "auto" }}>
      <h1>Editare Test: {testName}</h1>
      <input
        value={testName}
        onChange={(e) => setTestName(e.target.value)}
        style={{ marginBottom: "1rem", fontSize: "1.2rem", width: "100%" }}
        placeholder="Nume test"
      />

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="import-json" style={{ marginRight: "1rem" }}>
          Import JSON:
        </label>
        <input id="import-json" type="file" accept=".json" onChange={handleImport} />
      </div>

      <button onClick={handleExport} style={{ marginBottom: "1rem" }}>
        Export JSON
      </button>

      <h2>Subiectul I</h2>
      {sections.I.map((q, index) => (
        <div
          key={`I-${index}`}
          style={{
            border: "2px solid #0070f3",
            padding: "1rem",
            marginTop: "1.5rem",
            borderRadius: "8px",
            background: "#f9fafe",
          }}
        >
          <label style={{ fontWeight: "bold" }}>Enunț întrebare {index + 1}:</label>
          <textarea
            value={q.text}
            onChange={(e) => handleUpdateQuestion("I", index, "text", e.target.value)}
            style={{
              width: "100%",
              border: "1px solid black",
              marginBottom: "0.5rem",
              padding: "6px",
            }}
          />
          <div style={{ marginBottom: "1rem", whiteSpace: "pre-wrap" }}>
  {renderLatex(q.text)}
</div>

          <label style={{ fontWeight: "bold" }}>Imagine întrebare:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageChange("I", index, "image", e.target.files[0])
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
                onClick={() => handleRemoveImage("I", index, "image")}
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
                onChange={(e) => handleUpdateOption("I", index, i, e.target.value)}
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
                onChange={() => handleUpdateQuestion("I", index, "correct", i)}
              />
              <div>{renderLatex(opt)}</div>
            </div>
          ))}

          <label style={{ fontWeight: "bold" }}>Explicație:</label>
          <textarea
            value={q.explanation}
            onChange={(e) =>
              handleUpdateQuestion("I", index, "explanation", e.target.value)
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
              handleImageChange("I", index, "explanationImage", e.target.files[0])
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
                onClick={() => handleRemoveImage("I", index, "explanationImage")}
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
            onClick={() => handleDelete("I", index)}
            style={{ color: "red", marginTop: "0.5rem" }}
          >
            Șterge întrebarea
          </button>
        </div>
      ))}

      <h2>Subiectul II</h2>
      {sections.II.map((q, index) => (
        <div
          key={`II-${index}`}
          style={{
            border: "2px solid #0070f3",
            padding: "1rem",
            marginTop: "1.5rem",
            borderRadius: "8px",
            background: "#f9fafe",
          }}
        >
          <label style={{ fontWeight: "bold" }}>Enunț întrebare {index + 1}:</label>
          <textarea
            value={q.text}
            onChange={(e) => handleUpdateQuestion("II", index, "text", e.target.value)}
            style={{
              width: "100%",
              border: "1px solid black",
              marginBottom: "0.5rem",
              padding: "6px",
            }}
          />
          <div style={{ marginBottom: "1rem", whiteSpace: "pre-wrap" }}>
  {renderLatex(q.text)}
</div>

          <label style={{ fontWeight: "bold" }}>Imagine întrebare:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageChange("II", index, "image", e.target.files[0])
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
                onClick={() => handleRemoveImage("II", index, "image")}
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
                onChange={(e) => handleUpdateOption("II", index, i, e.target.value)}
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
                onChange={() => handleUpdateQuestion("II", index, "correct", i)}
              />
              <div>{renderLatex(opt)}</div>
            </div>
          ))}

          <label style={{ fontWeight: "bold" }}>Explicație:</label>
          <textarea
            value={q.explanation}
            onChange={(e) =>
              handleUpdateQuestion("II", index, "explanation", e.target.value)
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
              handleImageChange("II", index, "explanationImage", e.target.files[0])
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
                onClick={() => handleRemoveImage("II", index, "explanationImage")}
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
            onClick={() => handleDelete("II", index)}
            style={{ color: "red", marginTop: "0.5rem" }}
          >
            Șterge întrebarea
          </button>
        </div>
      ))}

      <button onClick={() => handleAddQuestion("I")} style={{ marginTop: "1rem" }}>
        + Adaugă întrebare Subiectul I
      </button>
      <button onClick={() => handleAddQuestion("II")} style={{ marginTop: "1rem" }}>
        + Adaugă întrebare Subiectul II
      </button>
    </div>
  );
}
