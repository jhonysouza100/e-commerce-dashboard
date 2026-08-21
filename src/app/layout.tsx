import "./globals.css";
import QueryWrapper from "@/providers/QueryWrapper";
// import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { Suspense } from "react";
import GoogleSessionWrapper from "@/providers/GoogleSessionWrapper";
import SessionInitializer from "@/auth/SessionInitializer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="es-AR"
    >
      <body className={`font-sans antialiased text-normal bg-background text-foreground-muted [transition:background-color_.4s]`}>
        <GoogleSessionWrapper>
          <QueryWrapper>
            <SessionInitializer />
            {/* <ThemeProvider> */}
              <Suspense>
                {children}
              </Suspense>
              <Toaster />
            {/* </ThemeProvider> */}
          </QueryWrapper>
        </GoogleSessionWrapper>
      </body>
    </html>
  );
}
