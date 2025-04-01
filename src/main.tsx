import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AvatarProvider } from "./context/AvatarContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AvatarProvider>
        <App />
      </AvatarProvider>
    </ThemeProvider>
  </React.StrictMode>
);
