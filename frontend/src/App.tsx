// src/App.tsx - Enhanced with best practices
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import theme from "./styles/theme";
import "./styles/globals.css";

// Import components
import SimpleHeader from "./components/common/SimpleHeader";
import ErrorBoundary from "./components/common/ErrorBoundary";
import AppRouter from "./router/AppRouter";
import Footer from "./components/common/Footer";
import { ENV_CONFIG } from "./config/app.config";
import { BookingProvider } from "./context/BookingContext";

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <BookingProvider>
            <Router>
              <div className="app">
                <SimpleHeader />
                <main className="main-content">
                  <AppRouter />
                </main>
                <Footer />
              </div>
            </Router>
          </BookingProvider>
        </ChakraProvider>
        {ENV_CONFIG.IS_DEVELOPMENT && <ReactQueryDevtools />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;