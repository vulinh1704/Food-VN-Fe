import { Outlet } from "react-router-dom";
import { Sidebar } from "./Partial/Sidebar/Sidebar";
import { TopBar } from "./Partial/TopBar/TopBar";
import { SideBarProvider } from "../../providers/admin/SideBarProvider";

export default function Layout() {
  return (
    <SideBarProvider>
      <main className="grid gap-4 p-4 grid-cols-[220px,_1fr]">
        <Sidebar />
        <div className="bg-white rounded-lg pb-4 shadow">
          <TopBar />
          <Outlet />
        </div>
      </main >
    </SideBarProvider>
  );
}