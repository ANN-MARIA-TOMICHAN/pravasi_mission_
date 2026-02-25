// layout.tsx
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeDebug } from "@/components/ThemeDebug";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="h-full bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
          storageKey="theme"
        >
          <LanguageProvider>
          <ThemeDebug />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}