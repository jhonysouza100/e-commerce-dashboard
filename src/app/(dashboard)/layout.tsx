import DashboardDOMHydratation from "@/components/dashboard_layout/DashboardDOMHydratation";
import Header from "@/components/dashboard_layout/Header";
import Sidebar from "@/components/dashboard_layout/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div id="dashboard-layout" className="dashboard_layout fixed left-4 right-4 pt-[calc(var(--header-height)_+_1rem)] h-[calc(100vh_-_var(--header-height))] lg:pt-[calc(var(--header-height)_+_3.5rem)] lg:pl-sidebar lg:[transition:_padding_.4s]">
      <Header />
      <Sidebar />
      <DashboardDOMHydratation />
      <main className="main my-2">
        {children}
      </main>
    </div>
  );
}