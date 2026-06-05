import Navbar from "@/src/components/Navbar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{ minHeight: "100vh", backgroundColor: "var(--color-background)" }}
    >
      <Navbar />
      {children}
    </div>
  )
}
