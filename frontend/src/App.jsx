import { useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import ChatAssistant from "./components/ChatAssistant";
import LabAnalyzer from "./components/LabAnalyzer";
import DietPlanner from "./components/DietPlanner";
import RiskAssessment from "./components/RiskAssessment";
import MedicationTracker from "./components/MedicationTracker";
import WellnessCompanion from "./components/WellnessCompanion";
import ProgressTracker from "./components/ProgressTracker";

export default function App() {
  const [section, setSection] = useState("dashboard");

  let content = null;
  switch (section) {
    case "chat":
      content = <ChatAssistant />;
      break;
    case "labs":
      content = <LabAnalyzer />;
      break;
    case "diet":
      content = <DietPlanner />;
      break;
    case "risk":
      content = <RiskAssessment />;
      break;
    case "meds":
      content = <MedicationTracker />;
      break;
    case "wellness":
      content = <WellnessCompanion />;
      break;
    case "progress":
      content = <ProgressTracker />;
      break;
    case "dashboard":
    default:
      content = <Dashboard />;
  }

  return (
    <Layout section={section} onSectionChange={setSection}>
      {content}
    </Layout>
  );
}
