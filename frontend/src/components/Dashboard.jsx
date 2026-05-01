export default function Dashboard() {
  return (
    <div className="card">
      <div className="card-inner">
        <div className="card-header">
          <h2>
            <span className="dot" />
            Patient overview
          </h2>
          <span className="card-subtitle">
            Demo patient · CKD care journey powered by NephroCare AI
          </span>
        </div>
        <p className="description">
          This dashboard is designed for judges: walk through how a CKD patient
          can understand labs, risk, diet, medications, emotional health and long-term
          trends in one place.
        </p>

        <div className="kpi-row">
          <div className="kpi">
            <div className="kpi-label">Latest eGFR (estimated)</div>
            <div className="kpi-value">55 mL/min</div>
            <div className="kpi-trend">Stable over last 6 months</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Serum creatinine</div>
            <div className="kpi-value">1.3 mg/dL</div>
            <div className="kpi-trend">Slightly above normal</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Current CKD risk band</div>
            <div className="kpi-value">Moderate</div>
            <div className="kpi-trend">Recommended 6–12 month follow-up</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Medication adherence (tracked)</div>
            <div className="kpi-value">~85%</div>
            <div className="kpi-trend">Based on entered doses</div>
          </div>
        </div>

        <p className="description" style={{ marginTop: "0.9rem" }}>
          Suggested demo narrative:
          <br />
          1️⃣ Upload a lab PDF in <strong>Lab Analyzer</strong> → AI structures and
          scores risk · 2️⃣ Show personalized <strong>Risk Assessment</strong> · 3️⃣
          Generate a tailored <strong>Diet Plan</strong> · 4️⃣ Capture{" "}
          <strong>Medications</strong> · 5️⃣ Close with{" "}
          <strong>Wellness Companion</strong> and long-term{" "}
          <strong>Progress</strong>.
        </p>
      </div>
    </div>
  );
}
