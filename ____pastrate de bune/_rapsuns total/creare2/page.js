"use client";

import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

export default function TestEditor() {
  const [testName, setTestName] = useState("testul");
  const [questions, setQuestions] = useState([]);

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

  // Întrebări
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        image: null,
        subitems: [
          {
            label: "a)",
            cerinta: "",
            barem: [{ cheie: "", puncte: 0 }],
            explanation: "",
            explanationImage: null,
          },
        ],
      },
    ]);
  };

  const handleUpdateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleDeleteQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  // Subitems / cerințe
  const handleAddSubitem = (qIndex) => {
    const updated = [...questions];
    const nextLabel = String.fromCharCode(97 + updated[qIndex].subitems.length) + ")";
    updated[qIndex].subitems.push({
      label: nextLabel,
      cerinta: "",
      barem: [{ cheie: "", puncte: 0 }],
      explanation: "",
      explanationImage: null,
    });
    setQuestions(updated);
  };

  const handleDeleteSubitem = (qIndex, sIndex) => {
    const updated = [...questions];
    updated[qIndex].subitems.splice(sIndex, 1);
    updated[qIndex].subitems = updated[qIndex].subitems.map((sub, i) => ({
      ...sub,
      label: String.fromCharCode(97 + i) + ")",
    }));
    setQuestions(updated);
  };

  const handleUpdateSubitem = (qIndex, sIndex, field, value) => {
    const updated = [...questions];
    updated[qIndex].subitems[sIndex][field] = value;
    setQuestions(updated);
  };

  // Barem
  const handleUpdateBarem = (qIndex, sIndex, bIndex, field, value) => {
    const updated = [...questions];
    updated[qIndex].subitems[sIndex].barem[bIndex][field] = value;
    setQuestions(updated);
  };

  const handleAddBaremStep = (qIndex, sIndex) => {
    const updated = [...questions];
    updated[qIndex].subitems[sIndex].barem.push({ cheie: "", puncte: 0 });
    setQuestions(updated);
  };

  const handleDeleteBaremStep = (qIndex, sIndex, bIndex) => {
    const updated = [...questions];
    updated[qIndex].subitems[sIndex].barem.splice(bIndex, 1);
    setQuestions(updated);
  };

  // Imagine întrebare
  const handleImageChange = (qIndex, field, file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const updated = [...questions];
      updated[qIndex][field] = reader.result;
      setQuestions(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (qIndex, field) => {
    const updated = [...questions];
    updated[qIndex][field] = null;
    setQuestions(updated);
  };

  // Imagine explicație subitem
  const handleSubitemImageChange = (qIndex, sIndex, file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const updated = [...questions];
      updated[qIndex].subitems[sIndex].explanationImage = reader.result;
      setQuestions(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveSubitemImage = (qIndex, sIndex) => {
    const updated = [...questions];
    updated[qIndex].subitems[sIndex].explanationImage = null;
    setQuestions(updated);
  };

  // Export / Import
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
        if (Array.isArray(content)) setQuestions(content);
        else alert("JSON invalid.");
      } catch {
        alert("Eroare la citirea JSON.");
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

      {questions.map((q, qIndex) => (
        <div
          key={qIndex}
          style={{
            border: "2px solid #0070f3",
            padding: "1rem",
            marginTop: "1.5rem",
            borderRadius: "8px",
            background: "#f9fafe",
          }}
        >
          <label style={{ fontWeight: "bold" }}>Enunț întrebare {qIndex + 1}:</label>
          <textarea
            value={q.text}
            onChange={(e) => handleUpdateQuestion(qIndex, "text", e.target.value)}
            style={{ width: "100%", border: "1px solid black", marginBottom: "0.5rem", padding: "6px" }}
          />
          <div style={{ marginBottom: "1rem" }}>{renderLatex(q.text)}</div>

          <label style={{ fontWeight: "bold" }}>Imagine enunț:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(qIndex, "image", e.target.files[0])}
            style={{ marginBottom: "0.5rem", display: "block" }}
          />
          {q.image && (
            <div style={{ textAlign: "center", marginBottom: "1rem", position: "relative" }}>
              <img src={q.image} alt="Enunț" style={{ maxWidth: "100%" }} />
              <button
                onClick={() => handleRemoveImage(qIndex, "image")}
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
              >
                &times;
              </button>
            </div>
          )}

          {/* Subitems */}
          {q.subitems.map((sub, sIndex) => (
            <div
              key={sIndex}
              style={{
                border: "1px solid #0070f3",
                padding: "0.8rem",
                marginBottom: "1rem",
                borderRadius: "6px",
                background: "#f0f4ff",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label style={{ fontWeight: "bold" }}>{sub.label} Cerință:</label>
                <button onClick={() => handleDeleteSubitem(qIndex, sIndex)} style={{ color: "red" }}>
                  Șterge cerința
                </button>
              </div>
              <textarea
                value={sub.cerinta}
                onChange={(e) => handleUpdateSubitem(qIndex, sIndex, "cerinta", e.target.value)}
                style={{ width: "100%", border: "1px solid black", marginBottom: "0.5rem", padding: "6px" }}
              />
              {sub.cerinta && (
                <div style={{ marginBottom: "0.5rem", background: "#eef2ff", padding: "6px", borderRadius: "4px" }}>
                  {renderLatex(sub.cerinta)}
                </div>
              )}

              {/* Explicație */}
              <label style={{ fontWeight: "bold" }}>Explicație:</label>
              <textarea
                value={sub.explanation}
                onChange={(e) => handleUpdateSubitem(qIndex, sIndex, "explanation", e.target.value)}
                style={{ width: "100%", border: "1px solid black", marginBottom: "0.3rem", padding: "6px" }}
              />
              {sub.explanation && (
                <div style={{ marginBottom: "0.3rem", background: "#eef2ff", padding: "6px", borderRadius: "4px" }}>
                  {renderLatex(sub.explanation)}
                </div>
              )}

              {/* Upload imagine explicație */}
              <label style={{ fontWeight: "bold" }}>Imagine explicație:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleSubitemImageChange(qIndex, sIndex, e.target.files[0])}
                style={{ marginBottom: "0.3rem", display: "block" }}
              />

              {sub.explanationImage && (
                <div style={{ textAlign: "center", position: "relative", marginBottom: "0.8rem" }}>
                  <img src={sub.explanationImage} alt="Explicație" style={{ maxWidth: "100%" }} />
                  <button
                    onClick={() => handleRemoveSubitemImage(qIndex, sIndex)}
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
                  >
                    &times;
                  </button>
                </div>
              )}

              {/* Barem */}
              {sub.barem.map((step, bIndex) => (
                <div
                  key={bIndex}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}
                >
                  <input
                    value={step.cheie}
                    onChange={(e) => handleUpdateBarem(qIndex, sIndex, bIndex, "cheie", e.target.value)}
                    placeholder="Cheie / pas"
                    style={{ flex: 1, border: "1px solid black", padding: "4px" }}
                  />
                  <input
                    type="number"
                    value={step.puncte}
                    onChange={(e) =>
                      handleUpdateBarem(qIndex, sIndex, bIndex, "puncte", parseFloat(e.target.value))
                    }
                    placeholder="Puncte"
                    style={{ width: "80px", border: "1px solid black", padding: "4px" }}
                  />
                  <button onClick={() => handleDeleteBaremStep(qIndex, sIndex, bIndex)} style={{ color: "red" }}>
                    Șterge
                  </button>
                </div>
              ))}
              <button onClick={() => handleAddBaremStep(qIndex, sIndex)} style={{ marginBottom: "0.5rem" }}>
                + Adaugă pas
              </button>
            </div>
          ))}

          <button onClick={() => handleAddSubitem(qIndex)} style={{ marginTop: "0.5rem" }}>
            + Adaugă cerință
          </button>

          <button
            onClick={() => handleDeleteQuestion(qIndex)}
            style={{ color: "red", marginTop: "0.5rem", display: "block" }}
          >
            Șterge întrebare
          </button>
        </div>
      ))}

      <button onClick={handleAddQuestion} style={{ marginTop: "1rem" }}>
        + Adaugă întrebare
      </button>
    </div>
  );
}
