import { Sidebar } from "./Sidebar";

export function Layout({ children }) {
  return (
    <div className="flex h-screen bg-[#dddddd] p-6 gap-6">
      <div className="h-full">
        <Sidebar />
      </div>
      <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-auto">
        {children}
      </div>
    </div>
  );
}
