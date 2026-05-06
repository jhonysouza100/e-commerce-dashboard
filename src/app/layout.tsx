import { Roboto } from "next/font/google";
import "./globals.css";
// import SessionWrapper from "@/providers/SessionWrapper";
// import QueryWrapper from "@/providers/QueryWrapper";
// import { ThemeProvider } from "next-themes";
// import { Toaster } from "sonner";
// import { Suspense } from "react";
// import Verify from "@/auth/Verify";

const fontFamily = Roboto({
  variable: "--body-font",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

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
      <body className={`${fontFamily.variable} antialiased text-normal bg-background text-foreground-muted [transition:background-color_.4s]`}>
        {/* <SessionWrapper> */}
          {/* <QueryWrapper> */}
            {/* <Verify /> */}
            {/* <ThemeProvider> */}
              {/* <Suspense> */}
                {children}
              {/* </Suspense> */}
              {/* <Toaster /> */}
            {/* </ThemeProvider> */}
          {/* </QueryWrapper> */}
        {/* </SessionWrapper> */}
      </body>
    </html>
  );
}
