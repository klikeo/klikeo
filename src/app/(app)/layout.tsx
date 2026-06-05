import DashboardSidebar from "@/src/components/DashboardSidebar"
import Navbar from "@/src/components/Navbar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{ minHeight: "100vh", backgroundColor: "var(--color-background)" }}
    >
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <DashboardSidebar />

          {children}
        </div>
      </div>
    </div>
  )
}
