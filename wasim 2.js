// React is available globally from CDN
const { useRef, useState } = React;

// Minimal CSS-in-JS for fluid layout and minimalism
const styles = {
  app: {
    fontFamily: "Inter, sans-serif",
    minHeight: "100vh",
    margin: 0,
    background: "#fafbfc",
    color: "#222",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "1rem 2rem",
    borderBottom: "1px solid #eee",
    fontWeight: 600,
    fontSize: "1.2rem",
    letterSpacing: "0.02em",
    background: "#fff",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    minHeight: 0,
    overflow: "hidden",
  },
  pdfSection: {
    flex: 1.2,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #eee",
    background: "#fff",
  },
  pdfViewer: {
    flex: 1,
    minHeight: 0,
    overflow: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f6fa",
  },
  comments: {
    borderTop: "1px solid #eee",
    padding: "0.5rem 1rem",
    background: "#f9f9fb",
    minHeight: "120px",
    maxHeight: "180px",
    overflowY: "auto",
  },
  sheetSection: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    background: "#fff",
  },
  sheetHeader: {
    padding: "0.5rem 1rem",
    borderBottom: "1px solid #eee",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#fafbfc",
  },
  sheet: {
    flex: 1,
    overflow: "auto",
    padding: "1rem",
  },
  exportBtn: {
    background: "#222",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "0.4rem 1rem",
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  sectionBtn: {
    background: "#f1f1f1",
    color: "#222",
    border: "none",
    borderRadius: "4px",
    padding: "0.3rem 0.7rem",
    fontSize: "0.9rem",
    marginLeft: "0.5rem",
    cursor: "pointer",
  },
  cell: {
    border: "1px solid #e0e0e0",
    minWidth: "80px",
    padding: "0.3rem 0.5rem",
    background: "#fff",
    outline: "none",
    fontSize: "1rem",
  },
  row: {
    display: "flex",
  },
  sectionLabel: {
    background: "#e6f7ff",
    color: "#0077b6",
    borderRadius: "3px",
    padding: "0.1rem 0.5rem",
    fontSize: "0.85rem",
    marginRight: "0.5rem",
  },
  annotation: {
    background: "#fffbe6",
    border: "1px solid #ffe58f",
    borderRadius: "3px",
    padding: "0.2rem 0.5rem",
    margin: "0.2rem 0",
    fontSize: "0.95rem",
  },
  commentInput: {
    width: "100%",
    border: "1px solid #e0e0e0",
    borderRadius: "3px",
    padding: "0.3rem 0.5rem",
    fontSize: "1rem",
    marginTop: "0.5rem",
    background: "#fff",
  },
  addCommentBtn: {
    marginTop: "0.5rem",
    background: "#0077b6",
    color: "#fff",
    border: "none",
    borderRadius: "3px",
    padding: "0.3rem 0.8rem",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  pdfInput: {
    margin: "1rem",
    fontSize: "1rem",
  },
};

function MinimalPDFReader({ onAnnotation }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [selectedText, setSelectedText] = useState("");
  const [annotationInput, setAnnotationInput] = useState("");
  const pdfRef = useRef();

  // Use PDF.js via CDN for demo (no import)
  // For real app, use 'react-pdf' or similar

  // Simple text selection for annotation
  function handleMouseUp() {
    const sel = window.getSelection();
    if (sel && sel.toString().trim()) {
      setSelectedText(sel.toString());
    }
  }

  function handleAddAnnotation() {
    if (selectedText && annotationInput.trim()) {
      const newAnn = {
        text: selectedText,
        note: annotationInput,
        id: Date.now(),
      };
      setAnnotations((a) => [...a, newAnn]);
      setAnnotationInput("");
      setSelectedText("");
      if (onAnnotation) onAnnotation(newAnn);
    }
  }

  function handlePdfUpload(e) {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfUrl(URL.createObjectURL(file));
    }
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      <input
        type="file"
        accept="application/pdf"
        style={styles.pdfInput}
        onChange={handlePdfUpload}
      />
      <div
        style={styles.pdfViewer}
        ref={pdfRef}
        onMouseUp={handleMouseUp}
      >
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            title="PDF"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              minHeight: "400px",
              background: "#fff",
              borderRadius: "4px",
            }}
          />
        ) : (
          <div style={{ color: "#aaa", fontSize: "1.1rem" }}>
            Upload a PDF to view and annotate.
          </div>
        )}
      </div>
      <div style={{ padding: "0.5rem 1rem", borderTop: "1px solid #eee", background: "#f9f9fb" }}>
        {selectedText && (
          <div style={{ marginBottom: "0.5rem" }}>
            <span style={{ fontWeight: 500 }}>Selected:</span> <span style={styles.annotation}>{selectedText}</span>
            <input
              style={styles.commentInput}
              placeholder="Add annotation..."
              value={annotationInput}
              onChange={e => setAnnotationInput(e.target.value)}
            />
            <button style={styles.addCommentBtn} onClick={handleAddAnnotation}>
              Add Annotation
            </button>
          </div>
        )}
        <div>
          <div style={{ fontWeight: 500, marginBottom: "0.3rem" }}>Annotations:</div>
          {annotations.length === 0 && <div style={{ color: "#bbb" }}>No annotations yet.</div>}
          {annotations.map(a => (
            <div key={a.id} style={styles.annotation}>
              <span style={{ fontWeight: 500 }}>{a.text}</span>
              <span style={{ marginLeft: "0.5rem", color: "#555" }}>{a.note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CommentsPanel() {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  function addComment() {
    if (input.trim()) {
      setComments((c) => [...c, { text: input, id: Date.now() }]);
      setInput("");
    }
  }
  return (
    <div style={styles.comments}>
      <div style={{ fontWeight: 500, marginBottom: "0.3rem" }}>Comments:</div>
      {comments.length === 0 && <div style={{ color: "#bbb" }}>No comments yet.</div>}
      {comments.map((c) => (
        <div key={c.id} style={{ marginBottom: "0.3rem" }}>{c.text}</div>
      ))}
      <input
        style={styles.commentInput}
        placeholder="Add a comment..."
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") addComment(); }}
      />
      <button style={styles.addCommentBtn} onClick={addComment}>
        Add
      </button>
    </div>
  );
}

function SheetCell({ value, onChange }) {
  return (
    <input
      style={styles.cell}
      value={value}
      onChange={e => onChange(e.target.value)}
      spellCheck={false}
    />
  );
}

function SheetSectionLabel({ label }) {
  return <span style={styles.sectionLabel}>{label}</span>;
}

function MinimalSheet({ sections, setSections }) {
  // Each section: { name, rows: [[cell, ...], ...] }
  function addSection() {
    setSections((s) => [
      ...s,
      { name: `Section ${s.length + 1}`, rows: [[""]], cols: 3 },
    ]);
  }
  function addRow(sectionIdx) {
    setSections((s) => {
      const copy = [...s];
      copy[sectionIdx].rows.push(Array(copy[sectionIdx].cols).fill(""));
      return copy;
    });
  }
  function addCol(sectionIdx) {
    setSections((s) => {
      const copy = [...s];
      copy[sectionIdx].cols += 1;
      copy[sectionIdx].rows = copy[sectionIdx].rows.map(row => [...row, ""]);
      return copy;
    });
  }
  function updateCell(sectionIdx, rowIdx, colIdx, value) {
    setSections((s) => {
      const copy = [...s];
      copy[sectionIdx].rows = copy[sectionIdx].rows.map((row, r) =>
        r === rowIdx
          ? row.map((cell, c) => (c === colIdx ? value : cell))
          : row
      );
      return copy;
    });
  }
  return (
    <div>
      {sections.map((section, sIdx) => (
        <div key={sIdx} style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.3rem" }}>
            <SheetSectionLabel label={section.name} />
            <button style={styles.sectionBtn} onClick={() => addRow(sIdx)}>+ Row</button>
            <button style={styles.sectionBtn} onClick={() => addCol(sIdx)}>+ Col</button>
          </div>
          <div>
            {section.rows.map((row, rIdx) => (
              <div key={rIdx} style={styles.row}>
                {row.map((cell, cIdx) => (
                  <SheetCell
                    key={cIdx}
                    value={cell}
                    onChange={val => updateCell(sIdx, rIdx, cIdx, val)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
      <button style={styles.sectionBtn} onClick={addSection}>+ Section</button>
    </div>
  );
}

function exportToGoogleSheetCSV(sections) {
  // Flatten sections into CSV
  let csv = "";
  sections.forEach(section => {
    csv += `"${section.name}"\n`;
    section.rows.forEach(row => {
      csv += row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(",") + "\n";
    });
    csv += "\n";
  });
  return csv;
}

function downloadCSV(csv, filename = "sheet.csv") {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function App() {
  const [sections, setSections] = useState([
    { name: "Section 1", rows: [[""]], cols: 3 },
  ]);
  return (
    <div style={styles.app}>
      <div style={styles.header}>
        Minimal PDF Reader & Sheet
      </div>
      <div style={styles.main}>
        <div style={styles.pdfSection}>
          <MinimalPDFReader />
          <CommentsPanel />
        </div>
        <div style={styles.sheetSection}>
          <div style={styles.sheetHeader}>
            <span style={{ fontWeight: 500 }}>Sheet</span>
            <button
              style={styles.exportBtn}
              onClick={() => {
                const csv = exportToGoogleSheetCSV(sections);
                downloadCSV(csv, "sheet.csv");
              }}
            >
              Export as Google Sheet (CSV)
            </button>
          </div>
          <div style={styles.sheet}>
            <MinimalSheet sections={sections} setSections={setSections} />
          </div>
        </div>
      </div>
    </div>
  );
}

// For demo: render App to root
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<App />);
