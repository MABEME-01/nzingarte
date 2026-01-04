import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerServiceWorker } from "./utils/registerSW";

// Register service worker for offline caching
registerServiceWorker();

createRoot(document.getElementById("root")!).render(<App />);
