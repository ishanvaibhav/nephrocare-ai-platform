import { useState } from "react";
import { api } from "../api";

export default function DietPlanner() {
  const [form, setForm] = useState({
    stage: "3",
    vegetarian: true,
    calories: 1800,
    age: "",
    diabetes: false,
    hypertension: false,
    region: "",
    notes: "",
  });
  const [plan, setPlan] = useState(null);
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
    setPlan(null);
    try {
      const payload = {
        ...form,
        calories: Number(form.calories),
        age: form.age ? Number(form.age) : null,
      };
      const res = await api.planDiet(payload);
      setPlan(res);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-inner">
        <div className="card-header">
          <h2>
            <span className="dot" />
            Renal Diet Planner
          </h2>
          <span className="card-subtitle">
            One-day renal meal plan tailored to CKD stage & comorbidities
          </span>
        </div>
        <p className="description">
          Demonstrate how AI can generate a practical, stage-aware meal plan
          that respects CKD restrictions, diabetes and hypertension, and local
          cuisine preferences. Always confirm with a dietitian in reality.
        </p>
        <div className="form-grid">
          <label>
            CKD stage
            <select name="stage" value={form.stage} onChange={onChange}>
              <option value="1">Stage 1</option>
              <option value="2">Stage 2</option>
              <option value="3">Stage 3</option>
              <option value="4">Stage 4</option>
              <option value="5">Stage 5 / Dialysis</option>
            </select>
          </label>
          <label>
            Vegetarian
            <input
              type="checkbox"
              name="vegetarian"
              checked={form.vegetarian}
              onChange={onChange}
            />
          </label>
          <label>
            Daily calories
            <input
              type="number"
              name="calories"
              value={form.calories}
              onChange={onChange}
            />
          </label>
          <label>
            Age
            <input
              name="age"
              value={form.age}
              onChange={onChange}
              placeholder="e.g. 54"
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
            Region / cuisine
            <input
              name="region"
              value={form.region}
              onChange={onChange}
              placeholder="e.g. South Indian"
            />
          </label>
          <label>
            Extra notes
            <input
              name="notes"
              value={form.notes}
              onChange={onChange}
              placeholder="e.g. prefers soft foods"
            />
          </label>
        </div>
        <button className="primary" onClick={submit} disabled={loading}>
          {loading ? "Generating…" : "Generate plan"}
        </button>

        {plan && (
          <div style={{ marginTop: "0.8rem" }}>
            <p className="description">{plan.summary}</p>
            <p style={{ fontSize: "0.86rem", color: "#4b5563" }}>
              <strong>Approximate macros: </strong>
              {plan.calories} kcal · {plan.protein_grams} g protein ·{" "}
              {plan.sodium_mg} mg sodium · {plan.potassium_mg} mg potassium ·{" "}
              {plan.phosphorus_mg} mg phosphorus
            </p>
            <ul>
              {plan.meals.map((m, idx) => (
                <li key={idx}>
                  <strong>{m.name}:</strong> {m.items.join(", ")}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
