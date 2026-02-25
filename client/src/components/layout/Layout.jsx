import { Sidebar } from "./Sidebar";
import { ClientHeader } from "./ClientHeader";
import { ProfileSwitcher } from "./ProfileSwitcher";

export function Layout({ children }) {
  const userRole = localStorage.getItem('userRole');

  if (userRole === 'cliente') {
    return (
      <div className="flex flex-col min-h-screen bg-[#eef0f3]">
        <ProfileSwitcher />
        <ClientHeader />
        <main className="flex-1 w-full max-w-5xl mx-auto p-6 mt-4">
          <div className="bg-[#f8f9fa] rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.05)] p-0 md:p-8 min-h-[600px] overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#dddddd] p-6 gap-6">
      <ProfileSwitcher />
      <div className="h-full">
        <Sidebar />
      </div>
      <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-auto">
        {children}
      </div>
    </div>
  );
}
