import "./index.css";
import "@assets/scss/style.scss";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App.tsx";

async function enableMocking() {
  if (import.meta.env.MODE !== "development") return;
  const { worker } = await import("./mocks/browser");
  return worker.start({ onUnhandledRequest: "bypass" });
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
});
