import { useState } from "react";
import { api } from "../api";

export default function WellnessCompanion() {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const entry = { type: "user", text: input };
    setLogs((l) => [...l, entry]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.wellnessChat(input);
      setLogs((l) => [...l, entry, { type: "bot", text: res.reply }]);
    } catch (e) {
      setLogs((l) => [
        ...l,
        { type: "bot", text: "Error: " + e.message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="card">
      <div className="card-inner">
        <div className="card-header">
          <h2>
            <span className="dot" />
            Wellness Companion
          </h2>
          <span className="card-subtitle">
            CKD-aware emotional support & self-care suggestions
          </span>
        </div>
        <p className="description">
          Highlight that NephroCare AI is not just about numbers. This space
          responds empathetically to how the patient feels and suggests practical,
          low-risk coping strategies while always encouraging clinical follow-up
          for worrying symptoms.
        </p>
        <div className="wellness-log">
          {logs.length === 0 && (
            <p className="hint">
              Example: &quot;I feel anxious every time I see my lab results and I
              worry my kidneys will fail.&quot;
            </p>
          )}
          {logs.map((l, i) => (
            <div
              key={i}
              className={l.type === "user" ? "msg user" : "msg bot"}
            >
              {l.text}
            </div>
          ))}
        </div>
        <div className="chat-input-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe how the patient is feeling today…"
            onKeyDown={onKeyDown}
          />
          <button onClick={send} disabled={loading}>
            {loading ? "Responding…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
