import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// create a React Query client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(

  // provider makes React Query work everywhere
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>

);