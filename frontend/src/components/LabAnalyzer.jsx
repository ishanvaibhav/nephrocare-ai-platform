import { useState } from "react";
import { api } from "../api";

export default function LabAnalyzer() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const upload = async () => {
    if (!file) {
      setError("Please select a PDF, image, or text lab report.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await api.analyzeLab(file);
      setResult(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const riskColor =
    result?.risk_band === "high"
      ? "#ef4444"
      : result?.risk_band === "moderate"
      ? "#f59e0b"
      : "#16a34a";

  const dotClass =
    result?.risk_band === "high"
      ? "chip-dot high"
      : result?.risk_band === "moderate"
      ? "chip-dot moderate"
      : "chip-dot low";

  const severityWidth = result ? `${Math.min(result.severity_score, 100)}%` : "0%";

  return (
    <div className="card">
      <div className="card-inner">
        <div className="card-header">
          <h2>
            <span className="dot" />
            Lab Report Analyzer
          </h2>
          <span className="card-subtitle">
            Auto-structured interpretation of PDF, image or text lab reports
          </span>
        </div>
        <p className="description">
          Upload a sample CKD lab report and show how NephroCare AI extracts
          parameters, infers CKD stage, scores overall kidney risk, and provides
          speaking points for the clinician and patient.
        </p>
        <div className="form-grid">
          <label>
            Lab report file
            <input
              type="file"
              accept=".pdf,.txt,.jpg,.jpeg,.png,image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>
        <button className="primary" onClick={upload} disabled={loading}>
          {loading ? "Analyzing…" : "Analyze report"}
        </button>
        {error && (
          <p className="hint" style={{ color: "#b91c1c" }}>
            {error}
          </p>
        )}

        {result && (
          <div style={{ marginTop: "0.85rem" }}>
            <p className="description">{result.summary}</p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {result.stage_guess && (
                <span className="chip">
                  <span className="chip-dot moderate" />
                  CKD stage (AI guess): <strong>{result.stage_guess}</strong>
                </span>
              )}
              <span className="chip">
                <span className={dotClass} />
                Overall kidney risk:{" "}
                <strong style={{ color: riskColor }}>
                  {result.risk_band?.toUpperCase()} ({result.severity_score}/100)
                </strong>
              </span>
            </div>

            <div className="severity-bar">
              <div
                className="severity-bar-inner"
                style={{ width: severityWidth, background: riskColor }}
              />
            </div>

            <p
              style={{
                fontSize: "0.85rem",
                marginTop: "0.45rem",
                color: "#4b5563",
              }}
            >
              <strong>Suggested next steps:</strong> {result.next_steps}
            </p>

            <table className="lab-table">
              <thead>
                <tr>
                  <th>Test</th>
                  <th>Value</th>
                  <th>Units</th>
                  <th>Reference</th>
                  <th>Status</th>
                  <th>System</th>
                </tr>
              </thead>
              <tbody>
                {result.labs.map((lab, idx) => {
                  const s = (lab.status || "").toLowerCase();
                  const cls =
                    s === "high"
                      ? "status-high"
                      : s === "low"
                      ? "status-low"
                      : "status-normal";
                  return (
                    <tr key={idx}>
                      <td>{lab.name}</td>
                      <td>{lab.value}</td>
                      <td>{lab.units}</td>
                      <td>{lab.ref_range}</td>
                      <td className={cls}>{lab.status}</td>
                      <td>{lab.system}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
