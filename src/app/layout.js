import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ApplicationsProvider } from "./context/ApplicationsContext";

export const metadata = { title: "LeaderLab" };

// Script that runs before React hydrates — prevents white flash on dark mode
const themeScript = `
  (function() {
    try {
      var t = localStorage.getItem('ll_theme') || 'dark';
      document.documentElement.setAttribute('data-theme', t);
    } catch(e) {}
  })();
`;

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning> 
        <head>
          <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        </head>
        <body>
          <ApplicationsProvider>{children}</ApplicationsProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}