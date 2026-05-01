import { useEffect, useState } from "react";
import { api } from "../api";

export default function MedicationTracker() {
  const [meds, setMeds] = useState([]);
  const [form, setForm] = useState({
    name: "",
    dose: "",
    schedule: "",
  });

  const load = async () => {
    try {
      const data = await api.listMeds();
      setMeds(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const add = async () => {
    if (!form.name.trim()) return;
    await api.addMed(form);
    setForm({ name: "", dose: "", schedule: "" });
    load();
  };

  const remove = async (id) => {
    await api.deleteMed(id);
    load();
  };

  const adherenceScore =
    meds.length === 0 ? "—" : `${Math.min(90 + meds.length * 2, 100)}%`;

  return (
    <div className="card">
      <div className="card-inner">
        <div className="card-header">
          <h2>
            <span className="dot" />
            Medication Tracker
          </h2>
          <span className="card-subtitle">
            Capture current CKD medications and estimated adherence
          </span>
        </div>
        <p className="description">
          Illustrate how a patient can keep a simple list of CKD-related drugs
          (e.g. ACE inhibitors, diuretics, phosphate binders) with dose and
          schedule. Adherence score here is illustrative for the demo.
        </p>

        <div className="kpi-row" style={{ marginBottom: "0.7rem" }}>
          <div className="kpi">
            <div className="kpi-label">Tracked medications</div>
            <div className="kpi-value">{meds.length}</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Estimated adherence (demo)</div>
            <div className="kpi-value">{adherenceScore}</div>
          </div>
        </div>

        <div className="form-grid">
          <label>
            Medicine name
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="e.g. Ramipril"
            />
          </label>
          <label>
            Dose
            <input
              name="dose"
              value={form.dose}
              onChange={onChange}
              placeholder="e.g. 5 mg"
            />
          </label>
          <label>
            Schedule
            <input
              name="schedule"
              value={form.schedule}
              onChange={onChange}
              placeholder="e.g. Once daily"
            />
          </label>
        </div>
        <button className="primary" onClick={add}>
          Add medication
        </button>

        <ul className="med-list">
          {meds.map((m) => (
            <li key={m.id}>
              <div>
                <strong>{m.name}</strong> · {m.dose} · {m.schedule}
              </div>
              <button onClick={() => remove(m.id)}>Remove</button>
            </li>
          ))}
          {meds.length === 0 && (
            <li>
              <span className="hint">
                No medications added yet. Add one to demonstrate this module.
              </span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
