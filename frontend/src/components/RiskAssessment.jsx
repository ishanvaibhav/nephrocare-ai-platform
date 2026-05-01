import { useState } from "react";
import { api } from "../api";

export default function RiskAssessment() {
  const [form, setForm] = useState({
    age: "",
    diabetes: false,
    hypertension: false,
    proteinuria: false,
    smoking: false,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submit = async () => {
    setLoading(true);
    setResult(null);
    try {
      const payload = {
        ...form,
        age: form.age ? Number(form.age) : null,
      };
      const res = await api.assessRisk(payload);
      setResult(res);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const bandColor =
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

  return (
    <div className="card">
      <div className="card-inner">
        <div className="card-header">
          <h2>
            <span className="dot" />
            CKD Risk Assessment
          </h2>
          <span className="card-subtitle">
            Simple risk banding based on clinical factors & AI guidance
          </span>
        </div>
        <p className="description">
          Combine non-lab factors such as age, diabetes and hypertension with
          AI logic to highlight overall CKD risk and guide frequency of follow-up
          or lifestyle focus.
        </p>
        <div className="form-grid">
          <label>
            Age
            <input
              name="age"
              value={form.age}
              onChange={onChange}
              placeholder="e.g. 60"
            />
          </label>
          <label>
            Diabetes
            <input
              type="checkbox"
              name="diabetes"
              checked={form.diabetes}
              onChange={onChange}
            />
          </label>
          <label>
            Hypertension
            <input
              type="checkbox"
              name="hypertension"
              checked={form.hypertension}
              onChange={onChange}
            />
          </label>
          <label>
            Proteinuria / albuminuria
            <input
              type="checkbox"
              name="proteinuria"
              checked={form.proteinuria}
              onChange={onChange}
            />
          </label>
          <label>
            Current smoker
            <input
              type="checkbox"
              name="smoking"
              checked={form.smoking}
              onChange={onChange}
            />
          </label>
        </div>
        <button className="primary" onClick={submit} disabled={loading}>
          {loading ? "Scoring…" : "Assess risk"}
        </button>

        {result && (
          <div style={{ marginTop: "0.8rem" }}>
            <div className="chip">
              <span className={dotClass} />
              Overall CKD risk:{" "}
              <strong style={{ color: bandColor }}>
                {result.risk_band?.toUpperCase()}
              </strong>{" "}
              ({result.score}/100)
            </div>
            <p
              style={{
                fontSize: "0.86rem",
                marginTop: "0.5rem",
                color: "#4b5563",
              }}
            >
              {result.explanation}
            </p>
            <p
              style={{
                fontSize: "0.86rem",
                marginTop: "0.2rem",
                color: "#4b5563",
              }}
            >
              <strong>Recommended follow-up:</strong> {result.followup}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
