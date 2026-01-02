import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ItemsProvider } from "./context/ItemContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <ItemsProvider>
        <App />
      </ItemsProvider>
    </AuthProvider>
  </BrowserRouter>
);
