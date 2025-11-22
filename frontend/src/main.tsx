import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes"; // 👈 1. Import Dark Theme

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider 
    publishableKey={PUBLISHABLE_KEY} 
    afterSignOutUrl="/"
    appearance={{
      baseTheme: dark, // 👈 2. Apply Dark Theme Globally
      variables: { 
        colorPrimary: "#E91C1C", // 👈 3. Match your "Impact" Red color
        colorBackground: "#111827", // Optional: Matches your dark background
        colorText: "white"
      }
    }}
  >
    <App />
  </ClerkProvider>
);