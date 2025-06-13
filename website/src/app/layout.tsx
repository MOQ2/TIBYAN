import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Amiri } from "next/font/google";
import QueryProvider from '@/components/providers/QueryProvider';
import AuthProvider from '@/components/providers/AuthProvider';
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "تِبيان - TIBYAN | Arabic Sentiment Analysis Platform",
  description: "Intelligent web application for analyzing customer sentiment based on conversations with support teams using AI. لنوضح محادثاتك. لنرتقي بتجربة عملائك.",
  keywords: "Arabic sentiment analysis, customer support, AI, WhatsApp, Messenger, تحليل المشاعر, خدمة العملاء",
  authors: [{ name: "TIBYAN Team" }],
  openGraph: {
    title: "تِبيان - TIBYAN | Arabic Sentiment Analysis Platform",
    description: "Intelligent platform for Arabic sentiment analysis",
    type: "website",
    locale: "ar_SA",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="h-full">
      <body className={`${inter.variable} ${amiri.variable} font-amiri antialiased h-full bg-gray-50`}>
        <QueryProvider>
          <AuthProvider>
            <div className="min-h-full">
              {children}
            </div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
