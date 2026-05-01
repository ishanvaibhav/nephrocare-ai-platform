import { useState } from "react";
import { api } from "../api";

export default function ChatAssistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setLoading(true);
    try {
      const res = await api.chat(userMsg.content, newHistory);
      const botMsg = { role: "assistant", content: res.reply };
      setMessages((m) => [...m, botMsg]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Error: " + e.message },
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
            CKD Support Chatbot
          </h2>
          <span className="card-subtitle">
            AI explanations for labs, CKD stages, lifestyle and follow-up
          </span>
        </div>
        <p className="description">
          Use this during the demo to show how a patient can ask questions in
          natural language and get CKD-specific, patient-friendly answers. The
          assistant keeps short-term context across messages.
        </p>
        <div className="chat-window">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "msg user" : "msg bot"}>
              {m.content}
            </div>
          ))}
          {messages.length === 0 && (
            <p className="hint">
              Try: &quot;My creatinine is 1.8 and eGFR is 45. What does that
              mean and what should I discuss with my doctor?&quot;
            </p>
          )}
        </div>
        <div className="chat-input-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a CKD question from a patient perspective…"
            onKeyDown={onKeyDown}
          />
          <button onClick={send} disabled={loading}>
            {loading ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
