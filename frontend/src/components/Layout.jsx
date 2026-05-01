export default function Layout({ section, onSectionChange, children }) {
  const items = [
    {
      key: "dashboard",
      title: "Overview",
      subtitle: "Patient snapshot",
      pill: "Start here",
    },
    {
      key: "chat",
      title: "CKD Chatbot",
      subtitle: "Explain & educate",
      pill: "Assist",
    },
    {
      key: "labs",
      title: "Lab Analyzer",
      subtitle: "Parse PDF labs",
      pill: "Labs",
    },
    {
      key: "risk",
      title: "Risk Assessment",
      subtitle: "Score kidney risk",
      pill: "Score",
    },
    {
      key: "diet",
      title: "Diet Planner",
      subtitle: "Personal renal plan",
      pill: "Diet",
    },
    {
      key: "meds",
      title: "Medication Tracker",
      subtitle: "Current regimen",
      pill: "Meds",
    },
    {
      key: "wellness",
      title: "Wellness Companion",
      subtitle: "Mental support",
      pill: "Support",
    },
    {
      key: "progress",
      title: "Progress Dashboard",
      subtitle: "Trends over time",
      pill: "Trends",
    },
  ];

  return (
    <div className="app-shell">
      <div className="app-header-wrap">
        <header className="app-header">
          <div className="app-header-left">
            <div className="app-logo">NC</div>
            <div className="app-title-block">
              <h1>NephroCare AI</h1>
              <span>AI-assisted CKD companion for patients & clinics</span>
            </div>
          </div>
          <div className="app-header-right">
            <div className="pill">Hackathon Prototype</div>
            <div className="pill">FastAPI · React · Azure OpenAI</div>
          </div>
        </header>
      </div>
      <main className="app-main">
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>Navigation</h2>
            <small>Live demo flow</small>
          </div>
          <ul className="nav-list">
            {items.map((item) => (
              <li key={item.key} className="nav-item">
                <button
                  className={
                    "nav-button" + (section === item.key ? " active" : "")
                  }
                  onClick={() => onSectionChange(item.key)}
                >
                  <span className="label">
                    <strong>{item.title}</strong>
                    <small>{item.subtitle}</small>
                  </span>
                  <span className="nav-pill">{item.pill}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <section className="content">{children}</section>
      </main>
    </div>
  );
}
