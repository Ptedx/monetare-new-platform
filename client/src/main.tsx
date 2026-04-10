import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setupMockApi } from "./mock/setup";

setupMockApi();

createRoot(document.getElementById("root")!).render(<App />);
