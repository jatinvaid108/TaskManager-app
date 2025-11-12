import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-60 flex-1 min-h-screen bg-gray-50">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
