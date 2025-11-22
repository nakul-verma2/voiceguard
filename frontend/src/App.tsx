import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

// Pages
import Home from "./pages/Home";
import Demo from "./pages/Demo";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<Home />} />
            <Route path="/resources" element={<Resources />} />

            {/* --- Authentication Routes --- */}
            {/* We use /* because Clerk handles multi-step flows in the URL */}
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />

            {/* --- Protected Routes --- */}
            <Route
              path="/demo"
              element={
                <>
                  <SignedIn>
                    <Demo />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />

            {/* --- Catch-All Route --- */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;