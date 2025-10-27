import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import MobileNav from "@/components/organisms/MobileNav";

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex" />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        
        {/* Mobile Navigation */}
        <MobileNav className="lg:hidden" />
      </div>
    </div>
  );
};

export default Layout;