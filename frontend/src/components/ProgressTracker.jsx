import { useEffect, useState } from "react";
import { api } from "../api";

export default function ProgressTracker() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.progressSummary()
      .then(setData)
      .catch((e) => console.error(e));
  }, []);

  const buildPoints = (trends) => {
    if (!trends || trends.length === 0) return "";
    const maxEgfr = Math.max(...trends.map((t) => t.egfr));
    const minEgfr = Math.min(...trends.map((t) => t.egfr));
    const range = maxEgfr - minEgfr || 1;
    return trends
      .map((t, idx) => {
        const x = (idx / Math.max(trends.length - 1, 1)) * 100;
        const y = 100 - ((t.egfr - minEgfr) / range) * 80 - 10;
        return `${x},${y}`;
      })
      .join(" ");
  };

  return (
    <div className="card">
      <div className="card-inner">
        <div className="card-header">
          <h2>
            <span className="dot" />
            CKD Progress Dashboard
          </h2>
          <span className="card-subtitle">
            Longitudinal trend of eGFR and creatinine over time
          </span>
        </div>
        <p className="description">
          Use this to close the demo: show how repeated labs can be translated
          into a simple trajectory, and how AI-generated commentary can help
          patients understand if they&apos;re broadly stable or heading toward
          higher risk.
        </p>
        {!data && <p>Loading summary…</p>}
        {data && (
          <div className="progress">
            <p style={{ fontSize: "0.88rem", color: "#4b5563" }}>
              {data.summary}
            </p>

            <div className="trend-row">
              {data.trends.map((t) => (
                <div key={t.date} className="trend-chip">
                  <strong>{t.date}</strong> · eGFR {t.egfr} · Cr {t.creatinine}
                </div>
              ))}
            </div>

            <div className="trend-chart">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{ width: "100%", height: "130px" }}
              >
                <polyline
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="1.5"
                  points={buildPoints(data.trends)}
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
