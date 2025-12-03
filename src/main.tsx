import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";

// Respect dir from index.html; only set lang if missing
const htmlEl = document.documentElement;
const hasDir = htmlEl.hasAttribute("dir");
const isArabic = typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("ar");
if (!hasDir) {
 htmlEl.setAttribute("dir", isArabic ? "rtl" : "ltr");
}
if (!htmlEl.getAttribute("lang")) {
 htmlEl.setAttribute("lang", isArabic ? "ar" : "en");
}

createRoot(document.getElementById("root")!).render(
 <ErrorBoundary>
  <App />
 </ErrorBoundary>
);
