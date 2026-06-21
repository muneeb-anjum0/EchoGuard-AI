import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import "./styles/base.css";
import "./styles/sections.css";
import "./styles/motion.css";
import "./styles/responsive.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
