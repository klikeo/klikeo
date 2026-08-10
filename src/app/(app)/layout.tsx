import DashboardSidebar from "@/src/components/DashboardSidebar";
import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Navbar superior */}
      <Navbar />

      {/* Contenido principal */}
      <div className="flex flex-1">

        {/* Sidebar */}
        <DashboardSidebar />

        {/* Área principal */}
        <main className="flex-1 flex flex-col overflow-hidden">

          <div className="flex-1 overflow-y-auto px-6 py-8">
            {children}
          </div>

          <Footer />

        </main>

      </div>

    </div>
  );
}