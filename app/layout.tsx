// app/layout.tsx
import Footer from "./components/Footer";
import Header from "./components/Header";
import { AuthProvider } from "./contexts/AuthContext";
import "./globals.css";

export const metadata = {
  title: "Cognitive Tests App",
  description: "Test your cognitive performance and track progress.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="max-w-5xl mx-auto p-6 flex-1 w-full">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
