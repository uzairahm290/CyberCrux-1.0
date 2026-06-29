import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CyberCrux",
  description: "AI-powered cybersecurity interview preparation platform with roadmaps, practice scenarios, mock interviews, and gamified learning.",
};

import PageViewsTracker from "@/components/ui/PageViewsTracker";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ThemeProvider>
            <PageViewsTracker />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
