import { StrictMode } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import { store } from "./store/store";
import "./index.css"
import App from "./App";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <AuthProvider>
        <App/>
      </AuthProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
