import "./globals.css"
import { Inter } from "next/font/google"
import { Header } from "./components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Article Management Dashboard",
  description: "Manage your articles with ease",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  )
}



import './globals.css'