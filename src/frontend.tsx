import { createRoot } from "react-dom/client";
import { App } from "./App";
import { AuthProvider } from "./features/auth/AuthContext";

// IMPORTANTE: Buscamos o QueryClient direto da fonte (core) 
// e o Provider do pacote React.
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";

// Agora sim, temos o construtor real!
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function start() {
  const root = createRoot(document.getElementById("root")!);
  root.render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />        
      </AuthProvider>
    </QueryClientProvider>
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}