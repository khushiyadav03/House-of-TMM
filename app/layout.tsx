import type React from "react"
import { Montserrat } from "next/font/google"
import { cn } from "@/lib/utils"
import Header from "../components/Header"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

export const metadata = {
  title: "House of TMM",
  description: "A modern fashion and lifestyle blog",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn("min-h-screen bg-white text-gray-700", montserrat.variable)}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
