import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ReactQueryProvider from "@/providers/react-query";

import AppSidebar from "./_components/app-siderbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </main>
    </SidebarProvider>
  );
}
