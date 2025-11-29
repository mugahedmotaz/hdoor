import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Set document direction and language based on browser language
const isArabic = typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("ar");
document.documentElement.setAttribute("dir", isArabic ? "rtl" : "ltr");
document.documentElement.setAttribute("lang", isArabic ? "ar" : "en");

createRoot(document.getElementById("root")!).render(<App />);
