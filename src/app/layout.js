import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ApplicationsProvider } from "./context/ApplicationsContext";
import { Analytics } from "@vercel/analytics/next";

export const metadata = { title: "LeaderLab" };

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
          <ApplicationsProvider>
            {children}
          </ApplicationsProvider>

          {/* ✅ Add here */}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}