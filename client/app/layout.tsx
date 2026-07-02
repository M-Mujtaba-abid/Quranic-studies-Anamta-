import type { Metadata } from "next";
import { Cinzel, Poppins } from "next/font/google";
import "./globals.css";
import { ApolloProvider } from "../providers/ApolloProvider";
import { ThemeProvider } from "../providers/ThemeProvider";
import { ToastProvider } from "../providers/ToastProvider";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Anamta Institute | Online Quran Learning",
  description:
    "Learn Quran with certified teachers — Tajweed, Hifz, Tafsir and Arabic.",
};

const themeScript = `
  (function() {
    try {
      var stored = localStorage.getItem('anamta-theme');
      var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      if (theme === 'dark') document.documentElement.classList.add('dark');
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning className={`${cinzel.variable} ${poppins.variable} font-body antialiased`}>
        <ApolloProvider>
          <ThemeProvider>
            {children}
            <ToastProvider />
          </ThemeProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}